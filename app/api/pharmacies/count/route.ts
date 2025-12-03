/**
 * @file route.ts
 * @description 약국 API 전체 데이터 개수 확인
 */

import { NextResponse } from 'next/server';

const API_KEY = process.env.DATA_GO_KR_API_KEY || process.env.TOUR_API_KEY || '';
const BASE_URL = 'https://apis.data.go.kr/B490001/sjHptMcalPstateInfoService/getSjJijeongyakgukChakgiList';

export async function GET() {
  try {
    if (!API_KEY) {
      return NextResponse.json(
        { success: false, error: 'API 키가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    // 최소한의 파라미터로 첫 페이지만 조회하여 totalCount 확인
    const url = new URL(BASE_URL);
    url.searchParams.set('serviceKey', API_KEY);
    url.searchParams.set('numOfRows', '1'); // 최소한의 데이터만 요청
    url.searchParams.set('pageNo', '1');

    console.log('[약국 Count] API 호출 중...');

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/xml',
      },
    });

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }

    const xmlText = await response.text();
    
    // xml2js를 사용한 XML 파싱
    const { parseString } = await import('xml2js');
    
    return new Promise<NextResponse>((resolve) => {
      parseString(xmlText, { explicitArray: false, mergeAttrs: true }, (err, result) => {
        if (err) {
          resolve(NextResponse.json(
            { success: false, error: `XML 파싱 실패: ${err.message}` },
            { status: 500 }
          ));
          return;
        }

        const response = result?.response;
        if (!response || response.header?.resultCode !== '00') {
          resolve(NextResponse.json(
            { 
              success: false, 
              error: `API 오류: ${response?.header?.resultMsg || '알 수 없는 오류'}`,
              resultCode: response?.header?.resultCode,
              resultMsg: response?.header?.resultMsg,
            },
            { status: 500 }
          ));
          return;
        }

        const body = response.body;
        const totalCount = parseInt(body?.totalCount || '0', 10);
        const numOfRows = parseInt(body?.numOfRows || '0', 10);
        const pageNo = parseInt(body?.pageNo || '0', 10);
        
        // 페이지 수 계산
        const totalPages = Math.ceil(totalCount / 100); // 최대 numOfRows는 100

        resolve(NextResponse.json({
          success: true,
          totalCount,
          totalPages,
          numOfRows,
          pageNo,
          message: `약국 API에 총 ${totalCount.toLocaleString()}개의 약국 정보가 있습니다.`,
          estimatedTime: {
            minutes: Math.ceil(totalPages * 0.5 / 60), // 페이지당 약 0.5초 가정
            hours: Math.ceil(totalPages * 0.5 / 3600),
          },
        }));
      });
    });
  } catch (error) {
    console.error('[약국 Count] 오류:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}







