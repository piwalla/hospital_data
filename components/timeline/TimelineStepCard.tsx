/**
 * @file TimelineStepCard.tsx
 * @description 타임라인 단계 카드 컴포넌트
 */

'use client';

import { ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { StageWithDetails } from '@/lib/types/timeline';
import { cn } from '@/lib/utils';

interface TimelineStepCardProps {
  stage: StageWithDetails;
  stepNumber: number;
  isCurrentStep?: boolean;
  isLastStep?: boolean;
}

export default function TimelineStepCard({ stage, stepNumber, isCurrentStep = false, isLastStep = false }: TimelineStepCardProps) {
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
        "flex-1 min-w-0 mb-8",
        "relative rounded-[24px] overflow-hidden",
        "bg-amber-50/30 border-2 border-gray-200",
        "shadow-[0_4px_20px_rgba(0,0,0,0.08)]",
        "hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)]",
        "hover:border-slate-400",
        "hover:-translate-y-2",
        "transition-all duration-300 ease-out",
        "cursor-pointer",
        isCurrentStep && "ring-2 ring-slate-400 shadow-[0_8px_30px_rgba(100,116,139,0.15)] bg-slate-50/30",
        "p-5 sm:p-7"
      )}>
        {/* Card Header Section */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            {/* Step Number Badge */}
            <div 
              className={cn(
                "flex items-center justify-center rounded-full shadow-lg transition-all duration-300 flex-shrink-0",
                "border-4 border-white",
                isCurrentStep 
                  ? "bg-slate-700 text-white shadow-xl ring-4 ring-slate-200" 
                  : "bg-slate-600 text-white shadow-md group-hover:bg-slate-700 group-hover:shadow-xl"
              )}
              style={{ 
                width: '3.5rem',
                height: '3.5rem',
                fontSize: '1.25rem',
                fontWeight: 700,
              }}
            >
              {stage.step_number}
            </div>
            
            <h3 className={cn(
              "text-xl sm:text-2xl font-bold leading-tight transition-colors",
              isCurrentStep ? "text-gray-900" : "text-gray-900 group-hover:text-green-900"
            )}>
              {title}
            </h3>
          </div>
          
          {/* Icon visual cue */}
          <ChevronRight className={cn(
            "w-6 h-6 text-slate-600 transition-all duration-300",
            "group-hover:text-green-600 group-hover:translate-x-1"
          )} />
        </div>
        
        <p id={`step-${stage.step_number}-description`} className="text-[15px] sm:text-[16px] text-gray-600 font-medium leading-[1.7] mb-6">
          {description}
        </p>

        {/* Tags & Action Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-auto">
          {/* Left: Tags */}
          <div className="flex flex-wrap gap-2">
            {isCurrentStep && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-green-600 text-white text-[11px] font-bold shadow-sm">
                진행중
              </span>
            )}
            
            {/* Actions Count Badge */}
            {(stage.actionItems?.length > 0 || stage.actions?.length > 0) && (
              <span
                role="button"
                onClick={(e) => handleTagClick(e, 'actions')}
                className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-50 hover:bg-green-50 text-gray-600 hover:text-green-700 text-xs font-semibold border border-gray-200 transition-colors cursor-pointer"
              >
                할일 {stage.actionItems?.length || stage.actions?.length}
              </span>
            )}
            
            {stage.documents.length > 0 && (
              <span
                role="button"
                onClick={(e) => handleTagClick(e, 'documents')}
                className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-700 text-xs font-semibold border border-gray-200 transition-colors cursor-pointer"
              >
                서류 {stage.documents.length}
              </span>
            )}
          </div>

          {/* Right: Explicit CTA Button */}
          <div className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg group-hover:border-green-500 group-hover:text-green-600 group-hover:bg-green-50 transition-all shadow-sm">
            상세보기
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}
