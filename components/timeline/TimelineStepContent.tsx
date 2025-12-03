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
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200",
        "text-sm sm:text-base font-medium",
        activeTab === tab
          ? "bg-primary text-primary-foreground shadow-leaf"
          : "bg-primary/5 text-muted-foreground hover:bg-primary/10 border border-primary/20"
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

  return (
    <div className="space-y-6 sm:space-y-8">
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
      <div className="min-h-[400px]">
        {activeTab === 'actions' && (
          <div className="space-y-3">
            {stage.actions.length === 0 ? (
              <p className="text-sm text-muted-foreground">해야 할 일이 없습니다.</p>
            ) : (
              <ul className="space-y-3">
                {stage.actions.map((action, index) => (
                  <li key={index} className="flex items-start gap-3 p-4 rounded-lg border border-primary/30 bg-primary/5">
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
                    className="flex items-start justify-between gap-3 p-4 rounded-lg border border-primary/30 bg-primary/5"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {doc.is_required && (
                          <span className="text-xs font-semibold text-primary px-2 py-0.5 rounded bg-primary/20">
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
                    className="flex items-start gap-3 p-4 rounded-lg border border-[var(--alert)]/30 bg-[var(--alert)]/5"
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

      {/* 네비게이션 버튼 */}
      <div className="flex gap-3 pt-4 border-t border-[var(--border-light)]">
        {prevStage && (
          <Button
            asChild
            variant="outline"
            className="flex-1"
          >
            <Link href={`/timeline/${prevStage.step_number}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              이전 단계
            </Link>
          </Button>
        )}
        {nextStage && (
          <Button
            asChild
            variant="default"
            className="flex-1"
          >
            <Link href={`/timeline/${nextStage.step_number}`}>
              다음 단계
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}

