/**
 * @file app/timeline/[stepNumber]/page.tsx
 * @description 타임라인 단계 상세 페이지
 * 
 * 각 단계의 상세 정보를 별도 페이지로 표시합니다.
 * stepNumber를 받아서 해당 단계의 정보를 보여줍니다.
 */

import { notFound } from 'next/navigation';
import { getAllStagesWithDetails } from '@/lib/api/timeline';

import { cn } from '@/lib/utils';
import TimelineStepClient from './TimelineStepClient';

interface TimelineStepPageProps {
  params: Promise<{ stepNumber: string }>;
  searchParams: Promise<{ tab?: string }>;
}

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
    <TimelineStepClient
      stage={stage}
      nextStage={nextStage}
      prevStage={prevStage}
      initialTab={tab}
    />
  );
}

