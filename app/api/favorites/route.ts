import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createClerkSupabaseClient } from "@/lib/supabase/server";
import type { EntityType } from "@/lib/types/favorites";

/**
 * 즐겨찾기 API 엔드포인트
 * 
 * GET: 사용자의 즐겨찾기 목록 조회
 * POST: 즐겨찾기 추가
 * DELETE: 즐겨찾기 제거
 */

// GET: 즐겨찾기 목록 조회
export async function GET() {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createClerkSupabaseClient();

    // Clerk user ID로 Supabase users 테이블에서 user_id 찾기
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", clerkUserId)
      .single();

    if (userError || !userData) {
      console.error("[Favorites] User not found:", userError);
      console.error("[Favorites] Clerk User ID:", clerkUserId);
      return NextResponse.json(
        { error: "User not found in database", details: userError?.message },
        { status: 404 }
      );
    }

    // 즐겨찾기 목록 조회
    const { data: favorites, error: favoritesError } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", userData.id)
      .order("created_at", { ascending: false });

    if (favoritesError) {
      console.error("[Favorites] 조회 실패:", favoritesError);
      return NextResponse.json(
        { error: "Failed to fetch favorites", details: favoritesError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      favorites: favorites || [],
    });
  } catch (error) {
    console.error("[Favorites] GET 오류:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: 즐겨찾기 추가
export async function POST(request: Request) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { entity_type, entity_id } = body;

    if (!entity_type || !entity_id) {
      return NextResponse.json(
        { error: "entity_type and entity_id are required" },
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
      console.error("[Favorites] User not found:", userError);
      console.error("[Favorites] Clerk User ID:", clerkUserId);
      return NextResponse.json(
        { error: "User not found in database", details: userError?.message },
        { status: 404 }
      );
    }

    // 즐겨찾기 추가
    const { data: favorite, error: insertError } = await supabase
      .from("favorites")
      .insert({
        user_id: userData.id,
        entity_type: entity_type as EntityType,
        entity_id: entity_id,
      })
      .select()
      .single();

    if (insertError) {
      // 중복 에러인 경우
      if (insertError.code === "23505") {
        return NextResponse.json(
          { error: "Already favorited", message: "이미 즐겨찾기에 추가된 항목입니다." },
          { status: 409 }
        );
      }

      console.error("[Favorites] 추가 실패:", insertError);
      console.error("[Favorites] Insert error code:", insertError.code);
      console.error("[Favorites] Insert error details:", JSON.stringify(insertError, null, 2));
      return NextResponse.json(
        { error: "Failed to add favorite", details: insertError.message, code: insertError.code },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      favorite,
    });
  } catch (error) {
    console.error("[Favorites] POST 오류:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: 즐겨찾기 제거
export async function DELETE(request: Request) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
      console.error("[Favorites] User not found:", userError);
      console.error("[Favorites] Clerk User ID:", clerkUserId);
      return NextResponse.json(
        { error: "User not found in database", details: userError?.message },
        { status: 404 }
      );
    }

    // 즐겨찾기 제거
    const { error: deleteError } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", userData.id)
      .eq("entity_type", entity_type)
      .eq("entity_id", entity_id);

    if (deleteError) {
      console.error("[Favorites] 제거 실패:", deleteError);
      return NextResponse.json(
        { error: "Failed to remove favorite", details: deleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Favorite removed successfully",
    });
  } catch (error) {
    console.error("[Favorites] DELETE 오류:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

