/**
 * @file TimelineContainer.tsx
 * @description 타임라인 메인 컨테이너 컴포넌트
 * 
 * 레이아웃:
 * - 모든 화면 크기: 세로 타임라인 (위에서 아래로)
 */

'use client';

import TimelineStepCard from './TimelineStepCard';
import type { StageWithDetails } from '@/lib/types/timeline';

interface TimelineContainerProps {
  stages: StageWithDetails[];
  currentStepNumber?: number;
}

export default function TimelineContainer({ stages, currentStepNumber }: TimelineContainerProps) {

  if (stages.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#6B7280]">타임라인 데이터를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* 진행률 표시 */}
      {currentStepNumber && (
        <div className="mb-6 sm:mb-8 p-4 sm:p-6 rounded-xl border border-[var(--border-medium)] bg-white" role="region" aria-label="진행 상황">
          <div className="flex items-center justify-between mb-3">
            <p className="text-base sm:text-lg font-semibold text-foreground">
              진행 상황
            </p>
            <p className="text-base sm:text-base text-[#374151]" aria-live="polite" aria-atomic="true">
              {stages.length}단계 중 {currentStepNumber}단계
            </p>
          </div>
          {/* 진행률 바 */}
          <div className="w-full h-3 sm:h-4 bg-[var(--border-light)] rounded-full overflow-hidden" aria-hidden="true">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${(currentStepNumber / stages.length) * 100}%` }}
            />
          </div>
          <div 
            role="progressbar"
            aria-valuenow={currentStepNumber}
            aria-valuemin={1}
            aria-valuemax={stages.length}
            aria-label={`${stages.length}단계 중 ${currentStepNumber}단계 완료, 진행률 ${Math.round((currentStepNumber / stages.length) * 100)}%`}
            className="sr-only"
          />
        </div>
      )}

      {/* 단계 카드 그리드 */}
      <nav className="relative grid grid-cols-1 gap-6 sm:gap-8" aria-label="산재 진행 과정 단계 목록">
        {stages.map((stage, index) => (
          <div key={stage.id} data-stage-id={stage.id} className="relative">
            <TimelineStepCard
              stage={stage}
              stepNumber={stage.step_number}
              isCurrentStep={currentStepNumber === stage.step_number}
            />
          </div>
        ))}
      </nav>
    </div>
  );
}

