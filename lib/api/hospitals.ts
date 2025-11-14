/**
 * @file hospitals.ts
 * @description 병원 데이터 조회 유틸리티
 *
 * Supabase에서 캐시된 병원 데이터를 조회하는 함수들입니다.
 *
 * @dependencies
 * - lib/supabase/server.ts 또는 lib/supabase/clerk-client.ts
 */

import { createClerkSupabaseClient } from '@/lib/supabase/server';

export interface Hospital {
  id: string;
  name: string;
  type: 'hospital' | 'pharmacy';
  address: string;
  latitude: number;
  longitude: number;
  phone: string | null;
  department: string | null;
  last_updated: string;
  distance?: number; // 거리 정보 (km, getHospitalsNearby에서 추가됨)
}

/**
 * 모든 병원 데이터 조회
 */
export async function getAllHospitals(): Promise<Hospital[]> {
  const supabase = await createClerkSupabaseClient();

  const { data, error } = await supabase
    .from('hospitals_pharmacies')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('[Hospitals] 조회 실패:', error);
    throw error;
  }

  return data || [];
}

/**
 * 위치 기반 병원 검색 (반경 내)
 * 
 * Haversine 공식을 사용하여 정확한 거리를 계산하고, 가까운 순으로 정렬합니다.
 * 
 * @param latitude 위도
 * @param longitude 경도
 * @param radiusKm 반경 (km, 기본값: 5)
 * @returns 반경 내 병원 배열 (가까운 순으로 정렬)
 */
export async function getHospitalsNearby(
  latitude: number,
  longitude: number,
  radiusKm: number = 5
): Promise<Hospital[]> {
  const supabase = await createClerkSupabaseClient();

  // 먼저 대략적인 범위로 필터링 (성능 최적화)
  // 1도 ≈ 111km이므로, 반경보다 약간 넓은 범위로 먼저 필터링
  const roughRadius = radiusKm / 111;
  
  console.log('[Hospitals] 위치 기반 검색 시작:', { latitude, longitude, radiusKm, roughRadius });
  
  const { data, error } = await supabase
    .from('hospitals_pharmacies')
    .select('*')
    .gte('latitude', latitude - roughRadius)
    .lte('latitude', latitude + roughRadius)
    .gte('longitude', longitude - roughRadius)
    .lte('longitude', longitude + roughRadius);
  
  console.log('[Hospitals] 대략적 범위 필터링 결과:', data?.length || 0, '개');

  if (error) {
    console.error('[Hospitals] 위치 검색 실패:', error);
    throw error;
  }

  // Haversine 공식으로 정확한 거리 계산 및 필터링
  const { calculateDistance } = await import('@/lib/utils/distance');
  
  const hospitalsWithDistance: (Hospital & { distance: number })[] = (data || [])
    .map((hospital) => {
      // 좌표가 유효한 경우에만 거리 계산
      if (hospital.latitude === 0 && hospital.longitude === 0) {
        return null;
      }

      const distance = calculateDistance(
        latitude,
        longitude,
        hospital.latitude,
        hospital.longitude
      );

      return {
        ...hospital,
        distance, // 거리 정보 추가
      };
    })
    .filter((hospital): hospital is Hospital & { distance: number } => {
      // null 제거 및 반경 내만 필터링
      return hospital !== null && hospital.distance <= radiusKm;
    })
    .sort((a, b) => a.distance - b.distance); // 가까운 순으로 정렬

  console.log(`[Hospitals] 반경 ${radiusKm}km 내 병원: ${hospitalsWithDistance.length}개`);

  // distance를 optional로 유지하면서 반환
  return hospitalsWithDistance.map(({ distance, ...rest }) => ({
    ...rest,
    distance,
  })) as Hospital[];
}

/**
 * 진료과목으로 필터링
 */
export async function getHospitalsByDepartment(
  department: string
): Promise<Hospital[]> {
  const supabase = await createClerkSupabaseClient();

  const { data, error } = await supabase
    .from('hospitals_pharmacies')
    .select('*')
    .eq('type', 'hospital')
    .ilike('department', `%${department}%`)
    .order('name', { ascending: true });

  if (error) {
    console.error('[Hospitals] 진료과목 검색 실패:', error);
    throw error;
  }

  return data || [];
}

