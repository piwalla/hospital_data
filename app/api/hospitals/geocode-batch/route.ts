/**
 * @file route.ts
 * @description Supabase에 저장된 병원 데이터의 주소를 Geocoding하여 좌표 업데이트
 *
 * 좌표가 0,0인 병원 데이터를 읽어서:
 * 1. 주소를 Geocoding API로 위도/경도 변환
 * 2. Supabase에 좌표 업데이트
 *
 * 사용법:
 * POST /api/hospitals/geocode-batch?limit=100&delayMs=150
 * - limit: 처리할 최대 개수 (기본값: 100)
 * - delayMs: Geocoding API 호출 간 딜레이 (기본값: 150ms)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getGeocodingClient } from '@/lib/api/geocoding';
import { getServiceRoleClient } from '@/lib/supabase/service-role';

export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const delayMs = parseInt(searchParams.get('delayMs') || '150', 10);

    console.log('[Geocode Batch] 시작:', { limit, delayMs });

    const supabase = getServiceRoleClient();
    const geocodingClient = getGeocodingClient();

    // 좌표가 0,0인 병원 데이터 조회 (주소가 있는 것만)
    const { data: hospitals, error: fetchError } = await supabase
      .from('hospitals_pharmacies')
      .select('id, name, address')
      .eq('latitude', 0)
      .eq('longitude', 0)
      .not('address', 'is', null)
      .limit(limit);

    if (fetchError) {
      console.error('[Geocode Batch] 데이터 조회 실패:', fetchError);
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
        message: 'Geocoding이 필요한 데이터가 없습니다.',
        summary: {
          processed: 0,
          success: 0,
          failed: 0,
        },
      });
    }

    console.log(`[Geocode Batch] ${hospitals.length}개 병원 데이터 Geocoding 시작`);

    // Geocoding 수행 및 업데이트
    let successCount = 0;
    let failedCount = 0;
    const failedAddresses: string[] = [];

    for (const hospital of hospitals) {
      try {
        // 주소가 비어있거나 null인 경우 스킵
        if (!hospital.address || hospital.address.trim().length === 0) {
          console.warn(`[Geocode Batch] 주소가 비어있음: ${hospital.name}`);
          failedCount++;
          continue;
        }

        const coordinates = await geocodingClient.geocode(hospital.address.trim());

        if (!coordinates) {
          console.warn(`[Geocode Batch] Geocoding 실패: ${hospital.name}`);
          console.warn(`[Geocode Batch] 주소: ${hospital.address}`);
          console.warn(`[Geocode Batch] 주소 길이: ${hospital.address.length}`);
          failedCount++;
          failedAddresses.push(hospital.address);
          continue;
        }

        // Supabase에 좌표 업데이트
        const { error: updateError } = await supabase
          .from('hospitals_pharmacies')
          .update({
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            last_updated: new Date().toISOString(),
          })
          .eq('id', hospital.id);

        if (updateError) {
          console.error(`[Geocode Batch] 업데이트 실패: ${hospital.name}`, updateError);
          failedCount++;
          failedAddresses.push(hospital.address);
        } else {
          successCount++;
          console.log(`[Geocode Batch] 성공: ${hospital.name} → (${coordinates.latitude}, ${coordinates.longitude})`);
        }

        // API 부하 방지를 위한 딜레이
        if (delayMs > 0) {
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      } catch (error) {
        console.error(`[Geocode Batch] 처리 중 오류: ${hospital.name}`, error);
        failedCount++;
        failedAddresses.push(hospital.address);
      }
    }

    console.log('[Geocode Batch] 완료:', {
      total: hospitals.length,
      success: successCount,
      failed: failedCount,
    });

    return NextResponse.json({
      success: true,
      message: 'Geocoding 배치 처리 완료',
      summary: {
        total: hospitals.length,
        processed: hospitals.length,
        success: successCount,
        failed: failedCount,
        failedAddresses: failedAddresses.slice(0, 10), // 처음 10개만 반환
      },
    });
  } catch (error) {
    console.error('[Geocode Batch] 오류:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류',
      },
      { status: 500 }
    );
  }
}

