/**
 * @file scripts/download-pdfs.js
 * @description Supabase Storage에서 PDF 파일을 다운로드하는 스크립트
 * 
 * 사용법:
 *   node scripts/download-pdfs.js
 * 
 * 환경 변수 필요:
 *   NEXT_PUBLIC_SUPABASE_URL
 * 
 * 다운로드 위치: ./temp-pdfs/
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const readline = require('readline');

// 환경 변수 로드 (여러 파일 시도)
const envFiles = [
  path.join(__dirname, '../.env.local'),
  path.join(__dirname, '../.env'),
];

for (const envFile of envFiles) {
  if (fs.existsSync(envFile)) {
    require('dotenv').config({ path: envFile });
  }
}

// 환경 변수 확인 및 입력 받기
let SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

if (!SUPABASE_URL) {
  console.log('⚠️  NEXT_PUBLIC_SUPABASE_URL 환경 변수가 설정되지 않았습니다.');
  console.log('\nSupabase URL을 입력하세요:');
  console.log('   (Supabase Dashboard → Settings → API → Project URL)');
  console.log('   예시: https://your-project.supabase.co\n');
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    rl.question('Supabase URL: ', (answer) => {
      rl.close();
      if (!answer || !answer.trim()) {
        console.error('\n❌ URL이 입력되지 않았습니다.');
        process.exit(1);
      }
      SUPABASE_URL = answer.trim();
      if (!SUPABASE_URL.startsWith('http')) {
        SUPABASE_URL = 'https://' + SUPABASE_URL;
      }
      main(SUPABASE_URL).then(resolve).catch(console.error);
    });
  });
}

// 다운로드 디렉토리 생성
const DOWNLOAD_DIR = path.join(__dirname, '../temp-pdfs');
if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
  console.log(`📁 다운로드 디렉토리 생성: ${DOWNLOAD_DIR}`);
}

// PDF 파일 목록
const PDF_FILES = ['step1.pdf', 'step2.pdf', 'step3.pdf', 'step4.pdf'];

/**
 * URL에서 파일 다운로드
 */
function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const file = fs.createWriteStream(filePath);
    
    protocol.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // 리다이렉트 처리
        return downloadFile(response.headers.location, filePath)
          .then(resolve)
          .catch(reject);
      }
      
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(filePath);
        reject(new Error(`다운로드 실패: ${response.statusCode} ${response.statusMessage}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      reject(err);
    });
  });
}

/**
 * 메인 실행 함수
 */
async function main(supabaseUrl = SUPABASE_URL) {
  console.log('📥 PDF 파일 다운로드 시작...\n');
  
  for (const pdfFile of PDF_FILES) {
    const url = `${supabaseUrl}/storage/v1/object/public/uploads/${pdfFile}`;
    const filePath = path.join(DOWNLOAD_DIR, pdfFile);
    
    try {
      console.log(`⬇️  다운로드 중: ${pdfFile}...`);
      await downloadFile(url, filePath);
      
      const stats = fs.statSync(filePath);
      const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      console.log(`✅ 완료: ${pdfFile} (${fileSizeMB} MB)\n`);
    } catch (error) {
      console.error(`❌ 실패: ${pdfFile}`);
      console.error(`   오류: ${error.message}\n`);
    }
  }
  
  console.log('📥 다운로드 완료!');
  console.log(`📁 파일 위치: ${DOWNLOAD_DIR}`);
  console.log('\n다음 단계:');
  console.log('1. PDF 파일을 WebP로 변환하세요.');
  console.log('2. 변환된 WebP 파일을 ./temp-pdfs/ 폴더에 저장하세요.');
  console.log('3. node scripts/upload-webp.js 명령으로 업로드하세요.');
}

// SUPABASE_URL이 이미 설정되어 있으면 바로 실행
if (SUPABASE_URL) {
  main().catch(console.error);
}

