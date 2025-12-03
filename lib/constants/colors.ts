/**
 * @file colors.ts
 * @description 색상 상수 정의
 * 
 * 하드코딩된 색상 값을 CSS 변수 기반으로 통일하기 위한 상수 파일입니다.
 * 동적 HTML 문자열 생성 시 사용됩니다.
 */

/**
 * 기관별 색상 상수
 */
export const COLORS = {
  // Primary 색상 (병원)
  primary: '#2F6E4F',
  primaryAlt: '#2E7D32',
  
  // 약국 색상
  pharmacy: '#34C759',
  
  // 재활기관 색상
  rehabilitation: '#9333EA',
  
  // Accent 색상
  accent: '#FFD54F',
  
  // Border 색상
  borderLight: '#E8F5E9',
  borderMedium: '#C8E6C9',
  
  // Background 색상
  background: '#F5F9F6',
  backgroundWarm: '#FFFCF5',
  
  // Text 색상
  textPrimary: '#1C1C1E',
  textSecondary: '#555555',
  textMuted: '#8A8A8E',
} as const;

/**
 * CSS 변수에서 색상을 가져오는 헬퍼 함수
 * (클라이언트 사이드에서만 사용 가능)
 */
export function getColorFromCSSVar(varName: string): string {
  if (typeof window === 'undefined') {
    // 서버 사이드에서는 기본값 반환
    return COLORS.primary;
  }
  
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
  
  return value || COLORS.primary;
}





