/**
 * 전체 약국 데이터 수집 시작 스크립트
 */

const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/pharmacies/import',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

console.log('🚀 전체 약국 데이터 수집을 시작합니다...');
console.log('📡 API 호출 중: http://localhost:3000/api/pharmacies/import');
console.log('⏳ 이 작업은 약 2-3분 정도 소요될 수 있습니다.\n');

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      console.log('\n✅ 수집 완료!');
      console.log(JSON.stringify(result, null, 2));
    } catch (e) {
      console.log('\n📄 응답:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ 오류 발생:', error.message);
  console.error('\n💡 개발 서버가 실행 중인지 확인해주세요:');
  console.error('   pnpm dev');
  process.exit(1);
});

req.end();







