/**
 * @file TimelineDetailPanel.tsx
 * @description 타임라인 단계 상세 정보 패널/모달 컴포넌트
 * 
 * 모바일: Full Screen Dialog
 * 데스크톱: 슬라이드 Sheet (우측)
 */

'use client';

import { useState } from 'react';
import { X, CheckCircle2, FileText, AlertTriangle, ArrowRight } from 'lucide-react';
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
import type { StageWithDetails } from '@/lib/types/timeline';
import { cn } from '@/lib/utils';

interface TimelineDetailPanelProps {
  stage: StageWithDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNextStage?: () => void;
  hasNextStage?: boolean;
}

type TabType = 'actions' | 'documents' | 'warnings';

export default function TimelineDetailPanel({
  stage,
  open,
  onOpenChange,
  onNextStage,
  hasNextStage = false,
}: TimelineDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('actions');

  if (!stage) return null;

  // 모바일: Dialog, 데스크톱: Sheet
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const TabButton = ({ tab, label, icon: Icon, count }: { tab: TabType; label: string; icon: typeof CheckCircle2; count?: number }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200",
        "text-sm sm:text-base font-medium",
        activeTab === tab
          ? "bg-primary text-primary-foreground shadow-leaf"
          : "bg-[var(--background-alt)] text-muted-foreground hover:bg-[var(--background-alt)]/80"
      )}
      aria-pressed={activeTab === tab}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
      {count !== undefined && count > 0 && (
        <span className="ml-1 px-2 py-0.5 rounded-full bg-white/20 text-xs">
          {count}
        </span>
      )}
    </button>
  );

  const Content = () => (
    <div className="space-y-6">
      {/* 탭 버튼 */}
      <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2">
        <TabButton
          tab="actions"
          label="해야 할 일"
          icon={CheckCircle2}
          count={stage.actions.length}
        />
        <TabButton
          tab="documents"
          label="필수 서류"
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
                    className="flex items-start justify-between gap-3 p-3 rounded-lg border border-[var(--border-light)] bg-[var(--background-alt)]"
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
        <div className="pt-4 border-t border-[var(--border-light)]">
          <p className="text-sm sm:text-base text-muted-foreground">
            <strong className="font-semibold text-foreground">다음 단계:</strong>{' '}
            {stage.next_condition}
          </p>
        </div>
      )}

      {/* 다음 단계 보기 버튼 */}
      {hasNextStage && onNextStage && (
        <div className="pt-4 border-t border-[var(--border-light)]">
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
        <DialogContent className="max-w-full h-full max-h-screen rounded-none sm:rounded-2xl flex flex-col p-0">
          <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b border-[var(--border-light)]">
            <DialogTitle className="text-lg sm:text-xl font-bold font-brand">
              {stage.step_number}단계: {stage.title}
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {stage.description}
            </p>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6">
            <Content />
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


