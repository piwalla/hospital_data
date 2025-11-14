/**
 * @file geocoding.ts
 * @description 네이버 Maps Geocoding API 클라이언트
 *
 * 주소를 좌표(위도, 경도)로 변환하는 기능을 제공합니다.
 *
 * 주요 기능:
 * 1. 주소 → 좌표 변환 (Geocoding)
 * 2. 좌표 → 주소 변환 (Reverse Geocoding)
 * 3. 배치 처리 지원
 *
 * @dependencies
 * - 네이버 클라우드 플랫폼 Maps API
 */

// Geocoding 응답 타입
export interface GeocodingResponse {
  status: string;
  meta: {
    totalCount: number;
    count: number;
  };
  addresses: Array<{
    roadAddress?: string;
    jibunAddress?: string;
    englishAddress?: string;
    addressElements: Array<{
      types: string[];
      longName: string;
      shortName: string;
      code: string;
    }>;
    x: string; // 경도
    y: string; // 위도
    distance: number;
  }>;
  errorMessage?: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * 네이버 Geocoding API 클라이언트
 */
class GeocodingClient {
  private clientId: string;
  private clientSecret: string;
  private baseUrl = 'https://maps.apigw.ntruss.com';

  constructor() {
    this.clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID || '';
    this.clientSecret = process.env.NAVER_MAP_CLIENT_SECRET || '';

    if (!this.clientId || !this.clientSecret) {
      console.warn('네이버 Maps API 키가 설정되지 않았습니다.');
    }
  }

  /**
   * 주소를 좌표로 변환 (Geocoding)
   * 
   * @param address 변환할 주소
   * @returns 좌표 정보
   */
  async geocode(address: string): Promise<Coordinates | null> {
    if (!this.clientId || !this.clientSecret) {
      console.error('[Geocoding] API 키가 설정되지 않았습니다.');
      return null;
    }

    const url = new URL(`${this.baseUrl}/map-geocode/v2/geocode`);
    url.searchParams.set('query', address);

    console.log('[Geocoding] 요청:', address);

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'X-NCP-APIGW-API-KEY-ID': this.clientId,
          'X-NCP-APIGW-API-KEY': this.clientSecret,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Geocoding] API 에러:', response.status, errorText);
        console.error('[Geocoding] 요청한 주소:', address);
        console.error('[Geocoding] 주소 길이:', address.length);
        console.error('[Geocoding] 주소 인코딩 확인:', Buffer.from(address).toString('hex').substring(0, 100));
        return null;
      }

      const data: GeocodingResponse = await response.json();

      if (data.status !== 'OK' || data.addresses.length === 0) {
        console.warn('[Geocoding] 결과 없음:', address);
        console.warn('[Geocoding] 주소 길이:', address.length);
        console.warn('[Geocoding] 주소 미리보기:', address.substring(0, 50));
        console.warn('[Geocoding] API 응답 상태:', data.status);
        console.warn('[Geocoding] API 응답:', JSON.stringify(data, null, 2));
        return null;
      }

      const firstResult = data.addresses[0];
      const coordinates: Coordinates = {
        latitude: parseFloat(firstResult.y),
        longitude: parseFloat(firstResult.x),
      };

      console.log('[Geocoding] 성공:', address, coordinates);
      return coordinates;
    } catch (error) {
      console.error('[Geocoding] 요청 실패:', error);
      return null;
    }
  }

  /**
   * 여러 주소를 일괄 변환 (배치 처리)
   * 
   * @param addresses 주소 배열
   * @param delayMs 요청 간 딜레이 (ms, 기본값: 100)
   * @returns 주소별 좌표 맵
   */
  async geocodeBatch(
    addresses: string[],
    delayMs: number = 100
  ): Promise<Map<string, Coordinates | null>> {
    const results = new Map<string, Coordinates | null>();

    for (const address of addresses) {
      const coordinates = await this.geocode(address);
      results.set(address, coordinates);

      // API 부하 방지를 위한 딜레이
      if (delayMs > 0) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }

    return results;
  }

  /**
   * 좌표를 주소로 변환 (Reverse Geocoding)
   * 
   * @param latitude 위도
   * @param longitude 경도
   * @returns 주소 정보
   */
  async reverseGeocode(
    latitude: number,
    longitude: number
  ): Promise<string | null> {
    if (!this.clientId || !this.clientSecret) {
      console.error('[Geocoding] API 키가 설정되지 않았습니다.');
      return null;
    }

    const url = new URL(`${this.baseUrl}/map-reversegeocode/v2/gc`);
    url.searchParams.set('coords', `${longitude},${latitude}`);
    url.searchParams.set('output', 'json');

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'X-NCP-APIGW-API-KEY-ID': this.clientId,
          'X-NCP-APIGW-API-KEY': this.clientSecret,
        },
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      // Reverse Geocoding 응답 구조에 따라 주소 추출
      return data.results?.[0]?.region?.area?.name || null;
    } catch (error) {
      console.error('[Geocoding] Reverse Geocoding 실패:', error);
      return null;
    }
  }
}

// 싱글톤 인스턴스
let geocodingInstance: GeocodingClient | null = null;

/**
 * Geocoding 클라이언트 인스턴스 가져오기
 */
export function getGeocodingClient(): GeocodingClient {
  if (!geocodingInstance) {
    geocodingInstance = new GeocodingClient();
  }
  return geocodingInstance;
}

