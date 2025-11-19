/**
 * @file update-institution-classification.js
 * @description 기관 유형 및 진료과목 추출 및 업데이트 스크립트
 * 
 * hospitals_pharmacies 테이블의 모든 레코드에 대해:
 * 1. 기관명(name)에서 기관 유형 추출 → institution_type 컬럼 업데이트
 * 2. 기관명(name)에서 진료과목 추출 → department_extracted 컬럼 업데이트
 */

const { createClient } = require('@supabase/supabase-js');
const { extractInstitutionType, extractDepartments } = require('../lib/utils/institution-classifier');
const path = require('path');
const fs = require('fs');

// 환경변수 로드
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ 환경변수가 설정되지 않았습니다.');
  console.error('필요한 환경변수:');
  console.error('  - NEXT_PUBLIC_SUPABASE_URL');
  console.error('  - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

/**
 * 배치 업데이트 함수
 * @param {number} batchSize 배치 크기
 * @param {number} delayMs 배치 간 지연 시간 (ms)
 */
async function updateInstitutionClassification(batchSize = 100, delayMs = 100) {
  console.log('🚀 기관 유형 및 진료과목 추출 시작...\n');

  let offset = 0;
  let totalUpdated = 0;
  let totalProcessed = 0;

  try {
    // 전체 개수 확인
    const { count } = await supabase
      .from('hospitals_pharmacies')
      .select('*', { count: 'exact', head: true });

    console.log(`📊 전체 레코드 수: ${count}개\n`);

    while (true) {
      // 배치로 데이터 가져오기
      const { data, error } = await supabase
        .from('hospitals_pharmacies')
        .select('id, name, institution_type, department_extracted')
        .range(offset, offset + batchSize - 1);

      if (error) {
        console.error('❌ 데이터 조회 실패:', error);
        break;
      }

      if (!data || data.length === 0) {
        console.log('✅ 모든 데이터 처리 완료!\n');
        break;
      }

      console.log(`📦 배치 처리 중... (${offset + 1} ~ ${offset + data.length} / ${count})`);

      // 업데이트할 데이터 준비
      const updates = data.map((record) => {
        const institutionType = extractInstitutionType(record.name);
        const departments = extractDepartments(record.name);
        const departmentExtracted = departments.join(',');

        // 이미 업데이트된 경우 스킵
        if (record.institution_type === institutionType && 
            record.department_extracted === departmentExtracted) {
          return null;
        }

        return {
          id: record.id,
          institution_type: institutionType,
          department_extracted: departmentExtracted,
        };
      }).filter(Boolean);

      // 배치 업데이트
      if (updates.length > 0) {
        const updatePromises = updates.map((update) =>
          supabase
            .from('hospitals_pharmacies')
            .update({
              institution_type: update.institution_type,
              department_extracted: update.department_extracted,
            })
            .eq('id', update.id)
        );

        const results = await Promise.all(updatePromises);
        const successCount = results.filter((r) => !r.error).length;
        totalUpdated += successCount;

        if (successCount < updates.length) {
          const errors = results.filter((r) => r.error);
          console.warn(`⚠️  일부 업데이트 실패: ${errors.length}개`);
        }
      }

      totalProcessed += data.length;
      offset += batchSize;

      // 진행률 표시
      const progress = ((totalProcessed / count) * 100).toFixed(1);
      console.log(`   ✅ 처리 완료: ${totalProcessed}/${count} (${progress}%)`);
      console.log(`   📝 업데이트: ${updates.length}개 (누적: ${totalUpdated}개)\n`);

      // 배치 간 지연
      if (offset < count && delayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    console.log('='.repeat(60));
    console.log('📊 최종 결과');
    console.log('='.repeat(60));
    console.log(`전체 처리: ${totalProcessed}개`);
    console.log(`업데이트: ${totalUpdated}개`);
    console.log('='.repeat(60));

    // 통계 확인
    const { data: stats } = await supabase
      .from('hospitals_pharmacies')
      .select('institution_type, department_extracted')
      .not('institution_type', 'is', null);

    if (stats) {
      const typeCounts = {};
      const deptCounts = {};

      stats.forEach((record) => {
        // 기관 유형 통계
        const type = record.institution_type || 'NULL';
        typeCounts[type] = (typeCounts[type] || 0) + 1;

        // 진료과목 통계
        const dept = record.department_extracted || 'NULL';
        deptCounts[dept] = (deptCounts[dept] || 0) + 1;
      });

      console.log('\n📈 기관 유형 분포:');
      Object.entries(typeCounts)
        .sort((a, b) => b[1] - a[1])
        .forEach(([type, count]) => {
          console.log(`   ${type}: ${count}개`);
        });

      console.log('\n📈 진료과목 분포 (상위 10개):');
      Object.entries(deptCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .forEach(([dept, count]) => {
          console.log(`   ${dept}: ${count}개`);
        });
    }

    console.log('\n✅ 작업 완료!');
  } catch (error) {
    console.error('❌ 오류 발생:', error);
    process.exit(1);
  }
}

// 스크립트 실행
updateInstitutionClassification(100, 100)
  .then(() => {
    console.log('\n🎉 모든 작업이 완료되었습니다!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ 치명적 오류:', error);
    process.exit(1);
  });

