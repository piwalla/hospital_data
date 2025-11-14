/**
 * @file geocoding-vworld.ts
 * @description VWorld Geocoding API 클라이언트
 *
 * VWorld API는 국토교통부에서 제공하는 무료 지오코딩 서비스입니다.
 * - 무료 할당량: 월 40,000건
 * - API 문서: https://www.vworld.kr/dev/v4dv_geocoderguide2_s001.do
 */

export interface VWorldGeocodingResponse {
  response: {
    status: string;
    input?: {
      point?: {
        x: string;
        y: string;
      };
    };
    result?: {
      point?: {
        x: string; // 경도
        y: string; // 위도
      };
      text?: string;
      structure?: {
        level0: string;
        level1: string;
        level2: string;
        level3: string;
        level4L: string;
        level4LC: string;
        level4A: string;
        level4AC: string;
        level5: string;
        detail: string;
      };
    };
  };
  error?: {
    text: string;
  };
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * VWorld Geocoding API 클라이언트
 */
class VWorldGeocodingClient {
  private apiKey: string;
  private baseUrl = 'http://api.vworld.kr/req/address';

  constructor() {
    this.apiKey = process.env.VWORLD_API_KEY || '';
    if (!this.apiKey) {
      console.warn('VWorld API 키가 설정되지 않았습니다.');
    }
  }

  /**
   * 주소를 좌표로 변환 (Geocoding)
   *
   * @param address 변환할 주소
   * @returns 좌표 정보
   */
  async geocode(address: string): Promise<Coordinates | null> {
    if (!this.apiKey) {
      console.error('[VWorld Geocoding] API 키가 설정되지 않았습니다.');
      return null;
    }

    const url = new URL(this.baseUrl);
    url.searchParams.set('service', 'address');
    url.searchParams.set('request', 'getcoord');
    url.searchParams.set('version', '2.0');
    url.searchParams.set('crs', 'epsg:4326');
    url.searchParams.set('address', address);
    url.searchParams.set('refine', 'true');
    url.searchParams.set('simple', 'false');
    url.searchParams.set('format', 'json');
    url.searchParams.set('type', 'road');
    url.searchParams.set('key', this.apiKey);

    console.log('[VWorld Geocoding] 요청:', address);

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[VWorld Geocoding] API 에러:', response.status, errorText);
        return null;
      }

      const data: VWorldGeocodingResponse = await response.json();

      if (data.response.status !== 'OK' || !data.response.result || !data.response.result.point) {
        console.warn('[VWorld Geocoding] 결과 없음:', address);
        console.warn('[VWorld Geocoding] 응답:', JSON.stringify(data, null, 2));
        if (data.error) {
          console.warn('[VWorld Geocoding] 에러:', data.error.text);
        }
        return null;
      }

      const result = data.response.result;
      const coordinates: Coordinates = {
        latitude: parseFloat(result.point!.y),
        longitude: parseFloat(result.point!.x),
      };

      console.log('[VWorld Geocoding] 성공:', address, coordinates);
      return coordinates;
    } catch (error) {
      console.error('[VWorld Geocoding] 요청 실패:', error);
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
}

// 싱글톤 인스턴스
let vworldGeocodingInstance: VWorldGeocodingClient | null = null;

/**
 * VWorld Geocoding 클라이언트 인스턴스 가져오기
 */
export function getVWorldGeocodingClient(): VWorldGeocodingClient {
  if (!vworldGeocodingInstance) {
    vworldGeocodingInstance = new VWorldGeocodingClient();
  }
  return vworldGeocodingInstance;
}
