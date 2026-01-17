"use client";

import { useState, useEffect } from 'react';
import { Locale, locales, timelineTranslations } from "@/lib/i18n/config";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import TimelineHero from '@/components/timeline/TimelineHero';
import TimelineContainer from '@/components/timeline/TimelineContainer';
import LegalNotice from '@/components/timeline/LegalNotice';
import VideoGuideButton from '@/components/timeline/VideoGuideButton';
import type { StageWithDetails } from '@/lib/types/timeline';

interface TimelineClientProps {
  initialStages: StageWithDetails[];
  initialStepNumber?: number;
}

export default function TimelineClient({ initialStages, initialStepNumber }: TimelineClientProps) {
  const [locale, setLocale] = useState<Locale>('ko');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLocale = localStorage.getItem('user_locale') as Locale;
    if (savedLocale && locales.includes(savedLocale)) {
      setLocale(savedLocale);
    }

    const handleLocaleChange = () => {
      const updated = localStorage.getItem('user_locale') as Locale;
      if (updated && locales.includes(updated)) {
        setLocale(updated);
      }
    };

    window.addEventListener('localeChange', handleLocaleChange);
    window.addEventListener('storage', handleLocaleChange);

    return () => {
      window.removeEventListener('localeChange', handleLocaleChange);
      window.removeEventListener('storage', handleLocaleChange);
    };
  }, []);

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('user_locale', newLocale);
    window.dispatchEvent(new Event('localeChange'));
  };

  if (!mounted) {
    // SSR fallback or skeleton could go here
    return (
      <div className="container mx-auto px-0 max-w-7xl animate-pulse">
        <div className="h-64 bg-slate-200 rounded-xl mb-8"></div>
      </div>
    );
  }

  const t = timelineTranslations[locale];

  return (
    <div className="container mx-auto px-0 max-w-7xl relative">

      <TimelineHero locale={locale} t={t} />

      <div className="relative w-[calc(100%+2rem)] -mx-4 md:w-screen md:left-[calc(-50vw+50%)] md:mx-0 bg-[#eff2f5] py-8 md:py-16 -mt-12 sm:-mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 md:space-y-16">
          
          <div className="space-y-6">
            <div className="flex justify-end">
              <VideoGuideButton locale={locale} t={t}>
                {t.videoBtn}
              </VideoGuideButton>
            </div>
          </div>

          <TimelineContainer 
            stages={initialStages} 
            currentStepNumber={initialStepNumber} 
            locale={locale}
            t={t}
          />

          <div className="pb-10">
            <LegalNotice title={t.legalTitle} content={t.legalNotice} />
          </div>
        </div>
      </div>
    </div>
  );
}
