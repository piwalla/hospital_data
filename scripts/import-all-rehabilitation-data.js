/**
 * @file import-all-rehabilitation-data.js
 * @description 재활기관 전체 데이터 Import 스크립트
 * 
 * 재활기관 API에서 모든 데이터를 가져와서 Supabase에 저장합니다.
 * Geocoding은 별도로 처리합니다.
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';
const ENDPOINT = '/api/rehabilitation-centers/import-all';

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

    req.setTimeout(600000); // 10분 타임아웃
    req.end();
  });
}

async function importAllData() {
  console.log('🚀 재활기관 전체 데이터 Import 시작\n');
  console.log('='.repeat(60));
  console.log('⚠️  이 작업은 시간이 오래 걸릴 수 있습니다 (약 5-10분)\n');

  try {
    console.log(`📡 API 호출: ${BASE_URL}${ENDPOINT}\n`);
    
    const result = await makeRequest('POST', `${BASE_URL}${ENDPOINT}`);

    if (result.status === 200 && result.data.success) {
      console.log('✅ 전체 데이터 Import 완료!\n');
      console.log('='.repeat(60));
      console.log(`📊 저장된 데이터: ${result.data.savedCount}개`);
      console.log(`🔄 업데이트된 데이터: ${result.data.updatedCount}개`);
      console.log(`⏭️  건너뛴 데이터: ${result.data.skippedCount}개`);
      console.log(`📈 전체 데이터 수: ${result.data.totalCount}개`);
      console.log(`📄 총 페이지 수: ${result.data.totalPages}개\n`);
      
      // 데이터 검증
      if (result.data.totalCount > 0) {
        console.log('='.repeat(60));
        console.log('📋 데이터 검증:');
        console.log(`  ✅ Import된 데이터: ${result.data.totalImported || (result.data.savedCount + result.data.updatedCount)}개`);
        console.log(`  📊 API 전체 데이터: ${result.data.totalCount}개`);
        console.log(`  📄 총 페이지 수: ${result.data.totalPages}개`);
        
        if (result.data.apiFetchedDiff !== undefined) {
          console.log(`  📥 API에서 가져온 항목: ${result.data.totalFetchedItems || 0}개`);
          if (result.data.apiFetchedDiff > 0) {
            console.log(`  ⚠️  API 필터링으로 제외: ${result.data.apiFetchedDiff}개 (기관명/주소 없는 항목)`);
          }
        }
        
        if (result.data.missingCount > 0) {
          console.log(`  ⚠️  누락된 데이터: ${result.data.missingCount}개`);
          console.log(`  💡 건너뛴 데이터: ${result.data.skippedCount}개`);
          console.log(`  💡 누락된 데이터가 있으니 다시 실행하거나 로그를 확인해주세요.`);
        } else {
          console.log(`  ✅ 모든 데이터가 성공적으로 Import되었습니다!`);
        }
        
        if (result.data.isComplete) {
          console.log(`  🎉 완료: 모든 데이터가 빠짐없이 Import되었습니다!`);
        }
      }
      
      return true;
    } else {
      console.error('❌ Import 실패');
      console.error(`상태 코드: ${result.status}`);
      console.error('응답:', JSON.stringify(result.data, null, 2));
      return false;
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ 서버에 연결할 수 없습니다.');
      console.error('💡 개발 서버를 실행해주세요: pnpm dev');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('❌ 요청 시간 초과 (10분)');
      console.error('💡 서버 로그를 확인하거나 더 긴 타임아웃을 설정해주세요.');
    } else {
      console.error('❌ 오류 발생:', error.message);
      console.error(error.stack);
    }
    return false;
  }
}

importAllData().catch(console.error);

