import { getAllStagesWithDetails } from '@/lib/api/timeline';
import TimelineClient from './TimelineClient';

/**
 * @file page.tsx
 * @description 산재 절차 타임라인 페이지 (지역화 지원)
 * 
 * 서버 컴포넌트로서 데이터를 조회하고, 
 * 다국어 상태 관리 및 UI 렌더링을 담당하는 TimelineClient에 데이터를 전달합니다.
 */

// 동적 렌더링 강제 (하지만 캐싱을 통해 성능 최적화)
export const dynamic = 'force-dynamic';
export const revalidate = 60; // 60초마다 재검증 (캐싱 활용)

interface TimelinePageProps {
  searchParams: Promise<{ step?: string }>;
}

export default async function TimelinePage({ searchParams }: TimelinePageProps) {
  let stages: Awaited<ReturnType<typeof getAllStagesWithDetails>> = [];

  try {
    stages = await getAllStagesWithDetails();
  } catch (error) {
    console.error('[Timeline] 데이터 로드 실패:', error);
    // 에러 발생 시 빈 배열로 처리 (UI는 에러 메시지 표시 지원 필요)
  }

  // URL 쿼리 파라미터에서 현재 단계 번호 가져오기
  const params = await searchParams;
  const currentStepNumber = params.step ? parseInt(params.step, 10) : undefined;

  return (
    <TimelineClient 
      initialStages={stages} 
      initialStepNumber={currentStepNumber} 
    />
  );
}

