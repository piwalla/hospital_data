/**
 * @file hooks/use-is-mobile.ts
 * @description 모바일 디바이스 감지 훅
 * 
 * 768px 미만을 모바일로 간주합니다.
 */

'use client';

import { useState, useEffect } from 'react';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // SSR 안전성: 초기값은 false
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // 초기 체크
    checkMobile();

    // 리사이즈 이벤트 리스너
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return isMobile;
}












