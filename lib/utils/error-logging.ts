/**
 * @file error-logging.ts
 * @description 에러 로깅 유틸리티 함수
 * 
 * 구조화된 에러 로깅을 제공합니다.
 * 
 * 주요 기능:
 * - 클라이언트 사이드: 구조화된 console.error 로깅
 * - 서버 사이드: 구조화된 console.error 로깅
 * - API 라우트 전용 에러 로깅
 */

/**
 * 에러 로깅 컨텍스트 타입
 */
export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

/**
 * API 에러 로깅 컨텍스트 타입
 */
export interface ApiErrorContext extends ErrorContext {
  method?: string;
  path?: string;
  statusCode?: number;
  params?: Record<string, any>;
}

/**
 * 에러를 로깅하는 함수
 * 
 * 클라이언트 사이드에서는 Vercel Analytics에 에러를 전송하고,
 * 서버 사이드에서는 구조화된 로그를 출력합니다.
 * 
 * @param error - 에러 객체 또는 에러 메시지
 * @param context - 에러 컨텍스트 정보
 */
export function logError(
  error: Error | unknown,
  context?: ErrorContext
): void {
  const isClient = typeof window !== 'undefined';
  
  // 에러 정보 추출
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;
  const errorName = error instanceof Error ? error.name : 'UnknownError';

  // 구조화된 에러 정보
  const errorInfo = {
    message: errorMessage,
    name: errorName,
    stack: errorStack,
    context: context || {},
    timestamp: new Date().toISOString(),
    environment: isClient ? 'client' : 'server',
  };

  if (isClient) {
    // 클라이언트 사이드: 구조화된 로그 출력
    console.error('[Client Error]', errorInfo);
  } else {
    // 서버 사이드: 구조화된 로그 출력
    console.error('[Server Error]', JSON.stringify(errorInfo, null, 2));
  }
}

/**
 * API 라우트 전용 에러 로깅 함수
 * 
 * API 라우트에서 발생한 에러를 구조화된 형태로 로깅합니다.
 * 
 * @param error - 에러 객체 또는 에러 메시지
 * @param context - API 에러 컨텍스트 정보
 */
export function logApiError(
  error: Error | unknown,
  context?: ApiErrorContext
): void {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;
  const errorName = error instanceof Error ? error.name : 'ApiError';

  // 구조화된 API 에러 정보
  const apiErrorInfo = {
    message: errorMessage,
    name: errorName,
    stack: errorStack,
    context: {
      method: context?.method || 'UNKNOWN',
      path: context?.path || 'UNKNOWN',
      statusCode: context?.statusCode,
      userId: context?.userId,
      params: context?.params,
      component: context?.component,
      action: context?.action,
      metadata: context?.metadata,
    },
    timestamp: new Date().toISOString(),
    environment: 'server',
  };

  // 서버 사이드 로깅
  console.error('[API Error]', JSON.stringify(apiErrorInfo, null, 2));
}

