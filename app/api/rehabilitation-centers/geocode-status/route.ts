/**
 * @file route.ts
 * @description 재활기관 Geocoding 상태 확인 API
 * 
 * Supabase에 저장된 재활기관 데이터의 Geocoding 상태를 확인합니다.
 */

import { NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase/service-role';

export async function GET() {
  try {
    const supabase = getServiceRoleClient();

    // 전체 데이터 수
    const { count: totalCount, error: totalError } = await supabase
      .from('rehabilitation_centers')
      .select('*', { count: 'exact', head: true });

    if (totalError) {
      throw totalError;
    }

    // 좌표가 있는 데이터 수 (latitude != 0 AND longitude != 0)
    const { count: geocodedCount, error: geocodedError } = await supabase
      .from('rehabilitation_centers')
      .select('*', { count: 'exact', head: true })
      .neq('latitude', 0)
      .neq('longitude', 0);

    if (geocodedError) {
      throw geocodedError;
    }

    // 좌표가 없는 데이터 수 (latitude = 0 OR longitude = 0)
    const { count: notGeocodedCount, error: notGeocodedError } = await supabase
      .from('rehabilitation_centers')
      .select('*', { count: 'exact', head: true })
      .or('latitude.eq.0,longitude.eq.0');

    if (notGeocodedError) {
      throw notGeocodedError;
    }

    // 주소가 없는 데이터 수
    const { count: noAddressCount, error: noAddressError } = await supabase
      .from('rehabilitation_centers')
      .select('*', { count: 'exact', head: true })
      .is('address', null);

    if (noAddressError) {
      throw noAddressError;
    }

    const successRate = totalCount && totalCount > 0 
      ? ((geocodedCount || 0) / totalCount * 100).toFixed(2)
      : '0.00';

    return NextResponse.json({
      success: true,
      status: {
        total: totalCount || 0,
        geocoded: geocodedCount || 0,
        notGeocoded: notGeocodedCount || 0,
        noAddress: noAddressCount || 0,
        successRate: `${successRate}%`,
      },
      message: notGeocodedCount === 0 
        ? '모든 재활기관의 Geocoding이 완료되었습니다!'
        : `${notGeocodedCount}개의 재활기관이 아직 Geocoding되지 않았습니다.`,
    });
  } catch (error) {
    console.error('[Rehabilitation Geocoding Status] 오류:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

