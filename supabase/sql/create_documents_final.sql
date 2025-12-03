-- RAG용 documents 벡터 테이블 및 검색 함수 생성
-- 벡터 차원: 1536 (Gemini embedding)

-- 1. 기존 함수 삭제 (이미 존재하는 경우)
DROP FUNCTION IF EXISTS match_documents(vector, int, jsonb);

-- 2. 기존 테이블 삭제 (주의: 모든 데이터가 삭제됩니다)
DROP TABLE IF EXISTS public.documents CASCADE;

-- 3. documents 테이블 생성
CREATE TABLE public.documents (
    id BIGSERIAL PRIMARY KEY,
    content TEXT, -- corresponds to Document.pageContent
    metadata JSONB, -- corresponds to Document.metadata
    embedding vector(1536) -- 1536 works for Gemini embeddings
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

-- 4. 벡터 검색 함수 생성
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



