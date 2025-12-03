-- 산재 지정 약국 테이블 생성
-- 근로복지공단 산재지정 약국 찾기 API 데이터 저장용
-- API: https://apis.data.go.kr/B490001/sjHptMcalPstateInfoService/getSjJijeongyakgukChakgiList

CREATE TABLE IF NOT EXISTS public.pharmacies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    hospital_nm TEXT NOT NULL, -- 약국명
    address TEXT NOT NULL, -- 주소
    latitude DOUBLE PRECISION NOT NULL DEFAULT 0, -- 위도 (Geocoding 후 업데이트)
    longitude DOUBLE PRECISION NOT NULL DEFAULT 0, -- 경도 (Geocoding 후 업데이트)
    tel TEXT, -- 전화번호
    fax_tel TEXT, -- 팩스번호 (선택적)
    gwanri_jisa_cd TEXT, -- 관리지사 코드
    jisa_nm TEXT, -- 관리지사명
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,

    -- 공간 검색을 위한 제약조건
    CONSTRAINT valid_coordinates CHECK (
        latitude >= -90 AND latitude <= 90 AND
        longitude >= -180 AND longitude <= 180
    )
);

-- 테이블 소유자 설정
ALTER TABLE public.pharmacies OWNER TO postgres;

-- RLS 비활성화 (개발 환경)
ALTER TABLE public.pharmacies DISABLE ROW LEVEL SECURITY;

-- 권한 부여
GRANT ALL ON TABLE public.pharmacies TO anon;
GRANT ALL ON TABLE public.pharmacies TO authenticated;
GRANT ALL ON TABLE public.pharmacies TO service_role;

-- 인덱스 생성 (성능 최적화)
-- 약국명 검색용
CREATE INDEX IF NOT EXISTS idx_pharmacies_hospital_nm
    ON public.pharmacies (hospital_nm);

-- 주소 검색용
CREATE INDEX IF NOT EXISTS idx_pharmacies_address
    ON public.pharmacies (address);

-- 관리지사 코드 검색용
CREATE INDEX IF NOT EXISTS idx_pharmacies_gwanri_jisa_cd
    ON public.pharmacies (gwanri_jisa_cd);

-- 공간 검색용 (Geocoding 후 사용)
CREATE INDEX IF NOT EXISTS idx_pharmacies_location
    ON public.pharmacies USING GIST (
        ll_to_earth(latitude, longitude)
    );

-- 중복 방지: 약국명 + 주소 조합이 유니크하도록
CREATE UNIQUE INDEX IF NOT EXISTS idx_pharmacies_unique
    ON public.pharmacies (hospital_nm, address);







