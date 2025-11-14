/**
 * @file route.ts
 * @description 병원 데이터 동기화 API 라우트
 *
 * 공공데이터포털 API에서 병원 데이터를 가져와서 Supabase에 캐싱하는 API 엔드포인트입니다.
 *
 * 사용법:
 * POST /api/hospitals/sync?maxPages=10
 *
 * @dependencies
 * - lib/api/cache-hospitals.ts
 */

import { NextRequest, NextResponse } from 'next/server';
import { syncHospitalsFromApi } from '@/lib/api/cache-hospitals';

export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const maxPages = parseInt(searchParams.get('maxPages') || '10', 10);
    const useGeocoding = searchParams.get('useGeocoding') !== 'false'; // 기본값: true

    console.log('[API] 병원 데이터 동기화 요청:', { maxPages, useGeocoding });

    const savedCount = await syncHospitalsFromApi(maxPages, useGeocoding);

    return NextResponse.json({
      success: true,
      message: '병원 데이터 동기화 완료',
      savedCount,
      useGeocoding,
    });
  } catch (error) {
    console.error('[API] 동기화 실패:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : '알 수 없는 오류',
      },
      { status: 500 }
    );
  }
}

