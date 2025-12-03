/**
 * @file DocumentSummary.tsx
 * @description 서류 요약 가이드 컴포넌트
 *
 * AI 생성 서류 요약 가이드를 표시합니다.
 * 로딩 상태, 에러 상태, 요약 내용을 표시합니다.
 */

'use client';

import { useState } from 'react';
import { AlertCircle, ExternalLink, Sparkles } from 'lucide-react';
import type { Document, DocumentSummary } from '@/lib/types/document';
import { Button } from '@/components/ui/button';
import { getDisclaimer } from '@/lib/utils/disclaimer';
import RiuIcon from '@/components/icons/riu-icon';
import RiuLoader from '@/components/ui/riu-loader';

interface DocumentSummaryProps {
  document: Document;
}

export default function DocumentSummary({ document }: DocumentSummaryProps) {
  const [aiSummary, setAiSummary] = useState<DocumentSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);
  const [showAiSummary, setShowAiSummary] = useState(false);

  const predefinedSummary = document.predefinedSummary;

  const fetchAiSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      setShowAiSummary(true);

      console.log(`[DocumentSummary] AI 요약 요청: ${document.id}`);

      const response = await fetch(`/api/documents/${document.id}/summary`);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '요약 생성 실패');
      }

      const data = await response.json();

      if (!data.success || !data.summary) {
        throw new Error('요약 데이터를 받을 수 없습니다.');
      }

      console.log(`[DocumentSummary] AI 요약 수신 완료: ${document.id}`);
      setAiSummary(data.summary);
      setFromCache(data.fromCache || false);
    } catch (err) {
      console.error(`[DocumentSummary] 오류: ${document.id}`, err);
      setError(err instanceof Error ? err.message : '알 수 없는 오류');
    } finally {
      setLoading(false);
    }
  };

  // 기본 설명이 없으면 기존 방식(AI 요약)으로 동작
  if (!predefinedSummary) {
    // 기존 로직 유지 (AI 요약만 표시)
    return (
      <div className="flex items-center justify-center py-8 sm:py-12" role="status" aria-live="polite" aria-label="서류 정보를 불러오는 중">
        <RiuLoader 
          message="서류 정보를 불러오는 중..." 
          iconVariants={['question', 'smile', 'cheer']}
          logId="DocumentSummary:initial-load"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 py-2 sm:py-4" role="region" aria-label="서류 요약 정보">
      {/* 기본 설명 섹션 */}
      <div className="space-y-4 sm:space-y-6">
        {/* 서류 목적 */}
        <div className="bg-white rounded-2xl border border-[var(--border-light)] p-4 sm:p-6 shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-foreground">
            이 서류는 무엇인가요?
          </h3>
          <div
            className="text-sm sm:text-base text-foreground prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{
              __html: predefinedSummary.summary
                .replace(/\n/g, '<br />')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
            }}
            role="article"
            aria-label="서류 목적 설명"
          />
        </div>

        {/* 주요 항목별 작성 방법 */}
        {predefinedSummary.sections && predefinedSummary.sections.length > 0 && (
          <div className="bg-white rounded-2xl border border-[var(--border-light)] p-4 sm:p-6 shadow-sm">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-foreground">
              주요 항목별 작성 방법
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {predefinedSummary.sections
                .sort((a, b) => a.order - b.order)
                .map((section, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-primary pl-3 sm:pl-4 py-2"
                    role="article"
                    aria-label={`${section.title} 작성 방법`}
                  >
                    <h4 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                      {section.title}
                    </h4>
                    <div
                      className="text-sm sm:text-base text-foreground prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: section.content
                          .replace(/\n/g, '<br />')
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                      }}
                    />
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* 주의사항 */}
        {predefinedSummary.importantNotes &&
          predefinedSummary.importantNotes.length > 0 && (
            <div className="bg-[var(--alert)]/10 border border-[var(--alert)]/30 rounded-lg p-4 sm:p-6" role="alert" aria-label="주의사항">
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-[var(--alert)]">
                주의사항
              </h3>
              <ul className="space-y-2" role="list">
                {predefinedSummary.importantNotes.map((note, index) => (
                  <li
                    key={index}
                    className="text-sm sm:text-base text-foreground flex items-start"
                    role="listitem"
                  >
                    <span className="mr-2 text-[var(--alert)]" aria-hidden="true">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        {/* 더 자세한 AI 설명 보기 버튼 */}
        {!showAiSummary && (
          <div className="flex justify-center">
            <Button
              onClick={fetchAiSummary}
              disabled={loading}
              className="flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label="더 자세한 AI 설명 보기"
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={1.75} aria-hidden="true" />
              <span className="text-xs sm:text-sm">더 자세한 AI 설명 보기</span>
            </Button>
          </div>
        )}
      </div>

      {/* AI 요약 섹션 (선택적 표시) */}
      {showAiSummary && (
        <div className="space-y-4 sm:space-y-6 border-t border-gray-200 pt-4 sm:pt-6" role="region" aria-label="AI 추가 설명">
          {loading && (
            <div className="py-8 sm:py-12" role="status" aria-live="polite" aria-label="AI가 서류를 분석 중입니다.">
              <RiuLoader 
                message="AI가 서류를 분석 중입니다..." 
                iconVariants={['question', 'smile', 'cheer']}
                logId="DocumentSummary:ai-analysis"
              />
            </div>
          )}

          {error && (
            <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg" role="alert" aria-live="assertive">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" aria-hidden="true" />
                <h3 className="text-sm sm:text-base font-semibold text-red-600">
                  오류 발생
                </h3>
              </div>
              <p className="text-sm sm:text-base text-red-600 mb-3 sm:mb-4">{error}</p>
              <Button
                onClick={fetchAiSummary}
                variant="outline"
                className="mt-3 sm:mt-4 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                aria-label="다시 시도"
              >
                <span className="text-xs sm:text-sm">다시 시도</span>
              </Button>
            </div>
          )}

          {aiSummary && !loading && !error && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <RiuIcon variant="success" size={32} className="sm:w-10 sm:h-10" aria-hidden="true" />
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" strokeWidth={1.75} aria-hidden="true" />
                  <h3 className="text-base sm:text-lg font-semibold text-foreground">
                    AI 추가 설명
                  </h3>
                </div>
              </div>

              {/* AI 요약 내용 */}
              <div className="bg-white rounded-2xl border border-[var(--border-light)] p-4 sm:p-6 shadow-sm">
                <h4 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-foreground">
                  이 서류는 무엇인가요? (AI 설명)
                </h4>
                <div
                  className="text-sm sm:text-base text-foreground prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: aiSummary.summary
                      .replace(/\n/g, '<br />')
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                  }}
                  role="article"
                  aria-label="AI 서류 목적 설명"
                />
              </div>

              {/* AI 주요 항목별 작성 방법 */}
              {aiSummary.sections && aiSummary.sections.length > 0 && (
                <div className="bg-white rounded-2xl border border-[var(--border-light)] p-4 sm:p-6 shadow-sm">
                  <h4 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-foreground">
                    주요 항목별 작성 방법 (AI 설명)
                  </h4>
                  <div className="space-y-3 sm:space-y-4">
                    {aiSummary.sections
                      .sort((a, b) => a.order - b.order)
                      .map((section, index) => (
                        <div
                          key={index}
                          className="border-l-4 border-primary pl-3 sm:pl-4 py-2"
                          role="article"
                          aria-label={`${section.title} 작성 방법 (AI 설명)`}
                        >
                          <h5 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                            {section.title}
                          </h5>
                          <div
                            className="text-sm sm:text-base text-foreground prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{
                              __html: section.content
                                .replace(/\n/g, '<br />')
                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                            }}
                          />
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* AI 주의사항 */}
              {aiSummary.importantNotes &&
                aiSummary.importantNotes.length > 0 && (
                  <div className="bg-[var(--alert)]/10 border border-[var(--alert)]/30 rounded-lg p-4 sm:p-6" role="alert" aria-label="주의사항 (AI 설명)">
                    <h4 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-[var(--alert)]">
                      주의사항 (AI 설명)
                    </h4>
                    <ul className="space-y-2" role="list">
                      {aiSummary.importantNotes.map((note, index) => (
                        <li
                          key={index}
                          className="text-sm sm:text-base text-foreground flex items-start"
                          role="listitem"
                        >
                          <span className="mr-2 text-[var(--alert)]" aria-hidden="true">•</span>
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* 캐시 표시 (개발용) */}
              {fromCache && (
                <p className="text-[12px] text-muted-foreground text-center">
                  캐시된 결과입니다
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* 다운로드 링크 */}
      <div className="flex flex-wrap gap-2 sm:gap-4" role="group" aria-label="서류 다운로드 및 예시 링크">
        {document.officialDownloadUrl && (
          <Button
            asChild
            aria-label="공식 서류 보기 (새 창에서 열림)"
          >
            <a
              href={
                document.officialDownloadUrl.endsWith('.pdf')
                  ? `/view-pdf?file=${encodeURIComponent(document.officialDownloadUrl)}`
                  : document.officialDownloadUrl
              }
              target={document.officialDownloadUrl.endsWith('.pdf') ? undefined : '_blank'}
              rel={document.officialDownloadUrl.endsWith('.pdf') ? undefined : 'noopener noreferrer'}
              className="flex items-center gap-2"
            >
              <span className="text-xs sm:text-sm">공식 서류 보기</span>
              <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={1.75} aria-hidden="true" />
            </a>
          </Button>
        )}
        {document.exampleUrl && (
          <Button variant="outline" asChild aria-label="작성 예시 보기 (새 창에서 열림)">
            <a
              href={
                document.exampleUrl.endsWith('.pdf')
                  ? `/view-pdf?file=${encodeURIComponent(document.exampleUrl)}`
                  : document.exampleUrl
              }
              target={document.exampleUrl.endsWith('.pdf') ? undefined : '_blank'}
              rel={document.exampleUrl.endsWith('.pdf') ? undefined : 'noopener noreferrer'}
              className="flex items-center gap-2"
            >
              <span className="text-xs sm:text-sm">작성 예시 보기</span>
              <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={1.75} aria-hidden="true" />
            </a>
          </Button>
        )}
      </div>

      {/* 면책 조항 */}
      <div className="berry-card mt-4 sm:mt-6 p-3 sm:p-4 border border-[var(--border-light)] rounded-2xl" role="note" aria-label="면책 조항">
        <p className="text-xs sm:text-sm text-muted-foreground">{getDisclaimer()}</p>
      </div>

      {/* 캐시 표시 (개발용) */}
      {fromCache && (
        <p className="text-xs sm:text-sm text-muted-foreground text-center">
          캐시된 결과입니다
        </p>
      )}
    </div>
  );
}

