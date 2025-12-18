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
export default async function CounselingPage() {
  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12 max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl space-y-8 sm:space-y-10 md:space-y-12 lg:space-y-16">
      {/* 페이지 헤더 */}
      <div className="text-center relative">
        <h1 className="text-senior-title">
          마음의 휴식 공간
        </h1>
        <p className="mt-4 sm:mt-6 text-senior-body text-muted-foreground">
          산재로 인한 심리적 부담감을 완화하고, 마음을 편안하게 해드립니다
        </p>
      </div>

      {/* 법적 고지 */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 sm:p-6">
        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          <strong className="font-semibold text-amber-800">※ 법적 고지</strong>
          <br />
          본 서비스는 전문 의료 서비스가 아닙니다. 심각한 우울, 자해 생각 등 위기 상황에서는 반드시 전문가 상담을 받으시기 바랍니다.
          <br />
          <strong className="font-semibold text-amber-800">위기 상황 신고</strong>: 생명의 전화 1588-9191, 자살예방 상담전화 1393
        </p>
      </div>

      {/* 섹션 1: AI 심리 상담 채팅 */}
      <section className="space-y-4 sm:space-y-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-1 h-6 sm:h-8 bg-primary rounded-full"></div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
            AI 심리 상담
          </h2>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground">
          마음의 고민을 편하게 이야기해보세요. 공감과 지지를 바탕으로 상담을 제공합니다.
        </p>
        <PsychologicalChatbot />
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
    </div>
  );
}

