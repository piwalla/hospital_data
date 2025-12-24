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
  actions: string[]; // Deprecated, but kept for backward compatibility if needed temporarily
  next_condition: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * 단계별 상세 행동 (구조화된 데이터)
 */
export interface TimelineAction {
  id: string;
  stage_id: string;
  title: string;
  description: string | null;
  order_index: number;
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
  guide_url: string | null;
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
  description: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

/**
 * 단계 정보와 관련 데이터를 포함한 확장 타입
 */
export interface StageWithDetails extends Stage {
  actionItems: TimelineAction[]; // New structured actions
  documents: TimelineDocument[];
  warnings: TimelineWarning[];
}


