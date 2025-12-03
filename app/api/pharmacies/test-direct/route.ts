/**
 * @file route.ts
 * @description 산재 약국 API 직접 테스트
 * 
 * 제공된 일반 인증키로 직접 API를 호출하여 테스트합니다.
 */

import { NextResponse } from 'next/server';

const API_KEY = 'aba6428813f7272c3d7a7918ec194233d0862839e5d1df1df223f03e1d01592a';
const BASE_URL = 'https://apis.data.go.kr/B490001/sjHptMcalPstateInfoService';

// 정확한 엔드포인트 (사용자 제공 정보)
const ENDPOINTS = [
  'getSjJijeongyakgukChakgiList', // 산재 지정 약국 찾기 목록 (정확한 엔드포인트)
];

export async function GET() {
  const results = [];

  for (const endpoint of ENDPOINTS) {
    try {
      const url = `${BASE_URL}/${endpoint}`;
      const params = new URLSearchParams({
        serviceKey: API_KEY,
        numOfRows: '5',
        pageNo: '1',
        // 선택적 검색 조건 (테스트용)
        // addr: '강원',  // 주소 검색
        // hospitalNm: '감초약국',  // 약국명 검색
      });

      console.log(`[직접 테스트] ${endpoint} 시도...`);
      console.log(`[직접 테스트] URL: ${url}?${params.toString().replace(API_KEY, '***')}`);
      
      const response = await fetch(`${url}?${params.toString()}`);
      const text = await response.text();
      
      // XML 파싱 시도
      let parsedData = null;
      if (text.includes('<?xml') || text.includes('<response>')) {
        // XML에서 기본 정보 추출
        const resultCodeMatch = text.match(/<resultCode>([^<]+)<\/resultCode>/);
        const resultMsgMatch = text.match(/<resultMsg>([^<]+)<\/resultMsg>/);
        const totalCountMatch = text.match(/<totalCount>([^<]+)<\/totalCount>/);
        
        // 약국 정보 추출
        const itemMatches = text.match(/<item>[\s\S]*?<\/item>/g);
        const items = itemMatches ? itemMatches.slice(0, 3).map(item => {
          const hospitalNmMatch = item.match(/<hospitalNm>([^<]+)<\/hospitalNm>/);
          const addrMatch = item.match(/<addr>([^<]+)<\/addr>/);
          const telNoMatch = item.match(/<telNo>([^<]+)<\/telNo>/);
          return {
            hospitalNm: hospitalNmMatch ? hospitalNmMatch[1] : null,
            addr: addrMatch ? addrMatch[1] : null,
            telNo: telNoMatch ? telNoMatch[1] : null,
          };
        }) : [];
        
        parsedData = {
          resultCode: resultCodeMatch ? resultCodeMatch[1] : null,
          resultMsg: resultMsgMatch ? resultMsgMatch[1] : null,
          totalCount: totalCountMatch ? totalCountMatch[1] : null,
          itemsCount: items.length,
          items: items,
        };
      }
      
      results.push({
        endpoint,
        status: response.status,
        success: response.ok,
        hasXml: text.includes('<?xml') || text.includes('<response>'),
        parsedData: parsedData,
        preview: text.substring(0, 500),
        fullResponse: text.substring(0, 3000),
      });
    } catch (error) {
      results.push({
        endpoint,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return NextResponse.json({
    message: '직접 API 테스트 결과',
    results,
  });
}

