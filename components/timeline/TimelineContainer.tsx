/**
 * @file TimelineContainer.tsx
 * @description 타임라인 메인 컨테이너 컴포넌트 (지역화 지원)
 * 
 * 레이아웃:
 * - 모든 화면 크기: 세로 타임라인 (위에서 아래로)
 */

'use client';

import TimelineStepCard from './TimelineStepCard';
import type { StageWithDetails } from '@/lib/types/timeline';
import { Locale, TimelineTranslation } from '@/lib/i18n/config';

interface TimelineContainerProps {
  stages: StageWithDetails[];
  currentStepNumber?: number;
  locale: Locale;
  t: TimelineTranslation;
}

export default function TimelineContainer({ stages, currentStepNumber, locale, t }: TimelineContainerProps) {

  if (stages.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#6B7280]">
          {locale === 'ko' ? '타임라인 데이터를 불러올 수 없습니다.' : 'Failed to load timeline data.'}
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* 단계 카드 그리드 */}
      <nav className="relative grid grid-cols-1 gap-0" aria-label="산재 진행 과정 단계 목록">
        {stages.map((stage, index) => (
          <div key={stage.id} data-stage-id={stage.id} className="relative">
            <TimelineStepCard
              stage={stage}
              stepNumber={stage.step_number}
              isCurrentStep={currentStepNumber === stage.step_number}
              locale={locale}
              t={t}
            />
            
            {/* Chevron between cards */}
            {index < stages.length - 1 && (
              <div className="flex justify-center my-2 sm:my-8" aria-hidden="true">
                <svg 
                  width="32" 
                  height="20" 
                  viewBox="0 0 32 20" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-gray-400"
                  style={{
                    animation: 'flowDown 2s ease-in-out infinite'
                  }}
                >
                  {/* Chevron shape - V pointing down */}
                  <path 
                    d="M2 2L16 18L30 2" 
                    stroke="currentColor" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
                <style jsx>{`
                  @keyframes flowDown {
                    0%, 100% {
                      opacity: 0.4;
                      transform: translateY(-4px);
                    }
                    50% {
                      opacity: 1;
                      transform: translateY(4px);
                    }
                  }
                `}</style>
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}

