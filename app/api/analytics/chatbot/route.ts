/**
 * @file route.ts
 * @description 챗봇 사용 통계 로깅 API
 * 
 * 클라이언트에서 챗봇 활동을 로깅하기 위한 API 엔드포인트입니다.
 * Supabase user_activity_logs 테이블에 통계를 저장합니다.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClerkSupabaseClient } from '@/lib/supabase/server';
import type { ChatbotAction } from '@/lib/utils/chatbot-analytics';

/**
 * POST: 챗봇 활동 로깅
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, question, responseTime, error, sessionId, metadata } = body;

    // 인증 확인
    const { userId: clerkUserId } = await auth();
    
    // userId는 Clerk user ID이므로, Supabase users 테이블에서 user_id 찾기
    const supabase = createClerkSupabaseClient();
    
    let supabaseUserId: string | null = null;
    
    if (clerkUserId) {
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', clerkUserId)
        .single();
      
      if (userData) {
        supabaseUserId = userData.id;
      }
    }

    // 메타데이터 구성 (개인정보 보호: 질문 내용은 길이만 저장)
    const meta: Record<string, any> = {
      action: action as ChatbotAction,
      ...(question && { questionLength: question.length }), // 질문 내용은 저장하지 않음
      ...(responseTime && { responseTime }),
      ...(error && { error }),
      ...(sessionId && { sessionId }),
      ...(metadata && { ...metadata }),
    };

    // user_activity_logs에 저장
    const { error: insertError } = await supabase
      .from('user_activity_logs')
      .insert({
        user_id: supabaseUserId,
        action: action as ChatbotAction,
        meta,
      });

    if (insertError) {
      console.error('[Chatbot Analytics API] Failed to log activity:', insertError);
      // 로깅 실패는 500 에러를 반환하지 않고 200 OK 반환 (사용자 경험 보호)
      return NextResponse.json({ success: false, error: insertError.message }, { status: 200 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Chatbot Analytics API] Error:', error);
    // 에러 발생 시에도 200 OK 반환 (사용자 경험 보호)
    return NextResponse.json({ success: false, error: error.message }, { status: 200 });
  }
}





