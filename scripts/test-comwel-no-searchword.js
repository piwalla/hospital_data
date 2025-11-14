/**
 * @file test-comwel-no-searchword.js
 * @description 근로복지공단 약국 크롤링 테스트 (검색어 없이 시도만 선택)
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.comwel.or.kr/comwel/medi/mesc.jsp';
const OUTPUT_DIR = path.join(__dirname, '..', 'data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'comwel_pharmacies_no_searchword_test.csv');

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
 * 검색어 없이 검색 테스트
 */
async function testWithoutSearchWord(page) {
  console.log('\n🔍 검색어 없이 시도만 선택하여 검색 테스트...\n');
  
  try {
    // 페이지 접속
    console.log(`🌐 페이지 접속: ${BASE_URL}`);
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // 시도 선택 (서울)
    console.log('📍 시도 선택: 서울');
    const sidoSelect = page.locator('#sido_select');
    await sidoSelect.selectOption('서울');
    await page.waitForTimeout(2000);
    
    // 구군 선택 (강남구)
    console.log('📍 구군 선택: 강남구');
    const gugunSelect = page.locator('#gugun_select');
    const gugunOptions = await gugunSelect.locator('option').allTextContents();
    const gangnamOption = gugunOptions.find(opt => opt.includes('강남'));
    
    if (!gangnamOption) {
      console.log('❌ 강남구 옵션을 찾을 수 없습니다.');
      return false;
    }
    
    await gugunSelect.selectOption({ label: gangnamOption });
    await page.waitForTimeout(2000);
    
    // 검색어 입력 필드 확인 (입력하지 않음)
    const searchInput = page.locator('#cont-search');
    const currentValue = await searchInput.inputValue();
    console.log(`📝 검색어 입력 필드 현재 값: "${currentValue}"`);
    
    // 방법 1: 검색어 필드를 아예 건드리지 않기
    // 방법 2: JavaScript로 검증 우회
    // 방법 3: 폼을 직접 제출
    
    // JavaScript로 검증 우회 시도
    console.log('🔍 JavaScript로 검증 우회 시도...');
    await page.evaluate(() => {
      const searchInput = document.querySelector('#cont-search');
      if (searchInput) {
        // required 속성 제거
        searchInput.removeAttribute('required');
        // value를 빈 문자열로 설정하되 이벤트 발생시키지 않음
        searchInput.value = '';
      }
    });
    
    await page.waitForTimeout(500);
    
    // 알림창 리스너 설정
    let dialogMessage = null;
    const dialogHandler = async (dialog) => {
      dialogMessage = dialog.message();
      await dialog.accept();
    };
    page.on('dialog', dialogHandler);
    
    // 방법 1: 검색 버튼 클릭
    console.log('🔍 검색 버튼 클릭...');
    const searchButton = page.locator('form button').first();
    await searchButton.click();
    
    // 알림창 처리 대기
    await page.waitForTimeout(2000);
    page.off('dialog', dialogHandler);
    
    // 알림창 확인
    if (dialogMessage) {
      console.log(`❌ 방법 1 실패: ${dialogMessage}`);
      console.log('🔍 방법 2: 폼 직접 제출 시도...');
      
      // 방법 2: 폼을 직접 제출 (JavaScript 검증 우회)
      dialogMessage = null;
      page.on('dialog', dialogHandler);
      
      await page.evaluate(() => {
        const form = document.querySelector('form');
        if (form) {
          const searchInput = document.querySelector('#cont-search');
          if (searchInput) {
            searchInput.value = '';
            searchInput.removeAttribute('required');
          }
          form.submit();
        }
      });
      
      await page.waitForTimeout(2000);
      page.off('dialog', dialogHandler);
      
      if (dialogMessage) {
        console.log(`❌ 방법 2도 실패: ${dialogMessage}`);
        return false;
      }
    }
    
    // 검색 결과 페이지 대기
    console.log('⏳ 검색 결과 페이지 대기...');
    await page.waitForTimeout(3000);
    
    // 결과 확인
    const currentUrl = page.url();
    console.log(`🔗 현재 URL: ${currentUrl}`);
    
    // 페이지 내용 확인
    const bodyText = await page.locator('body').textContent();
    console.log(`📄 페이지 내용 일부: ${bodyText?.substring(0, 300)}`);
    
    // 테이블 확인
    const table = page.locator('table');
    const tableExists = await table.count() > 0;
    console.log(`📊 테이블 존재: ${tableExists}`);
    
    if (tableExists) {
      // 헤더 확인
      const headers = await table.locator('th').allTextContents();
      console.log(`📋 테이블 헤더: ${headers.join(' | ')}`);
      
      // 모든 행 가져오기
      const allRows = await table.locator('tr').all();
      console.log(`📊 총 ${allRows.length}개 행 발견\n`);
      
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
      
      console.log(`✅ 성공: ${dataRowCount}개 결과 발견`);
      
      if (dataRowCount > 0 && sampleData) {
        console.log(`📊 샘플 데이터: ${sampleData.join(' | ')}`);
        return true;
      }
    } else {
      // 다른 형태의 결과 확인
      const resultDiv = page.locator('.result, .list, [class*="result"], [class*="list"]');
      const resultDivExists = await resultDiv.count() > 0;
      console.log(`📊 결과 div 존재: ${resultDivExists}`);
      
      if (resultDivExists) {
        const resultText = await resultDiv.first().textContent();
        console.log(`📝 결과 내용: ${resultText?.substring(0, 300)}`);
      }
    }
    
    return false;
    
  } catch (error) {
    console.error(`❌ 오류 발생: ${error.message}`);
    console.error(error.stack);
    return false;
  }
}

/**
 * 데이터 수집 (10개만)
 */
async function collectData(page, sido, gugun) {
  console.log(`\n📦 데이터 수집 시작 (${sido} ${gugun}, 최대 10개)...\n`);
  
  let collectedCount = 0;
  const maxCount = 10;
  
  try {
    // 페이지 접속
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // 시도 선택
    const sidoSelect = page.locator('#sido_select');
    await sidoSelect.selectOption(sido);
    await page.waitForTimeout(2000);
    
    // 구군 선택
    const gugunSelect = page.locator('#gugun_select');
    await gugunSelect.selectOption({ label: gugun });
    await page.waitForTimeout(2000);
    
    // 검색어 입력 필드를 빈 문자열로 설정
    const searchInput = page.locator('#cont-search');
    await searchInput.fill('');
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
    page.off('dialog', dialogHandler);
    
    if (dialogMessage) {
      console.log(`❌ 검색 실패: ${dialogMessage}`);
      return collectedCount;
    }
    
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
  console.log('🚀 근로복지공단 약국 크롤링 테스트 (검색어 없이)\n');
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
    // 1. 검색어 없이 검색 가능 여부 테스트
    const canSearch = await testWithoutSearchWord(page);
    
    if (!canSearch) {
      console.log('\n❌ 검색어 없이 검색이 불가능합니다.');
      console.log('💡 다른 방법을 시도하거나 메디서비스 사이트를 사용하세요.');
      return;
    }
    
    console.log('\n✅ 검색어 없이 검색 가능 확인!');
    
    // 2. 데이터 수집 (서울 강남구)
    const collectedCount = await collectData(page, '서울', '강남구');
    
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

