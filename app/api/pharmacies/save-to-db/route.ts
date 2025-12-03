/**
 * @file route.ts
 * @description 약국 데이터를 Supabase에 직접 저장 (Supabase MCP 사용)
 * 
 * API에서 약국 데이터를 가져와서 Supabase에 저장합니다.
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
 * 약국 API 호출
 */
async function fetchPharmacies(pageNo: number, numOfRows: number) {
  const url = new URL(BASE_URL);
  url.searchParams.set('serviceKey', API_KEY);
  url.searchParams.set('pageNo', pageNo.toString());
  url.searchParams.set('numOfRows', numOfRows.toString());

  console.log('[약국 API] 요청:', url.toString().replace(API_KEY, '***'));

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Accept': 'application/xml',
    },
  });

  if (!response.ok) {
    throw new Error(`API 호출 실패: ${response.status}`);
  }

  const xmlText = await response.text();
  
  // xml2js를 사용한 XML 파싱
  const { parseString } = await import('xml2js');
  
  return new Promise<PharmacyItem[]>((resolve, reject) => {
    parseString(xmlText, { explicitArray: false, mergeAttrs: true }, (err, result) => {
      if (err) {
        reject(err);
        return;
      }

      const response = result?.response;
      if (!response || response.header?.resultCode !== '00') {
        reject(new Error(`API 오류: ${response?.header?.resultMsg || '알 수 없는 오류'}`));
        return;
      }

      const body = response.body;
      if (!body || !body.items) {
        resolve([]);
        return;
      }

      const itemsData = body.items.item;
      const items: PharmacyItem[] = Array.isArray(itemsData)
        ? itemsData
        : itemsData
        ? [itemsData]
        : [];

      resolve(items.filter(item => item.hospitalNm && item.addr));
    });
  });
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
    const count = parseInt(searchParams.get('count') || '10', 10);

    console.log(`[약국 저장] ${count}개 약국 데이터 수집 시작...`);

    // API에서 약국 데이터 가져오기
    const items = await fetchPharmacies(1, count);
    console.log(`[약국 저장] API에서 ${items.length}개 데이터 수신`);

    if (items.length === 0) {
      return NextResponse.json(
        { success: false, error: '가져올 데이터가 없습니다.' },
        { status: 400 }
      );
    }

    // Supabase 클라이언트
    const supabase = getServiceRoleClient();

    // 데이터 저장
    let savedCount = 0;
    const results = [];

    for (const item of items) {
      try {
        // 중복 체크 (약국명 + 주소 + type)
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
          results.push({ action: 'updated', name: item.hospitalNm });
        } else {
          // 삽입
          const { error } = await supabase
            .from('hospitals_pharmacies')
            .insert(data);

          if (error) throw error;
          savedCount++;
          results.push({ action: 'inserted', name: item.hospitalNm });
        }

        // API Rate Limiting 방지
        await new Promise(resolve => setTimeout(resolve, 50));
      } catch (error) {
        console.error(`[약국 저장] 저장 실패: ${item.hospitalNm}`, error);
        results.push({ action: 'error', name: item.hospitalNm, error: String(error) });
      }
    }

    console.log(`[약국 저장] 완료: ${savedCount}개 저장`);

    return NextResponse.json({
      success: true,
      message: '약국 데이터 저장 완료',
      savedCount,
      totalFetched: items.length,
      results,
    });
  } catch (error) {
    console.error('[약국 저장] 오류:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

