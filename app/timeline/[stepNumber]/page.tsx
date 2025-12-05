/**
 * @file app/timeline/[stepNumber]/page.tsx
 * @description 타임라인 단계 상세 페이지
 * 
 * 각 단계의 상세 정보를 별도 페이지로 표시합니다.
 * stepNumber를 받아서 해당 단계의 정보를 보여줍니다.
 */

import { notFound } from 'next/navigation';
import { getAllStagesWithDetails } from '@/lib/api/timeline';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import DocumentDownloadButton from '@/components/timeline/DocumentDownloadButton';
import { cn } from '@/lib/utils';
import TimelineStepContent from '@/components/timeline/TimelineStepContent';

interface TimelineStepPageProps {
  params: Promise<{ stepNumber: string }>;
}

// 동적 렌더링 강제
export const dynamic = 'force-dynamic';

export default async function TimelineStepPage({ params }: TimelineStepPageProps) {
  const { stepNumber } = await params;
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
    <div className="min-h-screen bg-[var(--background)]">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-[var(--background)] border-b border-[var(--border-medium)]">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-4xl">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button
              asChild
              variant="ghost"
              size="sm"
              aria-label="타임라인으로 돌아가기"
            >
              <Link href={`/timeline?step=${stepNum}`}>
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-2 sm:gap-3 flex-1">
              <div className={cn(
                "flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full",
                "bg-primary text-primary-foreground",
                "flex items-center justify-center font-bold text-lg sm:text-xl"
              )}>
                {stage.step_number}
              </div>
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground font-brand">
                  {stage.title}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {stage.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 본문 */}
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12 max-w-4xl">
        {/* 클라이언트 컴포넌트로 탭 기능 구현 */}
        <TimelineStepContent 
          stage={stage} 
          nextStage={nextStage}
          prevStage={prevStage}
        />
      </div>
    </div>
  );
}

