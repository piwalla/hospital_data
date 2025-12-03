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
}

export default function TimelineStepCard({ stage, stepNumber }: TimelineStepCardProps) {
  return (
    <Link
      href={`/timeline/${stepNumber}`}
      className={cn(
        "group relative w-full text-left rounded-2xl border transition-all duration-200",
        "bg-primary/5 hover:bg-primary/10",
        "border-primary/30 hover:border-primary/50",
        "shadow-leaf hover:shadow-canopy",
        "p-4 sm:p-6 block",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      )}
      aria-label={`${stage.step_number}단계: ${stage.title} 자세히 보기`}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        {/* 단계 번호 원형 배지 */}
        <div className={cn(
          "flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full",
          "bg-primary text-primary-foreground",
          "flex items-center justify-center font-bold text-lg sm:text-xl",
          "transition-transform duration-200 group-hover:scale-110"
        )}>
          {stage.step_number}
        </div>

        {/* 내용 */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground mb-1 sm:mb-2 font-brand group-hover:text-primary transition-colors">
            {stage.title}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
            {stage.description}
          </p>

          {/* 요약 정보 */}
          <div className="mt-3 sm:mt-4 flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm">
            {stage.actions.length > 0 && (
              <span className="px-2 py-1 rounded-md bg-primary/10 text-primary font-medium">
                해야 할 일 {stage.actions.length}개
              </span>
            )}
            {stage.documents.length > 0 && (
              <span className="px-2 py-1 rounded-md bg-primary/10 text-primary font-medium">
                서류 {stage.documents.length}개
              </span>
            )}
            {stage.warnings.length > 0 && (
              <span className="px-2 py-1 rounded-md bg-[var(--alert)]/10 text-[var(--alert)] font-medium">
                주의사항 {stage.warnings.length}개
              </span>
            )}
          </div>
        </div>

        {/* 화살표 아이콘 */}
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
      </div>
    </Link>
  );
}

