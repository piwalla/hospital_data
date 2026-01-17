'use client';

import { useState, useEffect } from 'react';
import HeroSection from "@/components/landing/HeroSection";
import StatsSection from "@/components/landing/StatsSection";
import FeatureCard from "@/components/landing/FeatureCard";
import CTAButton from "@/components/landing/CTAButton";
import { Locale, landingTranslations } from "@/lib/i18n/config";
import Image from "next/image";
import { Info } from "lucide-react";

export default function LandingClient() {
  const [selectedLocale, setSelectedLocale] = useState<Locale>('ko');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLocale = localStorage.getItem('user_locale') as Locale;
    if (savedLocale) setSelectedLocale(savedLocale);

    const handleLocaleUpdate = () => {
      const updated = localStorage.getItem('user_locale') as Locale;
      if (updated) {
        setSelectedLocale(updated);
      }
    };

    window.addEventListener('storage', handleLocaleUpdate);
    window.addEventListener('localeChange', handleLocaleUpdate);

    return () => {
      window.removeEventListener('storage', handleLocaleUpdate);
      window.removeEventListener('localeChange', handleLocaleUpdate);
    };
  }, []);

  const t = landingTranslations[selectedLocale];

  if (!mounted) return null;

  return (
    <div className="relative">

      {/* Hero Section */}
      <HeroSection locale={selectedLocale} />

      {/* Stats Section */}
      <StatsSection locale={selectedLocale} />

      {/* Features Container */}
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Feature 1: Compensation Report */}
        <FeatureCard
          title={t.feature1Title}
          description={t.feature1Desc}
          imageSrc="/landing/compensation-preview-v3.png"
          imageAlt="Compensation Report Preview"
          linkHref="/compensation/guide"
          linkText={t.feature1Cta}
          delay={0.2}
          locale={selectedLocale}
        />

        {/* Feature 2: Timeline */}
        <FeatureCard
          title={t.feature2Title}
          description={t.feature2Desc}
          imageSrc="/landing/timeline-preview-v2.png"
          imageAlt="Timeline Preview"
          linkHref="/timeline"
          linkText={t.feature2Cta}
          reversed={true}
          delay={0.2}
          locale={selectedLocale}
        />

        {/* Feature 3: Hospital Map */}
        <FeatureCard
          title={t.feature3Title}
          description={t.feature3Desc}
          imageSrc="/landing/map-preview-v5.png"
          imageAlt="Hospital Map Preview"
          linkHref="/hospitals"
          linkText={t.feature3Cta}
          delay={0.2}
          locale={selectedLocale}
        />
        
         {/* Feature 4: Documents */}
         <FeatureCard
          title={t.feature4Title}
          description={t.feature4Desc}
          imageSrc="/landing/docs-preview-v3.png"
          imageAlt="Documents Search Preview"
          linkHref="/documents"
          linkText={t.feature4Cta}
          reversed={true}
          delay={0.2}
          locale={selectedLocale}
        />
      </div>

      {/* Bottom CTA Section */}
      <section className="relative w-screen left-[calc(-50vw+50%)] py-32 overflow-hidden flex items-center justify-center">
         {/* Background Image */}
         <div className="absolute inset-0 z-0">
            <Image
              src="/landing/hero-handshake.png"
              alt="Background"
              fill
              className="object-cover opacity-60"
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />
         </div>

         <div className="container mx-auto px-4 relative z-10 text-center text-white">
           <div className="space-y-10 max-w-4xl mx-auto">
             
              <h2 className="text-3xl sm:text-4xl md:text-7xl font-extrabold leading-tight tracking-tight drop-shadow-lg">
                {t.bottomTitlePrefix}<br/>
                <span className="text-[#4ADE80]">{t.bottomTitleSuffix}</span>
              </h2>
             
              <p className="text-gray-200 text-xl md:text-3xl max-w-3xl mx-auto leading-relaxed font-medium drop-shadow-md">
                {t.bottomDescription}
              </p>
             
             <div className="pt-8">
                <CTAButton href="/chatbot-v2" variant="primary" className="text-lg px-8 py-4 md:text-2xl md:px-14 md:py-7 shadow-2xl hover:shadow-white/20 hover:-translate-y-1 rounded-2xl">
                  {t.bottomCta}
                </CTAButton>
             </div>

             {/* Nuance Disclaimer and Image Notice */}
             {selectedLocale !== 'ko' && (
               <div className="pt-16 max-w-2xl mx-auto space-y-4">
                  <div className="flex items-start gap-3 justify-center text-sm text-gray-400 bg-black/30 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                     <Info className="w-5 h-5 shrink-0 mt-0.5" />
                     <div className="text-left space-y-2">
                        <p className="leading-relaxed whitespace-pre-wrap">
                          {t.nuanceDisclaimer}
                        </p>
                        <p className="text-xs opacity-70">
                          * {t.imageNotice}
                        </p>
                     </div>
                  </div>
               </div>
             )}
           </div>
         </div>
      </section>
    </div>
  );
}
