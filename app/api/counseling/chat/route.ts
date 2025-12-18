/**
 * @file route.ts
 * @description 심리 상담 채팅 API Route
 *
 * Google Gemini API를 활용하여 심리 지원 특화 상담 응답을 생성합니다.
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateContentWithRetry } from '@/lib/api/gemini';
import { createPsychologicalSupportPrompt } from '@/lib/prompts/psychological-support';
import { logApiError } from '@/lib/utils/error-logging';

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const { message, conversationHistory = [] } = await request.json();

    if (!message || typeof message !== 'string' || message.trim().length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: '메시지를 2자 이상 입력해주세요.',
        },
        { status: 400 }
      );
    }

    // 심리 지원 특화 프롬프트 생성
    const prompt = createPsychologicalSupportPrompt({
      message: message.trim(),
      conversationHistory,
    });

    // Gemini API 호출
    const answer = await generateContentWithRetry(prompt, {
      maxRetries: 3,
      retryDelay: 1500,
      timeout: 30000,
    });

    return NextResponse.json({
      success: true,
      answer,
    });
  } catch (error: any) {
    const responseTime = Date.now() - startTime;

    // 에러 로깅
    logApiError('counseling_chat', error, {
      responseTime,
      path: '/api/counseling/chat',
    }).catch(() => {
      // 로깅 실패는 무시
    });

    console.error('[CounselingChat] API 오류:', error);

    // 사용자 친화적 에러 메시지
    let errorMessage = '상담 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';

    if (error.message?.includes('timeout')) {
      errorMessage = '응답 시간이 초과되었습니다. 다시 시도해주세요.';
    } else if (error.message?.includes('503') || error.message?.includes('overloaded')) {
      errorMessage = '서비스가 일시적으로 과부하 상태입니다. 잠시 후 다시 시도해주세요.';
    } else if (error.message?.includes('429')) {
      errorMessage = '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

