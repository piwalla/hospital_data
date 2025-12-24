import { getAllStagesWithDetails } from '@/lib/api/timeline';
import LegalNotice from '@/components/timeline/LegalNotice';
import TimelineContainer from '@/components/timeline/TimelineContainer';
import FirstVisitBanner from '@/components/timeline/FirstVisitBanner';
import VideoGuideButton from '@/components/timeline/VideoGuideButton';

/**
 * @file page.tsx
 * @description 산재 절차 타임라인 페이지
 * 
 * 산재 환자와 가족을 위한 "사고 → 승인 → 치료 → 장해 → 사회복귀" 전 과정을
 * 시각적 타임라인으로 한눈에 이해할 수 있도록 제공하는 페이지입니다.
 * 
 * 로그인 없이도 접근 가능한 공개 페이지입니다.
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
    // 에러 발생 시 빈 배열로 처리 (UI는 에러 메시지 표시)
  }

  // URL 쿼리 파라미터에서 현재 단계 번호 가져오기
  const params = await searchParams;
  const currentStepNumber = params.step ? parseInt(params.step, 10) : undefined;

  return (
    <div className="min-h-screen w-full relative">
       {/* 
        Background Layer: Mesh Gradient for Glassmorphism 
        - 은은한 빛 효과 추가
      */}
      {/* Background: Structured Calm (Grid + Soft Light) */}
      <div className="fixed inset-0 -z-10 overflow-hidden bg-[#FBFBFB]">
        {/* 1. Subtle Engineering Grid/Dot Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.4]"
          style={{ 
            backgroundImage: 'radial-gradient(#E2E8F0 1.5px, transparent 1.5px)', 
            backgroundSize: '40px 40px' 
          }}
        />
        
        {/* 2. Top Center Soft Light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-slate-100/40 blur-[100px] rounded-full mix-blend-multiply" />
        
        {/* 3. Bottom Ambient Warmth (Very Subtle) */}
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-slate-100/50 blur-[80px] rounded-full" />
      </div>

      <div className="container relative z-10 mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12 max-w-7xl space-y-8 sm:space-y-10 md:space-y-16">
        {/* 페이지 헤더 */}
        <div className="text-center relative">
          <h1 className="text-senior-title bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-green-800 to-green-600 drop-shadow-sm pb-1">
            어떻게 치료 받나요?
          </h1>
          <p className="mt-3 text-lg font-medium text-gray-900">
            막막하시죠? 차근차근 따라해 보세요
          </p>

          {/* 비디오 가이드 버튼 - 항상 접근 가능, 우측 정렬 */}
          <div className="mt-4 sm:mt-6 flex justify-end">
            <VideoGuideButton>전체 과정 영상 보기</VideoGuideButton>
          </div>
        </div>

        {/* 첫 방문 안내 배너 */}
        <FirstVisitBanner />

        {/* 타임라인 컨테이너 */}
        <TimelineContainer stages={stages} currentStepNumber={currentStepNumber} />

        {/* 법적 고지 (하단) */}
        <LegalNotice />
      </div>
    </div>
  );
}

