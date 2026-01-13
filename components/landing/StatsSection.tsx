"use client";

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

function AnimatedCounter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  
  const numericValue = parseInt(value.replace(/[^0-9]/g, "")) || 0;
  const suffix = value.replace(/[0-9,]/g, "");

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 30, damping: 15 });

  useEffect(() => {
    if (inView) {
      motionValue.set(numericValue);
    }
  }, [inView, numericValue, motionValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.floor(latest).toLocaleString() + suffix;
      }
    });
  }, [springValue, suffix]);

  return <span ref={ref} className="inline-block tabular-nums">{0 + suffix}</span>;
}
interface StatItemProps {
  imageSrc: string;
  value: string;
  label: string;
  description: string;
  delay?: number;
}

function StatCard({ imageSrc, value, label, description }: StatItemProps) {
  return (
    <div 
      className="flex flex-col items-center justify-center text-center p-4 md:p-8 bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 z-10 h-full"
    >
      <div className="mb-6 shrink-0 z-10">
        <Image 
          src={imageSrc} 
          alt={label} 
          width={96}
          height={96}
          className="object-contain drop-shadow-xl transition-transform duration-300 hover:scale-110"
        />
      </div>
      
      <div className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 w-full break-normal">
        <AnimatedCounter value={value} />
      </div>
      <div className="text-lg font-bold text-gray-800 mb-1 w-full break-keep">{label}</div>
      <div className="text-sm text-gray-500 font-medium w-full break-keep">{description}</div>
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
        {/* Background Decoration (Optional, for Glassmorphism contrast) */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-green-100/40 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[100px]" />
        </div>

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16 max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-8">
            &quot;저도 업무 중 사고를 겪었던 <span className="text-primary relative px-1">산재 근로자였습니다<span className="absolute inset-x-0 bottom-1 h-3 bg-green-100 -z-10 opacity-60"></span></span>.&quot;
          </h2>
          
          <div className="relative">
             <div className="text-gray-700 text-lg md:text-xl leading-relaxed font-medium break-keep space-y-2">
               <p>
                 치료만으로도 벅찬 시기에 겪었던 절차의 막막함.<br className="hidden md:block" />
                 <span className="font-bold text-gray-900">&apos;누가 미리 알려줬더라면&apos;</span> 아쉬워했던 정보들을 모았습니다.
               </p>
               <p className="text-gray-600">
                 같은 길을 걷는 분들께 든든한 길잡이가 되겠습니다.
               </p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <StatCard
            imageSrc="/landing/icon-3d-docs-removebg-preview.png"
            value="13+"
            label="서류 안내"
            description="필수 서류 작성 가이드"
          />
          <StatCard
             imageSrc="/landing/icon-3d-video-removebg-preview.png"
            value="15+"
            label="설명 동영상"
            description="쉬운 이해를 돕는 영상"
          />
          <StatCard
            imageSrc="/landing/icon-3d-hospital-removebg-preview.png"
            value="1,800+"
            label="산재 병원"
            description="재활 인증 의료기관"
            delay={0.2}
          />
          <StatCard
            imageSrc="/landing/icon-3d-rehab-center-removebg-preview.png"
            value="3,000+"
            label="재활 기관"
            description="직업훈련 및 재활 시설"
            delay={0.3}
          />
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-green-100 rounded-full shadow-sm">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
            <span className="text-sm font-semibold text-gray-700">
              근로복지공단 공식 데이터 기반
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
