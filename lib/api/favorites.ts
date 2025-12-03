/**
 * @file favorites.ts
 * @description 즐겨찾기 API 호출 유틸리티 함수
 */

import type { Favorite, EntityType } from "@/lib/types/favorites";

/**
 * 사용자의 즐겨찾기 목록 조회
 */
export async function getFavorites(): Promise<Favorite[]> {
  try {
    const response = await fetch("/api/favorites", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("로그인이 필요합니다.");
      }
      throw new Error("즐겨찾기 목록을 불러오는데 실패했습니다.");
    }

    const data = await response.json();
    return data.favorites || [];
  } catch (error) {
    console.error("[getFavorites] 오류:", error);
    throw error;
  }
}

/**
 * 즐겨찾기 추가
 */
export async function addFavorite(
  entityType: EntityType,
  entityId: string
): Promise<Favorite> {
  try {
    const response = await fetch("/api/favorites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        entity_type: entityType,
        entity_id: entityId,
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("로그인이 필요합니다.");
      }
      if (response.status === 409) {
        const data = await response.json();
        throw new Error(data.message || "이미 즐겨찾기에 추가된 항목입니다.");
      }
      // 에러 응답에서 상세 정보 가져오기
      let errorMessage = "즐겨찾기 추가에 실패했습니다.";
      try {
        const errorData = await response.json();
        errorMessage = errorData.details || errorData.error || errorMessage;
        console.error("[addFavorite] API 에러 응답:", errorData);
      } catch (e) {
        console.error("[addFavorite] 응답 파싱 실패:", e);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.favorite;
  } catch (error) {
    console.error("[addFavorite] 오류:", error);
    throw error;
  }
}

/**
 * 즐겨찾기 제거
 */
export async function removeFavorite(
  entityType: EntityType,
  entityId: string
): Promise<void> {
  try {
    const response = await fetch(
      `/api/favorites?entity_type=${entityType}&entity_id=${entityId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("로그인이 필요합니다.");
      }
      throw new Error("즐겨찾기 제거에 실패했습니다.");
    }
  } catch (error) {
    console.error("[removeFavorite] 오류:", error);
    throw error;
  }
}

/**
 * 즐겨찾기 확인
 */
export async function checkFavorite(
  entityType: EntityType,
  entityId: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `/api/favorites/check?entity_type=${entityType}&entity_id=${entityId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.isFavorite || false;
  } catch (error) {
    console.error("[checkFavorite] 오류:", error);
    return false;
  }
}

