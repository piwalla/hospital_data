-- RAG용 documents 벡터 테이블 생성
-- Gemini 모델용 벡터 차원: 1536
-- Langchain과 Supabase Vector Store를 위한 테이블

-- 1. vector extension 확인 (이미 존재하면 무시)
-- 주의: extension이 이미 존재하는 경우 이 구문은 에러를 발생시킬 수 있으므로
-- Supabase SQL Editor에서 직접 실행할 때는 이 부분을 제거하거나 주석 처리하세요
-- CREATE EXTENSION IF NOT EXISTS vector;

-- 2. 기존 documents 테이블이 있으면 삭제 (주의: 모든 데이터가 삭제됩니다)
DROP TABLE IF EXISTS public.documents CASCADE;

-- 3. documents 테이블 생성 (벡터 차원: 1536)
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

-- 4. 벡터 검색을 위한 인덱스 생성 (HNSW 알고리즘 사용)
-- HNSW는 빠른 유사도 검색을 위한 인덱스입니다
CREATE INDEX IF NOT EXISTS documents_embedding_idx 
ON public.documents 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- 5. 메타데이터 검색을 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_documents_metadata 
ON public.documents 
USING gin (metadata);

-- 6. 생성일시 인덱스
CREATE INDEX IF NOT EXISTS idx_documents_created_at 
ON public.documents (created_at DESC);

-- 7. 코멘트 추가
COMMENT ON TABLE public.documents IS 'RAG용 문서 벡터 저장소 (Gemini embedding: 1536 차원)';
COMMENT ON COLUMN public.documents.content IS '문서의 원본 텍스트 내용';
COMMENT ON COLUMN public.documents.metadata IS '문서 메타데이터 (JSON 형식)';
COMMENT ON COLUMN public.documents.embedding IS 'Gemini embedding 벡터 (1536 차원)';



