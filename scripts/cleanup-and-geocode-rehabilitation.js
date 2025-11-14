/**
 * @file cleanup-and-geocode-rehabilitation.js
 * @description 재활기관 주소 정리 및 Geocoding 재시도 스크립트
 * 
 * 1. 실패한 주소를 정리 (괄호 제거 등)
 * 2. Supabase에 업데이트
 * 3. Geocoding 재시도
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

async function cleanupAddresses() {
  console.log('\n🧹 Step 1: 주소 정리 시작\n');
  console.log('='.repeat(60));

  try {
    const result = await makeRequest('POST', `${BASE_URL}/api/rehabilitation-centers/cleanup-addresses`);

    if (result.status === 200 && result.data.success) {
      console.log('✅ 주소 정리 완료!\n');
      console.log(`📝 정리된 주소: ${result.data.cleanedCount}개`);
      console.log(`📊 전체: ${result.data.totalCount}개\n`);
      
      if (result.data.results && result.data.results.length > 0) {
        console.log('📋 주소 정리 결과 (처음 10개):');
        result.data.results.slice(0, 10).forEach((r, i) => {
          if (r.status === 'success') {
            console.log(`  ${i + 1}. ✅ ${r.name}`);
            console.log(`     원본: ${r.original}`);
            console.log(`     정리: ${r.cleaned}\n`);
          } else if (r.status === 'no_change') {
            console.log(`  ${i + 1}. ⏭️  ${r.name} (변경 없음)`);
            console.log(`     주소: ${r.original}\n`);
          } else {
            console.log(`  ${i + 1}. ❌ ${r.name}: ${r.error || '오류'}\n`);
          }
        });
      }
      
      return {
        success: true,
        cleanedCount: result.data.cleanedCount,
        totalCount: result.data.totalCount,
      };
    } else {
      console.error('❌ 주소 정리 실패');
      console.error('응답:', JSON.stringify(result.data, null, 2));
      return { success: false };
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ 서버에 연결할 수 없습니다.');
      console.error('💡 개발 서버를 실행해주세요: pnpm dev');
    } else {
      console.error('❌ 오류 발생:', error.message);
    }
    return { success: false };
  }
}

async function runNaverGeocoding() {
  console.log('\n📍 Step 2: 네이버 Geocoding 재시도 시작\n');
  console.log('='.repeat(60));

  try {
    const url = `${BASE_URL}/api/rehabilitation-centers/geocode?limit=50&delayMs=150`;
    const result = await makeRequest('POST', url);

    if (result.status === 200 && result.data.success) {
      console.log('✅ 네이버 Geocoding 완료!\n');
      console.log(`📍 Geocoding 성공: ${result.data.geocodedCount}개`);
      console.log(`❌ Geocoding 실패: ${result.data.failedCount}개`);
      console.log(`📊 전체: ${result.data.totalCount}개\n`);
      
      return {
        success: true,
        geocodedCount: result.data.geocodedCount,
        failedCount: result.data.failedCount,
        totalCount: result.data.totalCount,
      };
    } else {
      console.error('❌ 네이버 Geocoding 실패');
      console.error('응답:', JSON.stringify(result.data, null, 2));
      return { success: false };
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ 서버에 연결할 수 없습니다.');
      console.error('💡 개발 서버를 실행해주세요: pnpm dev');
    } else {
      console.error('❌ 오류 발생:', error.message);
    }
    return { success: false };
  }
}

async function runVWorldGeocoding() {
  console.log('\n🌍 Step 3: VWorld Geocoding 재시도 시작\n');
  console.log('='.repeat(60));

  try {
    const url = `${BASE_URL}/api/rehabilitation-centers/geocode-vworld?limit=50&delayMs=200`;
    const result = await makeRequest('POST', url);

    if (result.status === 200 && result.data.success) {
      console.log('✅ VWorld Geocoding 완료!\n');
      console.log(`📍 Geocoding 성공: ${result.data.summary.success}개`);
      console.log(`❌ Geocoding 실패: ${result.data.summary.failed}개`);
      console.log(`📊 전체: ${result.data.summary.total}개\n`);
      
      return {
        success: true,
        geocodedCount: result.data.summary.success,
        failedCount: result.data.summary.failed,
        totalCount: result.data.summary.total,
      };
    } else {
      console.error('❌ VWorld Geocoding 실패');
      console.error('응답:', JSON.stringify(result.data, null, 2));
      return { success: false };
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ 서버에 연결할 수 없습니다.');
      console.error('💡 개발 서버를 실행해주세요: pnpm dev');
    } else {
      console.error('❌ 오류 발생:', error.message);
    }
    return { success: false };
  }
}

async function main() {
  console.log('🚀 재활기관 주소 정리 및 Geocoding 재시도 시작\n');
  console.log('='.repeat(60));

  // Step 1: 주소 정리
  const cleanupResult = await cleanupAddresses();

  if (!cleanupResult.success) {
    console.error('\n❌ 주소 정리 실패로 중단합니다.');
    process.exit(1);
  }

  // Step 2: 네이버 Geocoding 재시도
  const naverResult = await runNaverGeocoding();

  if (!naverResult.success) {
    console.error('\n❌ 네이버 Geocoding 실패로 중단합니다.');
    process.exit(1);
  }

  // Step 3: 실패한 주소가 있으면 VWorld로 재시도
  if (naverResult.failedCount > 0) {
    console.log(`\n⚠️  ${naverResult.failedCount}개 주소가 실패했습니다.`);
    console.log('🌍 VWorld API로 재시도합니다...\n');
    
    const vworldResult = await runVWorldGeocoding();
    
    if (vworldResult.success) {
      const totalSuccess = naverResult.geocodedCount + vworldResult.geocodedCount;
      const totalFailed = vworldResult.failedCount;
      const totalProcessed = naverResult.totalCount;
      
      console.log('\n' + '='.repeat(60));
      console.log('📊 최종 결과\n');
      console.log(`✅ 총 성공: ${totalSuccess}개`);
      console.log(`❌ 총 실패: ${totalFailed}개`);
      console.log(`📊 전체 처리: ${totalProcessed}개`);
      if (totalProcessed > 0) {
        console.log(`📈 성공률: ${((totalSuccess / totalProcessed) * 100).toFixed(2)}%\n`);
      }
    }
  } else {
    console.log('\n✅ 모든 주소가 성공적으로 Geocoding되었습니다!');
  }

  console.log('='.repeat(60));
  console.log('✅ 모든 작업 완료!\n');
}

main().catch(console.error);

