/**
 * @file TimelineDetailPanel.tsx
 * @description 타임라인 단계 상세 정보 패널/모달 컴포넌트
 * 
 * 모바일: Full Screen Dialog
 * 데스크톱: 슬라이드 Sheet (우측)
 */

'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, FileText, AlertTriangle, ArrowRight, BookOpen } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import DocumentDownloadButton from './DocumentDownloadButton';
import ConditionalPDFViewer from './ConditionalPDFViewer';
import type { StageWithDetails } from '@/lib/types/timeline';
import { cn } from '@/lib/utils';

interface TimelineDetailPanelProps {
  stage: StageWithDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNextStage?: () => void;
  hasNextStage?: boolean;
}

type TabType = 'guide' | 'actions' | 'documents' | 'warnings';

export default function TimelineDetailPanel({
  stage,
  open,
  onOpenChange,
  onNextStage,
  hasNextStage = false,
}: TimelineDetailPanelProps) {
  // 1단계, 2단계, 3단계, 4단계일 때는 기본 탭을 'guide'로 설정
  const [activeTab, setActiveTab] = useState<TabType>('actions');

  // PDF URL 생성 (1단계, 2단계, 3단계, 4단계용) - 툴바 숨김 파라미터 추가
  const getPdfUrl = () => {
    if (!stage) return null;
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

  // 1단계, 2단계, 3단계, 4단계일 때 기본 탭을 'guide'로 설정 (패널이 열릴 때마다)
  // useEffect는 early return 전에 호출되어야 함
  useEffect(() => {
    if (!stage) return;
    if (open && (stage.step_number === 1 || stage.step_number === 2 || stage.step_number === 3 || stage.step_number === 4) && pdfUrl) {
      setActiveTab('guide');
    } else if (open && stage.step_number !== 1 && stage.step_number !== 2 && stage.step_number !== 3 && stage.step_number !== 4) {
      setActiveTab('actions');
    }
  }, [open, stage, pdfUrl]);

  if (!stage) return null;

  // 모바일: Dialog, 데스크톱: Sheet
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const TabButton = ({ tab, label, icon: Icon, count }: { tab: TabType; label: string; icon: typeof CheckCircle2 | typeof BookOpen; count?: number }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={cn(
        "flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-2 rounded-lg transition-all duration-200",
        "text-[11px] sm:text-base font-medium whitespace-nowrap",
        "flex-shrink-0",
        activeTab === tab
          ? "bg-primary text-primary-foreground"
          : "bg-[var(--background-alt)] text-muted-foreground hover:bg-[var(--background-alt)]/80"
      )}
      aria-pressed={activeTab === tab}
    >
      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
      <span>{label}</span>
      {count !== undefined && count > 0 && (
        <span className="ml-0.5 sm:ml-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-white/20 text-[10px] sm:text-xs flex-shrink-0">
          {count}
        </span>
      )}
    </button>
  );

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

  const Content = () => (
    <div className="space-y-6">
      {/* 유튜브 가이드 영상 (1단계, 2단계, 3단계, 4단계) */}
      {youtubeVideoId && (
        <div className="w-full space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-0">
            <div className="w-1 h-6 sm:h-8 bg-primary rounded-full"></div>
            <h2 className="text-lg sm:text-xl font-bold text-foreground font-brand">
              가이드 영상
            </h2>
          </div>
          <div className="relative w-screen sm:w-full -ml-4 sm:ml-0 rounded-none sm:rounded-xl overflow-hidden border-0 sm:border border-[var(--border-medium)] bg-white shadow-sm" style={{ maxWidth: 'calc(100vw - 0px)' }}>
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
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
          <p className="text-sm sm:text-base text-muted-foreground text-center px-4 sm:px-0">
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

      {/* 탭 버튼 */}
      <div className="flex flex-nowrap gap-1 sm:gap-3 overflow-x-auto pb-2">
        {/* 1단계, 2단계, 3단계, 4단계일 때 "설명 보기" 탭 표시 */}
        {(stage.step_number === 1 || stage.step_number === 2 || stage.step_number === 3 || stage.step_number === 4) && pdfUrl && (
          <TabButton
            tab="guide"
            label="설명 보기"
            icon={BookOpen}
          />
        )}
        <TabButton
          tab="actions"
          label="해야 할 일"
          icon={CheckCircle2}
          count={stage.actions.length}
        />
        <TabButton
          tab="documents"
          label="서류"
          icon={FileText}
          count={stage.documents.length}
        />
        <TabButton
          tab="warnings"
          label="주의사항"
          icon={AlertTriangle}
          count={stage.warnings.length}
        />
      </div>

      {/* 탭 콘텐츠 */}
      <div className="min-h-[200px]">
        {/* 설명 보기 탭 (PDF) - 1단계, 2단계, 3단계, 4단계 */}
        {activeTab === 'guide' && (stage.step_number === 1 || stage.step_number === 2 || stage.step_number === 3 || stage.step_number === 4) && pdfUrl && (
          <div className="space-y-3">
            {/* 제목 (영상 섹션과 동일한 스타일) */}
            <div className="flex items-center gap-2 sm:gap-3 mb-3">
              <div className="w-1 h-6 sm:h-8 bg-primary rounded-full"></div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground font-brand">
                이렇게 진행하시면 됩니다.
              </h2>
            </div>
            {/* PDF 뷰어 (모바일: WebP 이미지, 데스크톱: PDF iframe) */}
            <ConditionalPDFViewer stepNumber={stage.step_number} pdfUrl={pdfUrl} />
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="space-y-3">
            {stage.actions.length === 0 ? (
              <p className="text-sm text-muted-foreground">해야 할 일이 없습니다.</p>
            ) : (
              <ul className="space-y-3">
                {stage.actions.map((action, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-foreground">{action}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-3">
            {stage.documents.length === 0 ? (
              <p className="text-sm text-muted-foreground">필수 서류가 없습니다.</p>
            ) : (
              <ul className="space-y-3">
                {stage.documents.map((doc) => (
                  <li
                    key={doc.id}
                    className="flex items-start justify-between gap-3 p-3 rounded-lg border border-[var(--border-medium)] bg-[var(--background-alt)]"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {doc.is_required && (
                          <span className="text-xs font-semibold text-[var(--alert)] px-2 py-0.5 rounded bg-[var(--alert)]/10">
                            필수
                          </span>
                        )}
                        <span className="text-sm sm:text-base font-medium text-foreground">
                          {doc.title}
                        </span>
                      </div>
                    </div>
                    <DocumentDownloadButton document={doc} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === 'warnings' && (
          <div className="space-y-3">
            {stage.warnings.length === 0 ? (
              <p className="text-sm text-muted-foreground">주의사항이 없습니다.</p>
            ) : (
              <ul className="space-y-3">
                {stage.warnings.map((warning) => (
                  <li
                    key={warning.id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-[var(--alert)]/30 bg-[var(--alert)]/5"
                  >
                    <AlertTriangle className="w-5 h-5 text-[var(--alert)] flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-foreground">{warning.content}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* 다음 단계 조건 */}
      {stage.next_condition && (
        <div className="pt-4 border-t border-[var(--border-medium)]">
          <p className="text-sm sm:text-base text-muted-foreground">
            <strong className="font-semibold text-foreground">다음 단계:</strong>{' '}
            {stage.next_condition}
          </p>
        </div>
      )}

      {/* 다음 단계 보기 버튼 */}
      {hasNextStage && onNextStage && (
        <div className="pt-4 border-t border-[var(--border-medium)]">
          <Button
            onClick={onNextStage}
            className="w-full flex items-center justify-center gap-2"
            variant="default"
          >
            다음 단계 보기
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );

  // 모바일: Dialog (Full Screen)
  if (isMobile) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-full h-[100dvh] max-h-[100dvh] rounded-none sm:rounded-lg flex flex-col p-0 top-0 left-0 translate-x-0 translate-y-0 m-0">
          <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b border-[var(--border-medium)] flex-shrink-0">
            <DialogTitle className="text-lg sm:text-xl font-bold font-brand">
              {stage.step_number}단계: {stage.title}
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {stage.description}
            </p>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto overflow-x-hidden px-0 sm:px-6 py-4 sm:py-6 min-h-0">
            <div className="px-4 sm:px-0">
              <Content />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // 데스크톱: Sheet (우측 슬라이드)
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl font-bold font-brand">
            {stage.step_number}단계: {stage.title}
          </SheetTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {stage.description}
          </p>
        </SheetHeader>
        <Content />
      </SheetContent>
    </Sheet>
  );
}



