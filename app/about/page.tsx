/**
 * @file page.tsx
 * @description 서비스 소개 페이지
 * 
 * 리워크케어의 기획 배경, 기술 스택, 제작 동기를 소개하는 페이지입니다.
 */

import Image from "next/image";
import { Code2, Database, Brain, MapPin, FileText, MessageSquare, Sparkles, Search } from "lucide-react";

export default function AboutPage() {
  const techStack = [
    {
      name: "Next.js 15",
      description: "React 기반 풀스택 프레임워크",
      icon: Code2,
      color: "text-black",
    },
    {
      name: "Supabase",
      description: "PostgreSQL 데이터베이스 및 백엔드",
      icon: Database,
      color: "text-green-500",
    },
    {
      name: "Google Gemini AI",
      description: "AI 기반 서류 가이드 생성",
      icon: Brain,
      color: "text-blue-500",
    },
    {
      name: "RAG (Retrieval-Augmented Generation)",
      description: "Supabase Vector Store 기반 AI 산재 상담",
      icon: Search,
      color: "text-orange-500",
    },
    {
      name: "Naver Maps API",
      description: "위치 기반 병원 정보 시각화",
      icon: MapPin,
      color: "text-green-600",
    },
    {
      name: "Clerk",
      description: "사용자 인증 및 관리",
      icon: Sparkles,
      color: "text-purple-500",
    },
  ];

  const features = [
    {
      title: "산재 절차 진행 과정 안내",
      description: "복잡한 산재 절차를 단계별로 쉽게 이해할 수 있도록 안내합니다.",
      icon: FileText,
    },
    {
      title: "산재 지정 병원 및 재활기관 찾기",
      description: "내 위치 주변의 산재 지정 의료기관을 지도로 쉽게 찾을 수 있습니다.",
      icon: MapPin,
    },
    {
      title: "필수 서류 작성 가이드",
      description: "AI가 각 서류의 작성 방법을 쉽게 설명해드립니다.",
      icon: FileText,
    },
    {
      title: "AI 기반 산재 상담 (RAG)",
      description: "RAG 기술을 활용하여 정확한 정보를 검색하고, 궁금한 점을 AI에게 물어보고 즉시 답변을 받을 수 있습니다.",
      icon: MessageSquare,
    },
  ];

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12 max-w-7xl space-y-8 sm:space-y-10 md:space-y-16">
      {/* 페이지 헤더 */}
      <div className="text-center relative">
        <h1 className="text-senior-title">
          리워크케어를 소개합니다
        </h1>
        <p className="mt-4 sm:mt-6 text-senior-body text-muted-foreground">
          AI기술을 활용해 산재 환자와 가족을 위한 정보를 제공합니다.
        </p>
      </div>

      {/* 기획 배경 */}
      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">왜 리워크케어를 만들었나요?</h2>
        
        <div className="bg-gray-50 rounded-xl p-6 sm:p-8 space-y-4">
          <div className="prose prose-sm sm:prose-base max-w-none">
            <p className="text-base sm:text-lg text-foreground leading-relaxed">
              저는 실제로 <strong className="font-semibold">산재로 2년 넘게 치료를 받았습니다</strong>. 그 과정에서 많은 불편함과 어려움을 직접 경험했습니다.
            </p>
            
            <div className="mt-6 space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold text-foreground">경험한 불편함들</h3>
              <ul className="space-y-3 text-base sm:text-lg text-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>어떤 서류를 언제 제출해야 하는지 알기 어려웠습니다</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>산재 지정 병원을 찾는 것이 쉽지 않았습니다</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>복잡한 서류 작성 방법을 이해하기 어려웠습니다</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>산재 절차가 어디까지 진행되었는지 파악하기 힘들었습니다</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-base sm:text-lg text-foreground leading-relaxed">
                이런 불편함을 <strong className="font-semibold">AI 기술을 활용해 개선</strong>하고 싶어서 리워크케어 프로젝트를 시작했습니다. 
                제가 겪었던 어려움을 다른 산재 환자와 가족들이 겪지 않도록, 쉽고 명확한 정보를 제공하는 것이 목표입니다.
              </p>
            </div>
          </div>

          {/* 사진 영역 (placeholder) */}
          <div className="mt-8 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
            <div className="relative w-full aspect-video">
              <Image
                src="/Gemini_Generated_Image_wq6kzmwq6kzmwq6k%20(1).png"
                alt="AI를 통해 복잡한 서류를 정리하고 산재 환자를 돕는 리워크케어 서비스 이미지"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* 기술 스택 */}
      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">사용한 기술</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {techStack.map((tech) => {
            const Icon = tech.icon;
            return (
              <div
                key={tech.name}
                className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${tech.color}`} />
                  <h3 className="text-base sm:text-lg font-semibold text-foreground">
                    {tech.name}
                  </h3>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {tech.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 주요 기능 */}
      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">주요 기능</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 비전 */}
      <section className="bg-primary/5 rounded-xl p-6 sm:p-8 space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">리워크케어의 비전</h2>
        <p className="text-base sm:text-lg text-foreground leading-relaxed">
          산재 환자와 가족들이 복잡한 절차와 서류 작성에 시간을 낭비하지 않고, 
          치료와 회복에만 집중할 수 있도록 돕는 것이 리워크케어의 목표입니다.
        </p>
        <p className="text-base sm:text-lg text-foreground leading-relaxed">
          AI 기술을 통해 누구나 쉽게 이해할 수 있는 정보를 제공하고, 
          산재 환자들이 자신의 권리를 제대로 행사할 수 있도록 지원하겠습니다.
        </p>
      </section>
    </div>
  );
}

