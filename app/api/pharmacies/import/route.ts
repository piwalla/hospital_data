/**
 * @file route.ts
 * @description 산재 약국 데이터 수집 및 저장 API
 * 
 * 근로복지공단 산재지정 약국 찾기 API에서 데이터를 가져와서 Supabase에 저장합니다.
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
  addr?: string, 
  hospitalNm?: string,
  retries: number = 3
): Promise<{ items: PharmacyItem[]; totalCount: number }> {
  const url = new URL(BASE_URL);
  url.searchParams.set('serviceKey', API_KEY);
  url.searchParams.set('pageNo', pageNo.toString());
  url.searchParams.set('numOfRows', numOfRows.toString());
  
  if (addr) {
    url.searchParams.set('addr', addr);
  }
  if (hospitalNm) {
    url.searchParams.set('hospitalNm', hospitalNm);
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`[약국 API] 요청 (시도 ${attempt}/${retries}):`, url.toString().replace(API_KEY, '***'));

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/xml',
        },
      });

      // 400 에러 시 응답 본문 확인
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[약국 API] HTTP ${response.status} 에러:`, errorText.substring(0, 500));
        
        // 재시도 가능한 에러인지 확인
        if (response.status === 429 || response.status >= 500) {
          if (attempt < retries) {
            const delay = attempt * 2000; // 2초, 4초, 6초...
            console.log(`[약국 API] ${delay}ms 후 재시도...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
        }
        
        throw new Error(`API 호출 실패: ${response.status} - ${errorText.substring(0, 200)}`);
      }

      const xmlText = await response.text();
      
      // xml2js를 사용한 XML 파싱
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
            console.error(`[약국 API] API 오류: ${errorMsg} (resultCode: ${response?.header?.resultCode})`);
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
      const delay = attempt * 2000;
      console.log(`[약국 API] 에러 발생, ${delay}ms 후 재시도...`, error);
      await new Promise(resolve => setTimeout(resolve, delay));
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
    const maxPagesParam = searchParams.get('maxPages');
    const numOfRows = parseInt(searchParams.get('numOfRows') || '100', 10);
    const addr = searchParams.get('addr') || undefined;
    const hospitalNm = searchParams.get('hospitalNm') || undefined;
    const startPage = parseInt(searchParams.get('startPage') || '1', 10); // 재개 기능

    // maxPages가 지정되지 않으면 전체 데이터 수집 (자동 계산)
    let maxPages: number | null = maxPagesParam ? parseInt(maxPagesParam, 10) : null;

    console.log('[약국 Import] 시작...', { 
      maxPages: maxPages || '전체', 
      numOfRows, 
      addr, 
      hospitalNm,
      startPage 
    });

    const supabase = getServiceRoleClient();
    let totalSaved = 0;
    let totalUpdated = 0;
    let totalFetched = 0;
    let currentPage = startPage; // 시작 페이지 설정
    let hasMore = true;
    let totalCount = 0;
    const failedPages: number[] = []; // 실패한 페이지 기록

    while (hasMore && (maxPages === null || currentPage <= maxPages)) {
      console.log(`[약국 Import] 페이지 ${currentPage}/${maxPages || '?'} 처리 중...`);

      // API에서 데이터 가져오기 (재시도 로직 포함)
      let items: PharmacyItem[] = [];
      let fetchedTotalCount = 0;
      
      try {
        const result = await fetchPharmacies(currentPage, numOfRows, addr, hospitalNm, 3);
        items = result.items;
        fetchedTotalCount = result.totalCount;
      } catch (error) {
        console.error(`[약국 Import] 페이지 ${currentPage} 실패:`, error);
        failedPages.push(currentPage);
        currentPage++;
        
        // 실패한 페이지는 건너뛰고 계속 진행
        if (currentPage <= (maxPages || 1000)) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // 실패 후 잠시 대기
          continue;
        } else {
          break;
        }
      }
      totalFetched += items.length;
      
      // 첫 페이지에서 전체 개수 확인
      if (currentPage === 1) {
        totalCount = fetchedTotalCount;
        // maxPages가 지정되지 않았으면 전체 페이지 수로 설정
        if (maxPages === null) {
          maxPages = Math.ceil(totalCount / numOfRows);
          console.log(`[약국 Import] 전체 ${totalCount}개 데이터, ${maxPages}페이지 수집 예정`);
        }
      }

      console.log(`[약국 Import] 페이지 ${currentPage}/${maxPages || '?'}: ${items.length}개 데이터 수신 (전체: ${totalCount}개, 진행률: ${Math.round((currentPage / (maxPages || 1)) * 100)}%)`);

      if (items.length === 0) {
        hasMore = false;
        break;
      }

      // 데이터 저장
      for (const item of items) {
        try {
          // 중복 체크 (약국명 + 주소) - 기존 hospitals_pharmacies 테이블 사용
          // .maybeSingle() 사용: 결과가 없거나 1개일 때 안전하게 처리
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
            latitude: 0, // Geocoding은 별도 API로 처리
            longitude: 0, // Geocoding은 별도 API로 처리
            phone: item.tel || null,
            department: null, // 약국은 진료과목 없음
          };

          if (existing) {
            // 업데이트
            const { error } = await supabase
              .from('hospitals_pharmacies')
              .update(data)
              .eq('id', existing.id);

            if (error) throw error;
            totalUpdated++;
          } else {
            // 삽입
            const { error } = await supabase
              .from('hospitals_pharmacies')
              .insert(data);

            if (error) throw error;
            totalSaved++;
          }

          // API Rate Limiting 방지
          await new Promise(resolve => setTimeout(resolve, 50));
        } catch (error) {
          console.error(`[약국 Import] 저장 실패: ${item.hospitalNm}`, error);
        }
      }

      // 다음 페이지 확인
      const totalPages = Math.ceil(totalCount / numOfRows);
      hasMore = currentPage < totalPages && (maxPages === null || currentPage < maxPages);
      currentPage++;

      // 페이지 간 딜레이 (Rate Limiting 방지)
      if (hasMore) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // 진행 상황 로그 (10페이지마다)
      if (currentPage % 10 === 0 || !hasMore) {
        console.log(`[약국 Import] 진행 상황: ${currentPage - 1}페이지 완료, ${totalSaved}개 신규 저장, ${totalFetched}개 수신`);
      }
    }

    console.log(`[약국 Import] 완료: ${totalSaved}개 신규 저장, ${totalUpdated}개 업데이트, ${totalFetched}개 수신`);

    return NextResponse.json({
      success: true,
      message: '약국 데이터 수집 완료',
      savedCount: totalSaved,
      updatedCount: totalUpdated,
      totalFetched,
      pagesProcessed: currentPage - startPage,
      startPage,
      lastPage: currentPage - 1,
      failedPages: failedPages.length > 0 ? failedPages : undefined,
      // 실패한 페이지가 있으면 재개 정보 제공
      resumeInfo: failedPages.length > 0 ? {
        message: '일부 페이지 수집 실패. 다음 페이지부터 재시도하세요.',
        nextPage: currentPage,
        failedPages,
      } : undefined,
    });
  } catch (error) {
    console.error('[약국 Import] 오류:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

