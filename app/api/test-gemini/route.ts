/**
 * @file route.ts
 * @description Gemini API 테스트용 API Route
 *
 * GET /api/test-gemini
 * - Gemini API가 정상적으로 작동하는지 확인
 */

import { NextResponse } from 'next/server';
import { generateContentWithRetry } from '@/lib/api/gemini';

export async function POST() {
  console.log('[Test Gemini] API 테스트 시작');

  try {
    const testPrompt = '안녕하세요. 간단히 자기소개를 해주세요. (한 문장으로)';
    console.log(`[Test Gemini] 프롬프트: ${testPrompt}`);

    const response = await generateContentWithRetry(testPrompt, {
      maxRetries: 3,
      retryDelay: 1000,
      timeout: 30000,
    });

    console.log('[Test Gemini] API 호출 성공');

    return NextResponse.json(
      {
        success: true,
        message: 'Gemini API 테스트 성공',
        prompt: testPrompt,
        response: response,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Test Gemini] API 호출 실패:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Gemini API 테스트 실패',
        error: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}













