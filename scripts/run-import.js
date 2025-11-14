/**
 * CSV Import 및 Geocoding 실행 스크립트
 * Node.js로 실행: node scripts/run-import.js
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

async function runImport() {
  console.log('==========================================');
  console.log('병원 데이터 Import 및 Geocoding 시작');
  console.log('==========================================');
  console.log('');

  try {
    // 1단계: CSV 데이터 Import
    console.log('[1단계] CSV 데이터를 Supabase에 저장 중...');
    console.log('예상 소요 시간: 약 1-2분');
    console.log('');

    const importData = await makeRequest(
      `${BASE_URL}/api/hospitals/import-csv?filename=hospital_data.csv`,
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
    console.log('예상 소요 시간: 약 15-20분 (6,000개 기준, 100개씩 처리)');
    console.log('');

    const BATCH_SIZE = 100;
    const DELAY_MS = 150;
    let totalProcessed = 0;
    let totalSuccess = 0;
    let totalFailed = 0;
    let batchNumber = 0;

    while (true) {
      batchNumber++;
      console.log(`배치 #${batchNumber} 처리 중... (현재까지 처리: ${totalProcessed}개)`);

      const geocodeData = await makeRequest(
        `${BASE_URL}/api/hospitals/geocode-batch?limit=${BATCH_SIZE}&delayMs=${DELAY_MS}`,
        'POST'
      );

      if (!geocodeData.success) {
        console.error('❌ Geocoding 실패:', geocodeData.error);
        process.exit(1);
      }

      const processed = geocodeData.summary.processed || 0;
      const success = geocodeData.summary.success || 0;
      const failed = geocodeData.summary.failed || 0;

      totalProcessed += processed;
      totalSuccess += success;
      totalFailed += failed;

      console.log(`   - 이번 배치: 처리 ${processed}개, 성공 ${success}개, 실패 ${failed}개`);

      // 더 이상 처리할 데이터가 없으면 종료
      if (processed === 0) {
        console.log('');
        console.log('✅ 모든 Geocoding 완료!');
        break;
      }

      console.log('');
    }

    console.log('');
    console.log('==========================================');
    console.log('전체 작업 완료!');
    console.log('==========================================');
    console.log(`총 처리: ${totalProcessed}개`);
    console.log(`성공: ${totalSuccess}개`);
    console.log(`실패: ${totalFailed}개`);
    console.log('');
  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    process.exit(1);
  }
}

runImport();

