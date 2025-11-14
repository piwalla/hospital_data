/**
 * @file geocode-rehabilitation-centers.js
 * @description 재활기관 Geocoding 실행 스크립트
 * 
 * 1. 네이버 Geocoding API로 주소를 좌표로 변환
 * 2. 실패한 주소는 VWorld API로 재시도
 * 
 * 사용법:
 * node scripts/geocode-rehabilitation-centers.js [limit] [delayMs]
 * 
 * 예시:
 * node scripts/geocode-rehabilitation-centers.js 100 150
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';

// 명령줄 인자 파싱
const limit = process.argv[2] ? parseInt(process.argv[2], 10) : 100;
const delayMs = process.argv[3] ? parseInt(process.argv[3], 10) : 150;

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

async function runNaverGeocoding() {
  console.log('\n📍 Step 1: 네이버 Geocoding 시작\n');
  console.log('='.repeat(60));
  console.log(`설정: limit=${limit}, delayMs=${delayMs}ms\n`);

  try {
    const url = `${BASE_URL}/api/rehabilitation-centers/geocode?limit=${limit}&delayMs=${delayMs}`;
    const result = await makeRequest('POST', url);

    if (result.status === 200 && result.data.success) {
      console.log('✅ 네이버 Geocoding 완료!\n');
      console.log(`📍 Geocoding 성공: ${result.data.geocodedCount}개`);
      console.log(`❌ Geocoding 실패: ${result.data.failedCount}개`);
      console.log(`📊 전체: ${result.data.totalCount}개\n`);
      
      if (result.data.results && result.data.results.length > 0) {
        console.log('📋 샘플 결과 (처음 5개):');
        result.data.results.slice(0, 5).forEach((r, i) => {
          if (r.status === 'success') {
            console.log(`  ${i + 1}. ✅ ${r.name}: (${r.lat}, ${r.lng})`);
          } else {
            console.log(`  ${i + 1}. ❌ ${r.name}: ${r.reason || r.error || '실패'}`);
          }
        });
        console.log('');
      }
      
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
  console.log('\n🌍 Step 2: VWorld Geocoding 재시도 시작\n');
  console.log('='.repeat(60));
  console.log(`설정: limit=${limit}, delayMs=${delayMs * 1.5}ms (VWorld은 조금 더 느리게)\n`);

  try {
    const vworldDelayMs = Math.floor(delayMs * 1.5); // VWorld은 조금 더 느리게
    const url = `${BASE_URL}/api/rehabilitation-centers/geocode-vworld?limit=${limit}&delayMs=${vworldDelayMs}`;
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
  console.log('🚀 재활기관 Geocoding 시작\n');
  console.log('='.repeat(60));
  console.log(`📋 설정: limit=${limit}, delayMs=${delayMs}ms\n`);

  // Step 1: 네이버 Geocoding
  const naverResult = await runNaverGeocoding();

  if (!naverResult.success) {
    console.error('\n❌ 네이버 Geocoding 실패로 중단합니다.');
    process.exit(1);
  }

  // Step 2: 실패한 주소가 있으면 VWorld로 재시도
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
      console.log(`📈 성공률: ${((totalSuccess / totalProcessed) * 100).toFixed(2)}%\n`);
    }
  } else {
    console.log('\n✅ 모든 주소가 성공적으로 Geocoding되었습니다!');
  }

  console.log('='.repeat(60));
  console.log('✅ 모든 작업 완료!\n');
}

main().catch(console.error);

