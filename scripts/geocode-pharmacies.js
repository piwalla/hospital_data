/**
 * 약국 데이터 지오코딩 자동화 스크립트
 * 
 * 배치 단위로 약국 데이터를 지오코딩하고 진행 상황을 표시합니다.
 * 
 * 사용법:
 * node scripts/geocode-pharmacies.js [options]
 * 
 * 옵션:
 * - --batch-size: 배치 크기 (기본값: 100)
 * - --delay: API 호출 간 딜레이 (기본값: 150ms)
 * - --max-batches: 최대 배치 수 (기본값: 20)
 */

const http = require('http');

// 명령줄 인자 파싱
const args = process.argv.slice(2);
const batchSize = parseInt(args.find(arg => arg.startsWith('--batch-size='))?.split('=')[1] || '100', 10);
const delayMs = parseInt(args.find(arg => arg.startsWith('--delay='))?.split('=')[1] || '150', 10);
const maxBatches = parseInt(args.find(arg => arg.startsWith('--max-batches='))?.split('=')[1] || '20', 10);

/**
 * 현재 지오코딩 상태 확인
 */
function getStatus() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:3000/api/pharmacies/status', (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

/**
 * 배치 지오코딩 실행
 */
function geocodeBatch(limit, delay) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: `/api/pharmacies/geocode-batch?limit=${limit}&delayMs=${delay}`,
      method: 'POST',
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (e) {
          reject(new Error(`응답 파싱 실패: ${data.substring(0, 200)}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

/**
 * 진행 상황 표시
 */
function displayProgress(batchNum, totalBatches, result, totalProcessed, totalSuccess, totalFailed) {
  const progress = Math.round((batchNum / totalBatches) * 100);
  const barLength = 30;
  const filled = Math.round((progress / 100) * barLength);
  const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled);

  console.log(`\n[배치 ${batchNum}/${totalBatches}] ${bar} ${progress}%`);
  console.log(`   처리: ${result.summary.processed}개 | 성공: ${result.summary.success}개 | 실패: ${result.summary.failed}개`);
  console.log(`   성공률: ${result.summary.successRate} | 남은 데이터: ${result.summary.remaining.toLocaleString()}개`);
  console.log(`   누적: ${totalProcessed}개 처리, ${totalSuccess}개 성공, ${totalFailed}개 실패`);
}

/**
 * 메인 함수
 */
async function main() {
  console.log('🚀 약국 데이터 지오코딩 시작...\n');
  console.log(`📋 설정:`);
  console.log(`   - 배치 크기: ${batchSize}개`);
  console.log(`   - API 딜레이: ${delayMs}ms`);
  console.log(`   - 최대 배치: ${maxBatches}개\n`);

  try {
    // 현재 상태 확인
    console.log('📊 현재 상태 확인 중...');
    const status = await getStatus();
    
    console.log(`   총 약국 데이터: ${status.savedCount.toLocaleString()}개`);
    console.log(`   지오코딩 필요: ${status.savedCount.toLocaleString()}개 (전체)\n`);

    let batchNum = 0;
    let totalProcessed = 0;
    let totalSuccess = 0;
    let totalFailed = 0;
    let hasMore = true;

    // 배치 처리 시작
    while (hasMore && batchNum < maxBatches) {
      batchNum++;

      try {
        console.log(`\n📦 배치 ${batchNum} 처리 중...`);
        const result = await geocodeBatch(batchSize, delayMs);

        if (!result.success) {
          console.error(`❌ 배치 ${batchNum} 실패:`, result.error);
          break;
        }

        totalProcessed += result.summary.processed;
        totalSuccess += result.summary.success;
        totalFailed += result.summary.failed;

        // 진행 상황 표시
        displayProgress(batchNum, maxBatches, result, totalProcessed, totalSuccess, totalFailed);

        // 실패한 주소가 있으면 샘플 표시
        if (result.details.failedAddresses && result.details.failedAddresses.length > 0) {
          console.log(`\n   ⚠️  실패한 주소 샘플:`);
          result.details.failedAddresses.slice(0, 3).forEach((item, idx) => {
            console.log(`      ${idx + 1}. ${item.name}: ${item.address.substring(0, 40)}...`);
          });
        }

        // 더 처리할 데이터가 있는지 확인
        hasMore = result.summary.remaining > 0;

        if (!hasMore) {
          console.log('\n🎉 모든 약국 데이터의 지오코딩이 완료되었습니다!');
          break;
        }

        // 다음 배치 전 대기 (마지막 배치가 아니면)
        if (batchNum < maxBatches && hasMore) {
          console.log(`\n⏳ 다음 배치 준비 중... (2초 대기)`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (error) {
        console.error(`\n❌ 배치 ${batchNum} 처리 중 오류:`, error.message);
        console.log(`⏳ 5초 후 재시도...`);
        await new Promise(resolve => setTimeout(resolve, 5000));
        batchNum--; // 재시도를 위해 배치 번호 감소
      }
    }

    // 최종 결과
    console.log('\n' + '='.repeat(60));
    console.log('📊 최종 결과');
    console.log('='.repeat(60));
    console.log(`   총 처리: ${totalProcessed.toLocaleString()}개`);
    console.log(`   성공: ${totalSuccess.toLocaleString()}개`);
    console.log(`   실패: ${totalFailed.toLocaleString()}개`);
    console.log(`   성공률: ${totalProcessed > 0 ? Math.round((totalSuccess / totalProcessed) * 100) : 0}%`);
    console.log(`   처리된 배치: ${batchNum}개`);

    if (hasMore) {
      console.log(`\n📌 ${maxBatches}배치 완료. 더 많은 데이터가 남아있습니다.`);
      console.log(`💡 계속 지오코딩하려면 이 스크립트를 다시 실행하세요.`);
      
      // 남은 데이터 확인
      try {
        const finalStatus = await getStatus();
        const remaining = finalStatus.savedCount - (totalSuccess + totalFailed);
        console.log(`   남은 약국 데이터: 약 ${remaining.toLocaleString()}개`);
      } catch (e) {
        // 상태 확인 실패는 무시
      }
    } else {
      console.log(`\n✅ 모든 약국 데이터의 지오코딩이 완료되었습니다!`);
    }

    console.log('\n');
  } catch (error) {
    console.error('\n❌ 오류 발생:', error.message);
    console.error('💡 개발 서버가 실행 중인지 확인해주세요: pnpm dev');
    process.exit(1);
  }
}

// 스크립트 실행
main();







