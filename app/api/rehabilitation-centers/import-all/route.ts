/**
 * @file route.ts
 * @description 재활기관 전체 데이터 Import API
 * 
 * 재활기관 API에서 모든 데이터를 가져와서 Supabase에 저장합니다.
 * Geocoding은 별도 API로 처리합니다.
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
async function fetchRehabilitationCenters(pageNo: number, numOfRows: number) {
  const url = new URL(BASE_URL);
  url.searchParams.set('serviceKey', API_KEY);
  url.searchParams.set('pageNo', pageNo.toString());
  url.searchParams.set('numOfRows', numOfRows.toString());

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
  const { parseString } = await import('xml2js');

  return new Promise<{ items: RehabilitationCenterItem[]; totalCount: number }>((resolve, reject) => {
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
        resolve({ items: [], totalCount: 0 });
        return;
      }

      const itemsData = body.items.item;
      const items: RehabilitationCenterItem[] = Array.isArray(itemsData)
        ? itemsData
        : itemsData
        ? [itemsData]
        : [];

      const totalCount = parseInt(body.totalCount || '0', 10);
      
      // 필터링 제거: 모든 항목을 포함 (빠지는 데이터 없도록)
      // 기관명/주소가 없어도 저장 (나중에 확인 가능하도록)
      const filteredItems = items; // 필터링 없이 모든 항목 포함
      
      // 기관명/주소가 없는 항목 수 확인 (로깅용)
      const itemsWithoutNameOrAddr = items.filter(item => {
        const hasName = item.gigwanNm && item.gigwanNm.trim().length > 0;
        const hasAddr = item.addr && item.addr.trim().length > 0;
        return !hasName && !hasAddr;
      });
      
      if (itemsWithoutNameOrAddr.length > 0) {
        console.log(`[Rehabilitation API] 페이지 ${pageNo}: 기관명/주소 없는 항목 ${itemsWithoutNameOrAddr.length}개 (그래도 저장)`);
      }

      resolve({
        items: filteredItems,
        totalCount,
      });
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

    console.log('[Rehabilitation Import All] 시작...');

    // 첫 페이지로 전체 개수 확인
    const firstPage = await fetchRehabilitationCenters(1, 1);
    const totalCount = firstPage.totalCount;
    const perPage = 100; // 페이지당 100개
    const totalPages = Math.ceil(totalCount / perPage);

    console.log(`[Rehabilitation Import All] 총 ${totalCount}개 데이터, ${totalPages}페이지`);
    console.log(`[Rehabilitation Import All] 페이지당 ${perPage}개씩 처리`);

    const supabase = getServiceRoleClient();
    let savedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    let totalFetchedItems = 0; // 실제로 API에서 가져온 총 항목 수

    // 모든 페이지 순회
    for (let page = 1; page <= totalPages; page++) {
      console.log(`[Rehabilitation Import All] 페이지 ${page}/${totalPages} 처리 중...`);

      const { items } = await fetchRehabilitationCenters(page, perPage);
      totalFetchedItems += items.length;

      if (items.length === 0 && page <= totalPages) {
        console.warn(`[Rehabilitation Import All] 페이지 ${page}에서 데이터가 없습니다.`);
      } else {
        // 각 페이지에서 가져온 항목 수 로그 (디버깅용)
        if (page <= 3 || page === totalPages || items.length < perPage) {
          console.log(`[Rehabilitation Import All] 페이지 ${page}: ${items.length}개 항목 가져옴`);
        }
      }

      for (const item of items) {
        try {
          // 중복 체크
          const { data: existing } = await supabase
            .from('rehabilitation_centers')
            .select('id')
            .eq('gigwan_nm', item.gigwanNm)
            .eq('address', item.addr)
            .single();

          // 모든 항목 저장 (기관명/주소가 없어도 저장)
          const data = {
            gigwan_nm: (item.gigwanNm || '').trim() || `기관명_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            gigwan_fg: item.gigwanFg || null,
            gigwan_fg_nm: item.gigwanFgNm || null,
            address: (item.addr || '').trim() || `주소_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            latitude: 0, // Geocoding은 /api/rehabilitation-centers/geocode로 별도 처리
            longitude: 0, // Geocoding은 /api/rehabilitation-centers/geocode로 별도 처리
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
            updatedCount++;
          } else {
            // 삽입
            const { error } = await supabase
              .from('rehabilitation_centers')
              .insert(data);

            if (error) throw error;
            savedCount++;
          }
        } catch (error) {
          console.error(`[Rehabilitation Import All] 저장 실패: ${item.gigwanNm || 'N/A'}`, error);
          skippedCount++;
          // 에러 상세 정보 로그
          if (error instanceof Error) {
            console.error(`[Rehabilitation Import All] 에러 상세:`, error.message);
          }
        }
      }

      // API Rate Limiting 방지
      if (page < totalPages) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // 진행 상황 로그
      if (page % 5 === 0 || page === totalPages) {
        const progress = ((page / totalPages) * 100).toFixed(1);
        console.log(`[Rehabilitation Import All] 진행: ${page}/${totalPages} 페이지 (${progress}%) - ${savedCount}개 저장, ${updatedCount}개 업데이트`);
      }
    }

    const totalImported = savedCount + updatedCount;
    const missingCount = totalCount - totalImported;
    const apiFetchedDiff = totalCount - totalFetchedItems; // API에서 실제로 가져온 데이터와 전체 개수 차이

    console.log(`[Rehabilitation Import All] 완료: ${savedCount}개 저장, ${updatedCount}개 업데이트, ${skippedCount}개 건너뜀`);
    console.log(`[Rehabilitation Import All] API에서 가져온 항목: ${totalFetchedItems}개`);
    console.log(`[Rehabilitation Import All] 총 Import: ${totalImported}개 / 전체: ${totalCount}개`);
    
    if (apiFetchedDiff > 0) {
      console.warn(`[Rehabilitation Import All] ⚠️  API 응답에서 ${apiFetchedDiff}개가 누락되었습니다 (필터링 또는 API 이슈 가능)`);
    }
    
    if (missingCount > 0) {
      console.warn(`[Rehabilitation Import All] ⚠️  ${missingCount}개 데이터가 누락되었습니다.`);
      console.warn(`[Rehabilitation Import All] 💡 원인: API 필터링(${apiFetchedDiff}개) 또는 저장 실패(${skippedCount}개)`);
    } else {
      console.log(`[Rehabilitation Import All] ✅ 모든 데이터가 성공적으로 Import되었습니다!`);
    }

    return NextResponse.json({
      success: true,
      message: '재활기관 전체 데이터 Import 완료',
      savedCount,
      updatedCount,
      skippedCount,
      totalImported,
      totalFetchedItems,
      totalCount,
      totalPages,
      missingCount,
      apiFetchedDiff,
      isComplete: missingCount === 0 && skippedCount === 0,
    });
  } catch (error) {
    console.error('[Rehabilitation Import All] 오류:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

