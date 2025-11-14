/**
 * @file route.ts
 * @description 재활기관 Geocoding API
 * 
 * Supabase에 저장된 재활기관 데이터 중 좌표가 없는 것들을 Geocoding합니다.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase/service-role';
import { getGeocodingClient } from '@/lib/api/geocoding';

export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const delayMs = parseInt(searchParams.get('delayMs') || '150', 10);

    console.log('[Rehabilitation Geocoding] 시작:', { limit, delayMs });

    const supabase = getServiceRoleClient();
    const geocodingClient = getGeocodingClient();

    // 좌표가 없는 데이터 조회
    const { data: centers, error: fetchError } = await supabase
      .from('rehabilitation_centers')
      .select('id, gigwan_nm, address')
      .or('latitude.eq.0,longitude.eq.0')
      .not('address', 'is', null)
      .order('last_updated', { ascending: true })
      .limit(limit);

    if (fetchError) {
      throw fetchError;
    }

    if (!centers || centers.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Geocoding이 필요한 데이터가 없습니다.',
        geocodedCount: 0,
        totalCount: 0,
      });
    }

    console.log(`[Rehabilitation Geocoding] ${centers.length}개 데이터 Geocoding 시작...`);

    let geocodedCount = 0;
    let failedCount = 0;
    const results = [];

    for (const center of centers) {
      try {
        const result = await geocodingClient.geocode(center.address);
        
        if (result && result.latitude && result.longitude) {
          const { error: updateError } = await supabase
            .from('rehabilitation_centers')
            .update({
              latitude: result.latitude,
              longitude: result.longitude,
            })
            .eq('id', center.id);

          if (updateError) {
            throw updateError;
          }

          geocodedCount++;
          results.push({
            id: center.id,
            name: center.gigwan_nm,
            address: center.address,
            lat: result.latitude,
            lng: result.longitude,
            status: 'success',
          });

          console.log(`[Geocoding 성공] ${center.gigwan_nm}: ${result.latitude}, ${result.longitude}`);
        } else {
          failedCount++;
          results.push({
            id: center.id,
            name: center.gigwan_nm,
            address: center.address,
            status: 'failed',
            reason: '결과 없음',
          });
          console.warn(`[Geocoding 실패] ${center.gigwan_nm}: 결과 없음`);
        }

        // API Rate Limiting 방지
        if (delayMs > 0) {
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      } catch (error) {
        failedCount++;
        results.push({
          id: center.id,
          name: center.gigwan_nm,
          address: center.address,
          status: 'error',
          error: String(error),
        });
        console.error(`[Geocoding 오류] ${center.gigwan_nm}:`, error);
      }
    }

    console.log(`[Rehabilitation Geocoding] 완료: ${geocodedCount}개 성공, ${failedCount}개 실패`);

    return NextResponse.json({
      success: true,
      message: 'Geocoding 완료',
      geocodedCount,
      failedCount,
      totalCount: centers.length,
      results: results.slice(0, 10), // 처음 10개만 반환
    });
  } catch (error) {
    console.error('[Rehabilitation Geocoding] 오류:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

