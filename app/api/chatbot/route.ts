/**
 * @file route.ts
 * @description n8n RAG 챗봇 API Route (프록시)
 * 
 * 클라이언트에서 직접 n8n 웹훅을 호출할 때 발생하는 CORS 문제를 해결하기 위해
 * Next.js API Route를 프록시로 사용합니다.
 * 
 * 주요 기능:
 * - n8n 웹훅으로 요청 전달
 * - CORS 문제 해결
 * - 에러 처리 및 로깅
 * - 타임아웃 처리
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { logApiError } from '@/lib/utils/error-logging';
import { logChatbotActivity } from '@/lib/utils/chatbot-analytics';

const N8N_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
const REQUEST_TIMEOUT = 30000; // 30초

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let userId: string | undefined;
  let requestBody: { message?: string; sessionId?: string } = {};

  try {
    // 사용자 인증 확인
    const { userId: clerkUserId } = await auth();
    userId = clerkUserId;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: '로그인이 필요합니다.',
        },
        { status: 401 }
      );
    }

    // 웹훅 URL 확인
    if (!N8N_WEBHOOK_URL) {
      console.error('[ChatbotAPI] NEXT_PUBLIC_N8N_WEBHOOK_URL 환경 변수가 설정되지 않았습니다.');
      return NextResponse.json(
        {
          success: false,
          error: '챗봇 서비스가 설정되지 않았습니다. 관리자에게 문의해주세요.',
        },
        { status: 500 }
      );
    }

    // 요청 본문 파싱
    requestBody = await request.json();
    const { message, sessionId } = requestBody;

    if (!message || typeof message !== 'string' || message.trim().length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: '질문을 2자 이상 입력해주세요.',
        },
        { status: 400 }
      );
    }

    const finalQuestion = message.trim();
    const finalSessionId = sessionId || userId;

    // 질문 로깅
    logChatbotActivity('chatbot_question', {
      userId,
      question: finalQuestion,
      sessionId: finalSessionId,
    }).catch(() => {
      // 로깅 실패는 무시
    });

    console.group('[ChatbotAPI] Outgoing request to n8n');
    console.log('User ID:', userId);
    console.log('Session ID:', finalSessionId);
    console.log('Question:', finalQuestion);
    console.log('Webhook URL:', N8N_WEBHOOK_URL);
    console.groupEnd();

    // n8n 웹훅에 요청 전달
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, REQUEST_TIMEOUT);

    try {
      // n8n 웹훅 요청 본문 (n8n이 기대하는 형식)
      const n8nRequestBody = {
        message: finalQuestion,
        sessionId: finalSessionId,
      };

      console.log('[ChatbotAPI] Request body:', JSON.stringify(n8nRequestBody, null, 2));

      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // ngrok 브라우저 경고 스킵 (선택사항)
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(n8nRequestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        console.error('[ChatbotAPI] n8n 응답 오류:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
          requestBody: n8nRequestBody,
        });

        // 400 에러인 경우 더 자세한 정보 제공
        if (response.status === 400) {
          try {
            const errorData = JSON.parse(errorText);
            throw new Error(`n8n 요청 형식 오류: ${errorData.message || errorText}`);
          } catch {
            throw new Error(`n8n 요청 형식 오류: ${errorText || 'Bad Request'}`);
          }
        }

        throw new Error(`n8n 서버 오류: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const responseTime = Date.now() - startTime;

      // n8n 응답 형식: { result: { output: "..." } }
      const answer = data?.result?.output;

      if (!answer) {
        console.error('[ChatbotAPI] n8n 응답 형식 오류:', data);
        throw new Error('응답을 받지 못했습니다. 응답 형식이 올바르지 않습니다.');
      }

      console.log('[ChatbotAPI] Response received:', {
        answerLength: answer.length,
        responseTime,
      });

      // 응답 로깅
      logChatbotActivity('chatbot_response', {
        userId,
        question: finalQuestion,
        responseTime,
        sessionId: finalSessionId,
      }).catch(() => {
        // 로깅 실패는 무시
      });

      return NextResponse.json({
        success: true,
        result: {
          output: answer,
        },
      });
    } catch (fetchError: any) {
      clearTimeout(timeoutId);

      if (fetchError.name === 'AbortError') {
        console.warn('[ChatbotAPI] Request timed out');
        throw new Error('요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.');
      }

      throw fetchError;
    }
  } catch (error: any) {
    const responseTime = Date.now() - startTime;

    // 에러 로깅
    logApiError(error, {
      component: 'ChatbotAPI',
      action: 'POST',
      method: 'POST',
      path: '/api/chatbot',
      userId,
      metadata: {
        responseTime,
      },
    });

    // 에러 활동 로깅
    if (userId) {
      logChatbotActivity('chatbot_error', {
        userId,
        question: requestBody?.message || 'Unknown',
        error: error?.message || 'Unknown error',
        responseTime,
        sessionId: userId,
      }).catch(() => {
        // 로깅 실패는 무시
      });
    }

    // 타임아웃 에러 처리
    if (error?.message?.includes('시간이 초과') || error?.message?.includes('timeout')) {
      return NextResponse.json(
        {
          success: false,
          error: '응답이 지연되고 있어요. 잠시 후 다시 시도해주세요.',
        },
        { status: 504 }
      );
    }

    // 네트워크 에러 처리
    if (error?.message?.includes('fetch') || error?.message?.includes('Failed to fetch')) {
      return NextResponse.json(
        {
          success: false,
          error: '챗봇 서버에 연결할 수 없습니다. 네트워크 연결을 확인하거나 잠시 후 다시 시도해주세요.',
        },
        { status: 503 }
      );
    }

    // 일반 에러 처리
    return NextResponse.json(
      {
        success: false,
        error: error?.message || '챗봇 응답 생성 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}

