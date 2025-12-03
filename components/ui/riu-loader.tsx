/**
 * @file riu-loader.tsx
 * @description 리우 캐릭터 로딩 애니메이션 컴포넌트
 * 
 * 로딩 및 빈 상태에서 사용되는 공통 로더 컴포넌트입니다.
 * 리우 캐릭터의 점프 애니메이션과 함께 메시지를 표시합니다.
 * 
 * 주요 기능:
 * - 리우 캐릭터 애니메이션 (점프 효과)
 * - 접근성 지원 (ARIA 라벨, 스크린 리더)
 * - 반응형 크기 조정
 * - 로깅 지원 (개발 환경)
 * 
 * @dependencies
 * - components/icons/riu-icon.tsx
 */

import RiuIcon from "@/components/icons/riu-icon";
import type { RiuIconProps } from "@/components/icons/riu-icon";

interface RiuLoaderProps {
  message?: string;
  iconVariants?: RiuIconProps["variant"][];
  size?: number;
  /** 접근성을 위한 추가 설명 (스크린 리더용) */
  ariaDescription?: string;
  /** 로깅용 식별자 (개발 환경에서만 사용) */
  logId?: string;
}

const DEFAULT_VARIANTS: RiuIconProps["variant"][] = ["question", "smile", "cheer"];

export function RiuLoader({
  message = "리우가 준비 중이에요...",
  iconVariants = DEFAULT_VARIANTS,
  size = 48,
  ariaDescription,
  logId,
}: RiuLoaderProps) {
  // 개발 환경에서 로깅
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development' && logId) {
    console.log(`[RiuLoader] ${logId}: ${message}`);
  }

  const fullAriaLabel = ariaDescription 
    ? `${message} ${ariaDescription}`
    : message;

  return (
    <div 
      className="flex flex-col items-center justify-center gap-3 sm:gap-4 text-center"
      role="status"
      aria-live="polite"
      aria-label={fullAriaLabel}
    >
      <div className="flex items-end gap-2 sm:gap-3">
        {iconVariants.map((variant, index) => (
          <RiuIcon
            key={`${variant}-${index}`}
            variant={variant}
            size={size}
            animated
            style={{ animationDelay: `${index * 0.15}s` }}
            aria-hidden="true"
          />
        ))}
      </div>
      <p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-md px-4">
        {message}
      </p>
    </div>
  );
}

export default RiuLoader;









