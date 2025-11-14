/**
 * @file route.ts
 * @description Geocoding 결과 검증 API
 * 
 * Supabase에 저장된 병원 데이터의 좌표가 실제 주소와 일치하는지 검증합니다.
 * - 좌표가 0,0이 아닌지 확인
 * - 좌표가 한국 지역 내에 있는지 확인 (위도: 33-43, 경도: 124-132)
 * - 샘플 데이터를 반환하여 수동 검증 가능
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase/service-role';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const supabase = getServiceRoleClient();

    // 좌표가 있는 병원 데이터 조회 (0,0 제외)
    const { data: hospitals, error } = await supabase
      .from('hospitals_pharmacies')
      .select('id, name, address, latitude, longitude, phone')
      .neq('latitude', 0)
      .neq('longitude', 0)
      .limit(limit);

    if (error) {
      console.error('[Verify Geocoding] 데이터 조회 실패:', error);
      return NextResponse.json(
        {
          success: false,
          error: '데이터 조회 실패',
        },
        { status: 500 }
      );
    }

    if (!hospitals || hospitals.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Geocoding된 데이터가 없습니다.',
        samples: [],
      });
    }

    // 한국 지역 범위 검증 (위도: 33-43, 경도: 124-132)
    const koreaLatMin = 33;
    const koreaLatMax = 43;
    const koreaLonMin = 124;
    const koreaLonMax = 132;

    const validSamples: typeof hospitals = [];
    const invalidSamples: typeof hospitals = [];

    hospitals.forEach((hospital) => {
      const isValid =
        hospital.latitude >= koreaLatMin &&
        hospital.latitude <= koreaLatMax &&
        hospital.longitude >= koreaLonMin &&
        hospital.longitude <= koreaLonMax;

      if (isValid) {
        validSamples.push(hospital);
      } else {
        invalidSamples.push(hospital);
      }
    });

    // 통계 계산
    const { count: totalWithCoordinates } = await supabase
      .from('hospitals_pharmacies')
      .select('*', { count: 'exact', head: true })
      .neq('latitude', 0)
      .neq('longitude', 0);

    const { count: totalInKorea } = await supabase
      .from('hospitals_pharmacies')
      .select('*', { count: 'exact', head: true })
      .gte('latitude', koreaLatMin)
      .lte('latitude', koreaLatMax)
      .gte('longitude', koreaLonMin)
      .lte('longitude', koreaLonMax);

    return NextResponse.json({
      success: true,
      message: 'Geocoding 결과 검증 완료',
      statistics: {
        totalWithCoordinates: totalWithCoordinates || 0,
        totalInKorea: totalInKorea || 0,
        invalidCoordinates: (totalWithCoordinates || 0) - (totalInKorea || 0),
      },
      samples: {
        valid: validSamples.slice(0, 5), // 유효한 샘플 5개
        invalid: invalidSamples.slice(0, 5), // 무효한 샘플 5개
      },
      koreaRegion: {
        latitude: { min: koreaLatMin, max: koreaLatMax },
        longitude: { min: koreaLonMin, max: koreaLonMax },
      },
    });
  } catch (error) {
    console.error('[Verify Geocoding] 오류:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류',
      },
      { status: 500 }
    );
  }
}


