/**
 * @file document.ts
 * @description 산재 관련 서류를 위한 타입 정의
 */

/**
 * 서류 카테고리
 */
export type DocumentCategory =
  | 'application' // 신청서류
  | 'benefit' // 급여 관련
  | 'compensation'; // 보상 관련

/**
 * 미리 정의된 기본 설명 (정적 데이터)
 */
export interface PredefinedSummary {
  summary: string; // 전체 요약 (2-3문단)
  sections?: Array<{
    title: string;
    content: string;
    order: number;
  }>; // 주요 항목별 작성 방법
  importantNotes?: string[]; // 주의사항
}

/**
 * 서류 정보
 */
export interface Document {
  id: string; // 서류 고유 ID (예: "workplace-accident-application")
  name: string; // 서류 이름 (예: "산재신청서")
  description: string; // 서류 설명
  category: DocumentCategory; // 서류 카테고리
  officialDownloadUrl?: string; // 공식 다운로드 링크
  exampleUrl?: string; // 작성 예시 링크
  requiredDocuments?: string[]; // 필요 서류 목록
  processingPeriod?: string; // 처리 기간 (예: "7일 이내")
  relatedDocuments?: string[]; // 관련 서류 ID 목록
  predefinedSummary?: PredefinedSummary; // 기본 설명 (정적 데이터)
}

/**
 * AI 요약 가이드 섹션
 */
export interface DocumentSection {
  title: string; // 섹션 제목
  content: string; // 섹션 내용 (마크다운 형식)
  order: number; // 표시 순서
}

/**
 * AI 요약 가이드 결과
 */
export interface DocumentSummary {
  documentId: string; // 서류 ID
  summary: string; // 전체 요약
  sections: DocumentSection[]; // 주요 항목별 작성 방법
  importantNotes?: string[]; // 주의사항 목록
  createdAt: Date; // 생성 일시
  expiresAt: Date; // 만료 일시 (캐시 TTL)
}

/**
 * 서류 목록 응답
 */
export interface DocumentsListResponse {
  documents: Document[];
  total: number;
}

/**
 * 서류 요약 요청
 */
export interface DocumentSummaryRequest {
  documentId: string;
  forceRefresh?: boolean; // 캐시 무시하고 새로 생성
}

/**
 * 서류 요약 응답
 */
export interface DocumentSummaryResponse {
  success: boolean;
  summary?: DocumentSummary;
  error?: string;
  fromCache?: boolean; // 캐시에서 가져온 경우
}


