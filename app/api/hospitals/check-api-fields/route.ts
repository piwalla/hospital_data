/**
 * @file check-api-fields/route.ts
 * @description 공공데이터포털 API 응답 필드 확인
 * 
 * 실제 API 응답에 어떤 필드가 포함되어 있는지 확인합니다.
 */

import { NextResponse } from 'next/server';
import { getDataKrClient } from '@/lib/api/data-kr';

export async function GET() {
  try {
    const client = getDataKrClient();
    
    // 첫 페이지 1개만 조회하여 필드 확인
    const response = await client.fetchHospitals(1, 1);
    
    if (!response.data || response.data.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'API 응답에 데이터가 없습니다.',
      }, { status: 404 });
    }

    const sampleData = response.data[0];
    
    // 모든 필드 추출
    const fields = Object.keys(sampleData);
    const fieldDetails = fields.map(field => ({
      name: field,
      value: sampleData[field as keyof typeof sampleData],
      type: typeof sampleData[field as keyof typeof sampleData],
    }));

    return NextResponse.json({
      success: true,
      message: 'API 응답 필드 확인 완료',
      totalCount: response.totalCount,
      sampleData: sampleData,
      fields: fieldDetails,
      hasTypeField: fields.some(f => 
        f.includes('종별') || 
        f.includes('종류') || 
        f.includes('유형') ||
        f.includes('등급') ||
        f.includes('분류')
      ),
    });
  } catch (error) {
    console.error('[Check API Fields] 확인 실패:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류',
    }, { status: 500 });
  }
}

