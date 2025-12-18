/**
 * @file disclaimer.ts
 * @description 면책 조항 유틸리티
 *
 * AI 생성 내용에 자동으로 포함되는 면책 조항을 정의합니다.
 */

/**
 * 면책 조항 텍스트
 */
export const DISCLAIMER_TEXT = `이 내용은 법률적/의학적 자문이 아니며, 참고용 정보입니다.
정확한 내용은 근로복지공단(www.comwel.or.kr) 또는 전문가와 상의하세요.`;

/**
 * 내용에 면책 조항 추가
 *
 * @param content 원본 내용
 * @returns 면책 조항이 추가된 내용
 */
export function addDisclaimer(content: string): string {
  return `${content}\n\n---\n\n${DISCLAIMER_TEXT}`;
}

/**
 * 면책 조항만 반환 (별도 표시용)
 *
 * @returns 면책 조항 텍스트
 */
export function getDisclaimer(): string {
  return DISCLAIMER_TEXT;
}













