/**
 * @file timeline.ts
 * @description 타임라인 데이터 조회 함수
 * 
 * 타임라인은 로그인 없이도 접근 가능한 공개 데이터이므로
 * 인증이 필요 없는 Supabase 클라이언트를 사용합니다.
 */

import { createPublicSupabaseClient } from '@/lib/supabase/public';
import type { StageWithDetails } from '@/lib/types/timeline';

/**
 * 모든 단계 정보와 관련 데이터를 조회합니다.
 * @returns 단계별 정보, 서류, 주의사항을 포함한 배열
 */
export async function getAllStagesWithDetails(): Promise<StageWithDetails[]> {
  const supabase = createPublicSupabaseClient();

  // 1. 모든 단계 조회 (step_number 순서대로)
  const { data: stages, error: stagesError } = await supabase
    .from('stages')
    .select('*')
    .order('step_number', { ascending: true });

  if (stagesError) {
    console.error('[Timeline] 단계 조회 실패:', stagesError);
    throw new Error(`단계 조회 실패: ${stagesError.message}`);
  }

  if (!stages || stages.length === 0) {
    return [];
  }

  // 2. 각 단계별 서류 및 주의사항 조회
  const stagesWithDetails: StageWithDetails[] = await Promise.all(
    stages.map(async (stage) => {
      // 서류 조회
      const { data: documents, error: documentsError } = await supabase
        .from('timeline_documents')
        .select('*')
        .eq('stage_id', stage.id)
        .order('order_index', { ascending: true });

      if (documentsError) {
        console.error(`[Timeline] 단계 ${stage.step_number} 서류 조회 실패:`, documentsError);
      }

      // 주의사항 조회
      const { data: warnings, error: warningsError } = await supabase
        .from('timeline_warnings')
        .select('*')
        .eq('stage_id', stage.id)
        .order('order_index', { ascending: true });

      if (warningsError) {
        console.error(`[Timeline] 단계 ${stage.step_number} 주의사항 조회 실패:`, warningsError);
      }

      return {
        ...stage,
        documents: documents || [],
        warnings: warnings || [],
      };
    })
  );

  return stagesWithDetails;
}

