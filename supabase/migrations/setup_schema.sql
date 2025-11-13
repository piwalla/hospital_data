-- 리워크케어(ReWorkCare) 데이터베이스 스키마 설정
-- Supabase SQL Editor에서 실행 가능

-- 1. USERS 테이블 생성 (Clerk 연동용)

-- Clerk 인증과 연동되는 사용자 정보를 저장하는 테이블
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    clerk_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 테이블 소유자 설정
ALTER TABLE public.users OWNER TO postgres;

-- Row Level Security (RLS) 비활성화
-- 이 프로젝트는 RLS를 사용하지 않습니다
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- 권한 부여
GRANT ALL ON TABLE public.users TO anon;
GRANT ALL ON TABLE public.users TO authenticated;
GRANT ALL ON TABLE public.users TO service_role;

-- 2. 병원/약국 캐시 테이블 생성

-- 산재 지정 의료기관 정보를 캐시하는 테이블
CREATE TABLE IF NOT EXISTS public.hospitals_pharmacies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('hospital', 'pharmacy')),
    address TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    phone TEXT,
    department TEXT, -- 병원 진료과목 (약국은 NULL)
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,

    -- 공간 검색을 위한 제약조건
    CONSTRAINT valid_coordinates CHECK (
        latitude >= -90 AND latitude <= 90 AND
        longitude >= -180 AND longitude <= 180
    )
);

-- 테이블 소유자 설정
ALTER TABLE public.hospitals_pharmacies OWNER TO postgres;

-- RLS 비활성화
ALTER TABLE public.hospitals_pharmacies DISABLE ROW LEVEL SECURITY;

-- 권한 부여
GRANT ALL ON TABLE public.hospitals_pharmacies TO anon;
GRANT ALL ON TABLE public.hospitals_pharmacies TO authenticated;
GRANT ALL ON TABLE public.hospitals_pharmacies TO service_role;

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_hospitals_pharmacies_location
ON public.hospitals_pharmacies USING gist (point(longitude, latitude));

CREATE INDEX IF NOT EXISTS idx_hospitals_pharmacies_type
ON public.hospitals_pharmacies (type);

CREATE INDEX IF NOT EXISTS idx_hospitals_pharmacies_last_updated
ON public.hospitals_pharmacies (last_updated);

-- 3. 사용자 활동 로그 테이블 생성

-- 사용자 행동 패턴을 분석하기 위한 로그 테이블
CREATE TABLE IF NOT EXISTS public.user_activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID, -- Clerk 사용자 ID (익명 사용자 허용)
    action TEXT NOT NULL, -- 액션 유형 ('page_view', 'search', 'download', 'share' 등)
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    meta JSONB, -- 추가 메타데이터 (검색어, 클릭 항목, 위치 정보 등)

    -- 사용자 ID가 있는 경우 users 테이블 참조
    CONSTRAINT fk_user_activity_logs_user_id
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL
);

-- 테이블 소유자 설정
ALTER TABLE public.user_activity_logs OWNER TO postgres;

-- RLS 비활성화
ALTER TABLE public.user_activity_logs DISABLE ROW LEVEL SECURITY;

-- 권한 부여
GRANT ALL ON TABLE public.user_activity_logs TO anon;
GRANT ALL ON TABLE public.user_activity_logs TO authenticated;
GRANT ALL ON TABLE public.user_activity_logs TO service_role;

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_user_id
ON public.user_activity_logs (user_id);

CREATE INDEX IF NOT EXISTS idx_user_activity_logs_action
ON public.user_activity_logs (action);

CREATE INDEX IF NOT EXISTS idx_user_activity_logs_timestamp
ON public.user_activity_logs (timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_user_activity_logs_meta
ON public.user_activity_logs USING gin (meta);
