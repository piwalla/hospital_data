/**
 * VWorld API로 남은 주소 Geocoding 처리 스크립트
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

async function runVWorldGeocoding() {
  console.log('==========================================');
  console.log('VWorld API로 남은 주소 Geocoding 처리');
  console.log('==========================================');
  console.log('');

  try {
    const geocodeData = await makeRequest(
      `${BASE_URL}/api/hospitals/geocode-vworld?limit=100&delayMs=100`,
      'POST'
    );

    if (!geocodeData.success) {
      console.error('❌ VWorld Geocoding 실패:', geocodeData.error);
      process.exit(1);
    }

    console.log('✅ VWorld Geocoding 완료!');
    console.log(`   - 처리: ${geocodeData.summary.processed}개`);
    console.log(`   - 성공: ${geocodeData.summary.success}개`);
    console.log(`   - 실패: ${geocodeData.summary.failed}개`);
    
    if (geocodeData.summary.failedAddresses && geocodeData.summary.failedAddresses.length > 0) {
      console.log(`   - 실패한 주소 (처음 5개):`);
      geocodeData.summary.failedAddresses.slice(0, 5).forEach((addr, i) => {
        console.log(`     ${i + 1}. ${addr.substring(0, 60)}`);
      });
    }
    console.log('');

    // 더 처리할 데이터가 있으면 반복
    if (geocodeData.summary.processed > 0 && geocodeData.summary.failed < geocodeData.summary.processed) {
      console.log('더 처리할 데이터가 있을 수 있습니다. 다시 실행하세요.');
    }

    console.log('==========================================');
    console.log('처리 완료!');
    console.log('==========================================');
  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    process.exit(1);
  }
}

runVWorldGeocoding();


