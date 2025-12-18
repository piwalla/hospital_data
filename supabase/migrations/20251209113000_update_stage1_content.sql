-- 산재 신청하기 단계 내용 개선
-- docs/산재 신청하기.md 문서의 상세 내용을 기반으로 Step 1의 내용을 업데이트합니다.

-- 1. stages 테이블 업데이트 (Step 1)
UPDATE public.stages
SET 
  description = '직장에서 다쳤을 때 근로복지공단에 산재라고 신고하는 단계입니다. 사고 직후 병원 방문부터 서류 준비, 접수, 조사 대기, 결과 대응까지의 전 과정을 안내합니다.',
  actions = ARRAY[
    '의사에게 "일하다 다쳤음"을 명확히 진술하기 (의무기록에 남기는 것이 핵심)',
    '건강보험이 아닌 산재보험으로 처리하겠다고 원무과에 알리기',
    '사고 현장 사진/동영상 확보',
    '목격자 연락처 확보',
    '요양급여신청서 작성 (환자가 쓰는 것)',
    '산재 소견서 받기 (의사가 써주는 것 - 일반 진단서와 다름)',
    '의무기록 사본 준비 (검사 결과지 등)',
    '사업주 동의 없이도 신청 가능함을 확인',
    '근로복지공단 (사업장 관할 지사) 찾기',
    '의료기관 대행 신청 또는 직접 방문/우편/팩스/온라인 접수',
    '담당 조사관 배정 및 연락 대기',
    '문답서 작성 준비 (육하원칙에 따라 사고 경위 진술)',
    '승인 시: 요양 결정 통지서 확인, 기존 병원비 돌려받기 (요양비 청구)',
    '불승인 시: 이의 제기(심사 청구) 가능, 노무사 등 전문가 상담'
  ],
  updated_at = now()
WHERE step_number = 1;

-- 2. timeline_warnings 테이블 업데이트 (Step 1의 기존 주의사항 삭제 후 새로 추가)
-- 기존 주의사항 삭제
DELETE FROM public.timeline_warnings
WHERE stage_id IN (SELECT id FROM public.stages WHERE step_number = 1);

-- 새로운 주의사항 추가
INSERT INTO public.timeline_warnings (stage_id, content, order_index)
SELECT 
  s.id,
  '골든타임 주의: 이 단계는 환자가 당황하여 실수를 가장 많이 하는 구간입니다. 의사에게 명확히 진술하고, 산재보험으로 처리 요청하는 것이 중요합니다.',
  1
FROM public.stages s WHERE s.step_number = 1;

INSERT INTO public.timeline_warnings (stage_id, content, order_index)
SELECT 
  s.id,
  '서류 준비 주의: 회사(사업주)가 도장을 안 찍어줘도 날인 불필요 제도로 사업주 동의 없이 신청 가능합니다. 회사가 "공상 처리(합의)"를 제안해도 산재가 장기적으로 유리합니다.',
  2
FROM public.stages s WHERE s.step_number = 1;

INSERT INTO public.timeline_warnings (stage_id, content, order_index)
SELECT 
  s.id,
  '접수 주의: 제출처는 회사가 아닌 근로복지공단 (사업장 관할 지사)입니다. 의료기관 대행 신청도 가능하니 병원 원무과에 부탁할 수 있습니다.',
  3
FROM public.stages s WHERE s.step_number = 1;

INSERT INTO public.timeline_warnings (stage_id, content, order_index)
SELECT 
  s.id,
  '조사 대기 주의: 업무상 질병(디스크, 뇌심혈관 등)의 경우 질병판정위원회가 열리고, 처리 기간이 사고보다 훨씬 길어질 수 있습니다. 마음의 준비를 하세요.',
  4
FROM public.stages s WHERE s.step_number = 1;

INSERT INTO public.timeline_warnings (stage_id, content, order_index)
SELECT 
  s.id,
  '결과 대응 주의: 불승인 시 이의 제기(심사 청구)가 가능하며, 노무사 등 전문가 상담이 필요한 시점입니다. 희망을 잃지 마세요.',
  5
FROM public.stages s WHERE s.step_number = 1;

-- 3. timeline_documents 테이블 업데이트 (서류 제목에 설명 추가)
-- 요양급여 신청서 제목 업데이트
UPDATE public.timeline_documents
SET title = '요양급여신청서 (환자가 쓰는 것)',
    updated_at = now()
WHERE stage_id IN (SELECT id FROM public.stages WHERE step_number = 1)
  AND title = '요양급여 신청서';

-- 초진소견서 제목 업데이트
UPDATE public.timeline_documents
SET title = '초진소견서 또는 진단서 (의사가 써주는 것 - 일반 진단서와 다름)',
    updated_at = now()
WHERE stage_id IN (SELECT id FROM public.stages WHERE step_number = 1)
  AND title = '초진소견서 또는 진단서';

-- 사고 경위서 제목 업데이트
UPDATE public.timeline_documents
SET title = '사고 경위서 (의무기록 사본 포함)',
    updated_at = now()
WHERE stage_id IN (SELECT id FROM public.stages WHERE step_number = 1)
  AND title = '사고 경위서';

-- 사업주 확인서 제목 업데이트
UPDATE public.timeline_documents
SET title = '사업주 확인서 (선택 - 사업주 동의 없이도 신청 가능)',
    updated_at = now()
WHERE stage_id IN (SELECT id FROM public.stages WHERE step_number = 1)
  AND title = '사업주 확인서';

















