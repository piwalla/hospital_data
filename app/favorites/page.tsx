import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import FavoritesPageClient from "./page-client";
import { getAllHospitals } from "@/lib/api/hospitals";
import { getAllRehabilitationCenters } from "@/lib/api/rehabilitation-centers";
import { createClerkSupabaseClient } from "@/lib/supabase/server";
import type { Favorite } from "@/lib/types/favorites";
import type { SupabaseClient } from "@supabase/supabase-js";

// 대체 방법: 모든 데이터를 가져와서 메모리에서 조인
async function loadFavoritesWithFallback(
  supabase: SupabaseClient,
  userId: string
) {
  // 즐겨찾기 목록 조회
  const { data: favorites, error: favoritesError } = await supabase
    .from("favorites")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (favoritesError) {
    console.error("[FavoritesPage] 즐겨찾기 조회 실패:", favoritesError);
    return <FavoritesPageClient favorites={[]} />;
  }

  // 모든 병원 및 재활기관 데이터 조회
  const [hospitals, rehabilitationCenters] = await Promise.all([
    getAllHospitals(),
    getAllRehabilitationCenters(),
  ]);

  // 즐겨찾기와 의료기관 정보 조인
  console.log("[FavoritesPage] 즐겨찾기 개수:", favorites?.length || 0);
  console.log("[FavoritesPage] 병원 개수:", hospitals.length);
  console.log("[FavoritesPage] 재활기관 개수:", rehabilitationCenters.length);
  
  const favoritesWithEntities = (favorites || []).map((favorite: Favorite) => {
    console.log("[FavoritesPage] 즐겨찾기 처리:", {
      id: favorite.id,
      entity_type: favorite.entity_type,
      entity_id: favorite.entity_id,
    });
    
    if (favorite.entity_type === "hospital") {
      const hospital = hospitals.find((h) => h.id === favorite.entity_id);
      console.log("[FavoritesPage] 병원 찾기 결과:", hospital ? "찾음" : "없음", {
        favorite_entity_id: favorite.entity_id,
        hospital_id: hospital?.id,
        hospital_name: hospital?.name,
        all_hospital_ids: hospitals.slice(0, 5).map(h => h.id), // 처음 5개만 로그
      });
      
      return {
        ...favorite,
        entity: hospital
          ? {
              id: hospital.id,
              name: hospital.name,
              type: hospital.type,
              address: hospital.address,
              latitude: hospital.latitude,
              longitude: hospital.longitude,
              phone: hospital.phone,
              institution_type: hospital.institution_type,
              department_extracted: hospital.department_extracted,
            }
          : null,
      };
    } else {
      const center = rehabilitationCenters.find(
        (c) => c.id === favorite.entity_id
      );
      console.log("[FavoritesPage] 재활기관 찾기 결과:", center ? "찾음" : "없음", {
        favorite_entity_id: favorite.entity_id,
        center_id: center?.id,
        center_name: center?.name,
      });
      
      return {
        ...favorite,
        entity: center
          ? {
              id: center.id,
              name: center.name,
              address: center.address,
              latitude: center.latitude,
              longitude: center.longitude,
              phone: center.phone,
              gigwan_fg_nm: center.gigwan_fg_nm,
            }
          : null,
      };
    }
  });
  
  console.log("[FavoritesPage] 조인 완료:", {
    total: favoritesWithEntities.length,
    withEntity: favoritesWithEntities.filter((f) => f.entity !== null).length,
    withoutEntity: favoritesWithEntities.filter((f) => f.entity === null).length,
  });

  return (
    <FavoritesPageClient
      favorites={favoritesWithEntities.filter((f) => f.entity !== null)}
    />
  );
}

/**
 * 즐겨찾기 페이지 (서버 컴포넌트)
 * 
 * 로그인 확인 및 즐겨찾기 데이터 로드
 */
export default async function FavoritesPage() {
  const { userId: clerkUserId } = await auth();

  // 로그인하지 않은 경우 홈으로 리다이렉트
  if (!clerkUserId) {
    redirect("/");
  }

  try {
    const supabase = createClerkSupabaseClient();

    // Clerk user ID로 Supabase users 테이블에서 user_id 찾기
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", clerkUserId)
      .single();

    if (userError || !userData) {
      console.error("[FavoritesPage] User not found:", userError);
      return <FavoritesPageClient favorites={[]} />;
    }

    // 대체 방법 사용 (메모리에서 조인)
    return await loadFavoritesWithFallback(supabase, userData.id);
  } catch (error) {
    console.error("[FavoritesPage] 데이터 로드 실패:", error);
    return <FavoritesPageClient favorites={[]} />;
  }
}

