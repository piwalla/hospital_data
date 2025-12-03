-- documents1 테이블의 벡터 차원을 768에서 1536으로 변경
-- 주의: 이 작업은 기존 데이터를 삭제하고 테이블을 재생성합니다

-- 1. 기존 함수 삭제
DROP FUNCTION IF EXISTS match_documents1(vector, int, jsonb);

-- 2. 기존 테이블 삭제 (주의: 모든 데이터가 삭제됩니다)
DROP TABLE IF EXISTS public.documents1 CASCADE;

-- 3. documents1 테이블 재생성 (벡터 차원: 1536)
CREATE TABLE public.documents1 (
    id BIGSERIAL PRIMARY KEY,
    content TEXT, -- corresponds to Document.pageContent
    metadata JSONB, -- corresponds to Document.metadata
    embedding vector(1536) -- 1536 for Gemini embeddings
);

-- 테이블 소유자 및 권한 설정
ALTER TABLE public.documents1 OWNER TO postgres;
ALTER TABLE public.documents1 DISABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.documents1 TO anon;
GRANT ALL ON TABLE public.documents1 TO authenticated;
GRANT ALL ON TABLE public.documents1 TO service_role;

-- 벡터 검색을 위한 인덱스 생성
CREATE INDEX documents1_embedding_idx 
ON public.documents1 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- 메타데이터 검색을 위한 인덱스
CREATE INDEX idx_documents1_metadata 
ON public.documents1 
USING gin (metadata);

-- 4. 벡터 검색 함수 재생성 (documents1 테이블 참조)
CREATE FUNCTION match_documents1 (
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
        1 - (documents1.embedding <=> query_embedding) AS similarity
    FROM documents1
    WHERE metadata @> filter
    ORDER BY documents1.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- 완료 메시지
DO $$
BEGIN
    RAISE NOTICE 'documents1 테이블이 1536 차원으로 재생성되었습니다.';
END $$;



