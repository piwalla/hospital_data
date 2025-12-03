-- 벡터 테이블의 차원 확인 스크립트
-- Supabase SQL Editor에서 실행하세요

-- 1. documents 테이블이 있는지 확인하고 벡터 차원 확인
SELECT 
    table_name,
    column_name,
    data_type,
    udt_name
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name LIKE 'documents%'
  AND column_name = 'embedding'
ORDER BY table_name;

-- 2. 각 테이블의 실제 데이터 샘플 확인 (벡터 차원 확인)
-- documents 테이블 확인
SELECT 
    'documents' as table_name,
    id,
    array_length(embedding::float[], 1) as vector_dimension,
    length(content) as content_length
FROM documents
LIMIT 5;

-- documents1 테이블 확인 (있는 경우)
SELECT 
    'documents1' as table_name,
    id,
    array_length(embedding::float[], 1) as vector_dimension,
    length(content) as content_length
FROM documents1
LIMIT 5;

-- 3. 테이블 정의 확인 (더 자세한 정보)
SELECT 
    t.table_name,
    c.column_name,
    c.data_type,
    c.udt_name,
    pg_catalog.format_type(c.udt_name::regtype, NULL) as full_type
FROM information_schema.tables t
JOIN information_schema.columns c ON t.table_name = c.table_name
WHERE t.table_schema = 'public'
  AND t.table_name LIKE 'documents%'
  AND c.column_name = 'embedding'
ORDER BY t.table_name;



