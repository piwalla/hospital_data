import PsychologicalChatbot from '@/components/counseling/PsychologicalChatbot';
import MediaSection from '@/components/counseling/MediaSection';
import { RELAXATION_MUSIC, MOOD_BOOST_VIDEOS } from '@/lib/data/counseling-content';

/**
 * @file page.tsx
 * @description 심리 상담 페이지
 * 
 * 산재 환자의 심리적 부담감 완화를 위한 종합 지원 페이지입니다.
 * AI 기반 심리 상담 채팅, 릴렉스 음악, 기분전환 영상을 제공합니다.
 */
import CounselingHero from '@/components/counseling/CounselingHero';

// ... (existing imports)

export default async function CounselingPage() {
  return (
    <div className="relative min-h-screen">
      {/* 프리미엄 Full-bleed 배경 */}
      <div className="absolute inset-0 w-screen left-[calc(-50vw+50%)] bg-[#eff2f5] -z-10" />

      <div className="container mx-auto px-0 max-w-7xl">
        <CounselingHero />
        
        <div className="px-4 sm:px-6 pb-20 space-y-12 sm:space-y-16">
          
          {/* 섹션 1: AI 심리 상담 채팅 */}
          <section className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-1 h-6 sm:h-8 bg-primary rounded-full"></div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground tracking-tight">
                힘들었던 오늘, 당신의 이야기를 들려주세요
              </h2>
            </div>

            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-white overflow-hidden">
               <PsychologicalChatbot />
            </div>
          </section>

          {/* 섹션 2: 릴렉스 음악 */}
          <section className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-1 h-6 sm:h-8 bg-primary rounded-full"></div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
                릴렉스 음악
              </h2>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">
              마음을 진정시키고 편안함을 느낄 수 있는 음악을 들어보세요.
            </p>
            <MediaSection contents={RELAXATION_MUSIC} />
          </section>

          {/* 섹션 3: 기분전환 영상 */}
          <section className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-1 h-6 sm:h-8 bg-primary rounded-full"></div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
                기분전환 영상
              </h2>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">
              하루의 피로를 풀고 기분을 전환시켜주는 영상을 감상해보세요.
            </p>
            <MediaSection contents={MOOD_BOOST_VIDEOS} />
          </section>

          {/* 법적 고지 */}
          <div className="bg-white/60 backdrop-blur-md border border-white rounded-3xl p-6 shadow-lg shadow-gray-200/30">
            <p className="text-sm text-foreground/80 leading-relaxed">
              <strong className="font-semibold text-rose-600">※ 법적 고지</strong>
              <br />
              본 서비스는 전문 의료 서비스가 아닙니다. 심각한 우울, 자해 생각 등 위기 상황에서는 반드시 전문가 상담을 받으시기 바랍니다.
              <br />
              <strong className="font-semibold text-rose-600">위기 상황 신고</strong>: 생명의 전화 1588-9191, 자살예방 상담전화 1393
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


