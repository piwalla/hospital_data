/**
 * @file crawl-medisvc-pharmacies.js
 * @description 메디서비스 산재 약국 전체 크롤링 스크립트
 * 
 * 목적: 메디서비스에서 모든 산재 지정 약국 데이터 수집
 * 
 * 프로세스:
 * 1. 페이지 접속
 * 2. 테이블 데이터 수집
 * 3. 페이지네이션 처리 (있는 경우)
 * 4. CSV 파일로 저장
 * 5. 중복 제거
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.medisvc.com/hospital/fo/ldpharmacylist.sd';
const OUTPUT_DIR = path.join(__dirname, '..', 'data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'medisvc_pharmacies_all.csv');

// CSV 헤더 (hospitals_pharmacies 테이블 형식에 맞춤)
const CSV_HEADER = 'name,address,type,phone\n';

// 출력 디렉토리 생성
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// CSV 파일 초기화
fs.writeFileSync(OUTPUT_FILE, CSV_HEADER, 'utf-8');

// 중복 체크용 Set (이름 + 주소 조합)
const seenData = new Set();

/**
 * CSV에 데이터 추가
 */
function appendToCSV(data) {
  // 중복 체크 (이름 + 주소)
  const key = `${data.name}|${data.address}`;
  if (seenData.has(key)) {
    return false; // 중복
  }
  seenData.add(key);
  
  const row = [
    data.name || '',
    data.address || '',
    'pharmacy', // type은 항상 pharmacy
    data.phone || ''
  ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(',') + '\n';
  
  fs.appendFileSync(OUTPUT_FILE, row, 'utf-8');
  return true; // 추가됨
}

/**
 * 테이블에서 데이터 수집
 */
async function collectTableData(page) {
  // 테이블이 로드될 때까지 대기
  await page.waitForSelector('table', { timeout: 10000 });
  
  const table = page.locator('table');
  const tableExists = await table.count() > 0;
  
  if (!tableExists) {
    console.log('   ⚠️ 테이블을 찾을 수 없습니다.');
    return 0;
  }
  
  // JavaScript로 직접 데이터 추출 (더 안정적)
  const tableData = await page.evaluate(() => {
    const table = document.querySelector('table');
    if (!table) return [];
    
    const allRows = Array.from(table.querySelectorAll('tr'));
    const dataRows = [];
    
    for (const row of allRows) {
      const thCount = row.querySelectorAll('th').length;
      if (thCount > 0) continue; // 헤더 행 스킵
      
      const cells = Array.from(row.querySelectorAll('td'));
      if (cells.length < 3) continue; // 데이터가 충분하지 않으면 스킵
      
      const name = cells[0]?.textContent?.trim() || '';
      const address = cells[1]?.textContent?.trim() || '';
      const phone = cells[2]?.textContent?.trim() || '';
      
      // 빈 데이터 스킵
      if (!name && !address) continue;
      
      // 광고 행 필터링
      if (name.includes('광고') || name.includes('이 곳은') || 
          name.includes('영역') || name.includes('쑥쑥') ||
          name.includes('수익이')) {
        continue;
      }
      
      dataRows.push({ name, address, phone });
    }
    
    return dataRows;
  });
  
  // CSV에 추가
  let collectedCount = 0;
  for (const data of tableData) {
    if (appendToCSV(data)) {
      collectedCount++;
    }
  }
  
  return collectedCount;
}

/**
 * 페이지네이션 처리
 */
async function handlePagination(page, currentPageNum) {
  // 페이지네이션 영역 찾기
  const pagination = page.locator('.pagination');
  const paginationExists = await pagination.count() > 0;
  
  if (!paginationExists) {
    console.log('   ❌ 페이지네이션 영역을 찾을 수 없습니다.');
    return false; // 페이지네이션 없음
  }
  
  console.log('   ✅ 페이지네이션 영역 발견');
  
  // 다음 페이지 번호 계산
  const nextPageNum = currentPageNum + 1;
  
  // 최대 페이지 수 확인 (마지막 페이지 번호 확인)
  const maxPage = await page.evaluate(() => {
    const pagination = document.querySelector('.pagination');
    if (!pagination) return null;
    
    // 마지막 링크 찾기 (">>" 버튼)
    const links = Array.from(pagination.querySelectorAll('a[onclick*="pager"]'));
    if (links.length === 0) return null;
    
    const lastLink = links[links.length - 1];
    const onclick = lastLink.getAttribute('onclick');
    if (!onclick) return null;
    
    const match = onclick.match(/pager\s*\(\s*(\d+)\s*\)/);
    return match ? parseInt(match[1]) : null;
  });
  
  console.log(`   📊 최대 페이지 수: ${maxPage || '(확인 불가)'}`);
  console.log(`   📄 다음 페이지 번호: ${nextPageNum}`);
  
  if (maxPage && nextPageNum > maxPage) {
    console.log(`   ✅ 마지막 페이지(${maxPage})에 도달했습니다.`);
    return false; // 마지막 페이지 도달
  }
  
  // maxPage가 null이면 계속 진행 (확인 불가능한 경우)
  if (maxPage === null) {
    console.log(`   ⚠️ 최대 페이지 수를 확인할 수 없지만 계속 진행합니다.`);
  }
  
  // 다음 페이지 번호로 이동 (onclick="pager(N)" 함수 호출)
  try {
    console.log(`   🔍 페이지 ${nextPageNum}로 이동 시도...`);
    
    // 현재 페이지의 첫 번째 약국명 저장 (페이지 변경 확인용)
    const firstPharmacyName = await page.evaluate(() => {
      const table = document.querySelector('table');
      if (!table) return null;
      const rows = Array.from(table.querySelectorAll('tr'));
      for (const row of rows) {
        if (row.querySelector('th')) continue; // 헤더 행 스킵
        const firstCell = row.querySelector('td');
        if (firstCell) {
          const text = firstCell.textContent?.trim();
          // 광고 행 필터링
          if (text && !text.includes('광고') && !text.includes('이 곳은') && !text.includes('영역') && !text.includes('쑥쑥')) {
            return text;
          }
        }
      }
      return null;
    });
    
    console.log(`   📌 현재 첫 번째 약국명: ${firstPharmacyName || '(없음)'}`);
    
    // 페이지네이션 링크 확인
    const allPaginationLinks = await page.evaluate(() => {
      const pagination = document.querySelector('.pagination');
      if (!pagination) return [];
      const links = Array.from(pagination.querySelectorAll('a'));
      return links.map(link => ({
        text: link.textContent?.trim(),
        onclick: link.getAttribute('onclick'),
        href: link.getAttribute('href')
      }));
    });
    
    console.log(`   📄 페이지네이션 링크 수: ${allPaginationLinks.length}`);
    
    // 다음 페이지 번호가 있는 링크 찾기
    let nextButtonFound = false;
    for (const linkInfo of allPaginationLinks) {
      if (linkInfo.onclick && linkInfo.onclick.includes(`pager(${nextPageNum})`)) {
        nextButtonFound = true;
        console.log(`   ✅ 다음 페이지 버튼 발견: ${linkInfo.text} (onclick: ${linkInfo.onclick})`);
        break;
      }
    }
    
    if (!nextButtonFound) {
      console.log(`   ⚠️ 페이지 ${nextPageNum} 버튼을 찾을 수 없습니다.`);
      // 마지막 페이지인지 확인
      if (maxPage && nextPageNum > maxPage) {
        console.log(`   ✅ 마지막 페이지(${maxPage})에 도달했습니다.`);
        return false;
      }
    }
    
    // 다음 페이지 버튼 클릭 시도 (공백 허용)
    const nextButton = pagination.locator(`a[onclick*="pager(${nextPageNum})"], a[onclick*="pager( ${nextPageNum} )"], a[onclick*="pager(${nextPageNum} )"], a[onclick*="pager( ${nextPageNum})"]`).first();
    const nextButtonExists = await nextButton.count() > 0;
    
    if (nextButtonExists) {
      console.log(`   🖱️ 페이지 ${nextPageNum} 버튼 클릭...`);
      
      // JavaScript로 직접 pager 함수 호출 (더 안정적)
      const clickSuccess = await page.evaluate((pageNum) => {
        if (typeof window.pager === 'function') {
          try {
            window.pager(pageNum);
            return true;
          } catch (e) {
            console.error('pager 호출 실패:', e);
            return false;
          }
        }
        return false;
      }, nextPageNum);
      
      if (!clickSuccess) {
        // pager 함수 호출 실패 시 버튼 클릭 시도
        await nextButton.click({ timeout: 5000 });
      }
      
      await page.waitForTimeout(5000); // 페이지 로드 대기 (더 길게)
      
      // 테이블이 업데이트되었는지 확인 (페이지 번호 또는 첫 번째 약국명 변경 확인)
      let updated = false;
      for (let i = 0; i < 20; i++) { // 최대 10초 대기
        await page.waitForTimeout(500);
        
        // 현재 활성화된 페이지 번호 확인
        const currentActivePage = await page.evaluate(() => {
          const pagination = document.querySelector('.pagination');
          if (!pagination) return null;
          const activeLink = pagination.querySelector('li.active a, a.active, [class*="active"]');
          if (activeLink) {
            const onclick = activeLink.getAttribute('onclick');
            if (onclick) {
              const match = onclick.match(/pager\s*\(\s*(\d+)\s*\)/);
              if (match) return parseInt(match[1]);
            }
            const text = activeLink.textContent?.trim();
            if (text && /^\d+$/.test(text)) {
              return parseInt(text);
            }
          }
          return null;
        });
        
        // 첫 번째 약국명 확인
        const newFirstPharmacyName = await page.evaluate(() => {
          const table = document.querySelector('table');
          if (!table) return null;
          const rows = Array.from(table.querySelectorAll('tr'));
          for (const row of rows) {
            if (row.querySelector('th')) continue;
            const firstCell = row.querySelector('td');
            if (firstCell) {
              const text = firstCell.textContent?.trim();
              if (text && !text.includes('광고') && !text.includes('이 곳은') && !text.includes('영역') && !text.includes('쑥쑥')) {
                return text;
              }
            }
          }
          return null;
        });
        
        // 페이지 번호가 변경되었는지 확인
        if (currentActivePage === nextPageNum) {
          updated = true;
          console.log(`   ✅ 페이지 변경 확인: 활성 페이지 번호가 ${nextPageNum}로 변경됨`);
          break;
        }
        
        // 첫 번째 약국명이 변경되었는지 확인
        if (newFirstPharmacyName && newFirstPharmacyName !== firstPharmacyName) {
          updated = true;
          console.log(`   ✅ 페이지 변경 확인: "${firstPharmacyName}" → "${newFirstPharmacyName}"`);
          break;
        }
        
        // 진행 상황 로그 (5초마다)
        if (i > 0 && i % 10 === 0) {
          console.log(`   ⏳ 페이지 로드 대기 중... (${i * 0.5}초 경과, 현재 활성 페이지: ${currentActivePage || '확인 불가'})`);
        }
      }
      
      if (updated) {
        return true;
      } else {
        console.log(`   ⚠️ 페이지 ${nextPageNum}로 이동했지만 테이블이 업데이트되지 않았습니다.`);
        return false;
      }
    }
    
    // 버튼이 없으면 JavaScript로 직접 pager 함수 호출
    console.log(`   🔧 JavaScript로 pager 함수 직접 호출 시도...`);
    const success = await page.evaluate((nextPage) => {
      if (typeof window.pager === 'function') {
        try {
          window.pager(nextPage);
          return true;
        } catch (e) {
          console.error('pager 함수 호출 실패:', e);
          return false;
        }
      }
      console.log('window.pager 함수를 찾을 수 없습니다.');
      return false;
    }, nextPageNum);
    
    if (success) {
      console.log(`   ✅ pager 함수 호출 성공, 페이지 로드 대기...`);
      
      // 테이블 업데이트 확인 (더 긴 대기 시간)
      let updated = false;
      for (let i = 0; i < 20; i++) { // 최대 10초 대기
        await page.waitForTimeout(500);
        const newFirstPharmacyName = await page.evaluate(() => {
          const table = document.querySelector('table');
          if (!table) return null;
          const rows = Array.from(table.querySelectorAll('tr'));
          for (const row of rows) {
            if (row.querySelector('th')) continue;
            const firstCell = row.querySelector('td');
            if (firstCell) {
              const text = firstCell.textContent?.trim();
              if (text && !text.includes('광고') && !text.includes('이 곳은') && !text.includes('영역') && !text.includes('쑥쑥')) {
                return text;
              }
            }
          }
          return null;
        });
        
        if (newFirstPharmacyName && newFirstPharmacyName !== firstPharmacyName) {
          updated = true;
          console.log(`   ✅ 페이지 변경 확인: "${firstPharmacyName}" → "${newFirstPharmacyName}"`);
          break;
        }
        
        // 진행 상황 로그 (5초마다)
        if (i > 0 && i % 10 === 0) {
          console.log(`   ⏳ 페이지 로드 대기 중... (${i * 0.5}초 경과)`);
        }
      }
      
      if (!updated) {
        console.log(`   ⚠️ 페이지 변경을 확인할 수 없습니다. (현재: "${firstPharmacyName}", 새로고침 후: "${await page.evaluate(() => {
          const table = document.querySelector('table');
          if (!table) return null;
          const rows = Array.from(table.querySelectorAll('tr'));
          for (const row of rows) {
            if (row.querySelector('th')) continue;
            const firstCell = row.querySelector('td');
            if (firstCell) {
              const text = firstCell.textContent?.trim();
              if (text && !text.includes('광고') && !text.includes('이 곳은') && !text.includes('영역') && !text.includes('쑥쑥')) {
                return text;
              }
            }
          }
          return null;
        })}")`);
      }
      
      return updated;
    } else {
      console.log(`   ❌ pager 함수 호출 실패`);
    }
    
    return false; // 다음 페이지 없음
    
  } catch (error) {
    console.log(`   ❌ 페이지 ${nextPageNum}로 이동 실패:`, error.message);
    console.error(error.stack);
    return false;
  }
}

/**
 * 전체 데이터 수집
 */
async function collectAllData(page) {
  console.log('\n📦 전체 데이터 수집 시작...\n');
  
  let totalCollected = 0;
  let pageNumber = 1;
  
  try {
    // 첫 페이지 접속
    console.log(`🌐 페이지 접속: ${BASE_URL}`);
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(5000); // 페이지 로드 대기 시간 증가
    
    // 무한 루프로 모든 페이지 수집
    while (true) {
      console.log(`\n📄 페이지 ${pageNumber} 처리 중...`);
      
      // 현재 페이지 데이터 수집
      const pageCount = await collectTableData(page);
      totalCollected += pageCount;
      
      console.log(`   ✅ ${pageCount}개 데이터 수집 (누적: ${totalCollected}개)`);
      
      // 다음 페이지로 이동 시도
      console.log(`   🔄 페이지 ${pageNumber + 1}로 이동 시도...`);
      const hasNext = await handlePagination(page, pageNumber);
      
      if (!hasNext) {
        console.log(`   ⚠️ 페이지 ${pageNumber + 1}로 이동 실패. 크롤링 종료.`);
        console.log('\n✅ 모든 페이지 처리 완료');
        break;
      }
      
      console.log(`   ✅ 페이지 ${pageNumber + 1}로 이동 성공!`);
      
      pageNumber++;
      
      // 최대 페이지 수 제한 (안전장치, 무한 루프 방지)
      if (pageNumber > 1000) {
        console.log('\n⚠️ 최대 페이지 수(1000)에 도달했습니다. 크롤링을 중단합니다.');
        break;
      }
      
      // 서버 부하 방지를 위한 딜레이
      await page.waitForTimeout(2000);
    }
    
  } catch (error) {
    console.error(`\n❌ 오류 발생: ${error.message}`);
    console.error(error.stack);
  }
  
  return totalCollected;
}

/**
 * 메인 함수
 */
async function main() {
  console.log('🚀 메디서비스 약국 전체 크롤링 시작\n');
  console.log(`📁 출력 파일: ${OUTPUT_FILE}\n`);
  console.log('⏰ 예상 소요 시간: 30분-1시간 (데이터 수에 따라 다름)\n');
  
  const startTime = Date.now();
  
  const browser = await chromium.launch({ 
    headless: false, // 브라우저 표시 (디버깅용)
    slowMo: 200 // 동작 속도 조절 (서버 부하 방지)
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  
  const page = await context.newPage();
  
  try {
    // 전체 데이터 수집
    const totalCollected = await collectAllData(page);
    
    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000); // 초 단위
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 크롤링 완료');
    console.log('='.repeat(50));
    console.log(`✅ 총 수집된 약국 수: ${totalCollected}개`);
    console.log(`⏱️ 소요 시간: ${Math.floor(duration / 60)}분 ${duration % 60}초`);
    console.log(`📁 파일 위치: ${OUTPUT_FILE}`);
    console.log(`📦 파일 크기: ${(fs.statSync(OUTPUT_FILE).size / 1024).toFixed(2)} KB`);
    console.log('='.repeat(50));
    
    if (totalCollected > 0) {
      console.log('\n💡 다음 단계:');
      console.log('   1. CSV 파일 확인');
      console.log('   2. Import API 호출: POST /api/hospitals/import-csv?filename=medisvc_pharmacies_all.csv');
      console.log('   3. Geocoding 실행: POST /api/hospitals/geocode-batch');
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

