/**
 * @file route.ts
 * @description CSV 파일에서 병원 데이터를 읽어서 Supabase에 저장 (주소만)
 *
 * public 폴더에 있는 CSV 파일을 읽어서:
 * 1. 주소 정보만 Supabase에 저장 (좌표는 0으로 설정)
 * 2. Geocoding은 별도 API 엔드포인트(/api/hospitals/geocode-batch)로 진행
 *
 * CSV 형식:
 * - name: 병원명 (필수)
 * - address: 주소 (필수)
 * - type: 'hospital' 또는 'pharmacy' (선택, 기본값: 'hospital')
 * - phone: 전화번호 (선택)
 * - department: 진료과목 (선택)
 */

import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import iconv from 'iconv-lite';
import { getServiceRoleClient } from '@/lib/supabase/service-role';

interface CsvRow {
  name: string;
  address: string;
  type?: string;
  phone?: string;
  department?: string;
}

/**
 * CSV 파일 파싱 (쉼표로 구분된 값 처리, 따옴표 처리)
 */
function parseCSV(content: string): CsvRow[] {
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length === 0) {
    return [];
  }

  // 첫 줄은 헤더
  const headerLine = lines[0];
  const headers = parseCSVLine(headerLine);
  
  // name과 address 컬럼 인덱스 찾기
  const nameIndex = headers.findIndex(h => h.toLowerCase() === 'name');
  const addressIndex = headers.findIndex(h => h.toLowerCase() === 'address');
  const phoneIndex = headers.findIndex(h => h.toLowerCase() === 'phone');
  const typeIndex = headers.findIndex(h => h.toLowerCase() === 'type');
  const departmentIndex = headers.findIndex(h => h.toLowerCase() === 'department');

  if (nameIndex === -1 || addressIndex === -1) {
    throw new Error('CSV 파일에 name 또는 address 컬럼이 없습니다.');
  }

  const rows: CsvRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === 0 || !values[nameIndex]) continue;

    const row: CsvRow = {
      name: values[nameIndex] || '',
      address: values[addressIndex] || '',
    };

    // 선택적 필드들
    if (phoneIndex !== -1 && values[phoneIndex]) {
      row.phone = values[phoneIndex];
    }
    if (typeIndex !== -1 && values[typeIndex]) {
      row.type = values[typeIndex];
    } else {
      row.type = 'hospital'; // 기본값
    }
    if (departmentIndex !== -1 && values[departmentIndex]) {
      row.department = values[departmentIndex];
    }

    if (row.name && row.address) {
      rows.push(row);
    }
  }

  return rows;
}

/**
 * CSV 라인 파싱 (따옴표로 감싸진 값 처리)
 */
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // 이스케이프된 따옴표
        current += '"';
        i++; // 다음 따옴표 건너뛰기
      } else {
        // 따옴표 시작/끝
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // 쉼표로 구분 (따옴표 밖에서만)
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  // 마지막 값 추가
  values.push(current.trim());

  return values;
}

export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filename = searchParams.get('filename') || 'hospitals.csv';
    const delayMs = parseInt(searchParams.get('delayMs') || '150', 10); // Geocoding 딜레이
    const testMode = searchParams.get('test') === 'true'; // 테스트 모드 (처음 10개만)
    const testLimit = parseInt(searchParams.get('limit') || '10', 10); // 테스트 시 처리할 개수

    console.log('[Import CSV] 시작:', { filename, delayMs, testMode, testLimit });

    // public 폴더에서 CSV 파일 읽기
    const filePath = join(process.cwd(), 'public', filename);
    
    let fileContent: string;
    try {
      // CSV 파일을 버퍼로 읽기
      const buffer = await readFile(filePath);
      
      // 여러 인코딩 시도 (EUC-KR 우선, 한국 CSV 파일은 보통 EUC-KR)
      const encodings = ['euc-kr', 'cp949', 'utf-8'];
      let bestContent = '';
      let bestEncoding = '';
      let bestKoreanCount = 0;
      
      for (const encoding of encodings) {
        try {
          let decoded: string;
          if (encoding === 'utf-8') {
            decoded = buffer.toString('utf-8');
          } else {
            decoded = iconv.decode(buffer, encoding);
          }
          
          // 한글 문자 개수 확인
          const koreanCount = (decoded.match(/[가-힣]/g) || []).length;
          
          console.log(`[Import CSV] ${encoding} 인코딩 시도: 한글 ${koreanCount}개 발견`);
          
          if (koreanCount > bestKoreanCount) {
            bestContent = decoded;
            bestEncoding = encoding;
            bestKoreanCount = koreanCount;
          }
        } catch (e) {
          console.warn(`[Import CSV] ${encoding} 인코딩 실패:`, e);
        }
      }
      
      if (bestContent) {
        fileContent = bestContent;
        console.log(`[Import CSV] 최종 선택된 인코딩: ${bestEncoding} (한글 ${bestKoreanCount}개)`);
      } else {
        // 모든 인코딩 실패 시 UTF-8 사용
        fileContent = buffer.toString('utf-8');
        console.warn('[Import CSV] 모든 인코딩 실패, UTF-8 사용');
      }
      
      // BOM 제거 (UTF-8 BOM)
      if (fileContent.charCodeAt(0) === 0xFEFF) {
        fileContent = fileContent.slice(1);
      }
      
      // 샘플 확인 (디버깅)
      const lines = fileContent.split('\n');
      if (lines.length > 1) {
        const firstDataLine = lines[1];
        const parsed = parseCSVLine(firstDataLine);
        const sampleAddress = parsed[3] || ''; // address는 4번째 컬럼 (인덱스 3)
        console.log('[Import CSV] 첫 번째 주소 샘플:', sampleAddress.substring(0, 50));
        console.log('[Import CSV] 한글 포함 여부:', /[가-힣]/.test(sampleAddress));
      }
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: `CSV 파일을 읽을 수 없습니다: ${filename}. public 폴더에 파일이 있는지 확인하세요.`,
        },
        { status: 404 }
      );
    }

    // CSV 파싱
    let csvRows = parseCSV(fileContent);
    console.log('[Import CSV] 파싱 완료:', csvRows.length, '개 행');

    // 테스트 모드: 처음 몇 개만 처리
    if (testMode && csvRows.length > testLimit) {
      csvRows = csvRows.slice(0, testLimit);
      console.log(`[Import CSV] 테스트 모드: 처음 ${testLimit}개만 처리`);
    }

    if (csvRows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'CSV 파일에 유효한 데이터가 없습니다.',
        },
        { status: 400 }
      );
    }

    // Supabase 클라이언트
    const supabase = getServiceRoleClient();

    // 데이터 변환 및 저장 (Geocoding 없이 주소만 저장)
    let savedCount = 0;
    let skippedCount = 0;
    let updatedCount = 0;

    for (const row of csvRows) {
      const hospitalData = {
        name: row.name.trim(),
        type: (row.type?.trim() || 'hospital') as 'hospital' | 'pharmacy',
        address: row.address.trim(),
        latitude: 0, // Geocoding은 별도 프로세스로 처리
        longitude: 0, // Geocoding은 별도 프로세스로 처리
        phone: row.phone?.trim() || null,
        department: row.department?.trim() || null,
      };

      try {
        // 중복 체크 (이름과 주소로)
        const { data: existing } = await supabase
          .from('hospitals_pharmacies')
          .select('id')
          .eq('name', hospitalData.name)
          .eq('address', hospitalData.address)
          .single();

        if (existing) {
          // 기존 데이터 업데이트 (주소 정보만, 좌표는 유지)
          const { data: existingData } = await supabase
            .from('hospitals_pharmacies')
            .select('latitude, longitude')
            .eq('id', existing.id)
            .single();

          // 기존에 좌표가 있으면 유지, 없으면 0으로 설정
          const updateData = {
            name: hospitalData.name,
            type: hospitalData.type,
            address: hospitalData.address,
            phone: hospitalData.phone,
            department: hospitalData.department,
            last_updated: new Date().toISOString(),
            // 좌표는 기존 값 유지 (이미 Geocoding된 경우)
            ...(existingData && existingData.latitude !== 0 && existingData.longitude !== 0
              ? { latitude: existingData.latitude, longitude: existingData.longitude }
              : { latitude: 0, longitude: 0 }),
          };

          const { error } = await supabase
            .from('hospitals_pharmacies')
            .update(updateData)
            .eq('id', existing.id);

          if (error) {
            console.error('[Import CSV] 업데이트 실패:', hospitalData.name, error);
            skippedCount++;
          } else {
            updatedCount++;
          }
        } else {
          // 새 데이터 삽입 (좌표는 0으로 설정, 나중에 Geocoding으로 업데이트)
          const { error } = await supabase
            .from('hospitals_pharmacies')
            .insert(hospitalData);

          if (error) {
            console.error('[Import CSV] 삽입 실패:', hospitalData.name, error);
            skippedCount++;
          } else {
            savedCount++;
          }
        }
      } catch (error) {
        console.error('[Import CSV] 처리 중 오류:', hospitalData.name, error);
        skippedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'CSV 파일에서 데이터를 성공적으로 가져왔습니다. (주소만 저장, Geocoding은 별도 프로세스로 진행)',
      summary: {
        totalRows: csvRows.length,
        savedCount, // 새로 저장된 개수
        updatedCount, // 업데이트된 개수
        skippedCount, // 실패한 개수
        nextStep: 'Geocoding을 진행하려면 /api/hospitals/geocode-batch 엔드포인트를 사용하세요.',
      },
    });
  } catch (error) {
    console.error('[Import CSV] 오류:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류',
      },
      { status: 500 }
    );
  }
}

