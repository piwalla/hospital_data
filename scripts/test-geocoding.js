/**
 * Geocoding API 테스트 스크립트
 * 네이버 Geocoding API가 정상 작동하는지 확인
 */

require('dotenv').config();
const http = require('http');

const CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;
const CLIENT_SECRET = process.env.NAVER_MAP_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('❌ API 키가 설정되지 않았습니다.');
  console.error('NEXT_PUBLIC_NAVER_MAP_CLIENT_ID:', CLIENT_ID ? '설정됨' : '없음');
  console.error('NAVER_MAP_CLIENT_SECRET:', CLIENT_SECRET ? '설정됨' : '없음');
  process.exit(1);
}

// 테스트 주소들
const testAddresses = [
  '서울특별시 강남구 테헤란로 152',
  '경기 고양시 일산동구 무궁화로 346',
  '부산 남구 수영로 238',
];

function testGeocode(address) {
  return new Promise((resolve, reject) => {
    const url = new URL('https://maps.apigw.ntruss.com/map-geocode/v2/geocode');
    url.searchParams.set('query', address);

    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'GET',
      headers: {
        'X-NCP-APIGW-API-KEY-ID': CLIENT_ID,
        'X-NCP-APIGW-API-KEY': CLIENT_SECRET,
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve({ status: res.statusCode, data: result });
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

async function runTests() {
  console.log('==========================================');
  console.log('네이버 Geocoding API 테스트');
  console.log('==========================================');
  console.log('');

  for (const address of testAddresses) {
    console.log(`테스트 주소: ${address}`);
    try {
      const result = await testGeocode(address);
      console.log(`  HTTP 상태: ${result.status}`);
      
      if (result.status === 200) {
        if (result.data.status === 'OK' && result.data.addresses.length > 0) {
          const coord = result.data.addresses[0];
          console.log(`  ✅ 성공: (${coord.y}, ${coord.x})`);
        } else {
          console.log(`  ❌ 실패: ${result.data.errorMessage || '결과 없음'}`);
          console.log(`  응답:`, JSON.stringify(result.data, null, 2));
        }
      } else {
        console.log(`  ❌ HTTP 에러: ${result.status}`);
        console.log(`  응답:`, JSON.stringify(result.data, null, 2));
      }
    } catch (error) {
      console.log(`  ❌ 오류: ${error.message}`);
    }
    console.log('');
  }
}

runTests();

