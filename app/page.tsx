import Image from "next/image";

import HeroSection from "@/components/landing/HeroSection";
import FeatureCard from "@/components/landing/FeatureCard";
import CTAButton from "@/components/landing/CTAButton";

import StatsSection from "@/components/landing/StatsSection";

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <>
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Stats Section */}
      <StatsSection />

      {/* 3. Features Container */}
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Feature A: Compensation Report */}
        <FeatureCard
          title={<>나에게 맞는 <span className="text-primary underline decoration-green-300 underline-offset-4 decoration-4">보상 항목</span>, 한눈에 확인하세요</>}
          description={<>치료비와 휴업급여 외에도 챙겨야 할 항목이 많습니다. <span className="font-bold text-gray-900">장해급여, 재취업 교육</span> 등 단계별로 받을 수 있는 <span className="text-primary font-bold">다양한 지원 제도</span>를 놓치지 않게 안내해 드립니다.</>}
          imageSrc="/landing/compensation-preview-v3.png"
          imageAlt="산재 보상금 리포트 예시 화면"
          linkHref="/compensation/guide"
          linkText="맞춤 보상 리포트 보기"
          delay={0.2}
        />

        {/* Feature B: Timeline */}
        <FeatureCard
          title={<>복잡한 절차, <span className="text-primary underline decoration-green-300 underline-offset-4 decoration-4">현재 나의 단계</span>를 확인하세요</>}
          description={<>내가 지금 어디쯤 와있는지 막막하신가요? 사고부터 치료, 보상, 복귀까지. 앞으로 남은 과정과 해야 할 일을 <span className="text-primary font-bold">단계별 타임라인</span>으로 명확하게 보여드립니다.</>}
          imageSrc="/landing/timeline-preview-v2.png"
          imageAlt="산재 절차 타임라인 예시 화면"
          linkHref="/timeline"
          linkText="나의 진행 단계 확인하기"
          reversed={true}
          delay={0.2}
        />

        {/* Feature C: Hospital Map */}
        <FeatureCard
          title={<><span className="text-primary underline decoration-green-300 underline-offset-4 decoration-4">집 근처 산재 병원</span>, 필터로 찾으세요</>}
          description={<>아픈 몸을 이끌고 아무 병원이나 갈 수 없습니다. 내 위치 주변의 <span className="text-primary font-bold">산재 지정 의료기관</span>만 쏙 뽑아 보여드립니다. 진료 시간부터 재활 시설 유무까지 꼼꼼하게 따져보세요.</>}
          imageSrc="/landing/map-preview-v5.png"
          imageAlt="병원 찾기 지도 및 필터 화면"
          linkHref="/hospitals"
          linkText="내 주변 산재 병원 찾기"
          delay={0.2}
        />
        
         {/* Feature D: Documents */}
         <FeatureCard
          title={<>필요한 서류, <span className="text-primary underline decoration-green-300 underline-offset-4 decoration-4">검색 한번</span>으로 찾으세요</>}
          description={<>어렵고 낯선 산재 서류 때문에 더 이상 헤매지 마세요. 검색만 하면 필요한 <span className="text-primary font-bold">필수 서류 양식</span>과 <span className="text-gray-900 font-bold">작성 예시</span>가 바로 나옵니다.</>}
          imageSrc="/landing/docs-preview-v3.png"
          imageAlt="서류 검색 및 다운로드 화면"
          linkHref="/documents"
          linkText="필수 서류 찾아보기"
          reversed={true}
          delay={0.2}
        />

      </div>

      {/* 3. Bottom CTA Section */}
      <section className="relative w-screen left-[calc(-50vw+50%)] py-32 overflow-hidden flex items-center justify-center">
         {/* Background Image */}
         <div className="absolute inset-0 z-0">
            <Image
              src="/landing/hero-handshake.png"
              alt="따뜻한 지원 배경"
              fill
              className="object-cover opacity-60"
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />
         </div>

         <div className="container mx-auto px-4 relative z-10 text-center">
           <div className="space-y-10 max-w-4xl mx-auto">
             
             <h2 className="text-2xl sm:text-3xl md:text-6xl font-extrabold text-white leading-tight tracking-tight drop-shadow-lg">
               나에게 필요한 산재 정보,<br/>
               <span className="text-[#4ADE80]">개인 대시보드</span>에 다 모았습니다.
             </h2>
             
             <p className="text-gray-200 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-md">
               여기저기 찾아다니지 마세요. 회원가입만 하면 꼭 필요한 정보를<br className="hidden md:block"/>
               <span className="font-bold text-white">한눈에 정리해</span> 보여드립니다.
             </p>
             
             <div className="pt-8">
               <CTAButton href="/chatbot-v2" variant="primary" className="text-lg px-8 py-4 md:text-xl md:px-12 md:py-6 shadow-2xl hover:shadow-white/20 hover:-translate-y-1 rounded-2xl">
                 산재 AI 무료로 사용하기
               </CTAButton>
             </div>
           </div>
         </div>
      </section>
    </>
  );
}
