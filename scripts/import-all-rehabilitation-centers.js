/**
 * @file import-all-rehabilitation-centers.js
 * @description 재활기관 전체 데이터 Import 및 Geocoding 스크립트
 * 
 * 1. 먼저 저장된 데이터에 대해 Geocoding 수행
 * 2. 그 다음 모든 재활기관 데이터를 API에서 가져와서 저장
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';

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

async function runGeocoding() {
  console.log('\n📍 Step 1: Geocoding 시작\n');
  console.log('='.repeat(60));

  try {
    const result = await makeRequest('POST', `${BASE_URL}/api/rehabilitation-centers/geocode`);

    if (result.status === 200 && result.data.success) {
      console.log('✅ Geocoding 완료!\n');
      console.log(`📍 Geocoding 성공: ${result.data.geocodedCount}개`);
      console.log(`❌ Geocoding 실패: ${result.data.failedCount}개`);
      console.log(`📊 전체: ${result.data.totalCount}개\n`);
      return true;
    } else {
      console.error('❌ Geocoding 실패');
      console.error('응답:', JSON.stringify(result.data, null, 2));
      return false;
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ 서버에 연결할 수 없습니다.');
      console.error('💡 개발 서버를 실행해주세요: pnpm dev');
    } else {
      console.error('❌ 오류 발생:', error.message);
    }
    return false;
  }
}

async function runImportAll() {
  console.log('\n📥 Step 2: 전체 데이터 Import 시작\n');
  console.log('='.repeat(60));
  console.log('⚠️  이 작업은 시간이 오래 걸릴 수 있습니다 (약 5-10분)\n');

  try {
    const result = await makeRequest('POST', `${BASE_URL}/api/rehabilitation-centers/import-all`);

    if (result.status === 200 && result.data.success) {
      console.log('✅ 전체 데이터 Import 완료!\n');
      console.log(`📊 저장된 데이터: ${result.data.savedCount}개`);
      console.log(`🔄 업데이트된 데이터: ${result.data.updatedCount}개`);
      console.log(`⏭️  건너뛴 데이터: ${result.data.skippedCount}개`);
      console.log(`📈 전체 데이터 수: ${result.data.totalCount}개`);
      console.log(`📄 총 페이지 수: ${result.data.totalPages}개\n`);
      return true;
    } else {
      console.error('❌ Import 실패');
      console.error('응답:', JSON.stringify(result.data, null, 2));
      return false;
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ 서버에 연결할 수 없습니다.');
      console.error('💡 개발 서버를 실행해주세요: pnpm dev');
    } else {
      console.error('❌ 오류 발생:', error.message);
    }
    return false;
  }
}

async function main() {
  console.log('🚀 재활기관 전체 데이터 Import 및 Geocoding 시작\n');
  console.log('='.repeat(60));

  // Step 1: Geocoding
  const geocodingSuccess = await runGeocoding();

  // Step 2: 전체 데이터 Import
  const importSuccess = await runImportAll();

  // Step 3: 다시 Geocoding (새로 저장된 데이터)
  if (importSuccess) {
    console.log('\n📍 Step 3: 새로 저장된 데이터 Geocoding 시작\n');
    console.log('='.repeat(60));
    console.log('⚠️  이 작업은 시간이 오래 걸릴 수 있습니다 (약 30-60분)\n');
    
    await runGeocoding();
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ 모든 작업 완료!\n');
}

main().catch(console.error);

