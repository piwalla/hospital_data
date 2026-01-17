/**
 * @file TimelineStepClient.tsx
 * @description 타임라인 단계 상세 페이지 클라이언트 컴포넌트
 */

'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { cn } from '@/lib/utils';
import TimelineStepContent from '@/components/timeline/TimelineStepContent';
import { timelineTranslations, type Locale, type TimelineTranslation } from '@/lib/i18n/config';
import type { StageWithDetails } from '@/lib/types/timeline';
import LanguageSwitcher from "@/components/common/LanguageSwitcher";

interface TimelineStepClientProps {
  stage: StageWithDetails;
  nextStage?: StageWithDetails;
  prevStage?: StageWithDetails;
  initialTab?: string;
}

export default function TimelineStepClient({ 
  stage, 
  nextStage, 
  prevStage, 
  initialTab 
}: TimelineStepClientProps) {
  // Locale State
  const [locale, setLocale] = useState<Locale>('ko');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 1. localStorage에서 언어 설정 가져오기
    const savedLocale = localStorage.getItem('user_locale') as Locale;
    if (savedLocale && timelineTranslations[savedLocale]) {
      setLocale(savedLocale);
    }

    // 2. 커스텀 이벤트 리스너 등록 (헤더의 언어 변경 감지)
    const handleLocaleChange = () => {
      const updated = localStorage.getItem('user_locale') as Locale;
      if (updated && timelineTranslations[updated]) {
        console.log('TimelineStepClient: Locale changed to:', updated);
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

  const handleManualLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('user_locale', newLocale);
    window.dispatchEvent(new Event('localeChange'));
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-4xl px-4">
          <div className="h-12 bg-gray-200 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded w-2/3"></div>
          <div className="h-64 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  const t: TimelineTranslation = timelineTranslations[locale];
  
  // 번역된 스테이지 정보 가져오기
  const stageKey = stage.step_number as keyof typeof t.stages;
  const translatedStage = t.stages[stageKey];
  
  const title = translatedStage?.title || stage.title;
  const description = translatedStage?.description || stage.description;

  return (
    <div className="min-h-screen bg-[var(--background)] overflow-x-hidden relative">
      {/* 헤더 (모바일 여백 보호) */}
      <div className="sticky top-0 z-10 bg-[var(--background)]">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-4xl w-full">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 pb-4 sm:pb-6">
            <div className={cn(
              "flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full",
              "bg-primary text-primary-foreground",
              "flex items-center justify-center font-bold text-lg sm:text-xl"
            )}>
              {stage.step_number}
            </div>
            <div className="min-w-0">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground font-brand leading-tight break-words">
                {title}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* 단계 설명을 헤더 아래로 분리 표시 */}
      <div className="container mx-auto px-3 sm:px-4 pt-3 sm:pt-4 pb-1 sm:pb-2 max-w-4xl w-full">
        <p className="text-sm sm:text-lg md:text-xl font-semibold text-muted-foreground break-words border-b border-[var(--border-medium)] pb-3">
          {description}
        </p>
      </div>

      {/* 본문 */}
      <div className="container mx-auto px-0 sm:px-4 py-6 sm:py-8 md:py-12 max-w-4xl w-full overflow-x-hidden">
        {/* 클라이언트 컴포넌트로 탭 기능 구현 */}
        <div className="px-0 sm:px-0">
          <TimelineStepContent 
            stage={stage} 
            nextStage={nextStage}
            prevStage={prevStage}
            initialTab={initialTab as 'guide' | 'actions' | 'documents' | 'warnings' | undefined}
            locale={locale}
            t={t}
          />
        </div>
      </div>
    </div>
  );
}
