/**
 * @file map.ts
 * @description 지도 관련 유틸리티 함수
 *
 * 반경에 따른 적절한 지도 확대/축소 레벨(zoom)을 계산합니다.
 */

/**
 * 반경(km)에 따른 적절한 지도 zoom 레벨 계산
 * 
 * Naver Maps API zoom 레벨:
 * - 5km: zoom 14 (더 확대, 상세하게 보기)
 * - 10km: zoom 13 (중간 확대)
 * - 15km: zoom 12 (중간 축소)
 * - 30km: zoom 11 (더 축소, 넓게 보기)
 * 
 * @param radiusKm 반경 (킬로미터)
 * @returns 적절한 zoom 레벨 (10-14)
 */
export function getZoomLevelByRadius(radiusKm: number): number {
  // 반경에 따라 적절한 zoom 레벨 반환
  if (radiusKm <= 5) {
    return 14; // 5km 이하: 가장 확대
  } else if (radiusKm <= 10) {
    return 13; // 10km: 중간 확대
  } else if (radiusKm <= 15) {
    return 12; // 15km: 중간 축소
  } else {
    return 11; // 30km 이상: 가장 축소
  }
}








