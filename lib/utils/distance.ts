/**
 * @file distance.ts
 * @description 거리 계산 유틸리티 함수
 *
 * Haversine 공식을 사용하여 두 지점 간의 거리를 계산합니다.
 *
 * @see https://en.wikipedia.org/wiki/Haversine_formula
 */

/**
 * 두 지점 간의 거리를 계산 (Haversine 공식)
 * 
 * @param lat1 첫 번째 지점의 위도
 * @param lon1 첫 번째 지점의 경도
 * @param lat2 두 번째 지점의 위도
 * @param lon2 두 번째 지점의 경도
 * @returns 거리 (킬로미터)
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  // 지구의 반지름 (km)
  const R = 6371;

  // 위도와 경도를 라디안으로 변환
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  // Haversine 공식
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

/**
 * 각도를 라디안으로 변환
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * 거리를 포맷팅하여 반환
 * 
 * @param distanceKm 거리 (킬로미터)
 * @returns 포맷팅된 거리 문자열 (예: "1.2km", "500m")
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    // 1km 미만은 미터로 표시
    const meters = Math.round(distanceKm * 1000);
    return `${meters}m`;
  } else {
    // 1km 이상은 킬로미터로 표시 (소수점 첫째 자리)
    return `${distanceKm.toFixed(1)}km`;
  }
}

/**
 * 병원과 사용자 위치 간의 거리를 계산하고 포맷팅
 * 
 * @param hospitalLat 병원 위도
 * @param hospitalLon 병원 경도
 * @param userLat 사용자 위도
 * @param userLon 사용자 경도
 * @returns 포맷팅된 거리 문자열
 */
export function getFormattedDistance(
  hospitalLat: number,
  hospitalLon: number,
  userLat: number,
  userLon: number
): string {
  const distance = calculateDistance(
    userLat,
    userLon,
    hospitalLat,
    hospitalLon
  );
  return formatDistance(distance);
}


