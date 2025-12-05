import { getAllStagesWithDetails } from '@/lib/api/timeline';
import LegalNotice from '@/components/timeline/LegalNotice';
import TimelineContainer from '@/components/timeline/TimelineContainer';
import FirstVisitBanner from '@/components/timeline/FirstVisitBanner';

/**
 * @file page.tsx
 * @description 산재 절차 타임라인 페이지
 * 
 * 산재 환자와 가족을 위한 "사고 → 승인 → 치료 → 장해 → 사회복귀" 전 과정을
 * 시각적 타임라인으로 한눈에 이해할 수 있도록 제공하는 페이지입니다.
 * 
 * 로그인 없이도 접근 가능한 공개 페이지입니다.
 */

// 동적 렌더링 강제 (Supabase 데이터 조회를 위해)
export const dynamic = 'force-dynamic';

interface TimelinePageProps {
  searchParams: Promise<{ step?: string }>;
}

export default async function TimelinePage({ searchParams }: TimelinePageProps) {
  let stages: Awaited<ReturnType<typeof getAllStagesWithDetails>> = [];

  try {
    stages = await getAllStagesWithDetails();
  } catch (error) {
    console.error('[Timeline] 데이터 로드 실패:', error);
    // 에러 발생 시 빈 배열로 처리 (UI는 에러 메시지 표시)
  }

  // URL 쿼리 파라미터에서 현재 단계 번호 가져오기
  const params = await searchParams;
  const currentStepNumber = params.step ? parseInt(params.step, 10) : undefined;

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12 max-w-7xl space-y-8 sm:space-y-10 md:space-y-16">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-senior-title">
          산재 진행 과정
        </h1>
        <p className="mt-4 sm:mt-6 text-senior-body text-muted-foreground">
          산재 신청 부터 치료, 복귀까지 한번에 살펴보세요
        </p>
      </div>

      {/* 첫 방문 안내 배너 */}
      <FirstVisitBanner />

      {/* 타임라인 컨테이너 */}
      <TimelineContainer stages={stages} currentStepNumber={currentStepNumber} />

      {/* 법적 고지 (하단) */}
      <LegalNotice />
    </div>
  );
}

