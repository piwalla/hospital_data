/**
 * @file page.tsx
 * @description 서비스 소개 페이지
 * 
 * 리워크케어의 기획 배경, 기술 스택, 제작 동기를 소개하는 페이지입니다.
 */

import Image from "next/image";
import { 
  Bot, 
  MapPin, 
  FileText, 
  Calculator, 
  HeartHandshake, 
  Stethoscope, 
  Brain, 
  Search,
  Sparkles,
  Database,
  Lock,
  Code2
} from "lucide-react";

export default function AboutPage() {
  const solutions = [
    {
      title: "AI 산재 상담 파트너",
      description: "최신 산재 법령과 판례 등 수천 페이지의 문서를 학습한 AI(RAG 기술)가 24시간 당신의 궁금증을 해결해 드립니다. \"휴업급여는 언제 들어오나요?\", \"전원하려면 어떻게 해야 하나요?\" 등 편하게 물어보세요.",
      icon: Bot,
      color: "text-blue-600 bg-blue-50",
    },
    {
      title: "검증된 산재 병원 찾기",
      description: "아무 병원이나 가지 마세요. 근로복지공단이 인증한 '재활인증의료기관' 데이터를 기반으로, 내 주변의 믿을 수 있는 병원을 지도에서 바로 찾아드립니다.",
      icon: Stethoscope,
      color: "text-green-600 bg-green-50",
    },
    {
      title: "안심 휴업급여 계산기",
      description: "치료받는 동안 생활비 걱정이 크시죠? 복잡한 계산식은 몰라도 됩니다. 평균임금만 입력하면 예상 휴업급여를 즉시 계산해 드려, 미래를 계획할 수 있게 돕습니다.",
      icon: Calculator,
      color: "text-orange-600 bg-orange-50",
    },
    {
      title: "단계별 맞춤 가이드",
      description: "산재 신청부터 요양, 장해 심사, 그리고 직귀 복귀까지. 내가 지금 어느 단계에 있고, 다음에 무엇을 준비해야 하는지 명확한 로드맵을 제시합니다.",
      icon: MapPin,
      color: "text-purple-600 bg-purple-50",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl space-y-20">
      
      {/* 1. Hero Section: 공감과 문제 제기 */}
      <section className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
          <HeartHandshake className="w-4 h-4" />
          <span>산재 근로자와 가족을 위한 이야기</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight word-keep leading-tight">
          &quot;막막했던 산재,<br className="hidden sm:block" />이제는 <span className="text-primary">AI와 함께</span> 안심하세요.&quot;
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed word-keep">
          갑작스러운 사고, 복잡한 서류, 낯선 법률 용어...<br/>
          혼자 감당하기엔 너무나 벅찬 과정임을 누구보다 잘 알고 있습니다.
        </p>
      </section>

      {/* 2. Story Section: 기획 의도 (Real Story) */}
      <section className="bg-white border border-slate-100 rounded-3xl p-8 md:p-12 shadow-sm">
        <div className="flex flex-col md:flex-row gap-10 items-center">
          <div className="flex-1 space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              왜 리워크케어를 만들었나요?
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed text-lg">
              <p>
                저 또한 산재로 2년이 넘는 시간 동안 병원에서 치료를 받았습니다.
                몸이 아픈 것도 힘들었지만, <strong className="text-foreground bg-yellow-100 px-1">&quot;다음에 뭘 해야 하지?&quot;</strong>라는 막막함이 가장 큰 고통이었습니다.
              </p>
              <p>
                병원 로비에 앉아 수많은 서류를 붙들고 헤매던 날들, 
                인터넷의 부정확한 정보에 불안했던 밤들을 기억합니다.
              </p>
              <p className="font-medium text-foreground">
                &quot;누군가 옆에서 차근차근 알려준다면 얼마나 좋을까?&quot;
              </p>
              <p>
                그 간절했던 마음으로 리워크케어를 시작했습니다.
                제가 겪은 시행착오를 다른 분들은 겪지 않기를 바라는 마음을 담았습니다.
              </p>
            </div>
          </div>
          <div className="w-full md:w-5/12 aspect-square relative rounded-2xl overflow-hidden shadow-lg border border-slate-200">
            {/* 감성적인 이미지 배치 */}
             <Image
                src="/Gemini_Generated_Image_wq6kzmwq6kzmwq6k%20(1).png"
                alt="산재 환자의 회복을 돕는 따뜻한 기술"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
          </div>
        </div>
      </section>

      {/* 3. Tech & Features Section: 해결책 */}
      <section className="space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl font-bold text-foreground">
            기술로 따뜻함을 전합니다
          </h2>
          <p className="text-slate-600 text-lg">
            최첨단 AI 기술과 데이터가 만나, 가장 쉬운 언어로 당신을 돕습니다.<br/>
            리워크케어가 제공하는 4가지 핵심 솔루션을 확인해보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {solutions.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="group bg-white p-8 rounded-2xl border border-slate-200 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${item.color}`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. AI Technology Highlight */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 md:p-16 text-center space-y-8 relative overflow-hidden">
        {/* 장식용 배경 요소 */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-300 font-medium text-sm backdrop-blur-sm border border-white/5">
            <Sparkles className="w-4 h-4" />
            <span>Powered by Google Gemini & RAG</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight">
            AI가 당신의 전담 매니저가 됩니다
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed">
            리워크케어의 인공지능은 단순히 정해진 답변만 하는 챗봇이 아닙니다.<br/>
            당신의 상황을 이해하고, 수천 건의 산재 데이터와 법률 정보를 실시간으로 분석하여
            <br className="hidden md:block"/>가장 정확하고 개인화된 가이드를 제공합니다.
          </p>
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10">
              <Brain className="w-6 h-6 text-blue-400 mb-2" />
              <div className="font-bold mb-1">복잡한 문서 분석</div>
              <div className="text-sm text-slate-400">어려운 법률 용어를 쉬운 말로 번역</div>
            </div>
            <div className="bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10">
              <Search className="w-6 h-6 text-green-400 mb-2" />
              <div className="font-bold mb-1">정확한 정보 검색</div>
              <div className="text-sm text-slate-400">RAG 기술로 할루시네이션 최소화</div>
            </div>
            <div className="bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10">
              <FileText className="w-6 h-6 text-purple-400 mb-2" />
              <div className="font-bold mb-1">서류 작성 보조</div>
              <div className="text-sm text-slate-400">빈칸 채우기부터 제출까지 완벽 가이드</div>
            </div>
          </div>

          {/* Tech Stack Grid */}
          <div className="pt-12 border-t border-white/10 mt-12">
            <h3 className="text-xl font-bold mb-8 opacity-90">사용된 핵심 기술</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-left">
              {/* Next.js 15 */}
              <div className="bg-white/5 p-5 rounded-xl backdrop-blur-sm border border-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-2 mb-2 text-white">
                  <Code2 className="w-5 h-5 text-white/80" />
                  <span className="font-bold text-lg">Next.js 15</span>
                </div>
                <p className="text-sm text-slate-400">React 기반 풀스택 프레임워크</p>
              </div>

              {/* Supabase */}
              <div className="bg-white/5 p-5 rounded-xl backdrop-blur-sm border border-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-2 mb-2 text-green-400">
                  <Database className="w-5 h-5" />
                  <span className="font-bold text-lg text-white">Supabase</span>
                </div>
                <p className="text-sm text-slate-400">PostgreSQL 데이터베이스 및 백엔드</p>
              </div>

              {/* Google Gemini AI */}
              <div className="bg-white/5 p-5 rounded-xl backdrop-blur-sm border border-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-2 mb-2 text-blue-400">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-bold text-lg text-white">Google Gemini AI</span>
                </div>
                <p className="text-sm text-slate-400">AI 기반 서류 가이드 생성</p>
              </div>

              {/* RAG */}
              <div className="bg-white/5 p-5 rounded-xl backdrop-blur-sm border border-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-2 mb-2 text-purple-400">
                  <Brain className="w-5 h-5" />
                  <span className="font-bold text-lg text-white">RAG</span>
                </div>
                <p className="text-sm text-slate-400">Supabase Vector 기반 AI 산재 상담</p>
              </div>

              {/* Naver Maps API */}
              <div className="bg-white/5 p-5 rounded-xl backdrop-blur-sm border border-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-2 mb-2 text-green-500">
                  <MapPin className="w-5 h-5" />
                  <span className="font-bold text-lg text-white">Naver Maps API</span>
                </div>
                <p className="text-sm text-slate-400">위치 기반 병원 정보 시각화</p>
              </div>

              {/* Clerk */}
              <div className="bg-white/5 p-5 rounded-xl backdrop-blur-sm border border-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-2 mb-2 text-indigo-400">
                  <Lock className="w-5 h-5" />
                  <span className="font-bold text-lg text-white">Clerk</span>
                </div>
                <p className="text-sm text-slate-400">사용자 인증 및 관리</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Vision / Closing */}
      <section className="text-center space-y-8 py-8">
        <h2 className="text-2xl font-bold text-foreground">
          산재는 끝이 아니라, <br/>
          <span className="text-primary relative inline-block">
            다시 일어서는 시작
            <svg className="absolute w-full h-2 bottom-0 left-0 text-primary/20 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="10" fill="none" />
            </svg>
          </span>
          입니다
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          리워크케어는 당신이 치료와 회복에만 온전히 집중할 수 있도록,<br/>
          복잡한 절차라는 짐을 대신 짊어지겠습니다.<br/>
          건강하게 일상으로 돌아가는 그날까지 함께하겠습니다.
        </p>
      </section>

    </div>
  );
}
