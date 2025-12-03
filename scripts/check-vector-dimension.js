/**
 * @file check-vector-dimension.js
 * @description documents1 테이블의 벡터 차원 확인 스크립트
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ 환경 변수가 설정되지 않았습니다.');
  console.error('필요한 환경 변수:');
  console.error('  - NEXT_PUBLIC_SUPABASE_URL');
  console.error('  - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkVectorDimension() {
  console.log('🔍 documents1 테이블의 벡터 차원 확인 중...\n');

  try {
    // 방법 1: 테이블 스키마 확인 (SQL 쿼리 실행)
    const { data: schemaData, error: schemaError } = await supabase.rpc('exec_sql', {
      query: `
        SELECT 
          column_name,
          data_type,
          udt_name
        FROM information_schema.columns
        WHERE table_schema = 'public' 
          AND table_name = 'documents1'
          AND column_name = 'embedding';
      `
    });

    if (schemaError) {
      console.log('⚠️  RPC 함수를 사용할 수 없습니다. 직접 쿼리로 확인합니다...\n');
    } else {
      console.log('📊 테이블 스키마 정보:');
      console.log(JSON.stringify(schemaData, null, 2));
      console.log('');
    }

    // 방법 2: 실제 데이터 샘플 확인
    const { data: sampleData, error: sampleError } = await supabase
      .from('documents1')
      .select('id, embedding')
      .limit(1);

    if (sampleError) {
      if (sampleError.code === 'PGRST116') {
        console.log('⚠️  documents1 테이블이 존재하지 않거나 데이터가 없습니다.');
        console.log('   테이블이 비어있을 수 있습니다.\n');
      } else {
        console.error('❌ 데이터 조회 실패:', sampleError.message);
      }
    } else if (sampleData && sampleData.length > 0) {
      const embedding = sampleData[0].embedding;
      if (embedding && Array.isArray(embedding)) {
        const dimension = embedding.length;
        console.log('✅ 실제 벡터 차원 확인:');
        console.log(`   차원: ${dimension}`);
        if (dimension === 768) {
          console.log('   ⚠️  경고: 768 차원입니다. 1536으로 변경이 필요합니다!');
        } else if (dimension === 1536) {
          console.log('   ✅ 정상: 1536 차원입니다.');
        } else {
          console.log(`   ⚠️  예상과 다른 차원입니다: ${dimension}`);
        }
      } else {
        console.log('⚠️  embedding 데이터가 배열 형식이 아닙니다.');
      }
    } else {
      console.log('ℹ️  테이블이 비어있어 실제 벡터 차원을 확인할 수 없습니다.');
      console.log('   테이블 정의만 확인할 수 있습니다.\n');
    }

    // 방법 3: 테이블 존재 여부 확인
    const { count, error: countError } = await supabase
      .from('documents1')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      if (countError.code === 'PGRST116') {
        console.log('❌ documents1 테이블이 존재하지 않습니다.');
      } else {
        console.error('❌ 테이블 확인 실패:', countError.message);
      }
    } else {
      console.log(`\n📈 documents1 테이블 레코드 수: ${count || 0}개`);
    }

    console.log('\n💡 벡터 차원을 정확히 확인하려면 Supabase SQL Editor에서 다음 쿼리를 실행하세요:');
    console.log('   supabase/sql/check_documents1_vector_dimension.sql 파일 참고');

  } catch (error) {
    console.error('❌ 오류 발생:', error);
  }
}

checkVectorDimension();



