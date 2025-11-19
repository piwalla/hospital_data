/**
 * @file DocumentSummary.tsx
 * @description 서류 요약 가이드 컴포넌트
 *
 * AI 생성 서류 요약 가이드를 표시합니다.
 * 로딩 상태, 에러 상태, 요약 내용을 표시합니다.
 */

'use client';

import { useState } from 'react';
import { Loader2, AlertCircle, ExternalLink, Sparkles } from 'lucide-react';
import type { Document, DocumentSummary } from '@/lib/types/document';
import { Button } from '@/components/ui/button';
import { getDisclaimer } from '@/lib/utils/disclaimer';

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
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-[#2F6E4F]" strokeWidth={1.75} />
        <span className="ml-3 text-[16px] text-[#555555]">
          서류 정보를 불러오는 중...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4">
      {/* 기본 설명 섹션 */}
      <div className="space-y-6">
        {/* 서류 목적 */}
        <div className="bg-white rounded-xl border border-[#E4E7E7] p-6">
          <h3 className="font-semibold mb-3 text-[#1C1C1E]">
            이 서류는 무엇인가요?
          </h3>
          <div
            className="text-[16px] text-[#1C1C1E] prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{
              __html: predefinedSummary.summary
                .replace(/\n/g, '<br />')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
            }}
          />
        </div>

        {/* 주요 항목별 작성 방법 */}
        {predefinedSummary.sections && predefinedSummary.sections.length > 0 && (
          <div className="bg-white rounded-xl border border-[#E4E7E7] p-6">
            <h3 className="font-semibold mb-4 text-[#1C1C1E]">
              주요 항목별 작성 방법
            </h3>
            <div className="space-y-4">
              {predefinedSummary.sections
                .sort((a, b) => a.order - b.order)
                .map((section, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-[#2F6E4F] pl-4 py-2"
                  >
                    <h4 className="text-[18px] font-semibold text-[#1C1C1E] mb-2">
                      {section.title}
                    </h4>
                    <div
                      className="text-[16px] text-[#1C1C1E] prose prose-sm max-w-none"
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
            <div className="bg-[#FF9500]/10 border border-[#FF9500]/30 rounded-lg p-6">
              <h3 className="font-semibold mb-3 text-[#FF9500]">
                주의사항
              </h3>
              <ul className="space-y-2">
                {predefinedSummary.importantNotes.map((note, index) => (
                  <li
                    key={index}
                    className="text-[16px] text-[#1C1C1E] flex items-start"
                  >
                    <span className="mr-2 text-[#FF9500]">•</span>
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
              className="flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" strokeWidth={1.75} />
              더 자세한 AI 설명 보기
            </Button>
          </div>
        )}
      </div>

      {/* AI 요약 섹션 (선택적 표시) */}
      {showAiSummary && (
        <div className="space-y-6 border-t border-gray-200 pt-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <img 
                src="/Generated_Image_November_19__2025_-_4_31PM-removebg-preview.png" 
                alt="Re 캐릭터들" 
                className="w-24 h-24 object-contain mb-4 animate-pulse"
              />
              <div className="flex items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-[#2F6E4F]" strokeWidth={1.75} />
                <span className="text-[16px] text-[#555555]">
                  AI가 서류를 분석 중입니다...
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-red-600">
                  오류 발생
                </h3>
              </div>
              <p className="text-[17px] text-red-600 mb-4">{error}</p>
              <Button
                onClick={fetchAiSummary}
                variant="outline"
                className="mt-4"
              >
                다시 시도
              </Button>
            </div>
          )}

          {aiSummary && !loading && !error && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src="/Generated_Image_November_19__2025_-_4_40PM__3_-removebg-preview.png" 
                  alt="Re 캐릭터 (성공)" 
                  className="w-10 h-10 object-contain flex-shrink-0"
                />
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#2F6E4F]" strokeWidth={1.75} />
                  <h3 className="font-semibold text-[#1C1C1E]">
                    AI 추가 설명
                  </h3>
                </div>
              </div>

              {/* AI 요약 내용 */}
              <div className="bg-white rounded-xl border border-[#E4E7E7] p-6">
                <h4 className="text-[20px] font-semibold mb-3 text-[#1C1C1E]">
                  이 서류는 무엇인가요? (AI 설명)
                </h4>
                <div
                  className="text-[16px] text-[#1C1C1E] prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: aiSummary.summary
                      .replace(/\n/g, '<br />')
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                  }}
                />
              </div>

              {/* AI 주요 항목별 작성 방법 */}
              {aiSummary.sections && aiSummary.sections.length > 0 && (
                <div className="bg-white rounded-xl border border-[#E4E7E7] p-6">
                  <h4 className="text-[20px] font-semibold mb-4 text-[#1C1C1E]">
                    주요 항목별 작성 방법 (AI 설명)
                  </h4>
                  <div className="space-y-4">
                    {aiSummary.sections
                      .sort((a, b) => a.order - b.order)
                      .map((section, index) => (
                        <div
                          key={index}
                          className="border-l-4 border-[#2F6E4F] pl-4 py-2"
                        >
                          <h5 className="text-[18px] font-semibold text-[#1C1C1E] mb-2">
                            {section.title}
                          </h5>
                          <div
                            className="text-[16px] text-[#1C1C1E] prose prose-sm max-w-none"
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
                  <div className="bg-[#FF9500]/10 border border-[#FF9500]/30 rounded-lg p-6">
                    <h4 className="text-[20px] font-semibold mb-3 text-[#FF9500]">
                      주의사항 (AI 설명)
                    </h4>
                    <ul className="space-y-2">
                      {aiSummary.importantNotes.map((note, index) => (
                        <li
                          key={index}
                          className="text-[16px] text-[#1C1C1E] flex items-start"
                        >
                          <span className="mr-2 text-[#FF9500]">•</span>
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* 캐시 표시 (개발용) */}
              {fromCache && (
                <p className="text-[12px] text-[#555555] text-center">
                  캐시된 결과입니다
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* 다운로드 링크 */}
      <div className="flex flex-wrap gap-4">
        {document.officialDownloadUrl && (
          <Button
            asChild
          >
            <a
              href={document.officialDownloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              공식 서류 다운로드
              <ExternalLink className="w-4 h-4" strokeWidth={1.75} />
            </a>
          </Button>
        )}
        {document.exampleUrl && (
          <Button variant="outline" asChild>
            <a
              href={document.exampleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              작성 예시 보기
              <ExternalLink className="w-4 h-4" strokeWidth={1.75} />
            </a>
          </Button>
        )}
      </div>

      {/* 면책 조항 */}
      <div className="mt-6 p-4 bg-[#F7F9F8] border border-[#E4E7E7] rounded-xl">
        <p className="text-[14px] text-[#555555]">{getDisclaimer()}</p>
      </div>

      {/* 캐시 표시 (개발용) */}
      {fromCache && (
        <p className="text-[12px] text-[#555555] text-center">
          캐시된 결과입니다
        </p>
      )}
    </div>
  );
}

