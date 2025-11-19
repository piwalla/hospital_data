/**
 * @file document-summary.ts
 * @description 서류 요약 가이드 생성 API
 *
 * Gemini API를 사용하여 서류 요약 가이드를 생성하고,
 * Supabase에 캐싱하는 기능을 제공합니다.
 *
 * 주요 기능:
 * 1. AI 요약 가이드 생성
 * 2. 마크다운 응답 파싱
 * 3. Supabase 캐싱 (7일 TTL)
 */

import { generateContentWithRetry } from './gemini';
import { createDocumentSummaryPrompt } from '@/lib/prompts/document-summary';
import { createClerkSupabaseClient } from '@/lib/supabase/server';
import type { Document, DocumentSummary, DocumentSection } from '@/lib/types/document';

/**
 * 마크다운 응답을 구조화된 데이터로 파싱
 *
 * @param text Gemini API 응답 텍스트 (마크다운 형식)
 * @param documentId 서류 ID
 * @returns 구조화된 DocumentSummary 객체
 */
function parseSummaryResponse(text: string, documentId: string): DocumentSummary {
  console.log('[Document Summary] 응답 파싱 시작');

  // 전체 요약 (첫 번째 섹션의 내용)
  const summary = extractSummary(text);

  // 섹션 추출
  const sections = extractSections(text);

  // 주의사항 추출
  const importantNotes = extractImportantNotes(text);

  // 생성 일시 및 만료 일시 설정
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000); // 7일 후

  return {
    documentId,
    summary,
    sections,
    importantNotes,
    createdAt,
    expiresAt,
  };
}

/**
 * 전체 요약 추출 (첫 번째 섹션)
 */
function extractSummary(text: string): string {
  // "### 1. 이 서류는 무엇인가요?" 섹션 추출
  const summaryMatch = text.match(/###\s*1\.\s*이\s*서류는\s*무엇인가요\?[\s\S]*?(?=###|$)/i);
  if (summaryMatch) {
    return summaryMatch[0]
      .replace(/###\s*1\.\s*이\s*서류는\s*무엇인가요\?/i, '')
      .trim();
  }

  // 대체: 첫 번째 문단 추출
  const firstParagraph = text.split('\n\n')[0];
  return firstParagraph || text.substring(0, 200);
}

/**
 * 주요 항목별 작성 방법 섹션 추출
 */
function extractSections(text: string): DocumentSection[] {
  const sections: DocumentSection[] = [];

  // "### 2. 주요 항목별 작성 방법" 섹션 찾기
  const sectionMatch = text.match(/###\s*2\.\s*주요\s*항목별\s*작성\s*방법[\s\S]*?(?=###\s*3\.|$)/i);
  if (!sectionMatch) {
    return sections;
  }

  const sectionText = sectionMatch[0];
  let order = 0;

  // "## [항목명]" 패턴으로 섹션 추출
  const sectionRegex = /##\s*([^#\n]+?)(?:\(필수|선택\))?\s*\n([\s\S]*?)(?=##|$)/g;
  let match;

  while ((match = sectionRegex.exec(sectionText)) !== null) {
    const title = match[1].trim();
    let content = match[2].trim();

    // "예시:" 부분 제거 (별도 처리하지 않음)
    content = content.replace(/예시:\s*[^\n]+/g, '').trim();

    if (title && content) {
      sections.push({
        title,
        content,
        order: order++,
      });
    }
  }

  // 섹션을 찾지 못한 경우, 전체 내용을 하나의 섹션으로
  if (sections.length === 0) {
    sections.push({
      title: '작성 방법',
      content: sectionText.replace(/###\s*2\.\s*주요\s*항목별\s*작성\s*방법/i, '').trim(),
      order: 0,
    });
  }

  return sections;
}

/**
 * 주의사항 추출
 */
function extractImportantNotes(text: string): string[] {
  const notes: string[] = [];

  // "### 3. 주의사항" 섹션 찾기
  const notesMatch = text.match(/###\s*3\.\s*주의사항[\s\S]*?(?=###\s*4\.|$)/i);
  if (!notesMatch) {
    return notes;
  }

  const notesText = notesMatch[0];

  // 리스트 항목 추출 (마크다운 리스트 형식: -, *, • 등)
  const listItemRegex = /[-*•]\s*(.+?)(?=\n[-*•]|\n\n|$)/g;
  let match;

  while ((match = listItemRegex.exec(notesText)) !== null) {
    const note = match[1].trim();
    if (note) {
      notes.push(note);
    }
  }

  // 리스트를 찾지 못한 경우, 문단 단위로 분리
  if (notes.length === 0) {
    const paragraphs = notesText
      .replace(/###\s*3\.\s*주의사항/i, '')
      .split('\n\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    notes.push(...paragraphs);
  }

  return notes;
}

/**
 * 서류 요약 가이드 생성
 *
 * @param document 서류 정보
 * @returns 생성된 요약 가이드
 */
export async function generateDocumentSummary(
  document: Document
): Promise<DocumentSummary> {
  console.log(`[Document Summary] 요약 생성 시작: ${document.id}`);

  try {
    // 프롬프트 생성
    const prompt = createDocumentSummaryPrompt(document);
    console.log(`[Document Summary] 프롬프트 생성 완료: ${document.name}`);

    // Gemini API 호출
    const responseText = await generateContentWithRetry(prompt, {
      maxRetries: 3,
      retryDelay: 1000,
      timeout: 30000,
    });

    console.log(`[Document Summary] AI 응답 수신 완료: ${document.id}`);

    // 응답 파싱
    const summary = parseSummaryResponse(responseText, document.id);

    console.log(`[Document Summary] 요약 생성 완료: ${document.id}`);
    return summary;
  } catch (error) {
    console.error(`[Document Summary] 요약 생성 실패: ${document.id}`, error);
    throw error;
  }
}

/**
 * 캐시된 서류 요약 가이드 조회
 *
 * @param documentId 서류 ID
 * @returns 캐시된 요약 가이드 또는 null
 */
export async function getCachedDocumentSummary(
  documentId: string
): Promise<DocumentSummary | null> {
  try {
    const supabase = await createClerkSupabaseClient();

    // 7일 이내 생성된 캐시만 조회
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const { data, error } = await supabase
      .from('document_summaries')
      .select('*')
      .eq('document_id', documentId)
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      console.log(`[Document Summary] 캐시 없음: ${documentId}`);
      return null;
    }

    console.log(`[Document Summary] 캐시 조회 성공: ${documentId}`);

    // 데이터베이스 형식을 DocumentSummary 형식으로 변환
    return {
      documentId: data.document_id,
      summary: data.summary,
      sections: data.sections || [],
      importantNotes: data.important_notes || [],
      createdAt: new Date(data.created_at),
      expiresAt: new Date(data.expires_at),
    };
  } catch (error) {
    console.error(`[Document Summary] 캐시 조회 실패: ${documentId}`, error);
    return null;
  }
}

/**
 * 서류 요약 가이드를 캐시에 저장
 *
 * @param summary 요약 가이드
 */
export async function cacheDocumentSummary(
  summary: DocumentSummary
): Promise<void> {
  try {
    const supabase = await createClerkSupabaseClient();

    const { error } = await supabase.from('document_summaries').upsert({
      document_id: summary.documentId,
      summary: summary.summary,
      sections: summary.sections,
      important_notes: summary.importantNotes || [],
      created_at: summary.createdAt.toISOString(),
      expires_at: summary.expiresAt.toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error(`[Document Summary] 캐시 저장 실패: ${summary.documentId}`, error);
      throw error;
    }

    console.log(`[Document Summary] 캐시 저장 성공: ${summary.documentId}`);
  } catch (error) {
    console.error(`[Document Summary] 캐시 저장 중 오류: ${summary.documentId}`, error);
    // 캐시 저장 실패해도 요약은 반환 (에러 throw하지 않음)
  }
}





