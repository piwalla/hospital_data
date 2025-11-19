/**
 * @file address-parser.ts
 * @description 주소 파싱 유틸리티
 * 
 * 병원/재활기관 주소에서 시/도, 시/군/구를 추출하는 함수들입니다.
 * 다양한 주소 형식을 지원합니다.
 */

import { ALL_PROVINCES } from '@/lib/data/korean-regions';

/**
 * 주소 파싱 결과
 */
export interface ParsedAddress {
  province: string | null; // 시/도 이름
  district: string | null; // 시/군/구 이름
  subDistrict: string | null; // 구 이름 (시의 하위 구)
}

/**
 * 주소에서 시/도, 시/군/구 추출
 * 
 * 지원하는 주소 형식:
 * - "서울특별시 강남구 테헤란로 123"
 * - "경기도 수원시 영통구 월드컵로 456"
 * - "부산광역시 해운대구 해운대해변로 789"
 * - "서울시 강남구" (약자 형식)
 * 
 * @param address 주소 문자열
 * @returns 파싱된 주소 정보
 */
export function parseAddress(address: string): ParsedAddress {
  if (!address || typeof address !== 'string') {
    return { province: null, district: null, subDistrict: null };
  }

  // 주소 정규화 (공백 제거, 특수문자 처리)
  const normalizedAddress = address.trim();

  // 시/도 찾기
  let province: string | null = null;
  let provinceMatch: RegExpMatchArray | null = null;

  // 모든 시/도를 순회하며 주소에 포함되어 있는지 확인
  for (const p of ALL_PROVINCES) {
    // 정확한 이름 매칭
    if (normalizedAddress.includes(p.name)) {
      province = p.name;
      provinceMatch = normalizedAddress.match(new RegExp(p.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
      break;
    }
    
    // 약자 형식 매칭 (서울특별시 → 서울시, 부산광역시 → 부산시)
    const shortName = p.name
      .replace(/특별시|광역시|특별자치도|특별자치시/g, '시')
      .replace(/도$/, '도');
    
    if (normalizedAddress.includes(shortName)) {
      province = p.name;
      provinceMatch = normalizedAddress.match(new RegExp(shortName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
      break;
    }
  }

  if (!province || !provinceMatch) {
    return { province: null, district: null, subDistrict: null };
  }

  // 시/도 이름 이후의 주소 추출
  const afterProvince = normalizedAddress.substring(
    (provinceMatch.index || 0) + provinceMatch[0].length
  ).trim();

  // 시/도 정보 가져오기
  const provinceData = ALL_PROVINCES.find((p) => p.name === province);
  if (!provinceData || !provinceData.districts) {
    return { province, district: null, subDistrict: null };
  }

  // 시/군/구 찾기
  let district: string | null = null;
  let subDistrict: string | null = null;

  // 모든 시/군/구를 순회하며 주소에 포함되어 있는지 확인
  for (const d of provinceData.districts) {
    // 정확한 이름 매칭
    if (afterProvince.includes(d.name)) {
      district = d.name;
      
      // 시의 경우 하위 구 확인
      if (d.type === 'city' && d.subDistricts) {
        const afterDistrict = afterProvince.substring(
          afterProvince.indexOf(d.name) + d.name.length
        ).trim();
        
        for (const subD of d.subDistricts) {
          if (afterDistrict.includes(subD.name)) {
            subDistrict = subD.name;
            break;
          }
        }
      }
      
      break;
    }
  }

  // 광역시인 경우 구를 district로 설정
  if (provinceData.type === 'metropolitan' && district) {
    // 광역시는 구가 district이므로 subDistrict는 null
    return { province, district, subDistrict: null };
  }

  return { province, district, subDistrict };
}

/**
 * 주소가 특정 지역에 속하는지 확인
 * 
 * @param address 주소 문자열
 * @param provinceName 시/도 이름
 * @param districtName 시/군/구 이름 (선택)
 * @param subDistrictName 구 이름 (선택)
 * @returns 지역에 속하면 true
 */
export function isAddressInRegion(
  address: string,
  provinceName: string,
  districtName?: string,
  subDistrictName?: string
): boolean {
  const parsed = parseAddress(address);

  // 시/도가 일치하지 않으면 false
  if (parsed.province !== provinceName) {
    return false;
  }

  // 시/군/구가 지정되지 않았으면 시/도만 일치하면 true
  if (!districtName) {
    return true;
  }

  // 시/군/구가 일치하지 않으면 false
  if (parsed.district !== districtName) {
    return false;
  }

  // 구가 지정되지 않았으면 시/군/구만 일치하면 true
  if (!subDistrictName) {
    return true;
  }

  // 구가 일치하는지 확인
  return parsed.subDistrict === subDistrictName;
}

/**
 * 주소 정규화 (약자 변환)
 * 
 * @param address 주소 문자열
 * @returns 정규화된 주소
 */
export function normalizeAddress(address: string): string {
  if (!address || typeof address !== 'string') {
    return '';
  }

  let normalized = address.trim();

  // 약자 변환
  const replacements: [RegExp, string][] = [
    [/서울시/g, '서울특별시'],
    [/부산시/g, '부산광역시'],
    [/대구시/g, '대구광역시'],
    [/인천시/g, '인천광역시'],
    [/광주시/g, '광주광역시'],
    [/대전시/g, '대전광역시'],
    [/울산시/g, '울산광역시'],
  ];

  for (const [regex, replacement] of replacements) {
    normalized = normalized.replace(regex, replacement);
  }

  return normalized;
}





