-- 마이그레이션: 기관 유형 및 진료과목 컬럼 추가
-- 목적: hospitals_pharmacies 테이블에 기관 유형(institution_type)과 추출된 진료과목(department_extracted) 컬럼 추가
-- 날짜: 2025-01-14

-- 1. 기관 유형 컬럼 추가
-- 기관명에서 추출한 기관 유형 (대학병원, 종합병원, 병원, 의원, 한의원, 요양병원, 기타)
ALTER TABLE public.hospitals_pharmacies
ADD COLUMN IF NOT EXISTS institution_type TEXT;

-- 2. 추출된 진료과목 컬럼 추가
-- 기관명에서 추출한 진료과목 (정형외과, 신경외과, 재활의학과 등)
-- 여러 과목이 있는 경우 쉼표로 구분된 문자열로 저장
ALTER TABLE public.hospitals_pharmacies
ADD COLUMN IF NOT EXISTS department_extracted TEXT;

-- 3. 인덱스 추가 (필터링 성능 향상)
CREATE INDEX IF NOT EXISTS idx_hospitals_pharmacies_institution_type 
ON public.hospitals_pharmacies(institution_type);

CREATE INDEX IF NOT EXISTS idx_hospitals_pharmacies_department_extracted 
ON public.hospitals_pharmacies(department_extracted);

-- 4. 컬럼 코멘트 추가
COMMENT ON COLUMN public.hospitals_pharmacies.institution_type IS '기관 유형: 대학병원, 종합병원, 병원, 의원, 한의원, 요양병원, 기타';
COMMENT ON COLUMN public.hospitals_pharmacies.department_extracted IS '기관명에서 추출한 진료과목 (여러 과목은 쉼표로 구분)';
















