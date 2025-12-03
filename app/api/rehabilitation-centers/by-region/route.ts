/**
 * @file route.ts
 * @description 지역 기반 재활기관 검색 API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { getRehabilitationCentersByRegion } from '@/lib/api/rehabilitation-centers';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const provinceName = searchParams.get('provinceName');
    const districtName = searchParams.get('districtName') || undefined;
    const subDistrictName = searchParams.get('subDistrictName') || undefined;

    if (!provinceName) {
      return NextResponse.json(
        { error: 'provinceName is required' },
        { status: 400 }
      );
    }

    console.log('[API] 지역 기반 재활기관 검색:', { provinceName, districtName, subDistrictName });

    const rehabilitationCenters = await getRehabilitationCentersByRegion(
      provinceName,
      districtName,
      subDistrictName
    );

    return NextResponse.json({ rehabilitationCenters });
  } catch (error) {
    console.error('[API] 지역 기반 재활기관 검색 실패:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rehabilitation centers by region' },
      { status: 500 }
    );
  }
}













