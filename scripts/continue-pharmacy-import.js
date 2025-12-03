/**
 * 약국 데이터 수집 이어서 진행 스크립트
 * 배치 단위로 안전하게 수집합니다.
 */

const http = require('http');

function importBatch(startPage, batchSize = 10) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: `/api/pharmacies/import-batch?startPage=${startPage}&batchSize=${batchSize}`,
      method: 'POST',
    };

    console.log(`\n📦 배치 수집 시작: 페이지 ${startPage}부터 ${batchSize}페이지`);
    
    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.success) {
            console.log(`✅ 배치 완료: ${result.savedCount}개 신규 저장, ${result.updatedCount}개 업데이트`);
            console.log(`   진행률: ${result.progress?.percentage || 0}% (${result.progress?.completed || 0}/${result.progress?.total || 0}페이지)`);
            
            if (result.failedPages && result.failedPages.length > 0) {
              console.log(`   ⚠️  실패한 페이지: ${result.failedPages.join(', ')}`);
            }
            
            resolve(result);
          } else {
            console.error('❌ 배치 실패:', result.error);
            reject(new Error(result.error));
          }
        } catch (e) {
          console.error('❌ 응답 파싱 실패:', data);
          reject(e);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ 요청 실패:', error.message);
      reject(error);
    });

    req.end();
  });
}

async function main() {
  console.log('🚀 약국 데이터 수집 재개...\n');
  
  // 현재 상태 확인
  try {
    const statusRes = await new Promise((resolve, reject) => {
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

    console.log(`📊 현재 상태: ${statusRes.savedCount.toLocaleString()}개 저장됨`);
    console.log(`📄 예상 시작 페이지: ${statusRes.estimatedNextPage}\n`);

    let currentPage = statusRes.estimatedNextPage || 110;
    const batchSize = 10; // 10페이지씩 처리
    let totalBatches = 0;
    const maxBatches = 20; // 한 번에 최대 20배치 (200페이지)

    while (totalBatches < maxBatches) {
      try {
        const result = await importBatch(currentPage, batchSize);
        
        if (!result.hasMore) {
          console.log('\n🎉 모든 데이터 수집 완료!');
          break;
        }

        currentPage = result.nextPage;
        totalBatches++;

        // 배치 간 잠시 대기
        if (result.hasMore && totalBatches < maxBatches) {
          console.log('⏳ 다음 배치 준비 중... (2초 대기)');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (error) {
        console.error(`\n❌ 배치 실패 (페이지 ${currentPage}):`, error.message);
        console.log('⏳ 5초 후 재시도...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        // 재시도는 같은 페이지부터
      }
    }

    if (totalBatches >= maxBatches) {
      console.log(`\n📌 ${maxBatches}배치 완료. 다음 시작 페이지: ${currentPage}`);
      console.log('💡 계속 수집하려면 이 스크립트를 다시 실행하세요.');
    }
  } catch (error) {
    console.error('❌ 오류:', error.message);
    process.exit(1);
  }
}

main();







