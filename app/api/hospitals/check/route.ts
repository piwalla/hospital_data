/**
 * @file route.ts
 * @description 데이터베이스 상태 확인 API
 *
 * 데이터베이스에 저장된 병원 데이터의 상태를 확인합니다.
 */

import { NextResponse } from 'next/server';
import { createClerkSupabaseClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClerkSupabaseClient();

    // 전체 병원 수 확인
    const { count: totalCount, error: countError } = await supabase
      .from('hospitals_pharmacies')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      throw countError;
    }

    // 좌표가 유효한 병원 수 (0,0이 아닌 경우)
    const { count: validCoordinatesCount, error: validError } = await supabase
      .from('hospitals_pharmacies')
      .select('*', { count: 'exact', head: true })
      .neq('latitude', 0)
      .neq('longitude', 0);

    if (validError) {
      throw validError;
    }

    // 좌표가 0,0인 병원 수
    const { count: invalidCoordinatesCount, error: invalidError } = await supabase
      .from('hospitals_pharmacies')
      .select('*', { count: 'exact', head: true })
      .or('latitude.eq.0,longitude.eq.0');

    if (invalidError) {
      throw invalidError;
    }

    // 샘플 데이터 조회 (최대 5개)
    const { data: sampleData, error: sampleError } = await supabase
      .from('hospitals_pharmacies')
      .select('id, name, address, latitude, longitude, type')
      .limit(5);

    if (sampleError) {
      throw sampleError;
    }

    // 좌표 범위 확인 (한국 영역: 위도 33-43, 경도 124-132)
    const { count: koreaRegionCount, error: koreaError } = await supabase
      .from('hospitals_pharmacies')
      .select('*', { count: 'exact', head: true })
      .gte('latitude', 33)
      .lte('latitude', 43)
      .gte('longitude', 124)
      .lte('longitude', 132);

    if (koreaError) {
      throw koreaError;
    }

    return NextResponse.json({
      success: true,
      summary: {
        totalCount: totalCount || 0,
        validCoordinatesCount: validCoordinatesCount || 0,
        invalidCoordinatesCount: invalidCoordinatesCount || 0,
        koreaRegionCount: koreaRegionCount || 0,
      },
      sampleData: sampleData || [],
      message: {
        hasData: (totalCount || 0) > 0,
        hasValidCoordinates: (validCoordinatesCount || 0) > 0,
        needsGeocoding: (invalidCoordinatesCount || 0) > 0,
      },
    });
  } catch (error) {
    console.error('[API] 데이터베이스 상태 확인 실패:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류',
      },
      { status: 500 }
    );
  }
}


