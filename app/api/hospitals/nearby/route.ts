/**
 * @file route.ts
 * @description 반경 내 병원 검색 API 엔드포인트
 *
 * 클라이언트 컴포넌트에서 사용자 위치 기반 병원 검색을 위한 API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { getHospitalsNearby } from '@/lib/api/hospitals';

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

    console.log('[API] 반경 내 병원 검색:', { latitude, longitude, radiusKm });

    const hospitals = await getHospitalsNearby(latitude, longitude, radiusKm);

    return NextResponse.json({
      success: true,
      hospitals,
      count: hospitals.length,
    });
  } catch (error) {
    console.error('[API] 반경 내 병원 검색 실패:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류',
      },
      { status: 500 }
    );
  }
}


