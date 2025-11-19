-- 서류 요약 캐시 테이블 생성
-- AI 생성 서류 요약 가이드를 캐싱하여 성능을 향상시킵니다.
-- TTL: 7일

CREATE TABLE IF NOT EXISTS public.document_summaries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    document_id TEXT NOT NULL UNIQUE, -- 서류 ID (예: "workplace-accident-application")
    summary TEXT NOT NULL, -- 전체 요약
    sections JSONB NOT NULL DEFAULT '[]'::jsonb, -- 주요 항목별 작성 방법 (DocumentSection[])
    important_notes TEXT[] DEFAULT ARRAY[]::TEXT[], -- 주의사항 목록
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL, -- 만료 일시 (7일 후)
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 테이블 소유자 설정
ALTER TABLE public.document_summaries OWNER TO postgres;

-- RLS 비활성화 (개발 환경)
ALTER TABLE public.document_summaries DISABLE ROW LEVEL SECURITY;

-- 권한 부여
GRANT ALL ON TABLE public.document_summaries TO anon;
GRANT ALL ON TABLE public.document_summaries TO authenticated;
GRANT ALL ON TABLE public.document_summaries TO service_role;

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_document_summaries_document_id
    ON public.document_summaries(document_id);

CREATE INDEX IF NOT EXISTS idx_document_summaries_created_at
    ON public.document_summaries(created_at);

CREATE INDEX IF NOT EXISTS idx_document_summaries_expires_at
    ON public.document_summaries(expires_at);

-- 만료된 캐시 자동 삭제를 위한 함수 (선택사항)
-- 주기적으로 실행할 수 있는 함수
CREATE OR REPLACE FUNCTION cleanup_expired_document_summaries()
RETURNS void AS $$
BEGIN
    DELETE FROM public.document_summaries
    WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql;





