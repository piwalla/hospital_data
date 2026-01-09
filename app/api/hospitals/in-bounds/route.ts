/**
 * @file route.ts
 * @description 영역 기반 병원/재활기관 검색 API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { getHospitalsInBounds } from '@/lib/api/hospitals';
import { getRehabilitationCentersInBounds } from '@/lib/api/rehabilitation-centers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const neLat = parseFloat(searchParams.get('neLat') || '0');
    const neLng = parseFloat(searchParams.get('neLng') || '0');
    const swLat = parseFloat(searchParams.get('swLat') || '0');
    const swLng = parseFloat(searchParams.get('swLng') || '0');
    const type = searchParams.get('type') || 'all'; // 'hospital', 'rehab', 'all'

    if (!neLat || !neLng || !swLat || !swLng) {
      return NextResponse.json(
        { error: 'Bounds coordinates (neLat, neLng, swLat, swLng) are required' },
        { status: 400 }
      );
    }

    const northEast = { lat: neLat, lng: neLng };
    const southWest = { lat: swLat, lng: swLng };

    console.log('[API] 영역 기반 검색:', { northEast, southWest, type });

    let hospitals: any[] = [];
    let rehabs: any[] = [];

    // 병원 검색
    if (type === 'all' || type === 'hospital') {
      hospitals = await getHospitalsInBounds(northEast, southWest);
    }

    // 재활기관 검색
    if (type === 'all' || type === 'rehab') {
      rehabs = await getRehabilitationCentersInBounds(northEast, southWest);
    }

    return NextResponse.json({ 
      hospitals, 
      rehabilitationCenters: rehabs 
    });
  } catch (error) {
    console.error('[API] 영역 기반 검색 실패:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resources in bounds' },
      { status: 500 }
    );
  }
}
