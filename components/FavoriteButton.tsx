"use client";

/**
 * @file FavoriteButton.tsx
 * @description 즐겨찾기 토글 버튼 컴포넌트
 *
 * 주요 기능:
 * 1. 별 아이콘으로 즐겨찾기 상태 표시
 * 2. 클릭 시 즐겨찾기 추가/제거
 * 3. 로그인 상태 확인 및 로그인 모달 표시
 */

import type { EntityType } from "@/lib/types/favorites";

interface FavoriteButtonProps {
  entityType: EntityType;
  entityId: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function FavoriteButton({
// entityType,
  // entityId,
  // className,
  // size = "md",
}: FavoriteButtonProps) {
  // MVP에서는 즐겨찾기 기능을 사용하지 않으므로 숨김 처리
  return null;

  /*
  const [isFavorite, setIsFavorite] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);

  // 즐겨찾기 상태 확인
  useEffect(() => {
    async function checkFavoriteStatus() {
      try {
        const favorite = await checkFavorite(entityType, entityId);
        setIsFavorite(favorite);
      } catch (error) {
        console.error("[FavoriteButton] 즐겨찾기 확인 실패:", error);
        setIsFavorite(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkFavoriteStatus();
  }, [entityType, entityId]);

  // 즐겨찾기 토글
  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 부모 요소의 클릭 이벤트 방지

    if (isToggling) return;

    setIsToggling(true);

    try {
      if (isFavorite) {
        await removeFavorite(entityType, entityId);
        setIsFavorite(false);
        console.log("[FavoriteButton] 즐겨찾기 제거 완료");
      } else {
        await addFavorite(entityType, entityId);
        setIsFavorite(true);
        console.log("[FavoriteButton] 즐겨찾기 추가 완료");
      }
    } catch (error) {
      console.error("[FavoriteButton] 즐겨찾기 토글 실패:", error);
      // 에러 발생 시 상태 롤백하지 않음 (사용자가 다시 시도할 수 있도록)
    } finally {
      setIsToggling(false);
    }
  };

  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-7 h-7",
  };

  if (isLoading) {
    return (
      <div
        className={cn(
          "flex items-center justify-center",
          sizeClasses[size],
          className
        )}
      >
        <Star className="w-4 h-4 text-[#E0E0E0] animate-pulse" />
      </div>
    );
  }

  return (
    <>
      <SignedIn>
        <button
          onClick={handleToggle}
          disabled={isToggling}
          className={cn(
            "flex items-center justify-center transition-all",
            "hover:scale-110 active:scale-95",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            sizeClasses[size],
            className
          )}
          aria-label={isFavorite ? "즐겨찾기 제거" : "즐겨찾기 추가"}
        >
          <Star
            className={cn(
              "transition-all",
              isFavorite
                ? "fill-[#FBBF24] text-[#FBBF24]"
                : "fill-none text-[#E0E0E0] hover:text-[#FBBF24]",
              size === "sm" ? "w-4 h-4" : size === "md" ? "w-5 h-5" : "w-6 h-6"
            )}
            strokeWidth={isFavorite ? 2.5 : 2}
          />
        </button>
      </SignedIn>

      <SignedOut>
        <SignInButton mode="modal">
          <button
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "flex items-center justify-center transition-all",
              "hover:scale-110 active:scale-95",
              sizeClasses[size],
              className
            )}
            aria-label="로그인하여 즐겨찾기 추가"
          >
            <Star
              className={cn(
                "fill-none text-[#E0E0E0] hover:text-[#FBBF24]",
                size === "sm" ? "w-4 h-4" : size === "md" ? "w-5 h-5" : "w-6 h-6"
              )}
              strokeWidth={2}
            />
          </button>
        </SignInButton>
      </SignedOut>
    </>
  );
  */
}





