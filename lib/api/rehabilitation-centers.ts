/**
 * @file rehabilitation-centers.ts
 * @description 재활기관 데이터 조회 유틸리티
 *
 * Supabase에서 캐시된 재활기관 데이터를 조회하는 함수들입니다.
 *
 * @dependencies
 * - lib/supabase/server.ts 또는 lib/supabase/clerk-client.ts
 */

import { createClerkSupabaseClient } from '@/lib/supabase/server';

export interface RehabilitationCenter {
  id: string;
  name: string; // gigwan_nm
  type: 'rehabilitation'; // 기관 유형
  address: string;
  latitude: number;
  longitude: number;
  phone: string | null; // tel_no
  department: string | null; // gigwan_fg_nm (기관구분명)
  gigwan_fg_nm: string; // 직업훈련기관, 재활스포츠 위탁기관, 심리재활프로그램 위탁기관
  last_updated: string;
  distance?: number; // 거리 정보 (km, getRehabilitationCentersNearby에서 추가됨)
}

/**
 * 모든 재활기관 데이터 조회
 */
export async function getAllRehabilitationCenters(): Promise<RehabilitationCenter[]> {
  const supabase = await createClerkSupabaseClient();

  const { data, error } = await supabase
    .from('rehabilitation_centers')
    .select('*')
    .order('gigwan_nm', { ascending: true })
    .range(0, 49999);

  if (error) {
    console.error('[Rehabilitation Centers] 조회 실패:', error);
    throw error;
  }

  // Supabase 데이터를 RehabilitationCenter 인터페이스로 변환
  return (data || []).map((item) => ({
    id: item.id,
    name: item.gigwan_nm,
    type: 'rehabilitation' as const,
    address: item.address,
    latitude: item.latitude,
    longitude: item.longitude,
    phone: item.tel_no,
    department: item.gigwan_fg_nm, // 기관구분명을 department로 매핑
    gigwan_fg_nm: item.gigwan_fg_nm,
    last_updated: item.last_updated,
  }));
}

/**
 * 위치 기반 재활기관 검색 (반경 내)
 * 
 * Haversine 공식을 사용하여 정확한 거리를 계산하고, 가까운 순으로 정렬합니다.
 * 
 * @param latitude 위도
 * @param longitude 경도
 * @param radiusKm 반경 (km, 기본값: 5)
 * @returns 반경 내 재활기관 배열 (가까운 순으로 정렬)
 */
export async function getRehabilitationCentersNearby(
  latitude: number,
  longitude: number,
  radiusKm: number = 5
): Promise<RehabilitationCenter[]> {
  const supabase = await createClerkSupabaseClient();

  // 먼저 대략적인 범위로 필터링 (성능 최적화)
  // 1도 ≈ 111km이므로, 반경보다 약간 넓은 범위로 먼저 필터링
  const roughRadius = radiusKm / 111;
  
  console.log('[Rehabilitation Centers] 위치 기반 검색 시작:', { latitude, longitude, radiusKm, roughRadius });
  
  const { data, error } = await supabase
    .from('rehabilitation_centers')
    .select('*')
    .gte('latitude', latitude - roughRadius)
    .lte('latitude', latitude + roughRadius)
    .gte('longitude', longitude - roughRadius)
    .lte('longitude', longitude + roughRadius)
    .range(0, 49999);
  
  console.log('[Rehabilitation Centers] 대략적 범위 필터링 결과:', data?.length || 0, '개');

  if (error) {
    console.error('[Rehabilitation Centers] 위치 검색 실패:', error);
    throw error;
  }

  // Haversine 공식으로 정확한 거리 계산 및 필터링
  const { calculateDistance } = await import('@/lib/utils/distance');
  
  const centersWithDistance: (RehabilitationCenter & { distance: number })[] = (data || [])
    .map((center) => {
      // 좌표가 유효한 경우에만 거리 계산
      if (center.latitude === 0 && center.longitude === 0) {
        return null;
      }

      const distance = calculateDistance(
        latitude,
        longitude,
        center.latitude,
        center.longitude
      );

      return {
        id: center.id,
        name: center.gigwan_nm,
        type: 'rehabilitation' as const,
        address: center.address,
        latitude: center.latitude,
        longitude: center.longitude,
        phone: center.tel_no,
        department: center.gigwan_fg_nm,
        gigwan_fg_nm: center.gigwan_fg_nm,
        last_updated: center.last_updated,
        distance, // 거리 정보 추가
      };
    })
    .filter((center): center is RehabilitationCenter & { distance: number } => {
      // null 제거 및 반경 내만 필터링
      return center !== null && center.distance <= radiusKm;
    })
    .sort((a, b) => a.distance - b.distance); // 가까운 순으로 정렬

  console.log(`[Rehabilitation Centers] 반경 ${radiusKm}km 내 재활기관: ${centersWithDistance.length}개`);

  // distance를 optional로 유지하면서 반환
  return centersWithDistance.map(({ distance, ...rest }) => ({
    ...rest,
    distance,
  })) as RehabilitationCenter[];
}

/**
 * 기관구분으로 필터링
 * 
 * @param gigwanFgNm 기관구분명 (직업훈련기관, 재활스포츠 위탁기관, 심리재활프로그램 위탁기관)
 * @returns 필터링된 재활기관 배열
 */
export async function getRehabilitationCentersByType(
  gigwanFgNm: string
): Promise<RehabilitationCenter[]> {
  const supabase = await createClerkSupabaseClient();

  const { data, error } = await supabase
    .from('rehabilitation_centers')
    .select('*')
    .eq('gigwan_fg_nm', gigwanFgNm)
    .order('gigwan_nm', { ascending: true })
    .range(0, 49999);

  if (error) {
    console.error('[Rehabilitation Centers] 기관구분 검색 실패:', error);
    throw error;
  }

  return (data || []).map((item) => ({
    id: item.id,
    name: item.gigwan_nm,
    type: 'rehabilitation' as const,
    address: item.address,
    latitude: item.latitude,
    longitude: item.longitude,
    phone: item.tel_no,
    department: item.gigwan_fg_nm,
    gigwan_fg_nm: item.gigwan_fg_nm,
    last_updated: item.last_updated,
  }));
}

/**
 * 지역 기반 재활기관 검색
 * 
 * 주소 필드를 기반으로 특정 지역의 재활기관을 검색합니다.
 * 다양한 주소 형식을 지원합니다 (약자 변환 포함).
 * 
 * @param provinceName 시/도 이름 (예: "서울특별시")
 * @param districtName 시/군/구 이름 (선택, 예: "강남구")
 * @param subDistrictName 구 이름 (선택, 예: "영통구" - 시의 하위 구)
 * @returns 필터링된 재활기관 배열
 */
export async function getRehabilitationCentersByRegion(
  provinceName: string,
  districtName?: string,
  subDistrictName?: string
): Promise<RehabilitationCenter[]> {
  const supabase = await createClerkSupabaseClient();

  console.log('[Rehabilitation Centers] 지역 기반 검색 시작:', { provinceName, districtName, subDistrictName });

  // 주소 검색을 위한 패턴 생성 (약자 변환 지원)
  // 예: "인천광역시" → ["인천광역시", "인천"]
  const getProvincePatterns = (name: string): string[] => {
    const patterns = [name];
    // 약자 변환
    const shortName = name
      .replace(/특별시|광역시|특별자치도|특별자치시/g, '')
      .replace(/도$/, '');
    if (shortName !== name) {
      patterns.push(shortName);
    }
    return patterns;
  };

  const provincePatterns = getProvincePatterns(provinceName);

  // 시/도만 선택한 경우
  if (!districtName) {
    // 여러 패턴으로 검색 (OR 조건)
    const queries = provincePatterns.map(pattern =>
      supabase
        .from('rehabilitation_centers')
        .select('*')
        .ilike('address', `%${pattern}%`)
        .range(0, 49999)
    );

    // 모든 쿼리 실행
    const results = await Promise.all(queries);
    
    // 결과 병합 및 중복 제거
    const allCenters = new Map<string, any>();
    for (const result of results) {
      if (result.error) {
        console.error('[Rehabilitation Centers] 지역 검색 실패:', result.error);
        continue;
      }
      if (result.data) {
        for (const center of result.data) {
          allCenters.set(center.id, center);
        }
      }
    }

    const centers = Array.from(allCenters.values())
      .map((item) => ({
        id: item.id,
        name: item.gigwan_nm,
        type: 'rehabilitation' as const,
        address: item.address,
        latitude: item.latitude,
        longitude: item.longitude,
        phone: item.tel_no,
        department: item.gigwan_fg_nm,
        gigwan_fg_nm: item.gigwan_fg_nm,
        last_updated: item.last_updated,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    console.log(`[Rehabilitation Centers] ${provinceName} 지역 재활기관: ${centers.length}개`);
    return centers;
  }

  // 시/군/구까지 선택한 경우
  // 여러 패턴으로 검색 (OR 조건)
  const queries = provincePatterns.map(pattern => {
    let query = supabase
      .from('rehabilitation_centers')
      .select('*')
      .ilike('address', `%${pattern}%`)
      .ilike('address', `%${districtName}%`);

    // 구까지 선택한 경우 (시의 하위 구)
    if (subDistrictName) {
      query = query.ilike('address', `%${subDistrictName}%`);
    }

    return query.range(0, 49999);
  });

  // 모든 쿼리 실행
  const results = await Promise.all(queries);
  
  // 결과 병합 및 중복 제거
  const allCenters = new Map<string, any>();
  for (const result of results) {
    if (result.error) {
      console.error('[Rehabilitation Centers] 지역 검색 실패:', result.error);
      continue;
    }
    if (result.data) {
      for (const center of result.data) {
        allCenters.set(center.id, center);
      }
    }
  }

  const centers = Array.from(allCenters.values())
    .map((item) => ({
      id: item.id,
      name: item.gigwan_nm,
      type: 'rehabilitation' as const,
      address: item.address,
      latitude: item.latitude,
      longitude: item.longitude,
      phone: item.tel_no,
      department: item.gigwan_fg_nm,
      gigwan_fg_nm: item.gigwan_fg_nm,
      last_updated: item.last_updated,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const regionName = subDistrictName 
    ? `${provinceName} ${districtName} ${subDistrictName}`
    : `${provinceName} ${districtName}`;
  console.log(`[Rehabilitation Centers] ${regionName} 지역 재활기관: ${centers.length}개`);

  return centers;
}


/**
 * 영역 기반 재활기관 검색 (지도 화면 내 검색)
 * 
 * 지도의 남서쪽(SW), 북동쪽(NE) 좌표를 받아 해당 영영 내의 재활기관을 검색합니다.
 */
export async function getRehabilitationCentersInBounds(
  northEast: { lat: number; lng: number },
  southWest: { lat: number; lng: number }
): Promise<RehabilitationCenter[]> {
  const supabase = await createClerkSupabaseClient();

  const { data, error } = await supabase
    .from('rehabilitation_centers')
    .select('*')
    .gte('latitude', southWest.lat)
    .lte('latitude', northEast.lat)
    .gte('longitude', southWest.lng)
    .lte('longitude', northEast.lng)
    .range(0, 499); // 최대 500개 제한

  if (error) {
    console.error('[Rehabilitation Centers] 영역 검색 실패:', error);
    throw error;
  }

  // Supabase 데이터를 RehabilitationCenter 인터페이스로 변환
  return (data || []).map((item) => ({
    id: item.id,
    name: item.gigwan_nm,
    type: 'rehabilitation' as const,
    address: item.address,
    latitude: item.latitude,
    longitude: item.longitude,
    phone: item.tel_no,
    department: item.gigwan_fg_nm,
    gigwan_fg_nm: item.gigwan_fg_nm,
    last_updated: item.last_updated,
  }));
}
