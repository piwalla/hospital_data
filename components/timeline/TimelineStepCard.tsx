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
  const description =
    stepNumber === 1
      ? '사고 직후부터 신고·접수·조사·결과까지 산재 신청 전 과정을 한눈에 안내합니다.'
      : stepNumber === 2
      ? '치료비 지급 전환, 휴업급여 정기 청구, 행정 변경 사전 승인으로 치료 안정성과 보상 연속성을 챙깁니다.'
      : stepNumber === 3
      ? '치료 종결 후 장해평가와 장해급여·보조기구 신청을 준비합니다.'
      : stepNumber === 4
      ? '복귀·재취업을 위한 복귀 절차와 지원·훈련을 정리합니다.'
      : stage.description;

  return (
    <Link
      href={`/timeline/${stepNumber}`}
      className={cn(
        "group relative w-full max-w-full text-left rounded-xl overflow-hidden cursor-pointer",
        "transition-all duration-200 ease-in-out",
        // 시그니처 녹색 매우 두꺼운 외곽선 (3배 진하게)
        isCurrentStep 
          ? "bg-primary/15 hover:bg-[#f7f9f7] active:bg-primary/25 border-[6px] border-primary"
          : "bg-white hover:bg-[#f7f9f7] active:bg-primary/12 border-[6px] border-primary hover:border-primary",
        "hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5",
        "p-6 sm:p-8 block",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      )}
      aria-label={`${stage.step_number}단계: ${stage.title} 자세히 보기`}
      aria-describedby={`step-${stage.step_number}-description`}
    >
      {/* 단계 번호 원형 배지 - 좌측 상단에 절대 위치 (고정) */}
      <div 
        className="step-number-badge"
        style={{ 
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          width: '4rem',
          height: '4rem',
          borderRadius: '9999px',
          backgroundColor: 'var(--primary)',
          color: 'var(--primary-foreground)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '1.75rem',
          zIndex: 10,
          willChange: 'transform',
          transformOrigin: 'center center',
          transition: 'transform 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {stage.step_number}
      </div>

      <div className="flex items-start gap-3 sm:gap-4 pl-24 sm:pl-28 min-w-0">
        {/* 내용 */}
        <div className="flex-1 min-w-0">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-primary mb-1 sm:mb-2 transition-colors">
            {stage.title}
          </h3>
          <p id={`step-${stage.step_number}-description`} className="text-base sm:text-lg text-[#374151] line-clamp-3 break-words">
            {description}
          </p>

          {/* 요약 정보 */}
          <div className="mt-3 sm:mt-4 flex flex-wrap gap-2 sm:gap-3 text-sm sm:text-base items-center" role="group" aria-label="단계 요약 정보">
            {isCurrentStep && (
              <span className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground font-semibold min-h-[40px] flex items-center transition-colors duration-150 cursor-pointer hover:bg-primary/90" aria-label="현재 진행 중인 단계">
                현재 단계
              </span>
            )}
            {stage.actions.length > 0 && (
              <Link
                href={`/timeline/${stepNumber}?tab=actions`}
                onClick={(e) => e.stopPropagation()}
                className="px-3 py-1.5 rounded-md bg-primary/10 text-primary font-medium min-h-[40px] flex items-center transition-colors duration-150 cursor-pointer hover:bg-primary/20"
              >
                해야 할 일 {stage.actions.length}개
              </Link>
            )}
            {stage.documents.length > 0 && (
              <Link
                href={`/timeline/${stepNumber}?tab=documents`}
                onClick={(e) => e.stopPropagation()}
                className="px-3 py-1.5 rounded-md bg-primary/10 text-primary font-medium min-h-[40px] flex items-center transition-colors duration-150 cursor-pointer hover:bg-primary/20"
              >
                서류 {stage.documents.length}개
              </Link>
            )}
            {stage.warnings.length > 0 && (
              <Link
                href={`/timeline/${stepNumber}?tab=warnings`}
                onClick={(e) => e.stopPropagation()}
                className="px-3 py-1.5 rounded-md bg-[var(--alert)]/10 text-[var(--alert)] font-medium min-h-[40px] flex items-center transition-colors duration-150 cursor-pointer hover:bg-[var(--alert)]/20"
              >
                주의사항 {stage.warnings.length}개
              </Link>
            )}
          </div>
        </div>

        {/* 화살표 아이콘 - 인터랙션 요소 */}
        <div className="flex-shrink-0 mt-1 flex items-center justify-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-all duration-200">
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-primary group-hover:translate-x-1 transition-transform duration-200" />
          </div>
        </div>
      </div>
    </Link>
  );
}

