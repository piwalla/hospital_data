/**
 * @file test-comwel-pharmacy-crawl.js
 * @description 근로복지공단 산재 약국 크롤링 테스트 스크립트
 * 
 * 목적: 검색어 전략 확인 및 10개 데이터만 수집 테스트
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.comwel.or.kr/comwel/medi/mesc.jsp';
const OUTPUT_DIR = path.join(__dirname, '..', 'data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'comwel_pharmacies_test.csv');

// CSV 헤더
const CSV_HEADER = '지사,의료기관,소재지,전화번호\n';

// 출력 디렉토리 생성
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// CSV 파일 초기화
fs.writeFileSync(OUTPUT_FILE, CSV_HEADER, 'utf-8');

/**
 * CSV에 데이터 추가
 */
function appendToCSV(data) {
  const row = [
    data.branch || '',
    data.name || '',
    data.address || '',
    data.phone || ''
  ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(',') + '\n';
  
  fs.appendFileSync(OUTPUT_FILE, row, 'utf-8');
}

/**
 * 검색어 전략 테스트
 */
async function testSearchStrategies(page) {
  console.log('\n🔍 검색어 전략 테스트 시작...\n');
  
  const strategies = [
    { name: '공백 문자', value: ' ' },
    { name: '빈 문자열', value: '' },
    { name: '와일드카드 *', value: '*' },
    { name: '와일드카드 %', value: '%' },
    { name: '일반 검색어 "약국"', value: '약국' }
  ];
  
  // 알림창 리스너를 한 번만 설정
  let dialogMessage = null;
  const dialogHandler = async (dialog) => {
    dialogMessage = dialog.message();
    await dialog.accept();
  };
  
  for (const strategy of strategies) {
    console.log(`\n📝 전략 테스트: ${strategy.name} (값: "${strategy.value}")`);
    
    // 리스너 제거 후 재설정
    page.off('dialog', dialogHandler);
    dialogMessage = null;
    page.on('dialog', dialogHandler);
    
    try {
      // 페이지 새로고침
      await page.goto(BASE_URL, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);
      
      // 시도 선택 (서울)
      const sidoSelect = page.locator('#sido_select');
      await sidoSelect.selectOption('서울');
      await page.waitForTimeout(2000);
      
      // 구군 선택 (강남구)
      const gugunSelect = page.locator('#gugun_select');
      const gugunOptions = await gugunSelect.locator('option').allTextContents();
      const gangnamOption = gugunOptions.find(opt => opt.includes('강남'));
      
      if (gangnamOption) {
        await gugunSelect.selectOption({ label: gangnamOption });
        await page.waitForTimeout(2000);
      }
      
      // 검색어 입력
      const searchInput = page.locator('#cont-search');
      await searchInput.fill(strategy.value);
      await page.waitForTimeout(500);
      
      // 검색 버튼 클릭
      const searchButton = page.locator('form button').first();
      await searchButton.click();
      
      // 알림창 처리 대기
      await page.waitForTimeout(2000);
      
      // 알림창 확인
      if (dialogMessage) {
        console.log(`   ❌ 실패: ${dialogMessage}`);
        continue;
      }
      
      // 검색 결과 페이지 대기
      await page.waitForTimeout(3000);
      
      // 결과 확인
      const currentUrl = page.url();
      console.log(`   🔗 현재 URL: ${currentUrl}`);
      
      // 페이지 내용 확인
      const bodyText = await page.locator('body').textContent();
      const hasNoResult = bodyText?.includes('없습니다') || bodyText?.includes('조회');
      const hasTable = bodyText?.includes('의료기관') || bodyText?.includes('소재지');
      
      console.log(`   📄 페이지 내용 확인: ${hasNoResult ? '결과 없음' : hasTable ? '테이블 있음' : '확인 필요'}`);
      
      const table = page.locator('table');
      const tableExists = await table.count() > 0;
      
      // 다른 형태의 결과 컨테이너 확인
      const resultDiv = page.locator('.result, .list, [class*="result"], [class*="list"], .table, [class*="table"]');
      const resultDivExists = await resultDiv.count() > 0;
      
      console.log(`   📊 테이블 존재: ${tableExists}, 결과 div 존재: ${resultDivExists}`);
      
      if (tableExists) {
        // 모든 행 가져오기
        const allRows = await table.locator('tr').all();
        let dataRowCount = 0;
        let sampleData = null;
        
        for (const row of allRows) {
          const thCount = await row.locator('th').count();
          if (thCount > 0) continue; // 헤더 행 스킵
          
          const tdCount = await row.locator('td').count();
          if (tdCount < 3) continue; // 데이터가 충분하지 않으면 스킵
          
          dataRowCount++;
          
          // 첫 번째 데이터 행 저장
          if (!sampleData && dataRowCount === 1) {
            const cells = await row.locator('td').allTextContents();
            sampleData = cells;
          }
        }
        
        console.log(`   ✅ 성공: ${dataRowCount}개 결과 발견`);
        
        if (dataRowCount > 0 && sampleData) {
          console.log(`   📊 샘플 데이터: ${sampleData.join(' | ')}`);
          return { success: true, strategy: strategy.name, value: strategy.value };
        }
      } else if (resultDivExists) {
        console.log(`   ⚠️  테이블은 없지만 결과 div 발견`);
        // 결과 div에서 데이터 추출 시도
        const resultText = await resultDiv.first().textContent();
        console.log(`   📝 결과 내용: ${resultText?.substring(0, 200)}`);
      } else {
        console.log(`   ⚠️  테이블 및 결과 div 없음 (URL: ${currentUrl})`);
        // 페이지 스크린샷 저장 (디버깅용)
        // await page.screenshot({ path: `debug_${strategy.name.replace(/\s/g, '_')}.png` });
      }
      
    } catch (error) {
      console.log(`   ❌ 오류: ${error.message}`);
    }
  }
  
  return { success: false };
}

/**
 * 데이터 수집 (10개만)
 */
async function collectData(page, searchValue) {
  console.log('\n📦 데이터 수집 시작 (최대 10개)...\n');
  
  let collectedCount = 0;
  const maxCount = 10;
  
  try {
    // 페이지 새로고침
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // 시도 선택 (서울)
    const sidoSelect = page.locator('#sido_select');
    await sidoSelect.selectOption('서울');
    await page.waitForTimeout(2000);
    
    // 구군 선택 (강남구)
    const gugunSelect = page.locator('#gugun_select');
    const gugunOptions = await gugunSelect.locator('option').allTextContents();
    const gangnamOption = gugunOptions.find(opt => opt.includes('강남'));
    
    if (!gangnamOption) {
      console.log('❌ 강남구 옵션을 찾을 수 없습니다.');
      return collectedCount;
    }
    
    await gugunSelect.selectOption({ label: gangnamOption });
    await page.waitForTimeout(2000);
    
    // 검색어 입력
    const searchInput = page.locator('#cont-search');
    await searchInput.fill(searchValue);
    await page.waitForTimeout(500);
    
    // 알림창 리스너 설정
    let dialogMessage = null;
    const dialogHandler = async (dialog) => {
      dialogMessage = dialog.message();
      await dialog.accept();
    };
    page.on('dialog', dialogHandler);
    
    // 검색 버튼 클릭
    const searchButton = page.locator('form button').first();
    await searchButton.click();
    
    // 알림창 처리 대기
    await page.waitForTimeout(2000);
    
    if (dialogMessage) {
      console.log(`❌ 검색 실패: ${dialogMessage}`);
      page.off('dialog', dialogHandler);
      return collectedCount;
    }
    
    page.off('dialog', dialogHandler);
    
    // 검색 결과 페이지 대기
    await page.waitForTimeout(3000);
    
    // 테이블 데이터 파싱
    const table = page.locator('table');
    const tableExists = await table.count() > 0;
    
    if (!tableExists) {
      console.log('❌ 테이블을 찾을 수 없습니다.');
      return collectedCount;
    }
    
    // 헤더 확인
    const headers = await table.locator('th').allTextContents();
    console.log(`📋 테이블 헤더: ${headers.join(' | ')}`);
    
    // 데이터 행 수집
    const allRows = await table.locator('tr').all();
    
    for (const row of allRows) {
      if (collectedCount >= maxCount) break;
      
      const thCount = await row.locator('th').count();
      if (thCount > 0) continue; // 헤더 행 스킵
      
      const tdCount = await row.locator('td').count();
      if (tdCount < 3) continue; // 데이터가 충분하지 않으면 스킵
      
      const cells = await row.locator('td').allTextContents();
      
      // 데이터 추출 (지사, 의료기관, 소재지, 전화번호)
      const data = {
        branch: cells[0]?.trim() || '',
        name: cells[1]?.trim() || '',
        address: cells[2]?.trim() || '',
        phone: cells[3]?.trim() || ''
      };
      
      // 빈 데이터 스킵
      if (!data.name && !data.address) continue;
      
      // "조회하신 의료기관이 없습니다" 메시지 스킵
      if (data.name.includes('없습니다') || data.address.includes('없습니다')) continue;
      
      // CSV에 추가
      appendToCSV(data);
      collectedCount++;
      
      console.log(`   ✅ ${collectedCount}. ${data.name} | ${data.address}`);
    }
    
    console.log(`\n📊 총 ${collectedCount}개 데이터 수집 완료`);
    
  } catch (error) {
    console.error(`❌ 오류 발생: ${error.message}`);
    console.error(error.stack);
  }
  
  return collectedCount;
}

/**
 * 메인 함수
 */
async function main() {
  console.log('🚀 근로복지공단 약국 크롤링 테스트 시작\n');
  console.log(`📁 출력 파일: ${OUTPUT_FILE}\n`);
  
  const browser = await chromium.launch({ 
    headless: false, // 브라우저 표시 (디버깅용)
    slowMo: 500 // 동작 속도 조절
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });
  
  const page = await context.newPage();
  
  try {
    // 1. 검색어 전략 테스트
    const strategyResult = await testSearchStrategies(page);
    
    if (!strategyResult.success) {
      console.log('\n❌ 모든 검색어 전략이 실패했습니다.');
      console.log('💡 대안: 메디서비스(medisvc.com) 크롤링을 고려하세요.');
      return;
    }
    
    console.log(`\n✅ 성공한 전략: ${strategyResult.strategy} (값: "${strategyResult.value}")`);
    
    // 2. 데이터 수집
    const collectedCount = await collectData(page, strategyResult.value);
    
    if (collectedCount > 0) {
      console.log(`\n✅ 테스트 완료: ${collectedCount}개 데이터 수집`);
      console.log(`📁 파일 위치: ${OUTPUT_FILE}`);
    } else {
      console.log('\n❌ 데이터를 수집하지 못했습니다.');
    }
    
  } catch (error) {
    console.error(`\n❌ 치명적 오류: ${error.message}`);
    console.error(error.stack);
  } finally {
    await browser.close();
  }
}

// 실행
main().catch(console.error);

