/**
 * @file route.ts
 * @description 약국 데이터 지오코딩 테스트 API
 * 
 * 샘플 약국 10개로 지오코딩 API를 테스트합니다.
 * - 네이버 Geocoding API 응답 확인
 * - 성공률 측정
 * - API 응답 시간 측정
 * - 에러 케이스 확인
 */

import { NextResponse } from 'next/server';
import { getGeocodingClient } from '@/lib/api/geocoding';
import { getServiceRoleClient } from '@/lib/supabase/service-role';

interface TestResult {
  id: string;
  name: string;
  address: string;
  addressLength: number;
  success: boolean;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  error?: string;
  responseTime?: number;
}

export async function GET() {
  try {
    console.log('[약국 지오코딩 테스트] 시작...');

    // API 키 확인
    const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;
    const clientSecret = process.env.NAVER_MAP_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json({
        success: false,
        error: '네이버 Maps API 키가 설정되지 않았습니다.',
        requiredEnvVars: {
          NEXT_PUBLIC_NAVER_MAP_CLIENT_ID: clientId ? '설정됨' : '누락',
          NAVER_MAP_CLIENT_SECRET: clientSecret ? '설정됨' : '누락',
        },
      }, { status: 500 });
    }

    console.log('[약국 지오코딩 테스트] API 키 확인 완료');

    // 샘플 약국 데이터 조회
    const supabase = getServiceRoleClient();
    const { data: pharmacies, error: fetchError } = await supabase
      .from('hospitals_pharmacies')
      .select('id, name, address')
      .eq('type', 'pharmacy')
      .eq('latitude', 0)
      .eq('longitude', 0)
      .not('address', 'is', null)
      .limit(10);

    if (fetchError) {
      console.error('[약국 지오코딩 테스트] 데이터 조회 실패:', fetchError);
      return NextResponse.json({
        success: false,
        error: '데이터 조회 실패',
        details: String(fetchError),
      }, { status: 500 });
    }

    if (!pharmacies || pharmacies.length === 0) {
      return NextResponse.json({
        success: false,
        error: '테스트할 약국 데이터가 없습니다.',
      }, { status: 404 });
    }

    console.log(`[약국 지오코딩 테스트] ${pharmacies.length}개 샘플 약국 선택`);

    // Geocoding 클라이언트
    const geocodingClient = getGeocodingClient();

    // 각 약국에 대해 지오코딩 테스트
    const results: TestResult[] = [];
    let successCount = 0;
    let totalResponseTime = 0;

    for (const pharmacy of pharmacies) {
      const startTime = Date.now();
      const result: TestResult = {
        id: pharmacy.id,
        name: pharmacy.name || '',
        address: pharmacy.address || '',
        addressLength: (pharmacy.address || '').length,
        success: false,
      };

      try {
        if (!pharmacy.address || pharmacy.address.trim().length === 0) {
          result.error = '주소가 비어있음';
          results.push(result);
          continue;
        }

        console.log(`[약국 지오코딩 테스트] 처리 중: ${pharmacy.name}`);
        console.log(`[약국 지오코딩 테스트] 주소: ${pharmacy.address}`);

        const coordinates = await geocodingClient.geocode(pharmacy.address.trim());
        const responseTime = Date.now() - startTime;
        totalResponseTime += responseTime;
        result.responseTime = responseTime;

        if (coordinates) {
          result.success = true;
          result.coordinates = coordinates;
          successCount++;
          console.log(`[약국 지오코딩 테스트] ✅ 성공: ${pharmacy.name}`, coordinates);
        } else {
          result.error = 'Geocoding 결과 없음';
          console.log(`[약국 지오코딩 테스트] ❌ 실패: ${pharmacy.name}`);
        }
      } catch (error) {
        const responseTime = Date.now() - startTime;
        result.responseTime = responseTime;
        result.error = error instanceof Error ? error.message : String(error);
        console.error(`[약국 지오코딩 테스트] ❌ 에러: ${pharmacy.name}`, error);
      }

      results.push(result);

      // API Rate Limiting 방지 (테스트 중에는 200ms 딜레이)
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    const averageResponseTime = results.length > 0 
      ? Math.round(totalResponseTime / results.length) 
      : 0;
    const successRate = results.length > 0 
      ? Math.round((successCount / results.length) * 100) 
      : 0;

    console.log(`[약국 지오코딩 테스트] 완료: ${successCount}/${results.length} 성공 (${successRate}%)`);
    console.log(`[약국 지오코딩 테스트] 평균 응답 시간: ${averageResponseTime}ms`);

    // 주소 길이별 성공률 분석
    const lengthAnalysis = {
      short: { total: 0, success: 0 }, // < 20
      medium: { total: 0, success: 0 }, // 20-40
      long: { total: 0, success: 0 }, // 40-60
      veryLong: { total: 0, success: 0 }, // 60+
    };

    results.forEach(result => {
      if (result.addressLength < 20) {
        lengthAnalysis.short.total++;
        if (result.success) lengthAnalysis.short.success++;
      } else if (result.addressLength < 40) {
        lengthAnalysis.medium.total++;
        if (result.success) lengthAnalysis.medium.success++;
      } else if (result.addressLength < 60) {
        lengthAnalysis.long.total++;
        if (result.success) lengthAnalysis.long.success++;
      } else {
        lengthAnalysis.veryLong.total++;
        if (result.success) lengthAnalysis.veryLong.success++;
      }
    });

    return NextResponse.json({
      success: true,
      message: '약국 지오코딩 테스트 완료',
      summary: {
        total: results.length,
        success: successCount,
        failed: results.length - successCount,
        successRate: `${successRate}%`,
        averageResponseTime: `${averageResponseTime}ms`,
      },
      lengthAnalysis: {
        short: lengthAnalysis.short.total > 0 
          ? `${Math.round((lengthAnalysis.short.success / lengthAnalysis.short.total) * 100)}%` 
          : 'N/A',
        medium: lengthAnalysis.medium.total > 0 
          ? `${Math.round((lengthAnalysis.medium.success / lengthAnalysis.medium.total) * 100)}%` 
          : 'N/A',
        long: lengthAnalysis.long.total > 0 
          ? `${Math.round((lengthAnalysis.long.success / lengthAnalysis.long.total) * 100)}%` 
          : 'N/A',
        veryLong: lengthAnalysis.veryLong.total > 0 
          ? `${Math.round((lengthAnalysis.veryLong.success / lengthAnalysis.veryLong.total) * 100)}%` 
          : 'N/A',
      },
      results,
      recommendations: [
        successRate >= 90 
          ? '✅ 성공률이 우수합니다. 전체 데이터 지오코딩을 진행할 수 있습니다.'
          : '⚠️ 성공률이 낮습니다. 주소 형식을 확인하거나 VWorld API를 백업으로 사용하세요.',
        averageResponseTime < 200 
          ? '✅ API 응답 시간이 양호합니다.'
          : '⚠️ API 응답 시간이 느립니다. 딜레이를 조정하세요.',
      ],
    });
  } catch (error) {
    console.error('[약국 지오코딩 테스트] 오류:', error);
    return NextResponse.json({
      success: false,
      error: String(error),
    }, { status: 500 });
  }
}







