/**
 * @file region.ts
 * @description 지역 선택 필터를 위한 타입 정의
 */

/**
 * 시/도 타입
 */
export type ProvinceType = 'metropolitan' | 'province' | 'special';

/**
 * 시/군/구 타입
 */
export type DistrictType = 'city' | 'county' | 'gu';

/**
 * 시/도 정보
 */
export interface Region {
  code: string; // 행정구역 코드 (예: "11" = 서울)
  name: string; // 시/도 이름
  type: ProvinceType; // 광역시, 일반 도, 특별시
  districts?: District[]; // 시/군/구 목록
  latitude?: number; // 위도 (시청/도청 기준)
  longitude?: number; // 경도 (시청/도청 기준)
}

/**
 * 시/군/구 정보
 */
export interface District {
  code: string; // 시/군/구 코드
  name: string; // 시/군/구 이름
  type: DistrictType; // 시, 군, 구
  subDistricts?: SubDistrict[]; // 구 목록 (시의 경우)
}

/**
 * 구 정보 (시의 하위 구)
 */
export interface SubDistrict {
  code: string; // 구 코드
  name: string; // 구 이름
}

/**
 * 지역 선택 상태
 */
export interface RegionSelection {
  provinceCode: string | null; // 시/도 코드
  provinceName: string | null; // 시/도 이름
  districtCode: string | null; // 시/군/구 코드
  districtName: string | null; // 시/군/구 이름
  subDistrictCode: string | null; // 구 코드 (광역시)
  subDistrictName: string | null; // 구 이름 (광역시)
}

/**
 * 검색 모드
 */
export type SearchMode = 'location' | 'region'; // 내 위치 주변 vs 지역 선택













