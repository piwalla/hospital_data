/**
 * @file route.ts
 * @description 약국 데이터 수집 상태 확인 API
 * 
 * 현재 저장된 약국 데이터 개수와 다음 수집 시작 페이지를 확인합니다.
 */

import { NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase/service-role';

export async function GET() {
  try {
    const supabase = getServiceRoleClient();

    // 현재 저장된 약국 데이터 개수
    const { count, error: countError } = await supabase
      .from('hospitals_pharmacies')
      .select('*', { count: 'exact', head: true })
      .eq('type', 'pharmacy');

    if (countError) {
      throw countError;
    }

    // 최근 업데이트된 약국 데이터 샘플
    const { data: recent, error: recentError } = await supabase
      .from('hospitals_pharmacies')
      .select('id, name, address, last_updated')
      .eq('type', 'pharmacy')
      .order('last_updated', { ascending: false })
      .limit(5);

    if (recentError) {
      console.error('[약국 Status] 최근 데이터 조회 실패:', recentError);
    }

    // 전체 약국 API 개수 확인 (선택적)
    let apiTotalCount = null;
    try {
      const API_KEY = process.env.DATA_GO_KR_API_KEY || process.env.TOUR_API_KEY || '';
      if (API_KEY) {
        const url = `https://apis.data.go.kr/B490001/sjHptMcalPstateInfoService/getSjJijeongyakgukChakgiList?serviceKey=${API_KEY}&numOfRows=1&pageNo=1`;
        const response = await fetch(url);
        if (response.ok) {
          const xmlText = await response.text();
          const { parseString } = await import('xml2js');
          
          await new Promise<void>((resolve) => {
            parseString(xmlText, { explicitArray: false, mergeAttrs: true }, (err, result) => {
              if (!err && result?.response?.body?.totalCount) {
                apiTotalCount = parseInt(result.response.body.totalCount, 10);
              }
              resolve();
            });
          });
        }
      }
    } catch (error) {
      console.error('[약국 Status] API 개수 확인 실패:', error);
    }

    const savedCount = count || 0;
    const apiCount = apiTotalCount || 0;
    const remaining = apiCount > 0 ? Math.max(0, apiCount - savedCount) : null;
    const progress = apiCount > 0 ? Math.round((savedCount / apiCount) * 100) : null;

    // 페이지당 100개 기준으로 다음 시작 페이지 계산
    const numOfRows = 100;
    const estimatedNextPage = Math.floor(savedCount / numOfRows) + 1;

    return NextResponse.json({
      success: true,
      savedCount,
      apiTotalCount: apiCount > 0 ? apiCount : null,
      remaining,
      progress: progress !== null ? {
        percentage: progress,
        saved: savedCount,
        total: apiCount,
      } : null,
      estimatedNextPage,
      recent: recent || [],
      message: apiCount > 0
        ? `현재 ${savedCount.toLocaleString()}개 저장됨 (전체 ${apiCount.toLocaleString()}개 중 ${progress}%)`
        : `현재 ${savedCount.toLocaleString()}개 저장됨`,
    });
  } catch (error) {
    console.error('[약국 Status] 오류:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}







