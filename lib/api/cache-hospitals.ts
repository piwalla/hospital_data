/**
 * @file cache-hospitals.ts
 * @description 병원 데이터 Supabase 캐싱 로직
 *
 * 공공데이터포털 API에서 받은 병원 데이터를 Supabase에 캐싱합니다.
 *
 * 주요 기능:
 * 1. API 데이터를 DB 스키마로 변환
 * 2. 중복 데이터 방지 (이름 + 주소 기준)
 * 3. 배치 업데이트
 * 4. 캐시 갱신 로직
 *
 * @dependencies
 * - lib/api/data-kr.ts
 * - lib/supabase/service-role.ts (관리자 권한 필요)
 */

import { getServiceRoleClient } from '@/lib/supabase/service-role';
import type { HospitalData } from './data-kr';
import { transformHospitalDataList } from './data-kr';
import { getGeocodingClient } from './geocoding';

/**
 * 병원 데이터를 Supabase에 캐싱
 * 
 * @param hospitals 변환된 병원 데이터 배열
 * @returns 저장된 레코드 수
 */
export async function cacheHospitalsToSupabase(
  hospitals: HospitalData[]
): Promise<number> {
  // 캐싱은 관리자 작업이므로 service-role 사용
  const supabase = getServiceRoleClient();

  console.log('[Cache] 병원 데이터 캐싱 시작:', hospitals.length, '개');

  let savedCount = 0;
  let skippedCount = 0;

  // 배치 처리 (한 번에 너무 많은 데이터를 넣지 않기 위해)
  const batchSize = 50;
  for (let i = 0; i < hospitals.length; i += batchSize) {
    const batch = hospitals.slice(i, i + batchSize);

    // 각 병원에 대해 중복 체크 후 삽입 또는 업데이트
    for (const hospital of batch) {
      try {
        // 이름과 주소로 중복 체크
        const { data: existing } = await supabase
          .from('hospitals_pharmacies')
          .select('id')
          .eq('name', hospital.name)
          .eq('address', hospital.address)
          .single();

        if (existing) {
          // 기존 데이터 업데이트
          const { error } = await supabase
            .from('hospitals_pharmacies')
            .update({
              ...hospital,
              last_updated: new Date().toISOString(),
            })
            .eq('id', existing.id);

          if (error) {
            console.error('[Cache] 업데이트 실패:', hospital.name, error);
          } else {
            savedCount++;
          }
        } else {
          // 새 데이터 삽입
          const { error } = await supabase
            .from('hospitals_pharmacies')
            .insert(hospital);

          if (error) {
            console.error('[Cache] 삽입 실패:', hospital.name, error);
            skippedCount++;
          } else {
            savedCount++;
          }
        }
      } catch (error) {
        console.error('[Cache] 처리 중 오류:', hospital.name, error);
        skippedCount++;
      }
    }

    console.log(`[Cache] 진행 상황: ${Math.min(i + batchSize, hospitals.length)}/${hospitals.length}`);
  }

  console.log('[Cache] 캐싱 완료:', {
    저장됨: savedCount,
    건너뜀: skippedCount,
    전체: hospitals.length,
  });

  return savedCount;
}

/**
 * API에서 데이터를 가져와서 Supabase에 캐싱
 * 
 * @param maxPages 최대 조회할 페이지 수 (기본값: 10, 테스트용)
 * @param useGeocoding Geocoding 사용 여부 (기본값: true)
 * @returns 저장된 레코드 수
 */
export async function syncHospitalsFromApi(
  maxPages: number = 10,
  useGeocoding: boolean = true
): Promise<number> {
  const { getDataKrClient } = await import('./data-kr');

  try {
    console.log('[Sync] 병원 데이터 동기화 시작', { maxPages, useGeocoding });
    
    // API에서 데이터 조회
    const client = getDataKrClient();
    const apiData = await client.fetchAllHospitals(maxPages);

    let transformedData: HospitalData[];

    if (useGeocoding) {
      // Geocoding으로 주소 → 좌표 변환
      console.log('[Sync] Geocoding 시작:', apiData.length, '개 주소');
      const geocodingClient = getGeocodingClient();
      
      // 고유한 주소만 추출
      const uniqueAddresses = Array.from(
        new Set(apiData.map(item => item.소재지?.trim()).filter(Boolean))
      ) as string[];

      console.log('[Sync] 고유 주소:', uniqueAddresses.length, '개');
      
      // 배치 Geocoding (API 부하 방지를 위해 딜레이 포함)
      const coordinatesMap = await geocodingClient.geocodeBatch(uniqueAddresses, 150);
      
      console.log('[Sync] Geocoding 완료:', {
        성공: Array.from(coordinatesMap.values()).filter(c => c !== null).length,
        실패: Array.from(coordinatesMap.values()).filter(c => c === null).length,
      });

      // 데이터 변환 (좌표 포함)
      transformedData = transformHospitalDataList(apiData, coordinatesMap);
    } else {
      // Geocoding 없이 변환 (좌표는 0, 0)
      transformedData = transformHospitalDataList(apiData);
    }

    // Supabase에 캐싱
    const savedCount = await cacheHospitalsToSupabase(transformedData);

    return savedCount;
  } catch (error) {
    console.error('[Sync] 동기화 실패:', error);
    throw error;
  }
}

