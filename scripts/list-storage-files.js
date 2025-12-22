/**
 * @file scripts/list-storage-files.js
 * @description Supabase Storage의 파일 목록을 확인하는 스크립트
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// 환경 변수 로드
const envFiles = [
  path.join(__dirname, '../.env.local'),
  path.join(__dirname, '../.env'),
];

for (const envFile of envFiles) {
  const fs = require('fs');
  if (fs.existsSync(envFile)) {
    require('dotenv').config({ path: envFile });
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Supabase 환경 변수가 설정되지 않았습니다.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  console.log('📋 Supabase Storage 파일 목록 확인 중...\n');
  
  try {
    // uploads 버킷의 루트 디렉토리 파일 목록
    const { data, error } = await supabase.storage
      .from('uploads')
      .list('', {
        limit: 100,
        sortBy: { column: 'name', order: 'asc' }
      });
    
    if (error) {
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log('📭 파일이 없습니다.');
      return;
    }
    
    console.log(`📁 총 ${data.length}개 파일:\n`);
    
    // WebP 파일만 필터링
    const webpFiles = data.filter(file => file.name.endsWith('.webp'));
    const pdfFiles = data.filter(file => file.name.endsWith('.pdf'));
    
    if (webpFiles.length > 0) {
      console.log('🖼️  WebP 이미지 파일:');
      webpFiles.forEach(file => {
        const sizeMB = file.metadata?.size ? (file.metadata.size / (1024 * 1024)).toFixed(2) : '?';
        console.log(`   - ${file.name} (${sizeMB} MB)`);
      });
      console.log();
    }
    
    if (pdfFiles.length > 0) {
      console.log('📄 PDF 파일:');
      pdfFiles.forEach(file => {
        const sizeMB = file.metadata?.size ? (file.metadata.size / (1024 * 1024)).toFixed(2) : '?';
        console.log(`   - ${file.name} (${sizeMB} MB)`);
      });
      console.log();
    }
    
    // step1 관련 파일 확인
    const step1Files = webpFiles.filter(file => file.name.startsWith('step1'));
    if (step1Files.length > 0) {
      console.log(`📊 step1 관련 WebP 파일: ${step1Files.length}개`);
      step1Files.forEach(file => {
        console.log(`   - ${file.name}`);
      });
    }
    
  } catch (error) {
    console.error('❌ 오류:', error.message);
    process.exit(1);
  }
}

main();











