/**
 * @file route.ts
 * @description 약국 데이터 배치 수집 API
 * 
 * 작은 단위(예: 10페이지씩)로 나눠서 수집하여 안정성을 높입니다.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase/service-role';

const API_KEY = process.env.DATA_GO_KR_API_KEY || process.env.TOUR_API_KEY || '';
const BASE_URL = 'https://apis.data.go.kr/B490001/sjHptMcalPstateInfoService/getSjJijeongyakgukChakgiList';

interface PharmacyItem {
  hospitalNm?: string;
  addr?: string;
  tel?: string;
  faxTel?: string;
  gwanriJisaCd?: string;
  jisaNm?: string;
}

/**
 * 약국 API 호출 (재시도 로직 포함)
 */
async function fetchPharmacies(
  pageNo: number, 
  numOfRows: number, 
  retries: number = 3
): Promise<{ items: PharmacyItem[]; totalCount: number }> {
  const url = new URL(BASE_URL);
  url.searchParams.set('serviceKey', API_KEY);
  url.searchParams.set('pageNo', pageNo.toString());
  url.searchParams.set('numOfRows', numOfRows.toString());

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      if (attempt > 1) {
        const delay = (attempt - 1) * 2000;
        console.log(`[약국 API] 재시도 ${attempt}/${retries} (${delay}ms 대기 후)...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/xml',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[약국 API] HTTP ${response.status}:`, errorText.substring(0, 300));
        
        if (response.status === 429 || response.status >= 500) {
          if (attempt < retries) continue;
        }
        
        throw new Error(`API 호출 실패: ${response.status}`);
      }

      const xmlText = await response.text();
      const { parseString } = await import('xml2js');
      
      return new Promise<{ items: PharmacyItem[]; totalCount: number }>((resolve, reject) => {
        parseString(xmlText, { explicitArray: false, mergeAttrs: true }, (err, result) => {
          if (err) {
            reject(err);
            return;
          }

          const response = result?.response;
          if (!response || response.header?.resultCode !== '00') {
            const errorMsg = response?.header?.resultMsg || '알 수 없는 오류';
            reject(new Error(`API 오류: ${errorMsg}`));
            return;
          }

          const body = response.body;
          if (!body || !body.items) {
            resolve({ items: [], totalCount: 0 });
            return;
          }

          const itemsData = body.items.item;
          const items: PharmacyItem[] = Array.isArray(itemsData)
            ? itemsData
            : itemsData
            ? [itemsData]
            : [];

          const totalCount = parseInt(body.totalCount || '0', 10);

          resolve({ 
            items: items.filter(item => item.hospitalNm && item.addr),
            totalCount 
          });
        });
      });
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }
    }
  }
  
  throw new Error('모든 재시도 실패');
}

export async function POST(request: NextRequest) {
  try {
    if (!API_KEY) {
      return NextResponse.json(
        { success: false, error: 'API 키가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const startPage = parseInt(searchParams.get('startPage') || '1', 10);
    const batchSize = parseInt(searchParams.get('batchSize') || '10', 10); // 기본 10페이지씩
    const numOfRows = parseInt(searchParams.get('numOfRows') || '100', 10);

    console.log(`[약국 Import Batch] 시작: 페이지 ${startPage}부터 ${batchSize}페이지 수집`);

    const supabase = getServiceRoleClient();
    let totalSaved = 0;
    let totalUpdated = 0;
    let totalFetched = 0;
    const failedPages: number[] = [];
    let totalCount = 0;

    const endPage = startPage + batchSize - 1;

    for (let currentPage = startPage; currentPage <= endPage; currentPage++) {
      try {
        console.log(`[약국 Import Batch] 페이지 ${currentPage} 처리 중...`);

        const { items, totalCount: fetchedTotalCount } = await fetchPharmacies(currentPage, numOfRows, 3);
        
        if (currentPage === startPage) {
          totalCount = fetchedTotalCount;
          console.log(`[약국 Import Batch] 전체 ${totalCount}개 약국 데이터 확인`);
        }

        totalFetched += items.length;

        // 데이터 저장
        for (const item of items) {
          try {
            const { data: existing } = await supabase
              .from('hospitals_pharmacies')
              .select('id')
              .eq('name', item.hospitalNm)
              .eq('address', item.addr)
              .eq('type', 'pharmacy')
              .maybeSingle();

            const data = {
              name: item.hospitalNm || '',
              type: 'pharmacy' as const,
              address: item.addr || '',
              latitude: 0,
              longitude: 0,
              phone: item.tel || null,
              department: null,
            };

            if (existing) {
              await supabase
                .from('hospitals_pharmacies')
                .update(data)
                .eq('id', existing.id);
              totalUpdated++;
            } else {
              await supabase
                .from('hospitals_pharmacies')
                .insert(data);
              totalSaved++;
            }

            await new Promise(resolve => setTimeout(resolve, 50));
          } catch (error) {
            console.error(`[약국 Import Batch] 저장 실패: ${item.hospitalNm}`, error);
          }
        }

        // 페이지 간 딜레이
        if (currentPage < endPage) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error(`[약국 Import Batch] 페이지 ${currentPage} 실패:`, error);
        failedPages.push(currentPage);
        // 실패해도 계속 진행
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    const nextPage = endPage + 1;
    const totalPages = Math.ceil(totalCount / numOfRows);
    const hasMore = nextPage <= totalPages;

    console.log(`[약국 Import Batch] 완료: ${totalSaved}개 신규 저장, ${totalUpdated}개 업데이트`);

    return NextResponse.json({
      success: true,
      message: `배치 수집 완료 (페이지 ${startPage}-${endPage})`,
      savedCount: totalSaved,
      updatedCount: totalUpdated,
      totalFetched,
      startPage,
      endPage,
      nextPage: hasMore ? nextPage : null,
      totalPages,
      totalCount,
      failedPages: failedPages.length > 0 ? failedPages : undefined,
      hasMore,
      progress: {
        completed: endPage,
        total: totalPages,
        percentage: Math.round((endPage / totalPages) * 100),
      },
    });
  } catch (error) {
    console.error('[약국 Import Batch] 오류:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}







