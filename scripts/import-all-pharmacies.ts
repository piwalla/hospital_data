/**
 * @file import-all-pharmacies.ts
 * @description 전체 약국 데이터 수집 스크립트
 * 
 * 근로복지공단 산재 약국 API에서 전체 데이터를 가져와서 Supabase에 저장합니다.
 */

import { getServiceRoleClient } from '../lib/supabase/service-role';

const API_KEY = process.env.DATA_GO_KR_API_KEY || process.env.TOUR_API_KEY || '';
const BASE_URL = 'https://apis.data.go.kr/B490001/sjHptMcalPstateInfoService/getSjJijeongyakgukChakgiList';

interface PharmacyItem {
  hospitalNm?: string;
  addr?: string;
  tel?: string;
  faxTel?: string;
  gwanriJisaCd?: string;
  jisaNm?: string;
}

async function fetchPharmacies(pageNo: number, numOfRows: number) {
  const url = new URL(BASE_URL);
  url.searchParams.set('serviceKey', API_KEY);
  url.searchParams.set('pageNo', pageNo.toString());
  url.searchParams.set('numOfRows', numOfRows.toString());

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
  const { parseString } = await import('xml2js');

  return new Promise<{ items: PharmacyItem[]; totalCount: number }>((resolve, reject) => {
    parseString(xmlText, { explicitArray: false, mergeAttrs: true }, (err, result) => {
      if (err) {
        reject(err);
        return;
      }

      const response = result?.response;
      if (!response || response.header?.resultCode !== '00') {
        reject(new Error(`API 오류: ${response?.header?.resultMsg || '알 수 없는 오류'}`));
        return;
      }

      const body = response.body;
      if (!body || !body.items) {
        resolve({ items: [], totalCount: 0 });
        return;
      }

      const itemsData = body.items.item;
      const items: PharmacyItem[] = Array.isArray(itemsData)
        ? itemsData
        : itemsData
        ? [itemsData]
        : [];

      const totalCount = parseInt(body.totalCount || '0', 10);

      resolve({
        items: items.filter(item => item.hospitalNm && item.addr),
        totalCount,
      });
    });
  });
}

async function main() {
  if (!API_KEY) {
    console.error('❌ API 키가 설정되지 않았습니다.');
    process.exit(1);
  }

  console.log('🚀 전체 약국 데이터 수집 시작...\n');

  const supabase = getServiceRoleClient();
  const numOfRows = 100; // 페이지당 100개
  let totalSaved = 0;
  let totalUpdated = 0;
  let totalFetched = 0;
  let currentPage = 1;
  let totalCount = 0;
  let totalPages = 0;

  try {
    // 첫 페이지로 전체 개수 확인
    console.log('📊 전체 데이터 개수 확인 중...');
    const firstPage = await fetchPharmacies(1, 1);
    totalCount = firstPage.totalCount;
    totalPages = Math.ceil(totalCount / numOfRows);
    console.log(`✅ 총 ${totalCount.toLocaleString()}개 약국 데이터 발견 (${totalPages}페이지)\n`);

    // 전체 페이지 수집
    while (currentPage <= totalPages) {
      console.log(`📄 페이지 ${currentPage}/${totalPages} 처리 중... (${Math.round((currentPage / totalPages) * 100)}%)`);

      const { items } = await fetchPharmacies(currentPage, numOfRows);
      totalFetched += items.length;

      // 데이터 저장
      for (const item of items) {
        try {
          // 중복 체크
          const { data: existing } = await supabase
            .from('hospitals_pharmacies')
            .select('id')
            .eq('name', item.hospitalNm)
            .eq('address', item.addr)
            .eq('type', 'pharmacy')
            .maybeSingle();

          const data = {
            name: item.hospitalNm || '',
            type: 'pharmacy' as const,
            address: item.addr || '',
            latitude: 0,
            longitude: 0,
            phone: item.tel || null,
            department: null,
          };

          if (existing) {
            await supabase
              .from('hospitals_pharmacies')
              .update(data)
              .eq('id', existing.id);
            totalUpdated++;
          } else {
            await supabase
              .from('hospitals_pharmacies')
              .insert(data);
            totalSaved++;
          }

          // Rate Limiting 방지
          await new Promise(resolve => setTimeout(resolve, 50));
        } catch (error) {
          console.error(`  ⚠️  저장 실패: ${item.hospitalNm}`, error);
        }
      }

      currentPage++;

      // 진행 상황 출력 (10페이지마다 또는 마지막 페이지)
      if (currentPage % 10 === 0 || currentPage > totalPages) {
        console.log(`  ✅ 진행: ${currentPage - 1}페이지 완료, ${totalSaved}개 신규 저장, ${totalUpdated}개 업데이트\n`);
      }

      // 페이지 간 딜레이
      if (currentPage <= totalPages) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.log('\n🎉 전체 약국 데이터 수집 완료!');
    console.log(`   - 신규 저장: ${totalSaved.toLocaleString()}개`);
    console.log(`   - 업데이트: ${totalUpdated.toLocaleString()}개`);
    console.log(`   - 총 수신: ${totalFetched.toLocaleString()}개`);
  } catch (error) {
    console.error('\n❌ 오류 발생:', error);
    process.exit(1);
  }
}

main();







