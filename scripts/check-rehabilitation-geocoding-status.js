/**
 * @file check-rehabilitation-geocoding-status.js
 * @description 재활기관 Geocoding 상태 확인 스크립트
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (err) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function checkStatus() {
  console.log('🔍 재활기관 Geocoding 상태 확인 중...\n');
  console.log('='.repeat(60));

  try {
    const result = await makeRequest(`${BASE_URL}/api/rehabilitation-centers/geocode-status`);

    if (result.status === 200 && result.data.success) {
      const status = result.data.status;
      
      console.log('📊 Geocoding 상태:\n');
      console.log(`  전체 재활기관: ${status.total}개`);
      console.log(`  ✅ Geocoding 완료: ${status.geocoded}개`);
      console.log(`  ❌ Geocoding 미완료: ${status.notGeocoded}개`);
      console.log(`  ⚠️  주소 없음: ${status.noAddress}개`);
      console.log(`  📈 성공률: ${status.successRate}\n`);
      
      console.log('='.repeat(60));
      console.log(`💬 ${result.data.message}\n`);
      
      if (status.notGeocoded > 0) {
        console.log(`⚠️  아직 ${status.notGeocoded}개의 재활기관이 Geocoding되지 않았습니다.`);
        console.log(`💡 다음 명령어로 Geocoding을 진행하세요:`);
        console.log(`   node scripts/geocode-rehabilitation-centers.js ${status.notGeocoded} 150\n`);
      } else {
        console.log('✅ 모든 재활기관의 Geocoding이 완료되었습니다!\n');
      }
    } else {
      console.error('❌ 상태 확인 실패');
      console.error('응답:', JSON.stringify(result.data, null, 2));
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ 서버에 연결할 수 없습니다.');
      console.error('💡 개발 서버를 실행해주세요: pnpm dev');
    } else {
      console.error('❌ 오류 발생:', error.message);
    }
  }
}

checkStatus();

