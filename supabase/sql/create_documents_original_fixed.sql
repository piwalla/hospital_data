-- 원본 스크립트 수정 버전 (extension 에러 해결)
-- 
-- 해결 방법: create extension vector; 부분을 제거하거나 IF NOT EXISTS로 변경

-- 방법 1: Extension이 이미 있다면 이 줄을 주석 처리하거나 삭제
-- create extension vector;

-- 방법 2: Extension이 없을 수도 있다면 아래 줄 사용 (권장)
CREATE EXTENSION IF NOT EXISTS vector;

-- Create a table to store your documents
CREATE TABLE documents (
    id BIGSERIAL PRIMARY KEY,
    content TEXT, -- corresponds to Document.pageContent
    metadata JSONB, -- corresponds to Document.metadata
    embedding vector(1536) -- 1536 works for Gemini embeddings, change if needed
);

-- 테이블 소유자 및 권한 설정
ALTER TABLE public.documents OWNER TO postgres;
ALTER TABLE public.documents DISABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.documents TO anon;
GRANT ALL ON TABLE public.documents TO authenticated;
GRANT ALL ON TABLE public.documents TO service_role;

-- 벡터 검색을 위한 인덱스 생성 (성능 향상)
CREATE INDEX documents_embedding_idx 
ON public.documents 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- 메타데이터 검색을 위한 인덱스
CREATE INDEX idx_documents_metadata 
ON public.documents 
USING gin (metadata);

-- Create a function to search for documents
CREATE FUNCTION match_documents (
    query_embedding vector(1536),
    match_count int DEFAULT NULL,
    filter jsonb DEFAULT '{}'
) 
RETURNS TABLE (
    id bigint,
    content text,
    metadata jsonb,
    similarity float
)
LANGUAGE plpgsql
AS $$
#variable_conflict use_column
BEGIN
    RETURN QUERY
    SELECT
        id,
        content,
        metadata,
        1 - (documents.embedding <=> query_embedding) AS similarity
    FROM documents
    WHERE metadata @> filter
    ORDER BY documents.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;



