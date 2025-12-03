import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createClerkSupabaseClient } from "@/lib/supabase/server";

/**
 * 즐겨찾기 확인 API 엔드포인트
 * 
 * GET: 특정 의료기관이 즐겨찾기인지 확인
 * Query parameters: entity_type, entity_id
 */

export async function GET(request: Request) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json({ isFavorite: false });
    }

    const { searchParams } = new URL(request.url);
    const entity_type = searchParams.get("entity_type");
    const entity_id = searchParams.get("entity_id");

    if (!entity_type || !entity_id) {
      return NextResponse.json(
        { error: "entity_type and entity_id query parameters are required" },
        { status: 400 }
      );
    }

    if (entity_type !== "hospital" && entity_type !== "rehabilitation_center") {
      return NextResponse.json(
        { error: "Invalid entity_type. Must be 'hospital' or 'rehabilitation_center'" },
        { status: 400 }
      );
    }

    const supabase = createClerkSupabaseClient();

    // Clerk user ID로 Supabase users 테이블에서 user_id 찾기
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", clerkUserId)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ isFavorite: false });
    }

    // 즐겨찾기 확인
    const { data: favorite, error: checkError } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", userData.id)
      .eq("entity_type", entity_type)
      .eq("entity_id", entity_id)
      .single();

    if (checkError) {
      // 데이터가 없으면 즐겨찾기가 아님
      if (checkError.code === "PGRST116") {
        return NextResponse.json({ isFavorite: false });
      }

      console.error("[Favorites Check] 확인 실패:", checkError);
      return NextResponse.json({ isFavorite: false });
    }

    return NextResponse.json({
      isFavorite: !!favorite,
    });
  } catch (error) {
    console.error("[Favorites Check] 오류:", error);
    return NextResponse.json({ isFavorite: false });
  }
}

