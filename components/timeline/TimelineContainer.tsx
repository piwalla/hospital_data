/**
 * @file TimelineContainer.tsx
 * @description 타임라인 메인 컨테이너 컴포넌트
 * 
 * 반응형 레이아웃:
 * - 모바일 (< 768px): 세로 타임라인 (위에서 아래로)
 * - 데스크톱 (≥ 768px): 가로 타임라인 (왼쪽에서 오른쪽으로)
 */

'use client';

import { ArrowRight } from 'lucide-react';
import TimelineStepCard from './TimelineStepCard';
import type { StageWithDetails } from '@/lib/types/timeline';

interface TimelineContainerProps {
  stages: StageWithDetails[];
}

export default function TimelineContainer({ stages }: TimelineContainerProps) {

  if (stages.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">타임라인 데이터를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* 타임라인 연결선 (데스크톱만) */}
      <div className="absolute top-6 left-0 right-0 h-1 bg-primary/30 hidden md:block" />
      
      {/* 단계 카드 그리드 */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stages.map((stage, index) => (
          <div key={stage.id} data-stage-id={stage.id} className="relative">
            <TimelineStepCard
              stage={stage}
              stepNumber={stage.step_number}
            />
            {/* 단계 간 화살표 (마지막 제외, 데스크톱만) */}
            {index < stages.length - 1 && (
              <div className="hidden md:flex absolute top-6 -right-3 lg:-right-6 z-10 items-center justify-center">
                <div className="bg-primary/10 p-1 rounded-full border-2 border-primary/40 shadow-leaf">
                  <ArrowRight className="w-4 h-4 text-primary" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

