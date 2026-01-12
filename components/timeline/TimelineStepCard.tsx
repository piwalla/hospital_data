/**
 * @file TimelineStepCard.tsx
 * @description 타임라인 단계 카드 컴포넌트
 */

'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { StageWithDetails } from '@/lib/types/timeline';
import { cn } from '@/lib/utils';

interface TimelineStepCardProps {
  stage: StageWithDetails;
  stepNumber: number;
  isCurrentStep?: boolean;
}

export default function TimelineStepCard({ stage, stepNumber, isCurrentStep = false }: TimelineStepCardProps) {
  const router = useRouter();
  
  const title = 
    stepNumber === 1
      ? '산재 신청 이렇게 하세요'
      : stepNumber === 2
      ? '치료와 생활비 받으세요'
      : stepNumber === 3
      ? '후유증 보상금 받으세요'
      : stepNumber === 4
      ? '직장 복귀 또는 재취업 지원 받기'
      : stage.title;

  const description =
    stepNumber === 1
      ? '다쳤을 때 가장 먼저 해야 할 일! 산재 신청부터 승인까지 전 과정을 안내합니다.'
      : stepNumber === 2
      ? '병원비는 어떻게 내나요? 일 못 하는 동안 생활비(휴업급여)는 어떻게 받나요?'
      : stepNumber === 3
      ? '치료 끝났는데 몸이 예전 같지 않다면? 후유증 보상금(장해급여) 받는 방법을 알려드립니다.'
      : stepNumber === 4
      ? '다시 일하고 싶은데 어떻게 해야 하나요? 직업훈련 지원부터 재취업까지 도와드립니다.'
      : stage.description;

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
      aria-label={`${stage.step_number}단계: ${stage.title} 자세히 보기`}
      aria-describedby={`step-${stage.step_number}-description`}
    >
      {/* 
        [Refined Layout Structure] 
        Rail Column (Fixed Width) | Content Column (Flex 1)
      */}
      
      {/* Removed: Timeline Rail Column - Now using arrows between cards */}

      {/* Content Card Column */}
      <div className={cn(
        "flex-1 min-w-0 relative",
        "bg-white border border-gray-300/40", // Stronger static border
        "rounded-[24px] overflow-hidden",
        "shadow-[0_8px_30px_rgba(0,0,0,0.05)]", // More visible static shadow
        "group-hover:shadow-[0_24px_48px_rgba(0,0,0,0.12)]", // Stronger hover lift
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
                "w-10 h-10 text-lg sm:w-14 sm:h-14 sm:text-2xl", // Responsive size classes
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
                진행중
              </span>
            )}
            
            {/* Actions Count Badge */}
            {(stage.actionItems?.length > 0 || stage.actions?.length > 0) && (
              <span
                role="button"
                onClick={(e) => handleTagClick(e, 'actions')}
                className="inline-flex items-center px-3 py-1 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 text-xs font-semibold border border-gray-200 transition-colors cursor-pointer"
              >
                할일 {stage.actionItems?.length || stage.actions?.length}
              </span>
            )}
            
            {stage.documents.length > 0 && (
              <span
                role="button"
                onClick={(e) => handleTagClick(e, 'documents')}
                className="inline-flex items-center px-3 py-1 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 text-xs font-semibold border border-gray-200 transition-colors cursor-pointer"
              >
                서류 {stage.documents.length}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
