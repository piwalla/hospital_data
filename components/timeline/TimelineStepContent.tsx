/**
 * @file TimelineStepContent.tsx
 * @description 타임라인 단계 상세 콘텐츠 컴포넌트 (클라이언트)
 * 
 * 탭 기능을 포함한 단계 상세 정보를 표시합니다.
 */

'use client';

import { useState } from 'react';
import { CheckCircle2, FileText, AlertTriangle, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import DocumentDownloadButton from './DocumentDownloadButton';
import type { StageWithDetails } from '@/lib/types/timeline';
import { cn } from '@/lib/utils';

interface TimelineStepContentProps {
  stage: StageWithDetails;
  nextStage?: StageWithDetails;
  prevStage?: StageWithDetails;
}

export default function TimelineStepContent({ stage, nextStage, prevStage }: TimelineStepContentProps) {
  const [activeTab, setActiveTab] = useState<'actions' | 'documents' | 'warnings'>('actions');

  const TabButton = ({ tab, label, icon: Icon, count }: { 
    tab: 'actions' | 'documents' | 'warnings'; 
    label: string; 
    icon: typeof CheckCircle2; 
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
        "flex items-center gap-3 sm:gap-4 px-5 py-3 sm:px-6 sm:py-4 rounded-lg transition-all duration-200 flex-shrink-0",
        "text-base sm:text-lg font-medium whitespace-nowrap",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        activeTab === tab
          ? "bg-primary text-primary-foreground"
          : "bg-primary/5 text-[#6B7280] hover:bg-primary/10 active:bg-primary/15 border border-primary/20"
      )}
      role="tab"
      aria-selected={activeTab === tab}
      aria-controls={`tabpanel-${tab}`}
      aria-pressed={activeTab === tab}
      tabIndex={activeTab === tab ? 0 : -1}
    >
      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
      <span>{label}</span>
      {count !== undefined && count > 0 && (
        <span className="ml-1 px-2 py-0.5 rounded-full bg-white/20 text-xs">
          {count}
        </span>
      )}
    </button>
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 탭 버튼 */}
      <div className="flex flex-nowrap gap-3 sm:gap-4 overflow-x-auto pb-2" role="tablist" aria-label="단계 상세 정보 탭">
        <TabButton
          tab="actions"
          label="해야 할 일"
          icon={CheckCircle2}
          count={stage.actions.length}
        />
        <span id="tab-actions" className="sr-only">해야 할 일 탭</span>
        <TabButton
          tab="documents"
          label="필수 서류"
          icon={FileText}
          count={stage.documents.length}
        />
        <span id="tab-documents" className="sr-only">필수 서류 탭</span>
        <TabButton
          tab="warnings"
          label="주의사항"
          icon={AlertTriangle}
          count={stage.warnings.length}
        />
        <span id="tab-warnings" className="sr-only">주의사항 탭</span>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="min-h-[400px]">
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
                이 단계에서 꼭 해야 하는 일들입니다.
              </p>
            </div>
            {stage.actions.length === 0 ? (
              <p className="text-senior-body text-[#6B7280]" role="status" aria-live="polite">해야 할 일이 없습니다.</p>
            ) : (
              <ul className="space-y-4 sm:space-y-5" role="list" aria-label="해야 할 일 목록">
                {stage.actions.map((action, index) => (
                  <li key={index} className="flex items-start gap-3 p-5 sm:p-6 rounded-xl border border-[var(--border-medium)] bg-white">
                    <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-senior-body text-foreground">{action}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === 'documents' && (
          <div 
            id="tabpanel-documents"
            role="tabpanel"
            aria-labelledby="tab-documents"
            className="space-y-4 sm:space-y-5"
          >
            {/* 안내 텍스트 */}
            <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-lg bg-primary/5 border border-primary/20">
              <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-base sm:text-base text-[#374151] leading-relaxed">
                이 단계에서 필요한 서류들입니다.
              </p>
            </div>
            {stage.documents.length === 0 ? (
              <p className="text-senior-body text-[#6B7280]" role="status" aria-live="polite">필수 서류가 없습니다.</p>
            ) : (
              <ul className="space-y-4 sm:space-y-5" role="list" aria-label="필수 서류 목록">
                {stage.documents.map((doc) => (
                  <li
                    key={doc.id}
                    className="flex items-start justify-between gap-3 p-5 sm:p-6 rounded-xl border border-[var(--border-medium)] bg-white"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {doc.is_required && (
                          <span className="text-xs font-semibold text-primary px-2 py-0.5 rounded bg-primary/20">
                            필수
                          </span>
                        )}
                        <span className="text-senior-body font-medium text-foreground">
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
                이 단계에서 꼭 알아두어야 할 내용입니다.
              </p>
            </div>
            {stage.warnings.length === 0 ? (
              <p className="text-senior-body text-[#6B7280]" role="status" aria-live="polite">주의사항이 없습니다.</p>
            ) : (
              <ul className="space-y-4 sm:space-y-5" role="list" aria-label="주의사항 목록">
                {stage.warnings.map((warning) => (
                  <li
                    key={warning.id}
                    className="flex items-start gap-3 p-5 sm:p-6 rounded-xl border border-[var(--alert)]/40 bg-[var(--alert)]/5"
                  >
                    <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 text-[var(--alert)] flex-shrink-0 mt-0.5" />
                    <span className="text-senior-body text-foreground">{warning.content}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* 다음 단계 조건 */}
      {stage.next_condition && (
        <div className="pt-4 sm:pt-6 border-t border-[var(--border-medium)]">
          <p className="text-base sm:text-base text-[#374151]">
            <strong className="font-semibold text-foreground">다음 단계:</strong>{' '}
            {stage.next_condition}
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

