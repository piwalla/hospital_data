/**
 * @file TimelineStepCard.tsx
 * @description 타임라인 단계 카드 컴포넌트 (지역화 지원)
 */

'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { StageWithDetails } from '@/lib/types/timeline';
import { cn } from '@/lib/utils';
import { Locale, TimelineTranslation } from '@/lib/i18n/config';

interface TimelineStepCardProps {
  stage: StageWithDetails;
  stepNumber: number;
  isCurrentStep?: boolean;
  locale: Locale;
  t: TimelineTranslation;
}

export default function TimelineStepCard({ 
  stage, 
  stepNumber, 
  isCurrentStep = false,
  locale,
  t 
}: TimelineStepCardProps) {
  const router = useRouter();
  
  // 번역된 데이터 우선 사용, 없으면 stage 데이터 사용
  const stageKey = stepNumber as keyof typeof t.stages;
  const translatedStage = t.stages[stageKey];
  
  const title = translatedStage?.title || stage.title;
  const description = translatedStage?.description || stage.description;

  const handleTagClick = (e: React.MouseEvent, tab: string) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/timeline/${stepNumber}?tab=${tab}`);
  };

  return (
    <Link
      href={`/timeline/${stepNumber}`}
      prefetch={false}
      className="group relative flex w-full text-left"
      aria-label={`${stage.step_number}단계: ${title} 자세히 보기`}
      aria-describedby={`step-${stage.step_number}-description`}
    >
      {/* Content Card Column */}
      <div className={cn(
        "flex-1 min-w-0 relative",
        "bg-white border border-gray-300/40", 
        "rounded-[24px] overflow-hidden",
        "shadow-[0_8px_30px_rgba(0,0,0,0.05)]", 
        "group-hover:shadow-[0_24px_48px_rgba(0,0,0,0.12)]", 
        "group-hover:border-primary/40",
        "group-hover:-translate-y-1.5",
        "transition-all duration-300 ease-out",
        "cursor-pointer",
        isCurrentStep && "ring-2 ring-primary/25 shadow-[0_12px_40px_rgba(47,110,79,0.15)] bg-primary/[0.01]",
        "p-4 sm:p-8"
      )}>
        {/* Accent Bar - Vertical line on the left */}
        <div className={cn(
          "absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300",
          isCurrentStep ? "bg-primary" : "bg-transparent group-hover:bg-primary/40"
        )} />

        {/* Card Header Section */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Step Number Badge */}
            <div 
              className={cn(
                "flex items-center justify-center rounded-2xl shadow-sm transition-all duration-300 flex-shrink-0 font-display",
                "w-10 h-10 text-lg sm:w-14 sm:h-14 sm:text-2xl", 
                isCurrentStep 
                  ? "bg-primary text-white shadow-md ring-4 ring-primary/10" 
                  : "bg-gray-100 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary"
              )}
              style={{ fontWeight: 800 }}
            >
              {stage.step_number}
            </div>
            
            <h3 className={cn(
              "text-lg sm:text-2xl font-bold leading-tight transition-colors mt-1 sm:mt-2",
              isCurrentStep ? "text-gray-900" : "text-gray-900 group-hover:text-primary"
            )}>
              {title}
            </h3>
          </div>
          
          {/* Icon visual cue */}
          <div className={cn(
            "p-2 rounded-full transition-all duration-300 mt-1",
            "bg-primary/10 text-primary sm:bg-gray-50 sm:text-gray-400 sm:group-hover:bg-primary sm:group-hover:text-white"
          )}>
            <ArrowRight className="w-5 h-5 sm:stroke-2 stroke-[3]" />
          </div>
        </div>
        
        <p id={`step-${stage.step_number}-description`} className="text-[14px] sm:text-[16px] text-gray-600 font-medium leading-[1.6] mb-3 sm:mb-6 pl-[3.5rem] sm:pl-[4.75rem]">
          {description}
        </p>

        {/* Tags & Action Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 mt-auto pl-[3.5rem] sm:pl-[4.75rem]">
          {/* Left: Tags */}
          <div className="flex flex-wrap gap-2">
            {isCurrentStep && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold">
                {t.status.inProgress}
              </span>
            )}
            
            {/* Actions Count Badge */}
            {(stage.actionItems?.length > 0 || stage.actions?.length > 0) && (
              <span
                role="button"
                onClick={(e) => handleTagClick(e, 'actions')}
                className="inline-flex items-center px-3 py-1 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 text-xs font-semibold border border-gray-200 transition-colors cursor-pointer"
              >
                {t.tabs.actions} {stage.actionItems?.length || stage.actions?.length}
              </span>
            )}
            
            {stage.documents.length > 0 && (
              <span
                role="button"
                onClick={(e) => handleTagClick(e, 'documents')}
                className="inline-flex items-center px-3 py-1 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 text-xs font-semibold border border-gray-200 transition-colors cursor-pointer"
              >
                {t.tabs.documents} {stage.documents.length}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
