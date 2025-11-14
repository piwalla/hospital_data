/**
 * @file route.ts
 * @description 재활기관 테스트 데이터 Import API
 * 
 * 재활기관 API에서 10개 데이터를 가져와서 Supabase에 저장합니다.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase/service-role';

const API_KEY = process.env.TOUR_API_KEY || process.env.REHABILITATION_API_KEY || '';
const BASE_URL = 'https://apis.data.go.kr/B490001/sjbJhgigwanGwanriInfoService/getSjbWkGigwanInfoList';

interface RehabilitationCenterItem {
  gigwanNm?: string;
  gigwanFg?: string;
  gigwanFgNm?: string;
  addr?: string;
  telNo?: string;
  faxNo?: string;
  gwanriJisaCd?: string;
  jisaNm?: string;
}

/**
 * 재활기관 API 호출
 */
async function fetchRehabilitationCenters(count: number = 10) {
  const url = new URL(BASE_URL);
  url.searchParams.set('serviceKey', API_KEY);
  url.searchParams.set('pageNo', '1');
  url.searchParams.set('numOfRows', count.toString());

  console.log('[Rehabilitation API] 요청:', url.toString().replace(API_KEY, '***'));

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
  
  return new Promise<RehabilitationCenterItem[]>((resolve, reject) => {
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
      const items: RehabilitationCenterItem[] = Array.isArray(itemsData)
        ? itemsData
        : itemsData
        ? [itemsData]
        : [];

      resolve(items.filter(item => item.gigwanNm && item.addr));
    });
  });
}

// Geocoding은 별도 API로 처리하므로 여기서는 제거

export async function POST(request: NextRequest) {
  try {
    if (!API_KEY) {
      return NextResponse.json(
        { success: false, error: 'API 키가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    console.log('[Rehabilitation Import] 시작...');

    // API에서 데이터 가져오기
    const items = await fetchRehabilitationCenters(10);
    console.log(`[Rehabilitation Import] API에서 ${items.length}개 데이터 수신`);

    if (items.length === 0) {
      return NextResponse.json(
        { success: false, error: '가져올 데이터가 없습니다.' },
        { status: 400 }
      );
    }

    // Supabase 클라이언트
    const supabase = getServiceRoleClient();

    // 데이터 저장 (Geocoding은 별도로 처리)
    let savedCount = 0;
    const results = [];

    for (const item of items) {
      try {
        // 중복 체크
        const { data: existing } = await supabase
          .from('rehabilitation_centers')
          .select('id')
          .eq('gigwan_nm', item.gigwanNm)
          .eq('address', item.addr)
          .single();

        const data = {
          gigwan_nm: item.gigwanNm || '',
          gigwan_fg: item.gigwanFg || null,
          gigwan_fg_nm: item.gigwanFgNm || null,
          address: item.addr || '',
          latitude: 0, // Geocoding은 별도 API로 처리
          longitude: 0, // Geocoding은 별도 API로 처리
          tel_no: item.telNo || null,
          fax_no: item.faxNo || null,
          gwanri_jisa_cd: item.gwanriJisaCd || null,
          jisa_nm: item.jisaNm || null,
        };

        if (existing) {
          // 업데이트
          const { error } = await supabase
            .from('rehabilitation_centers')
            .update(data)
            .eq('id', existing.id);

          if (error) throw error;
          results.push({ action: 'updated', name: item.gigwanNm });
        } else {
          // 삽입
          const { error } = await supabase
            .from('rehabilitation_centers')
            .insert(data);

          if (error) throw error;
          savedCount++;
          results.push({ action: 'inserted', name: item.gigwanNm });
        }

        // API Rate Limiting 방지 (Geocoding 제거로 딜레이 감소)
        await new Promise(resolve => setTimeout(resolve, 50));
      } catch (error) {
        console.error(`[Rehabilitation Import] 저장 실패: ${item.gigwanNm}`, error);
        results.push({ action: 'error', name: item.gigwanNm, error: String(error) });
      }
    }

    console.log(`[Rehabilitation Import] 완료: ${savedCount}개 저장`);

    return NextResponse.json({
      success: true,
      message: '재활기관 테스트 데이터 저장 완료 (Geocoding은 별도로 처리 필요)',
      savedCount,
      totalFetched: items.length,
      results,
    });
  } catch (error) {
    console.error('[Rehabilitation Import] 오류:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

