-- documents1 테이블의 벡터 차원 확인
-- Supabase SQL Editor에서 실행하세요

-- 방법 1: 테이블 정의에서 벡터 차원 확인
SELECT 
    table_name,
    column_name,
    data_type,
    udt_name,
    -- vector 타입의 경우 차원 정보 추출
    CASE 
        WHEN udt_name = 'vector' THEN 
            (SELECT typname || '(' || 
             (SELECT regexp_replace(typname, '.*\((\d+)\).*', '\1', 'g') 
              FROM pg_type t2 
              WHERE t2.oid = (SELECT typelem FROM pg_type WHERE oid = c.udt_name::regtype::oid)
             ) || ')' 
             FROM pg_type WHERE oid = c.udt_name::regtype::oid)
        ELSE udt_name
    END as full_type
FROM information_schema.columns c
WHERE table_schema = 'public' 
  AND table_name = 'documents1'
  AND column_name = 'embedding';

-- 방법 2: pg_attribute를 통한 직접 확인 (더 정확)
SELECT 
    a.attname as column_name,
    t.typname as type_name,
    CASE 
        WHEN t.typname = 'vector' THEN
            (SELECT typname || '(' || 
             substring(pg_catalog.format_type(a.atttypid, a.atttypmod) from '\((\d+)\)') || ')'
            )
        ELSE pg_catalog.format_type(a.atttypid, a.atttypmod)
    END as full_type,
    a.atttypmod as type_modifier
FROM pg_attribute a
JOIN pg_class cl ON a.attrelid = cl.oid
JOIN pg_type t ON a.atttypid = t.oid
WHERE cl.relname = 'documents1'
  AND a.attname = 'embedding'
  AND a.attnum > 0
  AND NOT a.attisdropped;

-- 방법 3: 실제 데이터가 있다면 샘플로 차원 확인
-- (데이터가 없으면 에러가 날 수 있음)
SELECT 
    id,
    CASE 
        WHEN embedding IS NOT NULL THEN 
            array_length(embedding::float[], 1)
        ELSE NULL
    END as vector_dimension,
    length(content) as content_length
FROM documents1
LIMIT 5;

-- 방법 4: 가장 간단한 방법 - 테이블 정의 확인
SELECT 
    column_name,
    data_type,
    udt_name,
    pg_catalog.format_type(atttypid, atttypmod) as full_type
FROM information_schema.columns c
JOIN pg_attribute a ON a.attname = c.column_name
JOIN pg_class cl ON cl.relname = c.table_name
WHERE c.table_schema = 'public'
  AND c.table_name = 'documents1'
  AND c.column_name = 'embedding'
  AND a.attrelid = cl.oid;



