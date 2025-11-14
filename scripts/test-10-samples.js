/**
 * 10개 샘플 테스트 스크립트
 */

const BASE_URL = 'http://localhost:3000';
const http = require('http');

function makeRequest(url, method = 'GET') {
  return new Promise((resolve, reject) => {
    const req = http.request(url, { method }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`JSON 파싱 실패: ${e.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

async function runTest() {
  console.log('==========================================');
  console.log('10개 샘플 테스트');
  console.log('==========================================');
  console.log('');

  try {
    // 1단계: CSV 데이터 Import (10개만)
    console.log('[1단계] CSV 데이터를 Supabase에 저장 중... (10개만)');
    console.log('');

    const importData = await makeRequest(
      `${BASE_URL}/api/hospitals/import-csv?filename=hospital_data.csv&test=true&limit=10`,
      'POST'
    );

    if (!importData.success) {
      console.error('❌ CSV Import 실패:', importData.error);
      process.exit(1);
    }

    console.log('✅ CSV Import 완료!');
    console.log(`   - 총 행 수: ${importData.summary.totalRows}`);
    console.log(`   - 새로 저장: ${importData.summary.savedCount}`);
    console.log(`   - 업데이트: ${importData.summary.updatedCount}`);
    console.log(`   - 실패: ${importData.summary.skippedCount}`);
    console.log('');

    // 2단계: Geocoding 배치 처리
    console.log('[2단계] 주소를 위도/경도로 변환 중...');
    console.log('');

    const geocodeData = await makeRequest(
      `${BASE_URL}/api/hospitals/geocode-batch?limit=10&delayMs=150`,
      'POST'
    );

    if (!geocodeData.success) {
      console.error('❌ Geocoding 실패:', geocodeData.error);
      process.exit(1);
    }

    console.log('✅ Geocoding 완료!');
    console.log(`   - 처리: ${geocodeData.summary.processed}개`);
    console.log(`   - 성공: ${geocodeData.summary.success}개`);
    console.log(`   - 실패: ${geocodeData.summary.failed}개`);
    
    if (geocodeData.summary.failedAddresses && geocodeData.summary.failedAddresses.length > 0) {
      console.log(`   - 실패한 주소 (처음 3개):`);
      geocodeData.summary.failedAddresses.slice(0, 3).forEach((addr, i) => {
        console.log(`     ${i + 1}. ${addr.substring(0, 50)}`);
      });
    }
    console.log('');

    console.log('==========================================');
    console.log('테스트 완료!');
    console.log('==========================================');
  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    process.exit(1);
  }
}

runTest();


