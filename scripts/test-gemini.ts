/**
 * @file test-gemini.ts
 * @description Gemini API 기본 테스트 스크립트
 *
 * 이 스크립트는 Gemini API가 정상적으로 작동하는지 확인합니다.
 * 실행 방법: pnpm tsx scripts/test-gemini.ts
 */

import { generateContentWithRetry } from '../lib/api/gemini';

async function testGemini() {
  console.log('=== Gemini API 테스트 시작 ===\n');

  try {
    const testPrompt = '안녕하세요. 간단히 자기소개를 해주세요. (한 문장으로)';
    console.log(`프롬프트: ${testPrompt}\n`);

    const response = await generateContentWithRetry(testPrompt, {
      maxRetries: 3,
      retryDelay: 1000,
      timeout: 30000,
    });

    console.log('\n=== 응답 ===');
    console.log(response);
    console.log('\n=== 테스트 성공! ===');
  } catch (error: any) {
    console.error('\n=== 테스트 실패 ===');
    console.error('에러:', error.message);
    console.error('상세:', error);
    process.exit(1);
  }
}

testGemini();













