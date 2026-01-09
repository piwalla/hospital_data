/**
 * @file route.ts
 * @description 지역 기반 병원 검색 API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { getHospitalsByRegion } from '@/lib/api/hospitals';

export const dynamic = 'force-dynamic';

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

    console.log('[API] 지역 기반 병원 검색:', { provinceName, districtName, subDistrictName });

    const hospitals = await getHospitalsByRegion(
      provinceName,
      districtName,
      subDistrictName
    );

    return NextResponse.json({ hospitals });
  } catch (error) {
    console.error('[API] 지역 기반 병원 검색 실패:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hospitals by region' },
      { status: 500 }
    );
  }
}













