/**
 * @file TimelineStepCard.tsx
 * @description 타임라인 단계 카드 컴포넌트
 */

'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { StageWithDetails } from '@/lib/types/timeline';
import { cn } from '@/lib/utils';

interface TimelineStepCardProps {
  stage: StageWithDetails;
  stepNumber: number;
  isCurrentStep?: boolean;
}

export default function TimelineStepCard({ stage, stepNumber, isCurrentStep = false }: TimelineStepCardProps) {
  return (
    <Link
      href={`/timeline/${stepNumber}`}
      className={cn(
        "group relative w-full text-left rounded-xl border transition-all duration-200",
        isCurrentStep 
          ? "bg-primary/20 hover:bg-primary/25 active:bg-primary/30 border-2 border-primary"
          : "bg-white hover:bg-primary/10 active:bg-primary/15 border-[var(--border-medium)] hover:border-2 hover:border-primary",
        "p-6 sm:p-8 block",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      )}
      aria-label={`${stage.step_number}단계: ${stage.title} 자세히 보기`}
      aria-describedby={`step-${stage.step_number}-description`}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        {/* 단계 번호 원형 배지 */}
        <div className={cn(
          "flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full",
          "bg-primary text-primary-foreground",
          "flex items-center justify-center font-bold text-xl sm:text-2xl",
          "transition-transform duration-200 group-hover:scale-110"
        )}>
          {stage.step_number}
        </div>

        {/* 내용 */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#111827] mb-1 sm:mb-2 group-hover:text-primary transition-colors">
            {stage.title}
          </h3>
          <p id={`step-${stage.step_number}-description`} className="text-base sm:text-lg text-[#374151] line-clamp-3">
            {stage.description}
          </p>
          {/* 간단한 안내 텍스트 */}
          <p className="mt-2 text-base sm:text-base text-[#6B7280] italic">
            이 단계에서는 해야 할 일, 필요한 서류, 주의사항을 확인할 수 있습니다.
          </p>

          {/* 요약 정보 */}
          <div className="mt-3 sm:mt-4 flex flex-wrap gap-2 sm:gap-3 text-base sm:text-base items-center" role="group" aria-label="단계 요약 정보">
            {isCurrentStep && (
              <span className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground font-semibold text-base sm:text-base min-h-[44px] flex items-center" aria-label="현재 진행 중인 단계">
                현재 단계
              </span>
            )}
            {stage.actions.length > 0 && (
              <span className="px-3 py-2 rounded-md bg-primary/10 text-primary font-medium text-base min-h-[44px] flex items-center">
                해야 할 일 {stage.actions.length}개
              </span>
            )}
            {stage.documents.length > 0 && (
              <span className="px-3 py-2 rounded-md bg-primary/10 text-primary font-medium text-base min-h-[44px] flex items-center">
                서류 {stage.documents.length}개
              </span>
            )}
            {stage.warnings.length > 0 && (
              <span className="px-3 py-2 rounded-md bg-[var(--alert)]/10 text-[var(--alert)] font-medium text-base min-h-[44px] flex items-center">
                주의사항 {stage.warnings.length}개
              </span>
            )}
          </div>
        </div>

        {/* 화살표 아이콘 */}
        <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 text-[#6B7280] group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
      </div>
    </Link>
  );
}

