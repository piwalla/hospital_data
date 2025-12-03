/**
 * @file route.ts
 * @description 서류 챗봇 API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { DOCUMENTS } from '@/lib/data/documents';
import { createDocumentAssistantPrompt } from '@/lib/prompts/document-assistant';
import { generateContentWithRetry } from '@/lib/api/gemini';
import { getCachedDocumentSummary } from '@/lib/api/document-summary';
import { addDisclaimer } from '@/lib/utils/disclaimer';
import { logApiError } from '@/lib/utils/error-logging';
import { logChatbotActivity } from '@/lib/utils/chatbot-analytics';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let userId: string | undefined;
  
  try {
    // 사용자 ID 가져오기
    const { userId: clerkUserId } = await auth();
    userId = clerkUserId;

    const { question } = await request.json();

    if (!question || typeof question !== 'string' || question.trim().length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: '질문을 2자 이상 입력해주세요.',
        },
        { status: 400 }
      );
    }

    // 질문 로깅
    if (userId) {
      logChatbotActivity('chatbot_question', {
        userId,
        question: question.trim(),
        sessionId: userId,
      }).catch(() => {
        // 로깅 실패는 무시
      });
    }

    // 서류 컨텍스트 수집 (기본 설명 및 캐시된 AI 요약 포함)
    const documentContexts = await Promise.all(
      DOCUMENTS.map(async (document) => {
        const cachedSummary = await getCachedDocumentSummary(document.id);
        return {
          id: document.id,
          name: document.name,
          description: document.description,
          requiredDocuments: document.requiredDocuments,
          processingPeriod: document.processingPeriod,
          predefinedSummary: document.predefinedSummary ?? null, // 기본 설명 (우선 사용)
          summary: cachedSummary?.summary ?? null, // AI 요약 (추가 설명)
        };
      })
    );

    const prompt = createDocumentAssistantPrompt({
      question: question.trim(),
      documents: documentContexts,
    });

    const answer = await generateContentWithRetry(prompt, {
      maxRetries: 4,
      retryDelay: 1500,
      timeout: 40000,
    });

    const responseTime = Date.now() - startTime;

    // 응답 로깅
    if (userId) {
      logChatbotActivity('chatbot_response', {
        userId,
        question: question.trim(),
        responseTime,
        sessionId: userId,
      }).catch(() => {
        // 로깅 실패는 무시
      });
    }

    return NextResponse.json({
      success: true,
      answer: addDisclaimer(answer),
    });
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    
    // 에러 로깅
    logApiError(error, {
      component: 'DocumentChatAPI',
      action: 'POST',
      method: 'POST',
      path: '/api/documents/chat',
      userId,
      metadata: {
        responseTime,
      },
    });

    // 에러 활동 로깅
    if (userId) {
      logChatbotActivity('chatbot_error', {
        userId,
        error: error?.message || 'Unknown error',
        responseTime,
        sessionId: userId,
      }).catch(() => {
        // 로깅 실패는 무시
      });
    }

    const isServiceOverloaded =
      error?.message?.includes('과부하') ||
      error?.message?.includes('overloaded') ||
      error?.message?.includes('UNAVAILABLE') ||
      error?.message?.includes('503') ||
      error?.status === 503 ||
      error?.code === 503;

    const statusCode = isServiceOverloaded ? 503 : 500;

    return NextResponse.json(
      {
        success: false,
        error: isServiceOverloaded
          ? 'AI 서비스가 일시적으로 과부하 상태입니다. 잠시 후 다시 시도해주세요.'
          : error?.message || '챗봇 응답 생성 중 문제가 발생했습니다.',
      },
      { status: statusCode }
    );
  }
}


