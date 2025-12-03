/**
 * @file chatbot-analytics.ts
 * @description 챗봇 사용 통계 로깅 함수
 * 
 * Supabase user_activity_logs 테이블에 챗봇 사용 통계를 저장합니다.
 * 
 * 주요 기능:
 * - 질문 전송 로깅
 * - 응답 수신 로깅 (응답 시간 포함)
 * - 에러 발생 로깅
 * - 비동기 처리로 사용자 경험에 영향 없음
 */

/**
 * 챗봇 활동 타입
 */
export type ChatbotAction = 'chatbot_question' | 'chatbot_response' | 'chatbot_error';

/**
 * 챗봇 활동 데이터 타입
 */
export interface ChatbotActivityData {
  userId: string;
  question?: string;
  responseTime?: number;
  error?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
}

/**
 * 챗봇 활동을 로깅하는 함수
 * 
 * Supabase user_activity_logs 테이블에 챗봇 사용 통계를 저장합니다.
 * 로깅 실패 시에도 사용자 경험에 영향을 주지 않도록 비동기로 처리합니다.
 * 
 * @param action - 활동 타입 (질문, 응답, 에러)
 * @param data - 활동 데이터
 */
export async function logChatbotActivity(
  action: ChatbotAction,
  data: ChatbotActivityData
): Promise<void> {
  try {
    // 클라이언트 사이드에서는 API 라우트를 통해 로깅
    // 서버 사이드에서는 이 함수를 직접 호출하지 않고 API 라우트를 사용
    if (typeof window !== 'undefined') {
      await fetch('/api/analytics/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          userId: data.userId,
          question: data.question,
          responseTime: data.responseTime,
          error: data.error,
          sessionId: data.sessionId,
          metadata: data.metadata,
        }),
      }).catch((err) => {
        // API 호출 실패는 조용히 무시 (사용자 경험에 영향 없음)
        console.warn('[Chatbot Analytics] Failed to log activity:', err);
      });
    } else {
      // 서버 사이드에서는 API 라우트를 직접 호출하지 않음
      // 서버 사이드에서 로깅이 필요한 경우 API 라우트를 직접 사용하거나
      // 별도의 서버 사이드 함수를 구현해야 함
      console.warn('[Chatbot Analytics] Server-side logging not implemented. Use API route instead.');
    }
  } catch (error) {
    // 로깅 실패는 조용히 무시 (사용자 경험에 영향 없음)
    console.warn('[Chatbot Analytics] Error logging activity:', error);
  }
}

