/**
 * @file TimelineStepCard.tsx
 * @description 타임라인 단계 카드 컴포넌트
 */

'use client';

import { ChevronRight } from 'lucide-react';
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

  const handleTagClick = (e: React.MouseEvent, tab: string) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/timeline/${stepNumber}?tab=${tab}`);
  };

  return (
    <Link
      href={`/timeline/${stepNumber}`}
        className={cn(
        "group relative w-full max-w-full text-left rounded-xl overflow-hidden cursor-pointer",
        "transition-all duration-200 ease-in-out",
        // 외곽선 70% 줄임 (6px → 2px) 및 기본 그림자 추가
        isCurrentStep 
          ? "bg-primary/15 hover:bg-[#f7f9f7] active:bg-primary/25 border-2 border-black shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
          : "bg-white hover:bg-[#f7f9f7] active:bg-primary/12 border-2 border-black hover:border-black shadow-[0_4px_12px_rgba(0,0,0,0.08)]",
        "hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:-translate-y-0.5",
        "active:scale-[0.98] active:shadow-inner active:translate-y-0",
        "p-4 sm:p-6 block",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        "touch-manipulation" // 모바일 터치 최적화
      )}
      aria-label={`${stage.step_number}단계: ${stage.title} 자세히 보기`}
      aria-describedby={`step-${stage.step_number}-description`}
    >
      <div className="flex items-start gap-4 sm:gap-5 min-w-0">
        {/* 단계 번호 원형 배지 */}
        <div className="flex-shrink-0">
          <div 
            className="step-number-badge"
            style={{ 
              width: '3.5rem',
              height: '3.5rem',
              borderRadius: '9999px',
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '1.875rem',
              flexShrink: 0,
            }}
          >
            {stage.step_number}
          </div>
        </div>

        {/* 내용 */}
        <div className="flex-1 min-w-0">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-black mb-2 sm:mb-3 leading-tight break-words">
            {stage.title}
          </h3>
          <p id={`step-${stage.step_number}-description`} className="text-sm sm:text-base text-[#374151] leading-relaxed break-words mb-3 sm:mb-4">
            {description}
          </p>

          {/* 요약 정보 */}
          <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm items-center" role="group" aria-label="단계 요약 정보">
            {isCurrentStep && (
              <span className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground font-semibold min-h-[40px] flex items-center transition-colors duration-150 cursor-pointer hover:bg-primary/90" aria-label="현재 진행 중인 단계">
                현재 단계
              </span>
            )}
            {stage.actions.length > 0 && (
              <button
                type="button"
                onClick={(e) => handleTagClick(e, 'actions')}
                className="px-3 py-1.5 rounded-md bg-primary/10 text-primary font-medium min-h-[40px] flex items-center transition-colors duration-150 cursor-pointer hover:bg-primary/20"
                aria-label={`해야 할 일 ${stage.actions.length}개 보기`}
              >
                해야 할 일 {stage.actions.length}개
              </button>
            )}
            {stage.documents.length > 0 && (
              <button
                type="button"
                onClick={(e) => handleTagClick(e, 'documents')}
                className="px-3 py-1.5 rounded-md bg-primary/10 text-primary font-medium min-h-[40px] flex items-center transition-colors duration-150 cursor-pointer hover:bg-primary/20"
                aria-label={`서류 ${stage.documents.length}개 보기`}
              >
                서류 {stage.documents.length}개
              </button>
            )}
            {stage.warnings.length > 0 && (
              <button
                type="button"
                onClick={(e) => handleTagClick(e, 'warnings')}
                className="px-3 py-1.5 rounded-md bg-[var(--alert)]/10 text-[var(--alert)] font-medium min-h-[40px] flex items-center transition-colors duration-150 cursor-pointer hover:bg-[var(--alert)]/20"
                aria-label={`주의사항 ${stage.warnings.length}개 보기`}
              >
                주의사항 {stage.warnings.length}개
              </button>
            )}
          </div>
        </div>

        {/* 화살표 아이콘 - 인터랙션 요소 */}
        <div className="flex-shrink-0 flex items-center justify-center">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-all duration-200">
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-primary group-hover:translate-x-1 transition-transform duration-200" />
          </div>
        </div>
      </div>
    </Link>
  );
}

