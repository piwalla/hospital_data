/**
 * @file route.ts
 * @description VWorld API를 사용하여 재활기관 실패한 주소 Geocoding 재시도
 *
 * 네이버 API로 실패한 재활기관 주소를 VWorld API로 재시도합니다.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getVWorldGeocodingClient } from '@/lib/api/geocoding-vworld';
import { getServiceRoleClient } from '@/lib/supabase/service-role';

export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const delayMs = parseInt(searchParams.get('delayMs') || '200', 10);

    console.log('[Rehabilitation Geocode VWorld] 시작:', { limit, delayMs });

    const supabase = getServiceRoleClient();
    const geocodingClient = getVWorldGeocodingClient();

    // 좌표가 0,0인 재활기관 데이터 조회 (주소가 있는 것만)
    const { data: centers, error: fetchError } = await supabase
      .from('rehabilitation_centers')
      .select('id, gigwan_nm, address')
      .eq('latitude', 0)
      .eq('longitude', 0)
      .not('address', 'is', null)
      .limit(limit);

    if (fetchError) {
      console.error('[Rehabilitation Geocode VWorld] 데이터 조회 실패:', fetchError);
      return NextResponse.json(
        {
          success: false,
          error: '데이터 조회 실패',
        },
        { status: 500 }
      );
    }

    if (!centers || centers.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'VWorld Geocoding이 필요한 재활기관 데이터가 없습니다.',
        summary: {
          processed: 0,
          success: 0,
          failed: 0,
        },
      });
    }

    console.log(`[Rehabilitation Geocode VWorld] ${centers.length}개 재활기관 데이터 Geocoding 시작`);

    // Geocoding 수행 및 업데이트
    let successCount = 0;
    let failedCount = 0;
    const failedAddresses: string[] = [];

    for (const center of centers) {
      try {
        // 주소가 비어있거나 null인 경우 스킵
        if (!center.address || center.address.trim().length === 0) {
          console.warn(`[Rehabilitation Geocode VWorld] 주소가 비어있음: ${center.gigwan_nm}`);
          failedCount++;
          continue;
        }

        const coordinates = await geocodingClient.geocode(center.address.trim());

        if (!coordinates) {
          console.warn(`[Rehabilitation Geocode VWorld] Geocoding 실패: ${center.gigwan_nm}`);
          console.warn(`[Rehabilitation Geocode VWorld] 주소: ${center.address}`);
          failedCount++;
          failedAddresses.push(center.address);
          continue;
        }

        // Supabase에 좌표 업데이트
        const { error: updateError } = await supabase
          .from('rehabilitation_centers')
          .update({
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            last_updated: new Date().toISOString(),
          })
          .eq('id', center.id);

        if (updateError) {
          console.error(`[Rehabilitation Geocode VWorld] 업데이트 실패: ${center.gigwan_nm}`, updateError);
          failedCount++;
          failedAddresses.push(center.address);
        } else {
          successCount++;
          console.log(`[Rehabilitation Geocode VWorld] 성공: ${center.gigwan_nm} → (${coordinates.latitude}, ${coordinates.longitude})`);
        }

        // API 부하 방지를 위한 딜레이
        if (delayMs > 0) {
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      } catch (error) {
        console.error(`[Rehabilitation Geocode VWorld] 처리 중 오류: ${center.gigwan_nm}`, error);
        failedCount++;
        failedAddresses.push(center.address);
      }
    }

    console.log('[Rehabilitation Geocode VWorld] 완료:', {
      total: centers.length,
      success: successCount,
      failed: failedCount,
    });

    return NextResponse.json({
      success: true,
      message: '재활기관 VWorld Geocoding 배치 처리 완료',
      summary: {
        total: centers.length,
        processed: centers.length,
        success: successCount,
        failed: failedCount,
        failedAddresses: failedAddresses.slice(0, 10), // 처음 10개만 반환
      },
    });
  } catch (error) {
    console.error('[Rehabilitation Geocode VWorld] 오류:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류',
      },
      { status: 500 }
    );
  }
}

