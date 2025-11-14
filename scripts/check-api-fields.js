/**
 * 공공데이터포털 API 응답 필드 확인 스크립트
 */

const http = require('http');

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

async function checkApiFields() {
  try {
    console.log('🔍 API 응답 필드 확인 중...\n');
    
    const result = await makeRequest('http://localhost:3000/api/hospitals/check-api-fields');
    
    if (!result.success) {
      console.error('❌ API 호출 실패:', result.error);
      return;
    }
    
    console.log('✅ API 응답 필드 확인 완료\n');
    console.log('📊 총 데이터 수:', result.totalCount);
    console.log('\n📋 샘플 데이터:');
    console.log(JSON.stringify(result.sampleData, null, 2));
    console.log('\n🔑 필드 목록:');
    result.fields.forEach((field, index) => {
      console.log(`  ${index + 1}. ${field.name} (${field.type}): ${JSON.stringify(field.value)}`);
    });
    console.log('\n🏥 종별 필드 포함 여부:', result.hasTypeField ? '✅ 있음' : '❌ 없음');
    
    if (result.hasTypeField) {
      console.log('\n✨ 종별 정보가 포함되어 있습니다!');
    } else {
      console.log('\n⚠️  종별 정보가 포함되어 있지 않습니다.');
      console.log('   대안: 웹 크롤링 또는 건강보험심사평가원 API 사용을 고려하세요.');
    }
  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    console.log('\n💡 서버가 실행 중인지 확인하세요: pnpm dev');
  }
}

checkApiFields();

