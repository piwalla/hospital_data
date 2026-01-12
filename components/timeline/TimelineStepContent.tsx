/**
 * @file TimelineStepContent.tsx
 * @description 타임라인 단계 상세 콘텐츠 컴포넌트 (클라이언트)
 * 
 * 탭 기능을 포함한 단계 상세 정보를 표시합니다.
 */

'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, FileText, AlertTriangle, ArrowRight, ArrowLeft, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import DocumentDownloadButton from './DocumentDownloadButton';
import ConditionalPDFViewer from './ConditionalPDFViewer';
import type { StageWithDetails } from '@/lib/types/timeline';
import { cn } from '@/lib/utils';

interface TimelineStepContentProps {
  stage: StageWithDetails;
  nextStage?: StageWithDetails;
  prevStage?: StageWithDetails;
  initialTab?: 'guide' | 'actions' | 'documents' | 'warnings';
}

export default function TimelineStepContent({ stage, nextStage, prevStage, initialTab }: TimelineStepContentProps) {
  // URL 파라미터로 전달된 탭이 있으면 사용, 없으면 기본값 사용
  const getInitialTab = (): 'guide' | 'actions' | 'documents' | 'warnings' => {
    if (initialTab) return initialTab;
    return (stage.step_number === 1 || stage.step_number === 2 || stage.step_number === 3 || stage.step_number === 4) ? 'guide' : 'actions';
  };
  
  const [activeTab, setActiveTab] = useState<'guide' | 'actions' | 'documents' | 'warnings'>(getInitialTab());

  // URL 파라미터로 전달된 탭이 변경되면 탭 업데이트
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // PDF URL 생성 (1단계, 2단계, 3단계, 4단계용) - 툴바 숨김 파라미터 추가
  const getPdfUrl = () => {
    if (stage.step_number === 1) {
      return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/uploads/step1.pdf#toolbar=0&navpanes=0&scrollbar=0`;
    } else if (stage.step_number === 2) {
      return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/uploads/step2.pdf#toolbar=0&navpanes=0&scrollbar=0`;
    } else if (stage.step_number === 3) {
      return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/uploads/step3.pdf#toolbar=0&navpanes=0&scrollbar=0`;
    } else if (stage.step_number === 4) {
      return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/uploads/step4.pdf#toolbar=0&navpanes=0&scrollbar=0`;
    }
    return null;
  };
  const pdfUrl = getPdfUrl();

  const TabButton = ({ tab, label, icon: Icon, count }: { 
    tab: 'guide' | 'actions' | 'documents' | 'warnings'; 
    label: string; 
    icon: typeof CheckCircle2 | typeof BookOpen; 
    count?: number;
  }) => (
    <button
      onClick={() => setActiveTab(tab)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setActiveTab(tab);
        }
      }}
      className={cn(
        "flex items-center justify-center gap-1 sm:gap-3 px-2 sm:px-5 py-2 sm:py-4 rounded-lg transition-all duration-200",
        "text-[11px] sm:text-lg font-medium whitespace-nowrap",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        "flex-shrink-0",
        activeTab === tab
          ? "bg-primary text-primary-foreground"
          : "bg-primary/5 text-[#6B7280] hover:bg-primary/10 active:bg-primary/15 border border-primary/20"
      )}
      role="tab"
      aria-selected={activeTab === tab}
      aria-controls={`tabpanel-${tab}`}

      tabIndex={activeTab === tab ? 0 : -1}
    >
      <Icon className="w-3.5 h-3.5 sm:w-6 sm:h-6 flex-shrink-0" />
      <span>{label}</span>
      {count !== undefined && count > 0 && (
        <span className="ml-0.5 sm:ml-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-white/20 text-[10px] sm:text-xs flex-shrink-0">
          {count}
        </span>
      )}
    </button>
  );

  // Use actionItems if available, otherwise fall back to actions (though we aim to use actionItems primarily now)
  const actionsCount = stage.actionItems?.length || stage.actions?.length || 0;

  // 각 단계별 유튜브 영상 ID
  const getYouTubeVideoId = () => {
    switch (stage.step_number) {
      case 1:
        return 'anLDxaAFQAk';
      case 2:
        return 'WOKhzBSA3Ks';
      case 3:
        return 'ufCjFjOiJ1Y';
      case 4:
        return 'X0YvR1RI08g';
      default:
        return null;
    }
  };

  const youtubeVideoId = getYouTubeVideoId();

  return (
    <div className="space-y-6 sm:space-y-8 min-w-0 w-full max-w-full overflow-hidden">
      {/* 탭 버튼 */}
      <div className="relative">
        <div
          className="flex flex-nowrap gap-1 sm:gap-4 w-full min-w-0 overflow-x-auto scrollbar-hide"
          role="tablist"
          aria-label="단계 상세 정보 탭"
        >
          {/* 1단계, 2단계, 3단계, 4단계일 때 "설명 보기" 탭 표시 */}
          {(stage.step_number === 1 || stage.step_number === 2 || stage.step_number === 3 || stage.step_number === 4) && pdfUrl && (
            <>
              <TabButton
                tab="guide"
                label="설명 보기"
                icon={BookOpen}
              />
              <span id="tab-guide" className="sr-only">설명 보기 탭</span>
            </>
          )}
          <TabButton
            tab="actions"
            label="해야 할 일"
            icon={CheckCircle2}
            count={actionsCount}
          />
          <span id="tab-actions" className="sr-only">해야 할 일 탭</span>
          <TabButton
            tab="documents"
            label="서류"
            icon={FileText}
            count={stage.documents.length}
          />
          <span id="tab-documents" className="sr-only">서류 탭</span>
          <TabButton
            tab="warnings"
            label="주의사항"
            icon={AlertTriangle}
            count={stage.warnings.length}
          />
          <span id="tab-warnings" className="sr-only">주의사항 탭</span>
        </div>
        
        {/* ... (Scroll hint remains) */}
      </div>

      {/* 탭 콘텐츠 */}
      <div className="min-h-[400px] min-w-0">
        {/* 설명 보기 탭 (동영상 + PDF) - 1단계, 2단계, 3단계, 4단계 */}
        {activeTab === 'guide' && (stage.step_number === 1 || stage.step_number === 2 || stage.step_number === 3 || stage.step_number === 4) && pdfUrl && (
          <div 
            id="tabpanel-guide"
            role="tabpanel"
            aria-labelledby="tab-guide"
            className="space-y-6 sm:space-y-8"
          >
            {/* 유튜브 가이드 영상 */}
            {youtubeVideoId && (
              <div className="w-full space-y-3 sm:space-y-4 max-w-full overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 px-0 sm:px-0">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-1 h-6 sm:h-8 bg-primary rounded-full"></div>
                    <h2 className="text-lg sm:text-xl font-bold text-foreground font-brand">
                      영상으로 쉽게 설명해 드려요
                    </h2>
                  </div>
                  <span className="text-[10px] sm:text-xs text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-full w-fit">
                    ※ 본 영상은 AI 기술을 활용하여 제작되었습니다.
                  </span>
                </div>
                <div className="relative w-full max-w-full rounded-xl overflow-hidden border border-[var(--border-medium)] bg-white shadow-sm">
                  <div className="relative w-full max-w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                      title={`${stage.title} 가이드 영상`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground text-center px-0 sm:px-0">
                  {stage.step_number === 1 
                    ? '산재 신청 과정을 영상으로 확인하세요'
                    : stage.step_number === 2
                    ? '병원에서 치료받고 급여 받는 과정을 영상으로 확인하세요'
                    : stage.step_number === 3
                    ? '치료 끝나고 장해 등급 받는 과정을 영상으로 확인하세요'
                    : '직장 복귀하거나 재취업하는 과정을 영상으로 확인하세요'}
                </p>
              </div>
            )}

            {/* PDF 가이드 */}
            <div className="w-full space-y-3 sm:space-y-4 max-w-full overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-1 h-6 sm:h-8 bg-primary rounded-full"></div>
                    <h2 className="text-lg sm:text-xl font-bold text-foreground font-brand">
                      이렇게 진행하시면 됩니다.
                    </h2>
                  </div>
                  <span className="text-[10px] sm:text-xs text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-full w-fit">
                    ※ 본 문서는 AI 기술을 활용하여 작성되었습니다.
                  </span>
                </div>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  <a href={pdfUrl ?? '#'} download target="_blank" rel="noreferrer">
                    PDF 다운로드
                  </a>
                </Button>
              </div>
              {/* PDF 뷰어 (모바일: WebP 이미지, 데스크톱: PDF iframe) */}
              <ConditionalPDFViewer stepNumber={stage.step_number} pdfUrl={pdfUrl} />
            </div>
          </div>
        )}

        {activeTab === 'actions' && (
          <div 
            id="tabpanel-actions"
            role="tabpanel"
            aria-labelledby="tab-actions"
            className="space-y-4 sm:space-y-5"
          >
            {/* 안내 텍스트 */}
            <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-lg bg-primary/5 border border-primary/20">
              <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-base sm:text-base text-[#374151] leading-relaxed">
                이 단계에서는 꼭 해야 하는 일 {actionsCount}개가 있습니다.
                {stage.actionItems?.length > 0 && <span> 항목을 눌러 자세한 이유를 확인하세요.</span>}
              </p>
            </div>
            
            {actionsCount === 0 ? (
              <p className="text-senior-body text-[#6B7280]" role="status" aria-live="polite">해야 할 일이 없습니다.</p>
            ) : stage.actionItems && stage.actionItems.length > 0 ? (
              /* 구조화된 Action Items (Numbered List Style) */
              <div className="space-y-4 sm:space-y-5">
                {stage.actionItems.map((action, index) => (
                  <div 
                    key={action.id} 
                    className="bg-gray-50 rounded-lg p-4 sm:p-5"
                    role="article"
                    aria-label={`${action.title} 상세 내용`}
                  >
                    <h4 className="text-base sm:text-lg font-semibold text-foreground mb-2 flex items-start gap-2">
                       <span className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary text-white text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="leading-snug pt-0.5">
                        {action.title}
                      </span>
                    </h4>
                    {action.description && (
                       <div className="text-sm sm:text-base text-gray-700 ml-8 sm:ml-9 leading-relaxed break-keep">
                          {action.description}
                       </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              /* 기존 단순 텍스트 목록 (Fallback) - Numbered for consistency */
              <div className="space-y-4 sm:space-y-5" role="list" aria-label="해야 할 일 목록">
                {stage.actions.map((action, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 sm:p-5 flex items-start gap-3">
                     <span className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary text-white text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-senior-body text-foreground break-words pt-0.5">{action}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ... (Documents tab logic remains - DocumentDownloadButton handles the logic internally) */}
        
        {activeTab === 'documents' && (
            <div 
              id="tabpanel-documents"
              role="tabpanel"
              aria-labelledby="tab-documents"
              className="space-y-4 sm:space-y-5"
            >
              <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-lg bg-primary/5 border border-primary/20">
                <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-base sm:text-base text-[#374151] leading-relaxed">
                  이 단계에서 필요한 서류 {stage.documents.length}개가 있습니다.
                </p>
              </div>
              {stage.documents.length === 0 ? (
                <p className="text-senior-body text-[#6B7280]" role="status" aria-live="polite">필수 서류가 없습니다.</p>
              ) : (
                <>
                  <ul className="space-y-4 sm:space-y-5" role="list" aria-label="필수 서류 목록">
                    {stage.documents.map((doc) => (
                      <li
                        key={doc.id}
                        className="flex items-start justify-between gap-3 p-4 sm:p-5 md:p-6 rounded-xl border border-[var(--border-medium)] bg-white"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            {doc.is_required && (
                              <span className="text-xs font-semibold text-primary px-2 py-0.5 rounded bg-primary/20 flex-shrink-0">
                                필수
                              </span>
                            )}
                            <span className="text-senior-body font-medium text-foreground break-words">
                              {doc.title}
                            </span>
                          </div>
                        </div>
                        <DocumentDownloadButton document={doc} />
                      </li>
                    ))}
                  </ul>
                  {/* 더 자세한 서류 안내 링크 */}
                  <div className="mt-4 sm:mt-6 p-4 sm:p-5 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-sm sm:text-base text-foreground mb-3">
                      💡 이 서류에 대해 더 자세히 알고 싶으신가요?
                    </p>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      <Link href={`/documents?stage=${stage.step_number}`} prefetch={false}>
                        {stage.step_number}단계 서류 안내 자세히 보기
                      </Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}

        {activeTab === 'warnings' && (
          <div 
            id="tabpanel-warnings"
            role="tabpanel"
            aria-labelledby="tab-warnings"
            className="space-y-4 sm:space-y-5"
          >
            {/* 안내 텍스트 */}
            <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-lg bg-[var(--alert)]/10 border border-[var(--alert)]/20">
              <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 text-[var(--alert)] flex-shrink-0 mt-0.5" />
              <p className="text-base sm:text-base text-[#374151] leading-relaxed">
                이 단계에서 꼭 알아두어야 할 내용 {stage.warnings.length}개가 있습니다.
              </p>
            </div>
            {stage.warnings.length === 0 ? (
              <p className="text-senior-body text-[#6B7280]" role="status" aria-live="polite">주의사항이 없습니다.</p>
            ) : (
              <div className="space-y-4 sm:space-y-5" role="list" aria-label="주의사항 목록">
                {stage.warnings.map((warning, index) => (
                  <div
                    key={warning.id}
                    className="bg-gray-50 rounded-lg p-4 sm:p-5"
                    role="listitem"
                  >
                    <h4 className="text-base sm:text-lg font-semibold text-foreground mb-2 flex items-start gap-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[var(--alert)] text-white text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="leading-snug pt-0.5">
                        {warning.content}
                      </span>
                    </h4>
                    {warning.description && (
                      <div className="text-sm sm:text-base text-[var(--alert)] ml-8 sm:ml-9 leading-relaxed break-keep font-medium">
                         {warning.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 다음 단계 조건 */}
      {nextStage && nextStage.title && (
        <div className="pt-4 sm:pt-6 border-t border-[var(--border-medium)]">
          <p className="text-base sm:text-base text-[#374151]">
            <strong className="font-semibold text-foreground">다음 단계:</strong>{' '}
            {nextStage.title}
          </p>
        </div>
      )}

      {/* 네비게이션 버튼 */}
      <div className="flex gap-4 sm:gap-6 pt-4 border-t border-[var(--border-medium)]">
        {prevStage && (
          <Button
            asChild
            variant="outline"
            size="lg"
            className="flex-1 text-base sm:text-lg min-h-[48px]"
          >
            <Link href={`/timeline/${prevStage.step_number}`}>
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
              이전 단계
            </Link>
          </Button>
        )}
        {nextStage && (
          <Button
            asChild
            variant="default"
            size="lg"
            className="flex-1 text-base sm:text-lg min-h-[48px]"
          >
            <Link href={`/timeline/${nextStage.step_number}`}>
              다음 단계
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}

