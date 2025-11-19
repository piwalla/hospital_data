/**
 * @file route.ts
 * @description 서류 챗봇 API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { DOCUMENTS } from '@/lib/data/documents';
import { createDocumentAssistantPrompt } from '@/lib/prompts/document-assistant';
import { generateContentWithRetry } from '@/lib/api/gemini';
import { getCachedDocumentSummary } from '@/lib/api/document-summary';
import { addDisclaimer } from '@/lib/utils/disclaimer';

export async function POST(request: NextRequest) {
  try {
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

    return NextResponse.json({
      success: true,
      answer: addDisclaimer(answer),
    });
  } catch (error: any) {
    console.error('[Document Chat API] 오류 발생:', error);

    const isServiceOverloaded =
      error?.message?.includes('과부하') ||
      error?.message?.includes('overloaded') ||
      error?.message?.includes('UNAVAILABLE') ||
      error?.message?.includes('503') ||
      error?.status === 503 ||
      error?.code === 503;

    return NextResponse.json(
      {
        success: false,
        error: isServiceOverloaded
          ? 'AI 서비스가 일시적으로 과부하 상태입니다. 잠시 후 다시 시도해주세요.'
          : error?.message || '챗봇 응답 생성 중 문제가 발생했습니다.',
      },
      { status: isServiceOverloaded ? 503 : 500 }
    );
  }
}


