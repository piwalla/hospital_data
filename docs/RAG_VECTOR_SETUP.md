# RAG 벡터 스토어 설정 가이드

이 문서는 Supabase에서 RAG(Retrieval-Augmented Generation)를 위한 벡터 스토어를 설정하는 방법을 설명합니다.

## 문제 상황

- 처음에 벡터 차원을 768로 설정했으나, 실제 Gemini 모델은 1536 차원이 필요
- n8n에서 에러 발생: `expected 1536 dimensions, not 768`
- 테이블 삭제 후 재생성 시도 시 `extension "vector" already exists` 에러 발생

## 해결 방법

### 1. Vector Extension 확인

Supabase SQL Editor에서 다음 쿼리를 실행하여 extension 상태를 확인합니다:

```sql
-- Vector extension이 이미 설치되어 있는지 확인
SELECT * FROM pg_extension WHERE extname = 'vector';
```

**이미 설치되어 있다면**: `CREATE EXTENSION` 구문을 실행하지 마세요.

### 2. Documents 테이블 재생성

다음 SQL 스크립트를 실행합니다:

```sql
-- 기존 테이블 삭제 (주의: 모든 데이터가 삭제됩니다)
DROP TABLE IF EXISTS public.documents CASCADE;

-- Documents 테이블 생성 (벡터 차원: 1536)
CREATE TABLE public.documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content TEXT NOT NULL,
    metadata JSONB,
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

-- 벡터 검색을 위한 HNSW 인덱스 생성
CREATE INDEX documents_embedding_idx 
ON public.documents 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- 메타데이터 검색을 위한 인덱스
CREATE INDEX idx_documents_metadata 
ON public.documents 
USING gin (metadata);

-- 생성일시 인덱스
CREATE INDEX idx_documents_created_at 
ON public.documents (created_at DESC);
```

### 3. 주의사항

#### Vector Extension 에러 해결

만약 `extension "vector" already exists` 에러가 발생한다면:

1. **SQL 스크립트에서 `CREATE EXTENSION` 구문 제거**
   - Extension이 이미 존재하므로 다시 생성할 필요가 없습니다
   - 마이그레이션 파일(`20250120130000_create_documents_vector_table.sql`)에서는 해당 구문을 주석 처리했습니다

2. **Extension이 없다면**
   - Supabase 대시보드 → Database → Extensions에서 `vector` extension을 활성화하거나
   - SQL Editor에서 `CREATE EXTENSION IF NOT EXISTS vector;` 실행

#### 벡터 차원 확인

- **Gemini embedding**: 1536 차원
- **OpenAI embedding (text-embedding-ada-002)**: 1536 차원
- **OpenAI embedding (text-embedding-3-small)**: 1536 차원
- **OpenAI embedding (text-embedding-3-large)**: 3072 차원

사용하는 모델에 맞는 차원을 설정해야 합니다.

## 테이블 구조

### `documents` 테이블

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| `id` | UUID | 기본 키 |
| `content` | TEXT | 문서의 원본 텍스트 내용 |
| `metadata` | JSONB | 문서 메타데이터 (문서 ID, 제목, 카테고리 등) |
| `embedding` | vector(1536) | Gemini embedding 벡터 |
| `created_at` | TIMESTAMPTZ | 생성 일시 |
| `updated_at` | TIMESTAMPTZ | 최종 업데이트 일시 |

### 인덱스

1. **`documents_embedding_idx`**: HNSW 인덱스 (벡터 유사도 검색용)
   - 알고리즘: HNSW (Hierarchical Navigable Small World)
   - 연산자: `vector_cosine_ops` (코사인 유사도)
   - 파라미터: `m = 16`, `ef_construction = 64`

2. **`idx_documents_metadata`**: GIN 인덱스 (JSONB 메타데이터 검색용)

3. **`idx_documents_created_at`**: B-tree 인덱스 (시간순 정렬용)

## Langchain과의 연동

### Supabase Vector Store 설정

```python
from langchain.vectorstores import SupabaseVectorStore
from langchain.embeddings import GoogleGenerativeAIEmbeddings
from supabase import create_client

# Supabase 클라이언트 생성
supabase = create_client(
    supabase_url="YOUR_SUPABASE_URL",
    supabase_key="YOUR_SUPABASE_KEY"
)

# Gemini Embedding 모델 초기화
embeddings = GoogleGenerativeAIEmbeddings(
    model="models/embedding-001",  # Gemini embedding 모델
    google_api_key="YOUR_GOOGLE_API_KEY"
)

# Supabase Vector Store 초기화
vector_store = SupabaseVectorStore(
    client=supabase,
    embedding=embeddings,
    table_name="documents",
    query_name="match_documents"  # Supabase 함수 이름 (선택사항)
)
```

### n8n 설정

n8n의 Supabase Vector Store 노드에서:

- **Table Name**: `documents`
- **Embedding Column**: `embedding`
- **Vector Dimension**: `1536`
- **Content Column**: `content`
- **Metadata Column**: `metadata`

## 벡터 검색 함수 (선택사항)

더 효율적인 벡터 검색을 위해 Supabase 함수를 생성할 수 있습니다:

```sql
-- 벡터 유사도 검색 함수
CREATE OR REPLACE FUNCTION match_documents(
    query_embedding vector(1536),
    match_threshold float DEFAULT 0.7,
    match_count int DEFAULT 10
)
RETURNS TABLE (
    id uuid,
    content text,
    metadata jsonb,
    similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        documents.id,
        documents.content,
        documents.metadata,
        1 - (documents.embedding <=> query_embedding) AS similarity
    FROM documents
    WHERE 1 - (documents.embedding <=> query_embedding) > match_threshold
    ORDER BY documents.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;
```

## 참고 자료

- [Supabase Vector Store 문서](https://supabase.com/docs/guides/ai/vector-columns)
- [Langchain Supabase Vector Store](https://python.langchain.com/docs/integrations/vectorstores/supabase)
- [pgvector 문서](https://github.com/pgvector/pgvector)
- [Gemini Embedding API](https://ai.google.dev/docs/embeddings)



