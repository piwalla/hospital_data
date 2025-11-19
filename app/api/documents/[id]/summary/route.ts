/**
 * @file route.ts
 * @description 서류 요약 가이드 API Route
 *
 * GET /api/documents/[id]/summary
 * - 서류 ID에 해당하는 AI 요약 가이드를 반환합니다.
 * - 캐시가 있으면 캐시를 반환하고, 없으면 새로 생성합니다.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  generateDocumentSummary,
  getCachedDocumentSummary,
  cacheDocumentSummary,
} from '@/lib/api/document-summary';
import { findDocumentById } from '@/lib/data/documents';
import { addDisclaimer } from '@/lib/utils/disclaimer';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const forceRefresh = searchParams.get('forceRefresh') === 'true';

    console.log(`[Document Summary API] 요청 수신: ${id}, forceRefresh: ${forceRefresh}`);

    // 서류 정보 확인
    const document = findDocumentById(id);
    if (!document) {
      console.error(`[Document Summary API] 서류를 찾을 수 없음: ${id}`);
      return NextResponse.json(
        { success: false, error: '서류를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 캐시 확인 (forceRefresh가 false인 경우만)
    if (!forceRefresh) {
      const cached = await getCachedDocumentSummary(id);
      if (cached) {
        console.log(`[Document Summary API] 캐시된 결과 반환: ${id}`);
        return NextResponse.json({
          success: true,
          summary: cached,
          fromCache: true,
        });
      }
    }

    // AI 요약 생성
    console.log(`[Document Summary API] AI 요약 생성 시작: ${id}`);
    const summary = await generateDocumentSummary(document);

    // 면책 조항 추가
    summary.summary = addDisclaimer(summary.summary);

    // 캐시 저장
    await cacheDocumentSummary(summary);

    console.log(`[Document Summary API] 요약 생성 완료: ${id}`);

    return NextResponse.json({
      success: true,
      summary,
      fromCache: false,
    });
  } catch (error: any) {
    console.error('[Document Summary API] 오류 발생:', error);

    // 503 에러 또는 서비스 과부하 확인
    const isServiceOverloaded =
      error.message?.includes('과부하') ||
      error.message?.includes('overloaded') ||
      error.message?.includes('UNAVAILABLE') ||
      error.message?.includes('503') ||
      error.status === 503 ||
      error.code === 503;

    // 에러 메시지 결정
    let errorMessage = error.message || '서류 요약 생성 중 오류가 발생했습니다.';
    let statusCode = 500;

    if (isServiceOverloaded) {
      errorMessage =
        'AI 서비스가 일시적으로 과부하 상태입니다. 잠시 후 다시 시도해주세요.';
      statusCode = 503;
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: statusCode }
    );
  }
}

