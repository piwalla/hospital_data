/**
 * @file route.ts
 * @description 병원 데이터 API 테스트 엔드포인트
 *
 * API 클라이언트가 제대로 작동하는지 테스트하는 엔드포인트입니다.
 *
 * 사용법:
 * GET /api/hospitals/test
 */

import { NextResponse } from 'next/server';
import { getDataKrClient } from '@/lib/api/data-kr';

export async function GET() {
  try {
    console.log('[Test] API 클라이언트 테스트 시작');

    const client = getDataKrClient();
    
    // 첫 페이지만 테스트 (5개 항목)
    const response = await client.fetchHospitals(1, 5);

    return NextResponse.json({
      success: true,
      message: 'API 클라이언트 테스트 성공',
      data: {
        totalCount: response.totalCount,
        currentCount: response.currentCount,
        sample: response.data.slice(0, 2), // 샘플 2개만 반환
      },
    });
  } catch (error) {
    console.error('[Test] API 테스트 실패:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : '알 수 없는 오류',
      },
      { status: 500 }
    );
  }
}


