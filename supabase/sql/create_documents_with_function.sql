-- RAG용 documents 벡터 테이블 및 검색 함수 생성
-- 벡터 차원: 1536 (Gemini embedding)
-- 
-- 주의: vector extension이 이미 설치되어 있다고 가정합니다
-- 만약 extension이 없다면 아래 주석을 해제하세요:
-- CREATE EXTENSION IF NOT EXISTS vector;

-- 1. 기존 테이블 및 함수 삭제 (주의: 모든 데이터가 삭제됩니다)
DROP FUNCTION IF EXISTS match_documents(vector, int, jsonb);
DROP TABLE IF EXISTS public.documents CASCADE;

-- 2. documents 테이블 생성
CREATE TABLE public.documents (
    id BIGSERIAL PRIMARY KEY,
    content TEXT, -- corresponds to Document.pageContent
    metadata JSONB, -- corresponds to Document.metadata
    embedding vector(1536) -- 1536 works for Gemini embeddings
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

-- 5. 벡터 검색 함수 생성
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
        documents.id,
        documents.content,
        documents.metadata,
        1 - (documents.embedding <=> query_embedding) AS similarity
    FROM documents
    WHERE metadata @> filter
    ORDER BY documents.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- 완료 메시지
DO $$
BEGIN
    RAISE NOTICE 'documents 테이블과 match_documents 함수가 성공적으로 생성되었습니다. (벡터 차원: 1536)';
END $$;



