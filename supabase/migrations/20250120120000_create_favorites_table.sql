-- 즐겨찾기 테이블 생성
-- 사용자가 선택한 의료기관(병원/약국/재활기관)을 즐겨찾기에 등록하는 테이블

CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL CHECK (entity_type IN ('hospital', 'rehabilitation_center')),
    entity_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    
    -- 사용자는 같은 의료기관을 중복으로 즐겨찾기할 수 없음
    CONSTRAINT unique_user_favorite UNIQUE (user_id, entity_type, entity_id)
);

-- 테이블 소유자 설정
ALTER TABLE public.favorites OWNER TO postgres;

-- Row Level Security (RLS) 비활성화 (개발 환경)
ALTER TABLE public.favorites DISABLE ROW LEVEL SECURITY;

-- 권한 부여
GRANT ALL ON TABLE public.favorites TO anon;
GRANT ALL ON TABLE public.favorites TO authenticated;
GRANT ALL ON TABLE public.favorites TO service_role;

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_entity ON public.favorites(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_favorites_created_at ON public.favorites(created_at DESC);





