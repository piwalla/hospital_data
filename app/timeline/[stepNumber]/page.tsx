/**
 * @file app/timeline/[stepNumber]/page.tsx
 * @description 타임라인 단계 상세 페이지
 * 
 * 각 단계의 상세 정보를 별도 페이지로 표시합니다.
 * stepNumber를 받아서 해당 단계의 정보를 보여줍니다.
 */

import { notFound } from 'next/navigation';
import { getAllStagesWithDetails } from '@/lib/api/timeline';
import DocumentDownloadButton from '@/components/timeline/DocumentDownloadButton';
import { cn } from '@/lib/utils';
import TimelineStepContent from '@/components/timeline/TimelineStepContent';

interface TimelineStepPageProps {
  params: Promise<{ stepNumber: string }>;
  searchParams: Promise<{ tab?: string }>;
}

// 동적 렌더링 강제 (하지만 캐싱을 통해 성능 최적화)
export const dynamic = 'force-dynamic';
export const revalidate = 60; // 60초마다 재검증 (캐싱 활용)

export default async function TimelineStepPage({ params, searchParams }: TimelineStepPageProps) {
  const { stepNumber } = await params;
  const { tab } = await searchParams;
  const stepNum = parseInt(stepNumber, 10);

  if (isNaN(stepNum) || stepNum < 1) {
    notFound();
  }

  // 모든 단계 데이터 가져오기
  let stages: Awaited<ReturnType<typeof getAllStagesWithDetails>> = [];
  try {
    stages = await getAllStagesWithDetails();
  } catch (error) {
    console.error('[Timeline Step] 데이터 로드 실패:', error);
    notFound();
  }

  // 해당 단계 찾기
  const stage = stages.find(s => s.step_number === stepNum);
  if (!stage) {
    notFound();
  }

  // 다음 단계 찾기
  const nextStage = stages.find(s => s.step_number === stepNum + 1);
  const prevStage = stages.find(s => s.step_number === stepNum - 1);

  return (
    <div className="min-h-screen bg-[var(--background)] overflow-x-hidden">
      {/* 헤더 (모바일 여백 보호) */}
      <div className="sticky top-0 z-10 bg-[var(--background)]">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-4xl w-full">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 pb-4 sm:pb-6">
            <div className={cn(
              "flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full",
              "bg-primary text-primary-foreground",
              "flex items-center justify-center font-bold text-lg sm:text-xl"
            )}>
              {stage.step_number}
            </div>
            <div className="min-w-0">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground font-brand leading-tight break-words">
                {stage.title}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* 단계 설명을 헤더 아래로 분리 표시 */}
      <div className="container mx-auto px-3 sm:px-4 pt-3 sm:pt-4 pb-1 sm:pb-2 max-w-4xl w-full">
        <p className="text-sm sm:text-lg md:text-xl font-semibold text-muted-foreground break-words border-b border-[var(--border-medium)] pb-3">
          {stage.step_number === 1
            ? '사고 직후부터 신고·접수·조사·결과까지 산재 신청 전 과정을 한눈에 안내합니다.'
            : stage.step_number === 2
            ? '치료비 지급 전환, 휴업급여 정기 청구, 행정 변경 사전 승인으로 치료 안정성과 보상 연속성을 챙깁니다.'
            : stage.step_number === 3
            ? '치료 종결 후 장해평가와 장해급여·보조기구 신청을 준비합니다.'
            : stage.step_number === 4
            ? '복귀 절차와 지원·훈련을 정리합니다.'
            : stage.description}
        </p>
      </div>

      {/* 본문 */}
      <div className="container mx-auto px-0 sm:px-4 py-6 sm:py-8 md:py-12 max-w-4xl w-full overflow-x-hidden">
        {/* 클라이언트 컴포넌트로 탭 기능 구현 */}
        <div className="px-0 sm:px-0">
          <TimelineStepContent 
            stage={stage} 
            nextStage={nextStage}
            prevStage={prevStage}
            initialTab={tab as 'guide' | 'actions' | 'documents' | 'warnings' | undefined}
          />
        </div>
      </div>
    </div>
  );
}

