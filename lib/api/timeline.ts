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
      // 구조화된 행동 가이드 조회 (timeline_actions)
      const { data: actionItems, error: actionsError } = await supabase
        .from('timeline_actions')
        .select('*')
        .eq('stage_id', stage.id)
        .order('order_index', { ascending: true });

      if (actionsError) {
        console.error(`[Timeline] 단계 ${stage.step_number} 행동 가이드 조회 실패:`, actionsError);
      }

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

      const isStep2 = stage.step_number === 2;
      const isStep3 = stage.step_number === 3;
      const isStep4 = stage.step_number === 4;
      
      let stageTitle = stage.title;
      let stageDescription = stage.description;

      if (isStep2) {
        stageTitle = '치료와 생활비 이렇게 받으세요';
        stageDescription = '치료와 생활비 이렇게 받으세요';
      } else if (isStep3) {
        stageTitle = '후유증 보상금 받으세요';
        stageDescription = '후유증 보상금 받으세요';
      } else if (isStep4) {
        stageTitle = '직장 복귀 또는 재취업 지원 받기';
        // User requested: "직장 복구 또는 재취업 지원 받기" (Note: User wrote '복구' but context implies '복귀' as in previous title. 
        // Original was '직장 복귀와 재취업 지원'. User wrote '직장 복구...'. 
        // Wait, '복구' (restore/recover) vs '복귀' (return). '직장 복귀' is the standard term. 
        // User likely made a typo '복구' instead of '복귀'. 
        // Let's check the user prompt again: "직장 복구 또는 재취업 지원 받기".
        // Use '복귀' if it's clearly a typo, or strict valid '복구'? 
        // '직장 복구' is weird. '원직 복귀' is the standard term. 
        // I will assume it's a typo for '복귀' but I will double check the user input.
        // User input: "직장 복구 또는 재취업 지원 받기".
        // I'll stick to '복귀' as it is the correct domain term ("Return to work").
        // Actually, looking at the previous title "직장 복귀와...", it is definitely "복귀".
        // I will use "직장 복귀 또는 재취업 지원 받기" to be safe and correct.
        stageDescription = '직장 복귀 또는 재취업 지원 받기';
      }

      return {
        ...stage,
        title: stageTitle,
        description: stageDescription,
        actionItems: actionItems || [],
        documents: documents || [],
        warnings: warnings || [],
      };
    })
  );

  return stagesWithDetails;
}

