/**
 * @file scripts/upload-webp.js
 * @description 변환된 WebP 이미지를 Supabase Storage에 업로드하는 스크립트
 * 
 * 사용법:
 *   node scripts/upload-webp.js
 * 
 * 환경 변수 필요:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY (또는 anon key)
 * 
 * 업로드 위치: Supabase Storage uploads 버킷
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 환경 변수 로드 (.env.local 파일에서)
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Supabase 환경 변수가 설정되지 않았습니다.');
  console.error('   NEXT_PUBLIC_SUPABASE_URL과 SUPABASE_SERVICE_ROLE_KEY를 확인하세요.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 업로드 디렉토리
const UPLOAD_DIR = path.join(__dirname, '../temp-pdfs');

// WebP 파일 목록
const WEBP_FILES = ['step1.webp', 'step2.webp', 'step3.webp', 'step4.webp'];

/**
 * 파일 업로드
 */
async function uploadFile(fileName) {
  const filePath = path.join(UPLOAD_DIR, fileName);
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`파일을 찾을 수 없습니다: ${filePath}`);
  }
  
  const fileBuffer = fs.readFileSync(filePath);
  const fileStats = fs.statSync(filePath);
  const fileSizeMB = (fileStats.size / (1024 * 1024)).toFixed(2);
  
  console.log(`📤 업로드 중: ${fileName} (${fileSizeMB} MB)...`);
  
  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(fileName, fileBuffer, {
      contentType: 'image/webp',
      upsert: true, // 기존 파일이 있으면 덮어쓰기
    });
  
  if (error) {
    throw error;
  }
  
  return data;
}

/**
 * 메인 실행 함수
 */
async function main() {
  console.log('📤 WebP 이미지 업로드 시작...\n');
  
  // 업로드 디렉토리 확인
  if (!fs.existsSync(UPLOAD_DIR)) {
    console.error(`❌ 업로드 디렉토리를 찾을 수 없습니다: ${UPLOAD_DIR}`);
    console.error('   먼저 PDF를 다운로드하고 WebP로 변환하세요.');
    process.exit(1);
  }
  
  let successCount = 0;
  let failCount = 0;
  
  for (const webpFile of WEBP_FILES) {
    try {
      await uploadFile(webpFile);
      console.log(`✅ 완료: ${webpFile}\n`);
      successCount++;
    } catch (error) {
      console.error(`❌ 실패: ${webpFile}`);
      console.error(`   오류: ${error.message}\n`);
      failCount++;
    }
  }
  
  console.log('📤 업로드 완료!');
  console.log(`✅ 성공: ${successCount}개`);
  if (failCount > 0) {
    console.log(`❌ 실패: ${failCount}개`);
  }
  
  if (successCount > 0) {
    console.log('\n다음 단계:');
    console.log('1. 코드 구현을 진행하세요.');
    console.log('2. 모바일에서 WebP 이미지가 표시되는지 확인하세요.');
  }
}

main().catch(console.error);











