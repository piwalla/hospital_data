/**
 * @file geocode-pharmacies-vworld.js
 * @description 약국 데이터를 VWorld API로 반복 지오코딩하는 유틸 스크립트
 *
 * 사용법:
 *    node scripts/geocode-pharmacies-vworld.js --batch-size=1000 --delay=150 --iterations=10
 *
 * 옵션:
 *  - --batch-size: 한 번에 처리할 레코드 수 (기본 1000)
 *  - --delay: API 호출 간 딜레이(ms) (기본 150)
 *  - --iterations: 반복 횟수 (기본 10)
 */

const http = require('http');

const args = process.argv.slice(2);
const batchSize = parseInt(args.find(arg => arg.startsWith('--batch-size='))?.split('=')[1] || '1000', 10);
const delayMs = parseInt(args.find(arg => arg.startsWith('--delay='))?.split('=')[1] || '150', 10);
const iterations = parseInt(args.find(arg => arg.startsWith('--iterations='))?.split('=')[1] || '10', 10);

function runVWorldBatch(limit, delay) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: `/api/hospitals/geocode-vworld?limit=${limit}&delayMs=${delay}`,
      method: 'POST',
    };

    const req = http.request(options, res => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (error) {
          reject(new Error(`응답 파싱 실패: ${data.slice(0, 200)}`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function main() {
  console.log('🌍 VWorld 약국 지오코딩 반복 실행');
  console.log('='.repeat(60));
  console.log(`배치 크기: ${batchSize}, 딜레이: ${delayMs}ms, 반복: ${iterations}회\n`);

  let totalProcessed = 0;
  let totalSuccess = 0;
  let totalFailed = 0;

  for (let i = 1; i <= iterations; i += 1) {
    console.log(`\n--- VWorld 배치 ${i}/${iterations} ---`);

    try {
      const result = await runVWorldBatch(batchSize, delayMs);

      if (!result.success) {
        console.error('❌ VWorld 배치 실패:', result.error || '알 수 없는 오류');
        break;
      }

      const summary = result.summary || {};
      console.log(`총 처리: ${summary.processed || 0}개 | 성공: ${summary.success || 0}개 | 실패: ${summary.failed || 0}개`);

      totalProcessed += summary.processed || 0;
      totalSuccess += summary.success || 0;
      totalFailed += summary.failed || 0;

      if ((summary.processed || 0) < batchSize) {
        console.log('남은 데이터가 요청 수보다 적어 반복을 종료합니다.');
        break;
      }
    } catch (error) {
      console.error('❌ 요청 중 오류 발생:', error.message);
      break;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 VWorld 지오코딩 요약');
  console.log(`총 처리: ${totalProcessed}개`);
  console.log(`성공: ${totalSuccess}개`);
  console.log(`실패: ${totalFailed}개`);
  console.log('='.repeat(60));
}

main().catch(error => {
  console.error('❌ 스크립트 오류:', error);
  process.exit(1);
});







