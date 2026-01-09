"use client";

import React from "react";

export default function DesignTestPage() {
  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] text-[#111827] pb-20">
      {/* 
        1. Background Layer 
        - 기존의 노이즈/종이 질감 제거
        - 은은한 Mesh Gradient로 '빛' 표현
      */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-green-200/40 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-orange-100/40 blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-md mx-auto min-h-screen bg-white/30 backdrop-blur-sm border-x border-white/50 shadow-2xl shadow-gray-200/50">
        
        {/* Header: Clean & Trust */}
        <header className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between bg-white/70 backdrop-blur-md border-b border-white/50">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold tracking-widest text-green-700 uppercase">ReWork Care</span>
            {/* Paperozi는 로고/강조용으로만 제한적 사용 */}
            <h1 className="text-xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'var(--font-brand)' }}>
              내 주변 치료찾기
            </h1>
          </div>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-100/50 active:scale-95 transition-all">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </header>

        <main className="px-5 pt-6 space-y-8">
          
          {/* Section 1: Concept Explanation */}
          <section>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-white to-green-50/50 border border-white shadow-[0_8px_20px_rgba(20,83,45,0.06)]">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Modern Healing Concept</h2>
              <p className="text-[15px] leading-relaxed text-gray-600 font-medium">
                종이 질감 대신 <span className="text-green-700 font-bold bg-green-100/50 px-1 rounded">빛과 흐림(Light & Blur)</span>을 사용하여 
                더 전문적이고 깨끗한 의료 서비스 경험을 제공합니다.
              </p>
            </div>
          </section>

          {/* Section 2: Card Comparison */}
          <section className="space-y-4">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-1">Card Design Comparison</h2>
            
            {/* Old Style Simulation */}
            <div className="opacity-60 grayscale-[0.5] scale-95 origin-left">
               <div className="text-xs text-center mb-1 text-gray-400">Current (Paper Texture)</div>
               <div className="bg-[#FFFDF5] p-5 rounded-lg border border-orange-100 shadow-md relative overflow-hidden">
                  {/* Noise simulation */}
                  <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                  <h3 className="font-serif text-xl mb-1 relative z-10" style={{ fontFamily: 'var(--font-brand)' }}>서울재활병원</h3>
                  <p className="text-sm text-gray-600 relative z-10">서울특별시 은평구 갈현로 11길</p>
               </div>
            </div>

            {/* New Style */}
            <div>
              <div className="text-xs text-center mb-1 text-green-600 font-bold">New (Soft Gradient & Blur)</div>
              {/* Card Container */}
              <div className="group relative bg-white/80 backdrop-blur-xl p-6 rounded-[24px] border border-white shadow-[0_12px_30px_-10px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_-10px_rgba(20,83,45,0.1)] transition-all duration-300 transform hover:-translate-y-1">
                
                {/* Status Badge */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-green-100/80 text-green-700 text-[11px] font-bold tracking-tight border border-green-200/50">
                      정상진료중
                    </span>
                    <span className="px-3 py-1 rounded-full bg-gray-100/80 text-gray-600 text-[11px] font-bold tracking-tight border border-gray-200/50">
                      1.2km
                    </span>
                  </div>
                  <button className="text-gray-400 hover:text-red-500 transition-colors">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                  </button>
                </div>

                {/* Content */}
                <div className="space-y-1">
                  <h3 className="text-[22px] font-bold text-gray-900 leading-tight">
                    서울재활병원
                  </h3>
                  <p className="text-[15px] font-medium text-gray-500">
                    재활의학과 · 물리치료 전문
                  </p>
                </div>

                <div className="mt-5 flex items-center gap-3 text-sm text-gray-500">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span>은평구 갈현로 11길 30</span>
                </div>

                {/* Call to Action - Big & Accessible */}
                <button className="mt-5 w-full h-[52px] bg-green-700 hover:bg-green-800 text-white rounded-xl font-bold text-lg shadow-lg shadow-green-900/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  전화 상담하기
                </button>
              </div>
            </div>
          </section>
        
          {/* Section 3: Bottom Sheet Preview */}
          <section className="pt-10">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-1 mb-4">Bottom Sheet Interaction</h2>
            <div className="relative h-[200px] bg-gray-100 rounded-3xl overflow-hidden border border-gray-200">
                <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/126.9780,37.5665,14,0/600x400?access_token=YOUR_TOKEN')] bg-cover opacity-50 grayscale"></div>
                <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[24px] shadow-[0_-8px_30px_rgba(0,0,0,0.1)] p-4 transform translate-y-2">
                    <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />
                    <div className="space-y-4">
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            <span className="flex-shrink-0 px-4 py-2 bg-green-700 text-white rounded-full text-sm font-bold shadow-md shadow-green-900/10">전체</span>
                            <span className="flex-shrink-0 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-full text-sm font-bold">정형외과</span>
                            <span className="flex-shrink-0 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-full text-sm font-bold">재활의학과</span>
                        </div>
                    </div>
                </div>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
