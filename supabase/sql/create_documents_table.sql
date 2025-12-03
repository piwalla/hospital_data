-- RAG용 documents 벡터 테이블 생성 (SQL Editor에서 직접 실행용)
-- 주의: 이 스크립트는 vector extension이 이미 설치되어 있다고 가정합니다
-- 벡터 차원: 1536 (Gemini embedding)

-- 1. 기존 documents 테이블이 있으면 삭제 (주의: 모든 데이터가 삭제됩니다)
DROP TABLE IF EXISTS public.documents CASCADE;

-- 2. documents 테이블 생성 (벡터 차원: 1536)
CREATE TABLE public.documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content TEXT NOT NULL, -- 문서 내용
    metadata JSONB, -- 메타데이터 (문서 ID, 제목, 카테고리 등)
    embedding vector(1536), -- Gemini embedding 벡터 (1536 차원)
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 테이블 소유자 설정
ALTER TABLE public.documents OWNER TO postgres;

-- RLS 비활성화 (개발 환경)
ALTER TABLE public.documents DISABLE ROW LEVEL SECURITY;

-- 권한 부여
GRANT ALL ON TABLE public.documents TO anon;
GRANT ALL ON TABLE public.documents TO authenticated;
GRANT ALL ON TABLE public.documents TO service_role;

-- 3. 벡터 검색을 위한 인덱스 생성 (HNSW 알고리즘 사용)
CREATE INDEX documents_embedding_idx 
ON public.documents 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- 4. 메타데이터 검색을 위한 인덱스
CREATE INDEX idx_documents_metadata 
ON public.documents 
USING gin (metadata);

-- 5. 생성일시 인덱스
CREATE INDEX idx_documents_created_at 
ON public.documents (created_at DESC);

-- 완료 메시지
DO $$
BEGIN
    RAISE NOTICE 'documents 테이블이 성공적으로 생성되었습니다. (벡터 차원: 1536)';
END $$;



