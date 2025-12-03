/**
 * @file check-database-status.js
 * @description Supabase 데이터베이스 전체 상태 확인 스크립트
 * 
 * 모든 테이블의 스키마와 데이터 개수를 확인합니다.
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

async function checkTableSchema(tableName) {
  try {
    // 테이블 정보 조회 (PostgreSQL 시스템 카탈로그 사용)
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default
        FROM information_schema.columns
        WHERE table_schema = 'public' 
          AND table_name = $1
        ORDER BY ordinal_position;
      `,
      params: [tableName]
    });

    if (error) {
      // RPC가 없을 수 있으므로 다른 방법 시도
      return null;
    }
    return data;
  } catch (error) {
    return null;
  }
}

async function getTableCount(tableName) {
  try {
    const { count, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error(`  ❌ ${tableName} 개수 조회 실패:`, error.message);
      return null;
    }
    return count;
  } catch (error) {
    console.error(`  ❌ ${tableName} 개수 조회 중 오류:`, error.message);
    return null;
  }
}

async function getTableSample(tableName, limit = 3) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(limit);
    
    if (error) {
      return null;
    }
    return data;
  } catch (error) {
    return null;
  }
}

async function checkTableDetails(tableName) {
  console.log(`\n📊 테이블: ${tableName}`);
  console.log('─'.repeat(60));
  
  const count = await getTableCount(tableName);
  if (count === null) {
    console.log(`  ⚠️  테이블이 존재하지 않거나 접근할 수 없습니다.`);
    return;
  }
  
  console.log(`  📈 총 레코드 수: ${count.toLocaleString()}개`);
  
  // 샘플 데이터 조회
  if (count > 0) {
    const sample = await getTableSample(tableName, 2);
    if (sample && sample.length > 0) {
      console.log(`  📝 샘플 데이터 (최대 2개):`);
      sample.forEach((row, idx) => {
        console.log(`     [${idx + 1}]`, JSON.stringify(row, null, 2).substring(0, 200) + '...');
      });
    }
  }
}

async function checkIndexes(tableName) {
  try {
    // 인덱스 정보는 직접 조회하기 어려우므로 스킵
    return;
  } catch (error) {
    // 무시
  }
}

async function main() {
  console.log('🔍 Supabase 데이터베이스 상태 확인');
  console.log('='.repeat(60));
  console.log(`📍 Supabase URL: ${supabaseUrl}`);
  console.log(`⏰ 확인 시간: ${new Date().toLocaleString('ko-KR')}`);
  
  // 확인할 테이블 목록
  const tables = [
    'users',
    'hospitals_pharmacies',
    'rehabilitation_centers',
    'pharmacies',
    'favorites',
    'document_summaries',
    'user_activity_logs'
  ];
  
  for (const table of tables) {
    await checkTableDetails(table);
  }
  
  // 추가 통계 정보
  console.log('\n📊 추가 통계 정보');
  console.log('─'.repeat(60));
  
  // hospitals_pharmacies 타입별 개수
  try {
    const { data: typeCounts, error } = await supabase
      .from('hospitals_pharmacies')
      .select('type')
      .then(({ data, error }) => {
        if (error) throw error;
        const counts = {};
        data?.forEach(row => {
          counts[row.type] = (counts[row.type] || 0) + 1;
        });
        return { data: counts, error: null };
      });
    
    if (!error && typeCounts) {
      console.log('  🏥 hospitals_pharmacies 타입별 개수:');
      Object.entries(typeCounts).forEach(([type, count]) => {
        console.log(`     - ${type}: ${count.toLocaleString()}개`);
      });
    }
  } catch (error) {
    console.log('  ⚠️  타입별 개수 조회 실패');
  }
  
  // Geocoding 상태 확인
  try {
    const { count: geocodedCount } = await supabase
      .from('hospitals_pharmacies')
      .select('*', { count: 'exact', head: true })
      .neq('latitude', 0)
      .neq('longitude', 0);
    
    const { count: totalCount } = await supabase
      .from('hospitals_pharmacies')
      .select('*', { count: 'exact', head: true });
    
    if (totalCount > 0) {
      const geocodingRate = ((geocodedCount || 0) / totalCount * 100).toFixed(2);
      console.log(`  🗺️  Geocoding 완료율: ${geocodingRate}% (${geocodedCount || 0}/${totalCount})`);
    }
  } catch (error) {
    console.log('  ⚠️  Geocoding 상태 조회 실패');
  }
  
  // rehabilitation_centers Geocoding 상태
  try {
    const { count: rcGeocodedCount } = await supabase
      .from('rehabilitation_centers')
      .select('*', { count: 'exact', head: true })
      .neq('latitude', 0)
      .neq('longitude', 0);
    
    const { count: rcTotalCount } = await supabase
      .from('rehabilitation_centers')
      .select('*', { count: 'exact', head: true });
    
    if (rcTotalCount > 0) {
      const rcGeocodingRate = ((rcGeocodedCount || 0) / rcTotalCount * 100).toFixed(2);
      console.log(`  🗺️  재활기관 Geocoding 완료율: ${rcGeocodingRate}% (${rcGeocodedCount || 0}/${rcTotalCount})`);
    }
  } catch (error) {
    console.log('  ⚠️  재활기관 Geocoding 상태 조회 실패');
  }
  
  // pharmacies Geocoding 상태
  try {
    const { count: phGeocodedCount } = await supabase
      .from('pharmacies')
      .select('*', { count: 'exact', head: true })
      .neq('latitude', 0)
      .neq('longitude', 0);
    
    const { count: phTotalCount } = await supabase
      .from('pharmacies')
      .select('*', { count: 'exact', head: true });
    
    if (phTotalCount > 0) {
      const phGeocodingRate = ((phGeocodedCount || 0) / phTotalCount * 100).toFixed(2);
      console.log(`  🗺️  약국 Geocoding 완료율: ${phGeocodingRate}% (${phGeocodedCount || 0}/${phTotalCount})`);
    }
  } catch (error) {
    console.log('  ⚠️  약국 Geocoding 상태 조회 실패');
  }
  
  console.log('\n✅ 데이터베이스 상태 확인 완료');
  console.log('='.repeat(60));
}

main().catch(console.error);



