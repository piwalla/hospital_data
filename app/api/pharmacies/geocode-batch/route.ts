/**
 * @file route.ts
 * @description Supabase에 저장된 약국 데이터의 주소를 Geocoding하여 좌표 업데이트
 *
 * 좌표가 0,0인 약국 데이터를 읽어서:
 * 1. 주소를 Geocoding API로 위도/경도 변환
 * 2. Supabase에 좌표 업데이트
 *
 * 사용법:
 * POST /api/pharmacies/geocode-batch?limit=100&delayMs=150
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

    console.log('[약국 Geocode Batch] 시작:', { limit, delayMs });

    // API 키 확인
    const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;
    const clientSecret = process.env.NAVER_MAP_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        {
          success: false,
          error: '네이버 Maps API 키가 설정되지 않았습니다.',
        },
        { status: 500 }
      );
    }

    const supabase = getServiceRoleClient();
    const geocodingClient = getGeocodingClient();

    // 좌표가 0,0인 약국 데이터 조회 (주소가 있는 것만, type='pharmacy')
    const { data: pharmacies, error: fetchError } = await supabase
      .from('hospitals_pharmacies')
      .select('id, name, address')
      .eq('type', 'pharmacy')
      .eq('latitude', 0)
      .eq('longitude', 0)
      .not('address', 'is', null)
      .neq('address', '')
      .limit(limit);

    if (fetchError) {
      console.error('[약국 Geocode Batch] 데이터 조회 실패:', fetchError);
      return NextResponse.json(
        {
          success: false,
          error: '데이터 조회 실패',
          details: String(fetchError),
        },
        { status: 500 }
      );
    }

    if (!pharmacies || pharmacies.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Geocoding이 필요한 약국 데이터가 없습니다.',
        summary: {
          processed: 0,
          success: 0,
          failed: 0,
        },
      });
    }

    console.log(`[약국 Geocode Batch] ${pharmacies.length}개 약국 데이터 Geocoding 시작`);

    // Geocoding 수행 및 업데이트
    let successCount = 0;
    let failedCount = 0;
    const failedAddresses: Array<{ id: string; name: string; address: string; error?: string }> = [];
    const successAddresses: Array<{ id: string; name: string; coordinates: { latitude: number; longitude: number } }> = [];

    for (const pharmacy of pharmacies) {
      try {
        // 주소가 비어있거나 null인 경우 스킵
        if (!pharmacy.address || pharmacy.address.trim().length === 0) {
          console.warn(`[약국 Geocode Batch] 주소가 비어있음: ${pharmacy.name}`);
          failedCount++;
          failedAddresses.push({
            id: pharmacy.id,
            name: pharmacy.name || '',
            address: '',
            error: '주소가 비어있음',
          });
          continue;
        }

        const coordinates = await geocodingClient.geocode(pharmacy.address.trim());

        if (!coordinates) {
          console.warn(`[약국 Geocode Batch] Geocoding 실패: ${pharmacy.name}`);
          console.warn(`[약국 Geocode Batch] 주소: ${pharmacy.address}`);
          failedCount++;
          failedAddresses.push({
            id: pharmacy.id,
            name: pharmacy.name || '',
            address: pharmacy.address,
            error: 'Geocoding 결과 없음',
          });
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
          .eq('id', pharmacy.id);

        if (updateError) {
          console.error(`[약국 Geocode Batch] 업데이트 실패: ${pharmacy.name}`, updateError);
          failedCount++;
          failedAddresses.push({
            id: pharmacy.id,
            name: pharmacy.name || '',
            address: pharmacy.address,
            error: `업데이트 실패: ${updateError.message}`,
          });
          continue;
        }

        successCount++;
        successAddresses.push({
          id: pharmacy.id,
          name: pharmacy.name || '',
          coordinates,
        });

        // API Rate Limiting 방지를 위한 딜레이
        if (delayMs > 0) {
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      } catch (error) {
        console.error(`[약국 Geocode Batch] 처리 중 오류: ${pharmacy.name}`, error);
        failedCount++;
        failedAddresses.push({
          id: pharmacy.id,
          name: pharmacy.name || '',
          address: pharmacy.address || '',
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    const successRate = pharmacies.length > 0
      ? Math.round((successCount / pharmacies.length) * 100)
      : 0;

    console.log(`[약국 Geocode Batch] 완료: ${successCount}개 성공, ${failedCount}개 실패 (성공률: ${successRate}%)`);

    // 다음 배치를 위한 정보
    const { count: remainingCount } = await supabase
      .from('hospitals_pharmacies')
      .select('*', { count: 'exact', head: true })
      .eq('type', 'pharmacy')
      .eq('latitude', 0)
      .eq('longitude', 0)
      .not('address', 'is', null)
      .neq('address', '');

    return NextResponse.json({
      success: true,
      message: '약국 데이터 Geocoding 배치 처리 완료',
      summary: {
        processed: pharmacies.length,
        success: successCount,
        failed: failedCount,
        successRate: `${successRate}%`,
        remaining: remainingCount || 0,
      },
      details: {
        successAddresses: successAddresses.slice(0, 5), // 샘플 5개만
        failedAddresses: failedAddresses.slice(0, 10), // 실패한 주소 샘플 10개
        totalSuccess: successAddresses.length,
        totalFailed: failedAddresses.length,
      },
      nextSteps: remainingCount && remainingCount > 0
        ? {
            message: `${remainingCount}개 약국 데이터가 더 남아있습니다.`,
            recommendation: '다음 배치를 실행하세요.',
            nextBatchUrl: `/api/pharmacies/geocode-batch?limit=${limit}&delayMs=${delayMs}`,
          }
        : {
            message: '모든 약국 데이터의 Geocoding이 완료되었습니다.',
          },
    });
  } catch (error) {
    console.error('[약국 Geocode Batch] 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 }
    );
  }
}







