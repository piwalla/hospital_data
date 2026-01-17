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
      
      <div className="text-2xl md:text-5xl font-bold text-gray-900 mb-2 w-full break-normal">
        <AnimatedCounter value={value} />
      </div>
      <div className="text-lg md:text-2xl font-bold text-gray-800 mb-1 w-full break-keep">{label}</div>
      <div className="text-sm md:text-base text-gray-500 font-medium w-full break-keep">{description}</div>
    </div>
  );
}

import { Locale, landingTranslations } from '@/lib/i18n/config';

export default function StatsSection({ locale = 'ko' }: { locale?: Locale }) {
  const t = landingTranslations[locale];

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
        {/* Background Decoration (Optional, for Glassmorphism contrast) */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-green-100/40 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[100px]" />
        </div>

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16 max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight mb-8">
            &quot;{t.statsTitle}&quot;
          </h2>
          
          <div className="relative">
             <div className="text-gray-700 text-lg md:text-2xl leading-relaxed font-medium break-keep space-y-2">
               <p>
                 {t.statsDescription}
               </p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <StatCard
            imageSrc="/landing/icon-3d-docs-removebg-preview.png"
            value="13+"
            label={t.statDocsLabel}
            description={t.statDocsDesc}
          />
          <StatCard
             imageSrc="/landing/icon-3d-video-removebg-preview.png"
            value="15+"
            label={t.statVideoLabel}
            description={t.statVideoDesc}
          />
          <StatCard
            imageSrc="/landing/icon-3d-hospital-removebg-preview.png"
            value="1,800+"
            label={t.statHospitalLabel}
            description={t.statHospitalDesc}
            delay={0.2}
          />
          <StatCard
            imageSrc="/landing/icon-3d-rehab-center-removebg-preview.png"
            value="3,000+"
            label={t.statRehabLabel}
            description={t.statRehabDesc}
            delay={0.3}
          />
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-green-100 rounded-full shadow-sm">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
            <span className="text-sm font-semibold text-gray-700">
              {t.statSource}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
