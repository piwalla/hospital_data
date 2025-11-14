/**
 * @file test-rehabilitation-api.js
 * @description 산재 재활기관 API 테스트 스크립트
 * 
 * 공공데이터포털의 근로복지공단 고용/산재보험 현황정보 API를 테스트하여
 * 재활기관 관련 데이터가 포함되어 있는지 확인합니다.
 */

const https = require('https');
const { parseString } = require('xml2js');

// 기존 의료기관 API와 동일한 인증키 사용 (환경변수에서 가져오기)
const API_KEY = process.env.TOUR_API_KEY || 'aba6428813f7272c3d7a7918ec194233d0862839e5d1df1df223f03e1d01592a';
// 올바른 API 엔드포인트: 산재재활기관관리정보
const BASE_URL = 'https://apis.data.go.kr/B490001/sjbJhgigwanGwanriInfoService/getSjbWkGigwanInfoList';

console.log('🔑 사용할 인증키:', API_KEY.substring(0, 20) + '...');

/**
 * API 호출 함수
 */
function callAPI(params) {
  return new Promise((resolve, reject) => {
    // 공공데이터포털 API는 인증키를 인코딩하지 않고 사용
    const queryParams = new URLSearchParams({
      serviceKey: API_KEY, // 인코딩하지 않고 사용
      pageNo: params.pageNo || '1',
      numOfRows: params.numOfRows || '10',
      ...(params.opaBoheomFg && { opaBoheomFg: params.opaBoheomFg }),
      ...(params.v_saeopjaDrno && { v_saeopjaDrno: params.v_saeopjaDrno }),
    });

    const url = `${BASE_URL}?${queryParams.toString()}`;
    console.log(`\n🔗 API 호출: ${url.replace(API_KEY, '***')}\n`);

    https.get(url, (res) => {
      let data = '';

      // HTTP 상태 코드 확인
      console.log(`📊 HTTP 상태 코드: ${res.statusCode}`);
      
      // 응답 헤더 확인
      console.log('📋 응답 헤더:');
      Object.keys(res.headers).forEach(key => {
        console.log(`  ${key}: ${res.headers[key]}`);
      });

      if (res.statusCode !== 200) {
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          console.error(`\n❌ HTTP 오류 (${res.statusCode}):`);
          console.error(`📄 응답 내용:`, data);
          
          // 403 오류인 경우 안내
          if (res.statusCode === 403) {
            console.error('\n⚠️  403 Forbidden 오류 발생');
            console.error('가능한 원인:');
            console.error('1. 이 API에 대한 활용 신청이 완료되지 않았을 수 있습니다.');
            console.error('2. 인증키가 이 API에 대해 승인되지 않았을 수 있습니다.');
            console.error('3. 공공데이터포털에서 이 API에 대한 별도 활용 신청이 필요할 수 있습니다.');
            console.error('\n💡 해결 방법:');
            console.error('1. 공공데이터포털에 로그인');
            console.error('2. 해당 API 상세 페이지에서 "활용신청" 클릭');
            console.error('3. 승인 대기 후 인증키 확인');
          }
          
          reject(new Error(`HTTP ${res.statusCode}: ${data.substring(0, 200)}`));
        });
        return;
      }

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log(`📄 응답 길이: ${data.length} bytes`);
        console.log(`📄 응답 시작 부분: ${data.substring(0, 200)}`);
        
        // XML 파싱
        parseString(data, { explicitArray: false, mergeAttrs: true }, (err, result) => {
          if (err) {
            console.error('❌ XML 파싱 오류:', err.message);
            console.log('📄 원본 응답 (처음 1000자):', data.substring(0, 1000));
            reject(err);
            return;
          }

          resolve(result);
        });
      });
    }).on('error', (err) => {
      console.error('❌ API 호출 오류:', err);
      reject(err);
    });
  });
}

/**
 * 데이터 분석 및 출력
 */
function analyzeData(result) {
  console.log('📊 API 응답 분석\n');
  console.log('='.repeat(60));

  // 응답 구조 확인
  const response = result?.response;
  if (!response) {
    console.log('❌ 응답 구조가 예상과 다릅니다.');
    console.log('📄 전체 응답:', JSON.stringify(result, null, 2));
    return;
  }

  // 결과 코드 확인
  const header = response.header;
  if (header) {
    console.log('\n📋 응답 헤더:');
    console.log(`  결과코드: ${header.resultCode || 'N/A'}`);
    console.log(`  결과메시지: ${header.resultMsg || 'N/A'}`);
    
    if (header.resultCode !== '00') {
      console.log(`\n⚠️  API 호출 실패: ${header.resultMsg}`);
      return;
    }
  }

  // 본문 데이터 확인
  const body = response.body;
  if (!body) {
    console.log('\n❌ 본문 데이터가 없습니다.');
    return;
  }

  const items = body.items;
  if (!items) {
    console.log('\n❌ 항목 데이터가 없습니다.');
    console.log('📄 본문:', JSON.stringify(body, null, 2));
    return;
  }

  // items가 배열인지 단일 객체인지 확인
  const itemList = Array.isArray(items.item) ? items.item : (items.item ? [items.item] : []);

  console.log(`\n✅ 데이터 개수: ${itemList.length}개`);
  console.log(`📊 전체 건수: ${body.totalCount || 'N/A'}`);

  if (itemList.length === 0) {
    console.log('\n⚠️  데이터가 없습니다.');
    return;
  }

  // 샘플 데이터 출력
  console.log('\n📋 샘플 데이터 (최대 5개):');
  console.log('='.repeat(60));

  itemList.slice(0, 5).forEach((item, index) => {
    console.log(`\n[${index + 1}]`);
    console.log(`  기관명: ${item.gigwanNm || 'N/A'}`);
    console.log(`  기관구분: ${item.gigwanFgNm || 'N/A'} (코드: ${item.gigwanFg || 'N/A'})`);
    console.log(`  주소: ${item.addr || 'N/A'}`);
    console.log(`  전화번호: ${item.telNo || 'N/A'}`);
    console.log(`  팩스번호: ${item.faxNo || 'N/A'}`);
    console.log(`  관리지사: ${item.jisaNm || 'N/A'} (코드: ${item.gwanriJisaCd || 'N/A'})`);
  });

  // 기관구분별 통계
  const gigwanStats = {};
  itemList.forEach(item => {
    const gigwanFgNm = item.gigwanFgNm || '미분류';
    gigwanStats[gigwanFgNm] = (gigwanStats[gigwanFgNm] || 0) + 1;
  });

  console.log('\n' + '='.repeat(60));
  console.log(`\n📊 기관구분별 통계:`);
  Object.entries(gigwanStats).forEach(([name, count]) => {
    console.log(`  ${name}: ${count}개`);
  });

  // 재활기관 관련 데이터 통계 (기관구분명에 "재활" 포함 여부)
  const rehabilitationCount = itemList.filter(item => {
    const gigwanFgNm = (item.gigwanFgNm || '').toLowerCase();
    const gigwanNm = (item.gigwanNm || '').toLowerCase();
    return gigwanFgNm.includes('재활') || gigwanNm.includes('재활');
  }).length;

  console.log('\n' + '='.repeat(60));
  console.log(`\n📊 재활기관 관련 데이터: ${rehabilitationCount}개`);
  
  if (rehabilitationCount > 0) {
    console.log('✅ 재활기관 관련 데이터가 포함되어 있습니다!');
  } else {
    console.log('💡 기관구분명(gigwanFgNm)을 확인하여 재활기관을 필터링할 수 있습니다.');
  }

  // 전체 필드 목록 출력
  if (itemList.length > 0) {
    console.log('\n📋 제공되는 모든 필드:');
    const allFields = Object.keys(itemList[0]);
    allFields.forEach(field => {
      console.log(`  - ${field}: ${itemList[0][field] || 'N/A'}`);
    });
  }
}

/**
 * 메인 함수
 */
async function main() {
  console.log('🚀 산재 재활기관 API 테스트 시작\n');
  console.log('='.repeat(60));

  try {
    // 테스트 1: 기본 조회 (산재 구분)
    console.log('\n📝 테스트 1: 산재 보험 가입 사업장 조회 (opaBoheomFg=1)');
    // 테스트 1: 기본 조회 (파라미터 없이)
    console.log('\n📝 테스트 1: 기본 조회 (전체 데이터)');
    const result1 = await callAPI({
      pageNo: '1',
      numOfRows: '20',
    });
    analyzeData(result1);

    // 테스트 2: 더 많은 데이터 조회
    console.log('\n\n📝 테스트 2: 더 많은 데이터 조회');
    const result2 = await callAPI({
      pageNo: '1',
      numOfRows: '100',
    });
    analyzeData(result2);

  } catch (error) {
    console.error('\n❌ 테스트 실패:', error.message);
    console.error(error.stack);
  }
}

// 실행
main().catch(console.error);

