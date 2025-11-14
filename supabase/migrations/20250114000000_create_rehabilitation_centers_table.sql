-- 재활기관 테이블 생성
-- 근로복지공단 산재재활기관관리정보 API 데이터 저장용

CREATE TABLE IF NOT EXISTS public.rehabilitation_centers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    gigwan_nm TEXT NOT NULL, -- 기관명
    gigwan_fg TEXT, -- 기관구분 코드
    gigwan_fg_nm TEXT, -- 기관구분명 (직업훈련기관, 재활스포츠 위탁기관, 심리재활프로그램 위탁기관)
    address TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL DEFAULT 0,
    longitude DOUBLE PRECISION NOT NULL DEFAULT 0,
    tel_no TEXT, -- 전화번호
    fax_no TEXT, -- 팩스번호
    gwanri_jisa_cd TEXT, -- 관리지사 코드
    jisa_nm TEXT, -- 관리지사명
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,

    -- 공간 검색을 위한 제약조건
    CONSTRAINT valid_coordinates CHECK (
        latitude >= -90 AND latitude <= 90 AND
        longitude >= -180 AND longitude <= 180
    )
);

-- 테이블 소유자 설정
ALTER TABLE public.rehabilitation_centers OWNER TO postgres;

-- RLS 비활성화 (개발 환경)
ALTER TABLE public.rehabilitation_centers DISABLE ROW LEVEL SECURITY;

-- 권한 부여
GRANT ALL ON TABLE public.rehabilitation_centers TO anon;
GRANT ALL ON TABLE public.rehabilitation_centers TO authenticated;
GRANT ALL ON TABLE public.rehabilitation_centers TO service_role;

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_rehabilitation_centers_location
    ON public.rehabilitation_centers USING GIST (
        ll_to_earth(latitude, longitude)
    );

CREATE INDEX IF NOT EXISTS idx_rehabilitation_centers_gigwan_fg_nm
    ON public.rehabilitation_centers (gigwan_fg_nm);

CREATE INDEX IF NOT EXISTS idx_rehabilitation_centers_name
    ON public.rehabilitation_centers (gigwan_nm);

