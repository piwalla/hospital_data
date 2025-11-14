/**
 * @file route.ts
 * @description 반경 내 재활기관 검색 API 엔드포인트
 *
 * 클라이언트 컴포넌트에서 사용자 위치 기반 재활기관 검색을 위한 API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { getRehabilitationCentersNearby } from '@/lib/api/rehabilitation-centers';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const latitude = parseFloat(searchParams.get('latitude') || '0');
    const longitude = parseFloat(searchParams.get('longitude') || '0');
    const radiusKm = parseFloat(searchParams.get('radiusKm') || '5');

    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: '위도와 경도가 필요합니다.' },
        { status: 400 }
      );
    }

    console.log('[API] 반경 내 재활기관 검색:', { latitude, longitude, radiusKm });

    const rehabilitationCenters = await getRehabilitationCentersNearby(latitude, longitude, radiusKm);

    return NextResponse.json({
      success: true,
      rehabilitationCenters,
      count: rehabilitationCenters.length,
    });
  } catch (error) {
    console.error('[API] 반경 내 재활기관 검색 실패:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류',
      },
      { status: 500 }
    );
  }
}

