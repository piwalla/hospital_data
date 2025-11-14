/**
 * @file test-medisvc-pharmacy-crawl.js
 * @description 메디서비스 산재 약국 크롤링 테스트 스크립트
 * 
 * 목적: 10개 데이터만 수집 테스트
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.medisvc.com/hospital/fo/ldpharmacylist.sd';
const OUTPUT_DIR = path.join(__dirname, '..', 'data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'medisvc_pharmacies_test.csv');

// CSV 헤더
const CSV_HEADER = '의료기관명,주소,전화번호\n';

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
    data.name || '',
    data.address || '',
    data.phone || ''
  ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(',') + '\n';
  
  fs.appendFileSync(OUTPUT_FILE, row, 'utf-8');
}

/**
 * 데이터 수집 (10개만)
 */
async function collectData(page) {
  console.log('\n📦 데이터 수집 시작 (최대 10개)...\n');
  
  let collectedCount = 0;
  const maxCount = 10;
  
  try {
    // 페이지 접속
    console.log(`🌐 페이지 접속: ${BASE_URL}`);
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    // 테이블 확인
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
    console.log(`📊 총 ${allRows.length}개 행 발견\n`);
    
    for (const row of allRows) {
      if (collectedCount >= maxCount) break;
      
      const thCount = await row.locator('th').count();
      if (thCount > 0) continue; // 헤더 행 스킵
      
      const tdCount = await row.locator('td').count();
      if (tdCount < 3) continue; // 데이터가 충분하지 않으면 스킵
      
      const cells = await row.locator('td').allTextContents();
      
      // 데이터 추출 (의료기관명, 주소, 전화번호)
      const data = {
        name: cells[0]?.trim() || '',
        address: cells[1]?.trim() || '',
        phone: cells[2]?.trim() || ''
      };
      
      // 빈 데이터 스킵
      if (!data.name && !data.address) continue;
      
      // CSV에 추가
      appendToCSV(data);
      collectedCount++;
      
      console.log(`   ✅ ${collectedCount}. ${data.name}`);
      console.log(`      주소: ${data.address}`);
      console.log(`      전화: ${data.phone}\n`);
    }
    
    console.log(`📊 총 ${collectedCount}개 데이터 수집 완료`);
    
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
  console.log('🚀 메디서비스 약국 크롤링 테스트 시작\n');
  console.log(`📁 출력 파일: ${OUTPUT_FILE}\n`);
  
  const browser = await chromium.launch({ 
    headless: false, // 브라우저 표시 (디버깅용)
    slowMo: 300 // 동작 속도 조절
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });
  
  const page = await context.newPage();
  
  try {
    // 데이터 수집
    const collectedCount = await collectData(page);
    
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

