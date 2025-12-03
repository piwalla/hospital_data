/**
 * @file route.ts
 * @description 산재 약국 API 테스트 엔드포인트
 *
 * 근로복지공단 산재지정 약국 찾기 API를 테스트하는 엔드포인트입니다.
 * 여러 가능한 엔드포인트를 시도하여 올바른 API를 찾습니다.
 *
 * 사용법:
 * GET /api/pharmacies/test
 */

import { NextResponse } from 'next/server';

// 근로복지공단 산재병원 의료 현황정보 API 설정
// 참고: https://www.data.go.kr/data/15058644/openapi.do
const API_BASE_URL = 'https://apis.data.go.kr/B490001/sjHptMcalPstateInfoService';
const SERVICE_KEY = process.env.DATA_GO_KR_API_KEY || process.env.TOUR_API_KEY || '';

// 가능한 약국 API 엔드포인트 목록 (우선순위 순)
// 사용자 제공 정보: 요청 파라미터에 addr, hospitalNm이 있음 → "찾기" 기능
// 재활기관 API 패턴 참고: getSjbWkGigwanInfoList
// 의료기관 찾기 패턴 참고: getSjHptMcalPstateList (추정)
const POSSIBLE_ENDPOINTS = [
  'getYakgukList',              // 약국 목록 조회
  'getSjYakgukList',            // 산재 약국 목록
  'getYakgukFind',              // 약국 찾기 (addr, hospitalNm 파라미터와 일치)
  'getSjYakgukFind',            // 산재 약국 찾기
  'getSjHptMcalPstateList',     // 산재 병원/의료기관 목록 (약국 포함 가능)
  'getYakgukInfoList',          // 약국 정보 목록
  'getSjYakgukInfoList',        // 산재 약국 정보 목록
  'getYakgukSearch',            // 약국 검색
  'getYakgukInfo',              // 약국 정보 조회
  'getSjYakgukInfo',            // 산재 약국 정보
  'getYakguk',                  // 약국 조회
];

interface ApiTestResult {
  endpoint: string;
  success: boolean;
  status?: number;
  data?: any;
  error?: string;
  responseTime?: number;
}

/**
 * API 엔드포인트 테스트
 */
async function testEndpoint(endpoint: string): Promise<ApiTestResult> {
  const startTime = Date.now();
  const url = `${API_BASE_URL}/${endpoint}`;
  
  // 공공데이터포털 API는 serviceKey를 그대로 사용 (인코딩하지 않음)
  // 요청 파라미터 (사용자 제공 정보 기반)
  // 참고: addr, hospitalNm은 선택적 파라미터
  const params = new URLSearchParams({
    serviceKey: SERVICE_KEY,
    numOfRows: '10',
    pageNo: '1',
    // 선택적 검색 조건 (테스트용 - 주석 해제하여 테스트 가능)
    // addr: '강원',  // 주소 검색
    // hospitalNm: '감초약국',  // 약국명 검색
  });

  try {
    const fullUrl = `${url}?${params.toString()}`;
    console.log(`[약국 API 테스트] ${endpoint} 시도 중...`);
    console.log(`[약국 API 테스트] URL: ${fullUrl.replace(SERVICE_KEY, '***')}`);
    
    // XML 형식으로 응답 받기 (데이터 포맷이 XML이므로)
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/xml, text/xml',
      },
    });

    const responseTime = Date.now() - startTime;
    const responseText = await response.text();
    
    console.log(`[약국 API 테스트] ${endpoint} 응답 상태:`, response.status);
    console.log(`[약국 API 테스트] ${endpoint} 응답 본문 (처음 200자):`, responseText.substring(0, 200));
    
    let parsedData;
    
    // XML 응답 처리 (데이터 포맷이 XML이므로)
    if (responseText.includes('<?xml') || responseText.includes('<response>') || responseText.includes('<body>') || responseText.includes('<item>')) {
      console.log(`[약국 API 테스트] ${endpoint} XML 응답 감지`);
      
      // XML에서 정보 추출
      const resultCodeMatch = responseText.match(/<resultCode>([^<]+)<\/resultCode>/);
      const resultMsgMatch = responseText.match(/<resultMsg>([^<]+)<\/resultMsg>/);
      const totalCountMatch = responseText.match(/<totalCount>([^<]+)<\/totalCount>/);
      const numOfRowsMatch = responseText.match(/<numOfRows>([^<]+)<\/numOfRows>/);
      const pageNoMatch = responseText.match(/<pageNo>([^<]+)<\/pageNo>/);
      
      // 약국 정보 추출 시도
      const itemMatches = responseText.match(/<item>[\s\S]*?<\/item>/g);
      const items = itemMatches ? itemMatches.slice(0, 3) : []; // 처음 3개만
      
      parsedData = {
        format: 'XML',
        resultCode: resultCodeMatch ? resultCodeMatch[1] : null,
        resultMsg: resultMsgMatch ? resultMsgMatch[1] : null,
        totalCount: totalCountMatch ? totalCountMatch[1] : null,
        numOfRows: numOfRowsMatch ? numOfRowsMatch[1] : null,
        pageNo: pageNoMatch ? pageNoMatch[1] : null,
        itemsCount: items.length,
        items: items.map(item => {
          const hospitalNmMatch = item.match(/<hospitalNm>([^<]+)<\/hospitalNm>/);
          const addrMatch = item.match(/<addr>([^<]+)<\/addr>/);
          return {
            hospitalNm: hospitalNmMatch ? hospitalNmMatch[1] : null,
            addr: addrMatch ? addrMatch[1] : null,
          };
        }),
        raw: responseText.substring(0, 2000),
      };
    } else {
      // JSON 응답 시도 (혹시 모를 경우)
      try {
        parsedData = JSON.parse(responseText);
        console.log(`[약국 API 테스트] ${endpoint} JSON 파싱 성공`);
      } catch {
        parsedData = {
          format: 'unknown',
          raw: responseText.substring(0, 500),
        };
      }
    }

    console.log(`[약국 API 테스트] ${endpoint} 응답:`, {
      status: response.status,
      responseTime: `${responseTime}ms`,
      hasData: !!parsedData,
    });

    return {
      endpoint,
      success: response.ok,
      status: response.status,
      data: parsedData,
      responseTime,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error(`[약국 API 테스트] ${endpoint} 실패:`, error);
    
    return {
      endpoint,
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      responseTime,
    };
  }
}

export async function GET() {
  try {
    console.log('[약국 API 테스트] 시작');
    console.log('[약국 API 테스트] API 키 확인:', SERVICE_KEY ? '설정됨' : '❌ 설정되지 않음');

    if (!SERVICE_KEY) {
      return NextResponse.json(
        {
          success: false,
          message: 'API 키가 설정되지 않았습니다. DATA_GO_KR_API_KEY 또는 TOUR_API_KEY 환경변수를 확인하세요.',
          hint: '공공데이터포털(data.go.kr)에서 API 키를 발급받아 .env 파일에 설정하세요.',
        },
        { status: 400 }
      );
    }

    // 모든 가능한 엔드포인트 테스트
    const results: ApiTestResult[] = [];
    
    for (const endpoint of POSSIBLE_ENDPOINTS) {
      const result = await testEndpoint(endpoint);
      results.push(result);
      
      // 성공한 엔드포인트를 찾으면 중단
      if (result.success && result.data) {
        console.log(`[약국 API 테스트] ✅ 성공한 엔드포인트 발견: ${endpoint}`);
        break;
      }
      
      // API 부하 방지를 위한 딜레이
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // 결과 분석
    const successfulResults = results.filter(r => r.success);
    const failedResults = results.filter(r => !r.success);

    return NextResponse.json({
      success: successfulResults.length > 0,
      message: successfulResults.length > 0
        ? `성공한 엔드포인트 ${successfulResults.length}개 발견`
        : '모든 엔드포인트 테스트 실패',
      summary: {
        total: results.length,
        success: successfulResults.length,
        failed: failedResults.length,
      },
      results: results.map(r => ({
        endpoint: r.endpoint,
        success: r.success,
        status: r.status,
        responseTime: r.responseTime,
        error: r.error,
        // 데이터는 첫 500자만 반환 (너무 크면 잘림)
        dataPreview: r.data ? JSON.stringify(r.data).substring(0, 500) : null,
      })),
      // 성공한 결과 중 첫 번째 것의 전체 데이터 (샘플)
      sampleData: successfulResults[0]?.data || null,
      recommendations: successfulResults.length === 0
        ? [
            '1. 공공데이터포털(data.go.kr)에서 API 키가 올바르게 발급되었는지 확인',
            '2. API 활용신청이 승인되었는지 확인',
            '3. API 문서에서 정확한 엔드포인트 이름 확인',
            '4. 서비스 URL이 변경되었을 수 있으니 최신 문서 확인',
          ]
        : [
            `✅ 사용 가능한 엔드포인트: ${successfulResults[0].endpoint}`,
            `API URL: ${API_BASE_URL}/${successfulResults[0].endpoint}`,
          ],
    });
  } catch (error) {
    console.error('[약국 API 테스트] 전체 테스트 실패:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : '알 수 없는 오류',
      },
      { status: 500 }
    );
  }
}

