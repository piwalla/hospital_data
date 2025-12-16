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

