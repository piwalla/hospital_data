/**
 * @file gemini.ts
 * @description Google Gemini API 클라이언트
 *
 * Google Gemini 2.5 Flash 모델을 사용하여 AI 요약 가이드를 생성합니다.
 *
 * 주요 기능:
 * 1. Gemini API 클라이언트 초기화
 * 2. 에러 처리 및 재시도 로직
 * 3. Rate limiting 처리
 * 4. 타임아웃 설정
 *
 * @dependencies
 * - @google/genai: Google Generative AI SDK
 *
 * @see {@link https://ai.google.dev/docs} - Google Gemini API 문서
 */

import { GoogleGenAI } from '@google/genai';

// 환경변수 확인
const apiKey = process.env.GOOGLE_API_KEY;
const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

if (!apiKey) {
  throw new Error('GOOGLE_API_KEY is not set in environment variables');
}

// Gemini 클라이언트 초기화
const genAI = new GoogleGenAI({ apiKey });

/**
 * Gemini 모델 인스턴스 가져오기
 */
export function getGeminiModel() {
  return genAI;
}

/**
 * 재시도 옵션 인터페이스
 */
interface RetryOptions {
  maxRetries?: number; // 최대 재시도 횟수 (기본값: 3)
  retryDelay?: number; // 재시도 간격 (ms, 기본값: 1000)
  timeout?: number; // 타임아웃 (ms, 기본값: 30000)
}

/**
 * Gemini API 호출 (재시도 및 에러 처리 포함)
 *
 * @param prompt 생성할 프롬프트
 * @param options 재시도 옵션
 * @returns 생성된 텍스트
 * @throws 에러 발생 시
 */
export async function generateContentWithRetry(
  prompt: string,
  options: RetryOptions = {}
): Promise<string> {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    timeout = 30000,
  } = options;

  const ai = getGeminiModel();
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[Gemini] API 호출 시도 ${attempt + 1}/${maxRetries + 1}`);

      // 타임아웃을 위한 Promise.race 사용
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Request timeout after ${timeout}ms`));
        }, timeout);
      });

      const generatePromise = ai.models.generateContent({
        model: modelName,
        contents: prompt,
      });
      const result = await Promise.race([generatePromise, timeoutPromise]);
      const text = result.text;

      console.log(`[Gemini] API 호출 성공 (시도 ${attempt + 1})`);
      return text;
    } catch (error: any) {
      lastError = error;

      // Rate limiting 에러 (429)
      if (error.status === 429 || error.message?.includes('429')) {
        const retryAfter = error.retryAfter || retryDelay * (attempt + 1);
        console.warn(
          `[Gemini] Rate limit 초과. ${retryAfter}ms 후 재시도... (시도 ${attempt + 1}/${maxRetries + 1})`
        );

        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, retryAfter));
          continue;
        } else {
          throw new Error(
            `Rate limit 초과. 최대 재시도 횟수(${maxRetries}) 초과`
          );
        }
      }

      // Service Unavailable 에러 (503) - 모델 과부하
      if (
        error.status === 503 ||
        error.code === 503 ||
        error.message?.includes('503') ||
        error.message?.includes('overloaded') ||
        error.message?.includes('UNAVAILABLE')
      ) {
        // 503 에러는 지수 백오프로 재시도 (더 긴 대기 시간)
        const backoffDelay = retryDelay * Math.pow(2, attempt);
        console.warn(
          `[Gemini] 서비스 과부하 (503). ${backoffDelay}ms 후 재시도... (시도 ${attempt + 1}/${maxRetries + 1})`
        );

        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, backoffDelay));
          continue;
        } else {
          throw new Error(
            `서비스가 일시적으로 과부하 상태입니다. 잠시 후 다시 시도해주세요. (최대 재시도 횟수: ${maxRetries})`
          );
        }
      }

      // 네트워크 에러 또는 타임아웃
      if (
        error.message?.includes('timeout') ||
        error.message?.includes('network') ||
        error.message?.includes('ECONNRESET') ||
        error.message?.includes('ETIMEDOUT')
      ) {
        console.warn(
          `[Gemini] 네트워크 에러 발생. ${retryDelay}ms 후 재시도... (시도 ${attempt + 1}/${maxRetries + 1})`
        );

        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          continue;
        } else {
          throw new Error(
            `네트워크 에러. 최대 재시도 횟수(${maxRetries}) 초과: ${error.message}`
          );
        }
      }

      // 기타 에러 (API 키 오류, 모델 오류 등)
      console.error(`[Gemini] API 호출 실패:`, error);
      throw error;
    }
  }

  // 모든 재시도 실패
  throw lastError || new Error('Unknown error occurred');
}

/**
 * Gemini 모델 및 클라이언트 export (필요시 직접 사용)
 */
export { genAI, modelName };

