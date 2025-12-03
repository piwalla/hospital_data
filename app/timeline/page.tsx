import { getAllStagesWithDetails } from '@/lib/api/timeline';
import RiuIcon from '@/components/icons/riu-icon';
import LegalNotice from '@/components/timeline/LegalNotice';
import TimelineContainer from '@/components/timeline/TimelineContainer';

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

export default async function TimelinePage() {
  let stages: Awaited<ReturnType<typeof getAllStagesWithDetails>> = [];

  try {
    stages = await getAllStagesWithDetails();
  } catch (error) {
    console.error('[Timeline] 데이터 로드 실패:', error);
    // 에러 발생 시 빈 배열로 처리 (UI는 에러 메시지 표시)
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12 max-w-7xl space-y-6 sm:space-y-8 md:space-y-12">
      {/* 법적 고지 (상단 고정) */}
      <LegalNotice />

      {/* 페이지 헤더 */}
      <div 
        className="leaf-section rounded-2xl border border-[var(--border-light)] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 sm:p-6"
        role="region"
        aria-label="산재 절차 타임라인"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <RiuIcon variant="cheer" size={40} className="sm:w-14 sm:h-14" aria-hidden="true" />
          <h1 className="text-xl sm:text-2xl md:text-[30px] font-bold text-foreground font-brand">
            산재 절차 타임라인
          </h1>
        </div>
        <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground">
          산재 발생부터 사회 복귀까지의 전체 과정을 단계별로 확인하세요.
        </p>
      </div>

      {/* 타임라인 컨테이너 */}
      <TimelineContainer stages={stages} />
    </div>
  );
}

