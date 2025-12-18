-- 직장 복귀하거나 재취업하기 단계 내용 개선
-- docs/산재 직장 복귀_재취업하기.md 문서의 상세 내용을 기반으로 Step 4의 내용을 업데이트합니다.

-- 1. stages 테이블 업데이트 (Step 4)
UPDATE public.stages
SET 
  description = '산재 치료를 종결한 근로자는 근로복지공단의 다양한 직업 재활 및 복귀 지원 서비스를 활용하여 사회 및 일터로 복귀할 수 있습니다. 이 단계에서는 직업 재활 서비스, 재정 지원 제도, 그리고 필요한 서류와 주의사항을 명확히 이해하는 것이 중요합니다.',
  actions = ARRAY[
    '작업 능력 강화 프로그램 참여: 다시 일하는 데 필요한 신체적, 직업적 능력을 향상시키기 위해 공단 병원 등에서 작업 능력 강화 프로그램(Work Hardening Program)을 제공받을 수 있습니다',
    '직무지원형 재활보조기구 신청: 일반 재활보조기구와 달리, 직무 수행 능력을 강화하는 데 초점을 맞춘 직무지원형 재활보조기구 지원사업을 활용하여 잔존 기능을 보완할 수 있습니다',
    '직업 훈련 및 재취업 지원: 실직 중인 산재 장해인(제1급~제12급)은 새로운 기술 습득을 위한 직업훈련 비용과 수당을 지원받을 수 있으며, 취업성공패키지 및 취업전문 민간위탁기관과의 연계 등 맞춤형 취업알선 서비스를 무료로 받을 수 있습니다',
    '직업훈련생 생계비 대부: 140시간 이상의 훈련과정에 참여하는 훈련생 중 소득 요건을 충족하는 경우, 생계비 부담 없이 훈련을 받을 수 있도록 월 200만 원 한도(총 1,000만 원 또는 2,000만 원 한도)의 대부를 연리 1.0%로 받을 수 있습니다',
    '직장 적응 훈련비 신청: 요양 종결일 또는 직장 복귀일 이후 6개월 이내에 직무 관련 적응 훈련을 하는 경우 월 45만 원 범위 내에서 최대 3개월간 135만 원이 지원됩니다',
    '재활 운동비 신청: 잔존 기능 향상 및 유지를 위한 재활 운동을 하는 경우 월 15만 원 범위 내에서 최대 3개월간 45만 원이 지원됩니다',
    '장해와 장애의 구분 및 등록: 산재보험에서 결정하는 장해는 노동 능력 상실에 대한 보상을 목적으로 하며, 복지 혜택을 받기 위한 장애인 등록(복지 장애)은 별개의 절차입니다. 복지 혜택을 원한다면 주민센터에 별도로 장애인 등록을 신청하고 심사를 받아야 합니다'
  ],
  updated_at = now()
WHERE step_number = 4;

-- 2. timeline_documents 테이블 업데이트 (Step 4의 기존 서류 삭제 후 새로 추가)
-- 기존 서류 삭제
DELETE FROM public.timeline_documents
WHERE stage_id IN (SELECT id FROM public.stages WHERE step_number = 4);

-- 새로운 서류 추가
-- 장해급여 청구 시 필수 서류
INSERT INTO public.timeline_documents (stage_id, title, pdf_url, is_required, order_index)
SELECT 
  s.id,
  '장해급여 청구서 (치유일로부터 3년 이내)',
  NULL,
  true,
  1
FROM public.stages s WHERE s.step_number = 4;

INSERT INTO public.timeline_documents (stage_id, title, pdf_url, is_required, order_index)
SELECT 
  s.id,
  '산재보험 지정 의료기관 주치의가 발급한 장해 진단서 (장해 상태 및 등급 산정의 직접적 근거)',
  NULL,
  true,
  2
FROM public.stages s WHERE s.step_number = 4;

INSERT INTO public.timeline_documents (stage_id, title, pdf_url, is_required, order_index)
SELECT 
  s.id,
  '의료 영상 자료 (CD 등) 및 진료 기록부 (진단의 객관적 증빙 자료, 향후 재요양 신청 시 상병 악화 증명 자료로 활용되므로 사본 형태로 영구 보존 필수)',
  NULL,
  true,
  3
FROM public.stages s WHERE s.step_number = 4;

-- 직업 재활 서비스 신청 시 서류
INSERT INTO public.timeline_documents (stage_id, title, pdf_url, is_required, order_index)
SELECT 
  s.id,
  '취업지원서비스 참가신청서',
  NULL,
  true,
  4
FROM public.stages s WHERE s.step_number = 4;

INSERT INTO public.timeline_documents (stage_id, title, pdf_url, is_required, order_index)
SELECT 
  s.id,
  '개인정보 수집·이용 및 제3자 제공 동의서',
  NULL,
  true,
  5
FROM public.stages s WHERE s.step_number = 4;

INSERT INTO public.timeline_documents (stage_id, title, pdf_url, is_required, order_index)
SELECT 
  s.id,
  '취업준비도 평가',
  NULL,
  true,
  6
FROM public.stages s WHERE s.step_number = 4;

-- 재요양 신청 시 서류 (선택)
INSERT INTO public.timeline_documents (stage_id, title, pdf_url, is_required, order_index)
SELECT 
  s.id,
  '재요양신청서 (치유 종결 후 업무상 부상 또는 질병이 재발하거나 상태가 악화된 경우)',
  NULL,
  false,
  7
FROM public.stages s WHERE s.step_number = 4;

INSERT INTO public.timeline_documents (stage_id, title, pdf_url, is_required, order_index)
SELECT 
  s.id,
  '의료기관의 재요양소견서 (재요양의 대상이 되는 상병, 치료기간, 재요양 사유 등이 명시된 진단(소견)서로 대체 가능)',
  NULL,
  false,
  8
FROM public.stages s WHERE s.step_number = 4;

INSERT INTO public.timeline_documents (stage_id, title, pdf_url, is_required, order_index)
SELECT 
  s.id,
  '사업주 또는 제3자로부터 보상금이나 배상금을 받았는지 확인할 수 있는 서류 (합의서, 판결문 등)',
  NULL,
  false,
  9
FROM public.stages s WHERE s.step_number = 4;

-- 3. timeline_warnings 테이블 업데이트 (Step 4의 기존 주의사항 삭제 후 새로 추가)
-- 기존 주의사항 삭제
DELETE FROM public.timeline_warnings
WHERE stage_id IN (SELECT id FROM public.stages WHERE step_number = 4);

-- 새로운 주의사항 추가
-- 법적 소멸시효 관리
INSERT INTO public.timeline_warnings (stage_id, content, order_index)
SELECT 
  s.id,
  '장해급여 청구 기한: 장해급여 청구 시효는 치유일로부터 3년입니다. 반드시 이 기한 내에 청구해야 합니다.',
  1
FROM public.stages s WHERE s.step_number = 4;

INSERT INTO public.timeline_warnings (stage_id, content, order_index)
SELECT 
  s.id,
  '민사 손해배상 청구 시효 (매우 중요): 사업주나 제3자의 고의 또는 과실로 인해 손해를 입은 경우, 산재 급여와 별개로 민사 손해배상을 청구할 수 있습니다. 원청 등 제3자에 대한 불법행위 청구 시효는 손해 및 가해자를 안 날로부터 3년이며, 고용주(회사)에 대한 채무불이행 청구 시효는 10년입니다. 사고 발생일로부터 3년이 지나면 원청 등 제3자에 대한 청구권이 소멸될 위험이 높으므로, 장해 판정을 기다리지 않고 이 기한 내에 신속하게 법률 전문가와 상담하여 권리를 보존해야 합니다.',
  2
FROM public.stages s WHERE s.step_number = 4;

INSERT INTO public.timeline_warnings (stage_id, content, order_index)
SELECT 
  s.id,
  '산재 결정에 대한 불복 기한: 근로복지공단의 급여 결정에 불복하여 재심사 청구를 하고자 할 경우, 심사 청구에 대한 결정이 있음을 안 날로부터 90일 이내에 산업재해보상보험재심사위원회에 제기해야 합니다.',
  3
FROM public.stages s WHERE s.step_number = 4;

-- 재요양 승인 요건 및 불인정 주의사항
INSERT INTO public.timeline_warnings (stage_id, content, order_index)
SELECT 
  s.id,
  '재요양 승인 요건: 재요양은 이미 치유된 상병이 재발하거나 현저하게 악화되었고, 수술이나 집중 재활 등 적극적인 치료를 통해 노동 능력이 호전될 치료 기대 효과가 객관적으로 입증되어야만 승인됩니다. 나이나 그 밖의 업무 외 사유로 악화된 경우, 또는 치료를 해도 호전 가능성이 희박하여 치료 기대 효과가 적은 경우에는 재요양이 인정되지 않거나 승인받기 어렵습니다.',
  4
FROM public.stages s WHERE s.step_number = 4;

-- 기타 재활 및 재정적 주의사항
INSERT INTO public.timeline_warnings (stage_id, content, order_index)
SELECT 
  s.id,
  '직장 복귀 시 해고 제한: 사업주는 산재 요양으로 휴업한 기간과 그 후 30일 동안은 근로자를 해고할 수 없습니다.',
  5
FROM public.stages s WHERE s.step_number = 4;

INSERT INTO public.timeline_warnings (stage_id, content, order_index)
SELECT 
  s.id,
  '재취업 지원 기한: 근로복지공단의 직업 훈련 및 재취업 지원 프로그램은 일반적으로 장해 등급 판정일로부터 3년 이내에 신청하는 것이 좋습니다.',
  6
FROM public.stages s WHERE s.step_number = 4;

INSERT INTO public.timeline_warnings (stage_id, content, order_index)
SELECT 
  s.id,
  '연금 조정: 산재 장해급여(연금)와 국민연금 장애연금을 동시에 수령할 경우, 이중 보상을 방지하기 위해 국민연금 장애연금액의 1/2에 해당하는 금액이 감액되어 지급됩니다. 국민연금 장애연금을 받으려면 초진일 요건과 국민연금 보험료 납부 요건을 모두 충족해야 합니다.',
  7
FROM public.stages s WHERE s.step_number = 4;










