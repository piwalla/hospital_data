/**
 * @file timeline.ts
 * @description 타임라인 기능 관련 타입 정의
 */

/**
 * 산재 절차 단계 정보
 */
export interface Stage {
  id: string;
  step_number: number;
  title: string;
  description: string;
  actions: string[];
  next_condition: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * 단계별 필수 서류
 */
export interface TimelineDocument {
  id: string;
  stage_id: string;
  title: string;
  pdf_url: string | null;
  is_required: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

/**
 * 단계별 주의사항
 */
export interface TimelineWarning {
  id: string;
  stage_id: string;
  content: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

/**
 * 단계 정보와 관련 데이터를 포함한 확장 타입
 */
export interface StageWithDetails extends Stage {
  documents: TimelineDocument[];
  warnings: TimelineWarning[];
}


