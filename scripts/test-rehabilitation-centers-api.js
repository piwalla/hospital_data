/**
 * @file test-rehabilitation-centers-api.js
 * @description 재활기관 API 테스트 스크립트
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

async function testNearbyAPI() {
  console.log('🧪 재활기관 반경 검색 API 테스트\n');
  console.log('='.repeat(60));

  // 서울시청 좌표 (위도: 37.5665, 경도: 126.9780)
  const latitude = 37.5665;
  const longitude = 126.9780;
  const radiusKm = 5;

  try {
    const url = `${BASE_URL}/api/rehabilitation-centers/nearby?latitude=${latitude}&longitude=${longitude}&radiusKm=${radiusKm}`;
    console.log(`📍 테스트 위치: 서울시청 (${latitude}, ${longitude})`);
    console.log(`📏 반경: ${radiusKm}km\n`);
    console.log(`🔗 요청 URL: ${url}\n`);

    const result = await makeRequest(url);

    if (result.status === 200 && result.data.success) {
      console.log('✅ API 호출 성공!\n');
      console.log(`📊 검색 결과: ${result.data.count}개 재활기관\n`);

      if (result.data.rehabilitationCenters && result.data.rehabilitationCenters.length > 0) {
        console.log('📋 샘플 데이터 (처음 5개):\n');
        result.data.rehabilitationCenters.slice(0, 5).forEach((center, i) => {
          console.log(`  ${i + 1}. ${center.name}`);
          console.log(`     기관구분: ${center.gigwan_fg_nm}`);
          console.log(`     주소: ${center.address}`);
          console.log(`     전화: ${center.phone || '없음'}`);
          console.log(`     거리: ${center.distance ? center.distance.toFixed(2) + 'km' : 'N/A'}`);
          console.log(`     좌표: (${center.latitude}, ${center.longitude})\n`);
        });
      } else {
        console.log('⚠️  반경 내 재활기관이 없습니다.\n');
      }
    } else {
      console.error('❌ API 호출 실패');
      console.error('상태 코드:', result.status);
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

testNearbyAPI();

