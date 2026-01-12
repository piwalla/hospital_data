/**
 * @file DocumentSummary.tsx
 * @description 서류 요약 가이드 컴포넌트
 *
 * 서류 요약 가이드를 표시합니다.
 */

'use client';

import { ExternalLink, FileText, Youtube, Maximize2 } from 'lucide-react';
import type { Document } from '@/lib/types/document';
import { Button } from '@/components/ui/button';
import { getDisclaimer } from '@/lib/utils/disclaimer';

interface DocumentSummaryProps {
  document: Document;
}

export default function DocumentSummary({ document }: DocumentSummaryProps) {
  const predefinedSummary = document.predefinedSummary;

  // 기본 설명이 없으면 안내 메시지 표시
  if (!predefinedSummary) {
    return (
      <div className="flex items-center justify-center py-8 sm:py-12 text-muted-foreground">
        서류 정보를 준비 중입니다.
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 py-2 sm:py-4" role="region" aria-label="서류 요약 정보">
      {/* 서류 목적 (최상단 배치) */}
      <div className="bg-white rounded-lg border border-[var(--border-light)] p-4 sm:p-6 shadow-sm">
        <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-primary border-b-2 border-primary/30 pb-2">
          이 서류는 무엇인가요?
        </h3>
        <div className="bg-gray-50 rounded-lg p-4 sm:p-5">
          <div
            className="text-sm sm:text-base text-foreground prose prose-sm max-w-none space-y-3"
            dangerouslySetInnerHTML={{
              __html: predefinedSummary.summary
                .replace(/\n\n/g, '</p><p class="mt-3">')
                .replace(/\n/g, '<br />')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\[중요\]/g, '<span class="inline-block bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded text-xs sm:text-sm mr-1">중요</span>')
                .replace(/\[주의\]/g, '<span class="inline-block bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded text-xs sm:text-sm mr-1">주의</span>')
                .replace(/\[팁\]/g, '<span class="inline-block bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded text-xs sm:text-sm mr-1">팁</span>'),
            }}
            role="article"
            aria-label="서류 목적 설명"
          />
        </div>
      </div>



      {/* 유튜브 영상 임베드 */}
      {document.youtubeUrl && (
        <div className="bg-white rounded-lg border border-[var(--border-light)] p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-3 sm:mb-4">
            <div className="flex items-center gap-2">
              <Youtube className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" aria-hidden="true" />
              <h3 className="text-base sm:text-lg font-semibold text-foreground">
                영상으로 쉽게 알아보기
              </h3>
            </div>
            <span className="text-[10px] sm:text-xs text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-full w-fit">
              ※ 본 영상은 AI 기술을 활용하여 제작되었습니다.
            </span>
          </div>
          <div className="relative w-full aspect-video rounded-lg overflow-hidden">
            <iframe
              src={document.youtubeUrl
                .replace('youtu.be/', 'www.youtube.com/embed/')
                .replace('watch?v=', 'embed/')
                .split('?si=')[0]
              }
              title="서류 작성 방법 안내 영상"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
            />
          </div>
        </div>
      )}

      {/* PDF 가이드 임베드 (데스크톱 복원) */}
      {document.guidePdfPath && (
        <div className="bg-white rounded-lg border border-[var(--border-light)] p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-3 sm:mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-primary" aria-hidden="true" />
              <h3 className="text-base sm:text-lg font-semibold text-foreground">
                진행 과정 안내
              </h3>
            </div>
            <span className="text-[10px] sm:text-xs text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-full w-fit">
              ※ 본 문서는 AI 기술을 활용하여 작성되었습니다.
            </span>
          </div>
          
          {/* 모바일: 전체화면 버튼 */}
          <div className="block sm:hidden text-center py-6 bg-slate-50 rounded-lg border border-slate-200">
             <p className="text-sm text-slate-500 mb-4">
               진행 과정 안내 문서를 확인하세요.<br/>
               버튼을 누르면 전체화면으로 볼 수 있습니다.
             </p>
             <Button variant="outline" className="gap-2" asChild>
               <a href={`/view-pdf?file=${encodeURIComponent(
                 `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/uploads/${encodeURIComponent(document.guidePdfPath)}`
               )}`}>
                 <Maximize2 className="w-4 h-4" />
                 가이드 전체화면으로 보기
               </a>
             </Button>
          </div>

          {/* 데스크톱: iframe 뷰어 */}
          <div className="hidden sm:block relative w-full" style={{ height: '600px' }}>
            <iframe
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/uploads/${encodeURIComponent(document.guidePdfPath)}#toolbar=0&navpanes=0&scrollbar=0`}
              title="서류 진행 과정 안내 PDF"
              className="w-full h-full rounded-lg border border-gray-200"
            />
          </div>
        </div>
      )}


      {/* 기본 설명 섹션 */}
      <div className="space-y-4 sm:space-y-6">

        {/* 주요 항목별 작성 방법 */}
        {predefinedSummary.sections && predefinedSummary.sections.length > 0 && (
          <div className="bg-white rounded-lg border border-[var(--border-light)] p-4 sm:p-6 shadow-sm">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-primary border-b-2 border-primary/30 pb-2">
              주요 항목별 작성 방법
            </h3>
            <div className="space-y-4 sm:space-y-5">
              {predefinedSummary.sections
                .sort((a, b) => a.order - b.order)
                .map((section, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-4 sm:p-5"
                    role="article"
                    aria-label={`${section.title} 작성 방법`}
                  >
                    <h4 className="text-base sm:text-lg font-semibold text-foreground mb-2 flex items-start gap-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary text-white text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </span>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: section.title
                            .replace(/\[핵심\]/g, '<span class="inline-block bg-primary/20 text-primary font-bold px-2 py-0.5 rounded text-xs sm:text-sm mr-1">핵심</span>')
                            .replace(/\[중요\]/g, '<span class="inline-block bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded text-xs sm:text-sm mr-1">중요</span>')
                            .replace(/\[팁\]/g, '<span class="inline-block bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded text-xs sm:text-sm mr-1">팁</span>')
                        }}
                      />
                    </h4>
                    <div
                      className="text-sm sm:text-base text-foreground prose prose-sm max-w-none ml-8 sm:ml-9"
                      dangerouslySetInnerHTML={{
                        __html: section.content
                          .replace(/\n\n/g, '</p><p class="mt-2">')
                          .replace(/\n/g, '<br />')
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\[핵심\]/g, '<span class="inline-block bg-primary/20 text-primary font-bold px-2 py-0.5 rounded text-xs sm:text-sm mr-1">핵심</span>')
                          .replace(/\[지급 기준\]/g, '<span class="inline-block bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded text-xs sm:text-sm mr-1">지급 기준</span>')
                          .replace(/\[나쁜 예[^\]]*\]/g, '<span class="inline-block bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded text-xs sm:text-sm mr-1">나쁜 예</span>')
                          .replace(/\[좋은 예[^\]]*\]/g, '<span class="inline-block bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded text-xs sm:text-sm mr-1">좋은 예</span>')
                          .replace(/\[이동 수단별[^\]]*\]/g, '<span class="inline-block bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded text-xs sm:text-sm mr-1">이동 수단별</span>'),
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
            <div className="bg-white rounded-lg border border-[var(--border-light)] p-4 sm:p-6 shadow-sm" role="alert" aria-label="주의사항">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-[var(--alert)] border-b-2 border-[var(--alert)]/30 pb-2">
                주의사항
              </h3>
              <div className="space-y-3 sm:space-y-4" role="list">
                {predefinedSummary.importantNotes.map((note, index) => {
                  // 대괄호 태그 추출 및 색상 매핑
                  const tagMatch = note.match(/^\[([^\]]+)\]/);
                  const tag = tagMatch ? tagMatch[1] : null;
                  const content = tagMatch ? note.replace(/^\[[^\]]+\]\s*/, '') : note;
                  
                  // 태그별 색상 매핑
                  const getTagStyle = (tagText: string | null) => {
                    if (!tagText) return null;
                    if (tagText.includes('필수') || tagText.includes('꼭')) return 'bg-red-100 text-red-700';
                    if (tagText.includes('가능') || tagText.includes('지급')) return 'bg-green-100 text-green-700';
                    if (tagText.includes('주의') || tagText.includes('아님')) return 'bg-amber-100 text-amber-700';
                    return 'bg-blue-100 text-blue-700';
                  };
                  
                  const tagStyle = getTagStyle(tag);
                  
                  return (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-3 sm:p-4 flex items-start gap-3"
                      role="listitem"
                    >
                      <span className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[var(--alert)] text-white text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        {tag && (
                          <span className={`inline-block ${tagStyle} font-bold px-2 py-0.5 rounded text-xs sm:text-sm mr-2 mb-1`}>
                            {tag}
                          </span>
                        )}
                        <span className="text-sm sm:text-base text-foreground">{content}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

      </div>



      {/* 면책 조항 */}
      <div className="berry-card mt-4 sm:mt-6 p-3 sm:p-4 border border-[var(--border-light)] rounded-lg" role="note" aria-label="면책 조항">
        <p className="text-xs sm:text-sm text-muted-foreground">{getDisclaimer()}</p>
      </div>

    </div>
  );
}

