/**
 * @file test-rehabilitation-import.js
 * @description 재활기관 테스트 데이터 Import 스크립트
 * 
 * 재활기관 API에서 10개 데이터를 가져와서 Supabase에 저장합니다.
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';
const ENDPOINT = '/api/rehabilitation-centers/test-import';

function makeRequest(method, url) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, { method }, (res) => {
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
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}

async function testImport() {
  console.log('🚀 재활기관 테스트 데이터 Import 시작\n');
  console.log('='.repeat(60));

  try {
    console.log(`📡 API 호출: ${BASE_URL}${ENDPOINT}\n`);
    
    const result = await makeRequest('POST', `${BASE_URL}${ENDPOINT}`);

    if (result.status === 200 && result.data.success) {
      console.log('✅ Import 성공!\n');
      console.log(`📊 저장된 데이터: ${result.data.savedCount}개`);
      console.log(`📍 Geocoding 성공: ${result.data.geocodedCount}개`);
      console.log(`📥 API에서 가져온 데이터: ${result.data.totalFetched}개\n`);
      
      if (result.data.results && result.data.results.length > 0) {
        console.log('📋 저장 결과:');
        result.data.results.forEach((item, index) => {
          const status = item.action === 'inserted' ? '✅' : item.action === 'updated' ? '🔄' : '❌';
          console.log(`  ${index + 1}. ${status} ${item.name || 'N/A'}`);
        });
      }
    } else {
      console.error('❌ Import 실패');
      console.error(`상태 코드: ${result.status}`);
      console.error('응답:', JSON.stringify(result.data, null, 2));
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ 서버에 연결할 수 없습니다.');
      console.error('💡 개발 서버를 실행해주세요: pnpm dev');
    } else {
      console.error('❌ 오류 발생:', error.message);
      console.error(error.stack);
    }
  }
}

testImport();

