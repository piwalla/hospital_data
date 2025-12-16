/**
 * @file FirstVisitBanner.tsx
 * @description 첫 방문 안내 배너 컴포넌트
 * 
 * 초보자를 위한 안내 메시지를 표시합니다.
 * localStorage를 사용하여 "다시 보지 않기" 기능을 제공합니다.
 */

'use client';

import { useState, useEffect } from 'react';
import { X, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VideoGuideButton from './VideoGuideButton';

const STORAGE_KEY = 'timeline-first-visit-dismissed';

export default function FirstVisitBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // localStorage에서 닫기 상태 확인
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      className="relative p-4 sm:p-6 rounded-xl border-2 border-primary/30 bg-primary/10 mb-6 sm:mb-8"
      role="alert"
      aria-label="첫 방문 안내"
      aria-live="polite"
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <Info className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-base sm:text-lg font-semibold text-foreground mb-1">
            처음이신가요?
          </p>
          <p className="text-base sm:text-base text-[#374151] leading-relaxed mb-3">
            아래 단계를 순서대로 확인해보세요. 각 단계에서 해야 할 일, 필요한 서류, 주의사항을 확인할 수 있습니다.
          </p>
          <VideoGuideButton size="sm" />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="flex-shrink-0 h-8 w-8 p-0"
          aria-label="안내 닫기"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
      </div>
    </div>
  );
}

