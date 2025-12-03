-- 타임라인 기능을 위한 테이블 생성
-- 산재 절차의 4단계(신청 → 요양 → 장해 → 복귀) 정보를 저장하는 테이블

-- 1. stages 테이블 생성 (단계 정보)
CREATE TABLE IF NOT EXISTS public.stages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    step_number INTEGER NOT NULL UNIQUE, -- 단계 번호 (1, 2, 3, 4)
    title TEXT NOT NULL, -- 단계 제목
    description TEXT NOT NULL, -- 단계 설명
    actions TEXT[] DEFAULT ARRAY[]::TEXT[], -- 해야 할 일 목록
    next_condition TEXT, -- 다음 단계로 넘어가는 조건
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 테이블 소유자 설정
ALTER TABLE public.stages OWNER TO postgres;

-- RLS 비활성화 (개발 환경)
ALTER TABLE public.stages DISABLE ROW LEVEL SECURITY;

-- 권한 부여
GRANT ALL ON TABLE public.stages TO anon;
GRANT ALL ON TABLE public.stages TO authenticated;
GRANT ALL ON TABLE public.stages TO service_role;

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_stages_step_number ON public.stages(step_number);
CREATE INDEX IF NOT EXISTS idx_stages_created_at ON public.stages(created_at DESC);

-- 2. timeline_documents 테이블 생성 (단계별 필수 서류)
-- 주의: 기존 documents 테이블과 충돌 방지를 위해 timeline_documents로 명명
CREATE TABLE IF NOT EXISTS public.timeline_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    stage_id UUID NOT NULL REFERENCES public.stages(id) ON DELETE CASCADE,
    title TEXT NOT NULL, -- 서류명
    pdf_url TEXT, -- PDF 링크 (공식 링크 또는 로컬 경로)
    is_required BOOLEAN DEFAULT true, -- 필수 여부
    order_index INTEGER DEFAULT 0, -- 표시 순서
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 테이블 소유자 설정
ALTER TABLE public.timeline_documents OWNER TO postgres;

-- RLS 비활성화 (개발 환경)
ALTER TABLE public.timeline_documents DISABLE ROW LEVEL SECURITY;

-- 권한 부여
GRANT ALL ON TABLE public.timeline_documents TO anon;
GRANT ALL ON TABLE public.timeline_documents TO authenticated;
GRANT ALL ON TABLE public.timeline_documents TO service_role;

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_timeline_documents_stage_id ON public.timeline_documents(stage_id);
CREATE INDEX IF NOT EXISTS idx_timeline_documents_order ON public.timeline_documents(stage_id, order_index);

-- 3. timeline_warnings 테이블 생성 (단계별 주의사항)
CREATE TABLE IF NOT EXISTS public.timeline_warnings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    stage_id UUID NOT NULL REFERENCES public.stages(id) ON DELETE CASCADE,
    content TEXT NOT NULL, -- 주의사항 내용
    order_index INTEGER DEFAULT 0, -- 표시 순서
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 테이블 소유자 설정
ALTER TABLE public.timeline_warnings OWNER TO postgres;

-- RLS 비활성화 (개발 환경)
ALTER TABLE public.timeline_warnings DISABLE ROW LEVEL SECURITY;

-- 권한 부여
GRANT ALL ON TABLE public.timeline_warnings TO anon;
GRANT ALL ON TABLE public.timeline_warnings TO authenticated;
GRANT ALL ON TABLE public.timeline_warnings TO service_role;

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_timeline_warnings_stage_id ON public.timeline_warnings(stage_id);
CREATE INDEX IF NOT EXISTS idx_timeline_warnings_order ON public.timeline_warnings(stage_id, order_index);

-- 4. Seed 데이터 입력
-- Step 1: 산재 최초 신청 (인정 단계)
INSERT INTO public.stages (step_number, title, description, actions, next_condition) VALUES
(1, '산재 최초 신청 (인정 단계)', '산업재해 발생 후 공단에 최초로 신청하여 산재 인정을 받는 단계입니다.', 
 ARRAY['사고 즉시 병원 방문', '요양급여신청서 접수 (사업주 동의 불필요)'],
 '공단 요양 승인 통보')
ON CONFLICT (step_number) DO NOTHING;

-- Step 1의 필수 서류
INSERT INTO public.timeline_documents (stage_id, title, pdf_url, is_required, order_index)
SELECT 
    s.id,
    '요양급여 신청서',
    '/pdf/요양급여신청서.pdf',
    true,
    1
FROM public.stages s WHERE s.step_number = 1
ON CONFLICT DO NOTHING;

INSERT INTO public.timeline_documents (stage_id, title, pdf_url, is_required, order_index)
SELECT 
    s.id,
    '초진소견서 또는 진단서',
    NULL,
    true,
    2
FROM public.stages s WHERE s.step_number = 1
ON CONFLICT DO NOTHING;

INSERT INTO public.timeline_documents (stage_id, title, pdf_url, is_required, order_index)
SELECT 
    s.id,
    '사고 경위서',
    NULL,
    true,
    3
FROM public.stages s WHERE s.step_number = 1
ON CONFLICT DO NOTHING;

INSERT INTO public.timeline_documents (stage_id, title, pdf_url, is_required, order_index)
SELECT 
    s.id,
    '사업주 확인서',
    NULL,
    false,
    4
FROM public.stages s WHERE s.step_number = 1
ON CONFLICT DO NOTHING;

-- Step 1의 주의사항
INSERT INTO public.timeline_warnings (stage_id, content, order_index)
SELECT 
    s.id,
    '회사가 산재 접수 방해할 수 있습니다. 사업주 동의 없이도 신청 가능합니다.',
    1
FROM public.stages s WHERE s.step_number = 1
ON CONFLICT DO NOTHING;

INSERT INTO public.timeline_warnings (stage_id, content, order_index)
SELECT 
    s.id,
    '3년 초과 접수 시 불인정 가능성이 있습니다. 가능한 한 빨리 신청하세요.',
    2
FROM public.stages s WHERE s.step_number = 1
ON CONFLICT DO NOTHING;

-- Step 2: 요양 및 치료 + 휴업급여
INSERT INTO public.stages (step_number, title, description, actions, next_condition) VALUES
(2, '요양 및 치료 + 휴업급여', '산재 인정 후 치료를 받으면서 매월 휴업급여를 청구하는 단계입니다.',
 ARRAY['치료 지속', '매월 휴업급여 청구'],
 '치료 종결 판정')
ON CONFLICT (step_number) DO NOTHING;

-- Step 2의 필수 서류
INSERT INTO public.timeline_documents (stage_id, title, pdf_url, is_required, order_index)
SELECT 
    s.id,
    '휴업급여 청구서',
    '/pdf/휴업급여신청서.pdf',
    true,
    1
FROM public.stages s WHERE s.step_number = 2
ON CONFLICT DO NOTHING;

INSERT INTO public.timeline_documents (stage_id, title, pdf_url, is_required, order_index)
SELECT 
    s.id,
    '진료비 영수증',
    NULL,
    true,
    2
FROM public.stages s WHERE s.step_number = 2
ON CONFLICT DO NOTHING;

INSERT INTO public.timeline_documents (stage_id, title, pdf_url, is_required, order_index)
SELECT 
    s.id,
    '요양비 청구서 (비지정 병원)',
    '/pdf/요양급여신청서.pdf',
    false,
    3
FROM public.stages s WHERE s.step_number = 2
ON CONFLICT DO NOTHING;

INSERT INTO public.timeline_documents (stage_id, title, pdf_url, is_required, order_index)
SELECT 
    s.id,
    '진료계획서 (연장 시)',
    NULL,
    false,
    4
FROM public.stages s WHERE s.step_number = 2
ON CONFLICT DO NOTHING;

-- Step 2의 주의사항
INSERT INTO public.timeline_warnings (stage_id, content, order_index)
SELECT 
    s.id,
    '무단 근로 시 급여 환수될 수 있습니다. 치료 중에는 근로를 하지 마세요.',
    1
FROM public.stages s WHERE s.step_number = 2
ON CONFLICT DO NOTHING;

INSERT INTO public.timeline_warnings (stage_id, content, order_index)
SELECT 
    s.id,
    '요양 중단 판정 위험이 있습니다. 정기적으로 병원에 방문하여 치료를 지속하세요.',
    2
FROM public.stages s WHERE s.step_number = 2
ON CONFLICT DO NOTHING;

-- Step 3: 치료 종결 및 장해 심사
INSERT INTO public.stages (step_number, title, description, actions, next_condition) VALUES
(3, '치료 종결 및 장해 심사', '치료가 끝난 후 영구적인 장해가 남았을 때 장해급여를 청구하는 단계입니다.',
 ARRAY['장해급여 청구 여부 결정'],
 '장해 등급 확정')
ON CONFLICT (step_number) DO NOTHING;

-- Step 3의 필수 서류
INSERT INTO public.timeline_documents (stage_id, title, pdf_url, is_required, order_index)
SELECT 
    s.id,
    '장해급여 청구서',
    'https://www.comwel.or.kr/comwel/comwelBoard.do?menuId=comwel0304000000',
    true,
    1
FROM public.stages s WHERE s.step_number = 3
ON CONFLICT DO NOTHING;

INSERT INTO public.timeline_documents (stage_id, title, pdf_url, is_required, order_index)
SELECT 
    s.id,
    '장해진단서',
    NULL,
    true,
    2
FROM public.stages s WHERE s.step_number = 3
ON CONFLICT DO NOTHING;

INSERT INTO public.timeline_documents (stage_id, title, pdf_url, is_required, order_index)
SELECT 
    s.id,
    'MRI / X-ray CD',
    NULL,
    true,
    3
FROM public.stages s WHERE s.step_number = 3
ON CONFLICT DO NOTHING;

INSERT INTO public.timeline_documents (stage_id, title, pdf_url, is_required, order_index)
SELECT 
    s.id,
    '수술기록지',
    NULL,
    false,
    4
FROM public.stages s WHERE s.step_number = 3
ON CONFLICT DO NOTHING;

-- Step 3의 주의사항
INSERT INTO public.timeline_warnings (stage_id, content, order_index)
SELECT 
    s.id,
    '5년 초과 시 청구권 소멸됩니다. 치료 종결 후 가능한 한 빨리 청구하세요. (단, 과거법 적용 시 3년일 수 있으므로 3년 이내에 청구하는 것이 안전합니다)',
    1
FROM public.stages s WHERE s.step_number = 3
ON CONFLICT DO NOTHING;

INSERT INTO public.timeline_warnings (stage_id, content, order_index)
SELECT 
    s.id,
    '등급 불인정 분쟁이 발생할 수 있습니다. 주치의 소견은 참고 자료이며, 결정 권한은 공단에 있습니다.',
    2
FROM public.stages s WHERE s.step_number = 3
ON CONFLICT DO NOTHING;

INSERT INTO public.timeline_warnings (stage_id, content, order_index)
SELECT 
    s.id,
    'MRI, X-ray CD를 반드시 제출해야 합니다. 영상 자료 없이는 심사가 불가능합니다.',
    3
FROM public.stages s WHERE s.step_number = 3
ON CONFLICT DO NOTHING;

-- Step 4: 사회 복귀 및 직업 재활
INSERT INTO public.stages (step_number, title, description, actions, next_condition) VALUES
(4, '사회 복귀 및 직업 재활', '치료가 끝난 후 원래 직장으로 복귀하거나 새로운 직업을 위한 재활 훈련을 받는 단계입니다.',
 ARRAY['원직 복귀 또는 직업훈련 신청'],
 '재취업 안정 또는 재활 종료')
ON CONFLICT (step_number) DO NOTHING;

-- Step 4의 필수 서류
INSERT INTO public.timeline_documents (stage_id, title, pdf_url, is_required, order_index)
SELECT 
    s.id,
    '직업재활급여 신청서',
    NULL,
    true,
    1
FROM public.stages s WHERE s.step_number = 4
ON CONFLICT DO NOTHING;

INSERT INTO public.timeline_documents (stage_id, title, pdf_url, is_required, order_index)
SELECT 
    s.id,
    '위탁훈련계획서',
    NULL,
    false,
    2
FROM public.stages s WHERE s.step_number = 4
ON CONFLICT DO NOTHING;

INSERT INTO public.timeline_documents (stage_id, title, pdf_url, is_required, order_index)
SELECT 
    s.id,
    '취업확인서',
    NULL,
    false,
    3
FROM public.stages s WHERE s.step_number = 4
ON CONFLICT DO NOTHING;

-- Step 4의 주의사항
INSERT INTO public.timeline_warnings (stage_id, content, order_index)
SELECT 
    s.id,
    '복귀 거부, 재취업 실패 등의 문제가 발생할 수 있습니다. 직업재활 상담을 받아보세요.',
    1
FROM public.stages s WHERE s.step_number = 4
ON CONFLICT DO NOTHING;

-- 코멘트 추가
COMMENT ON TABLE public.stages IS '산재 절차의 단계별 정보를 저장하는 테이블';
COMMENT ON TABLE public.timeline_documents IS '각 단계별로 필요한 필수 서류 정보를 저장하는 테이블';
COMMENT ON TABLE public.timeline_warnings IS '각 단계별 주의사항 및 분쟁 포인트를 저장하는 테이블';

COMMENT ON COLUMN public.stages.step_number IS '단계 번호 (1: 신청, 2: 요양, 3: 장해, 4: 복귀)';
COMMENT ON COLUMN public.stages.actions IS '해야 할 일 목록 (배열)';
COMMENT ON COLUMN public.timeline_documents.pdf_url IS 'PDF 링크 (공식 링크 또는 로컬 경로 /pdf/...)';
COMMENT ON COLUMN public.timeline_documents.is_required IS '필수 서류 여부 (true: 필수, false: 선택)';


