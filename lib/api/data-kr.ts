/**
 * @file data-kr.ts
 * @description 공공데이터포털 API 클라이언트
 *
 * 근로복지공단 산재보험 지정의료기관 현황정보 API를 호출하는 클라이언트입니다.
 *
 * 주요 기능:
 * 1. 산재 지정 의료기관 데이터 조회
 * 2. 페이지네이션 처리
 * 3. 데이터 변환 및 정규화
 * 4. Supabase 캐싱 연동
 *
 * @dependencies
 * - 공공데이터포털 API (api.odcloud.kr)
 * - Supabase (데이터 캐싱)
 */

// API 응답 타입 정의
export interface DataKrApiResponse {
  page: number;
  perPage: number;
  totalCount: number;
  currentCount: number;
  matchCount: number;
  data: DataKrHospital[];
}

export interface DataKrHospital {
  연도: number;
  의료기관명: string;
  우편번호: string;
  소재지: string;
  연락처: string;
}

// 변환된 데이터 타입 (DB 스키마와 일치)
export interface HospitalData {
  name: string;
  type: 'hospital' | 'pharmacy';
  address: string;
  latitude: number;
  longitude: number;
  phone: string | null;
  department: string | null;
}

// API 설정
const API_BASE_URL = 'https://api.odcloud.kr/api/3044320/v1';
const ENDPOINT_2017 = 'uddi:d9ecddd6-d2c4-4e54-8a1c-da36aeeaecc5_201906131805';

/**
 * 공공데이터포털 API 클라이언트
 */
class DataKrClient {
  private apiKey: string;

  constructor() {
    // 서버 사이드에서만 사용 (환경변수는 서버에서만 접근 가능)
    this.apiKey = process.env.TOUR_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn('TOUR_API_KEY가 설정되지 않았습니다.');
    }
  }

  /**
   * 산재 지정 의료기관 데이터 조회
   * @param page 페이지 번호 (기본값: 1)
   * @param perPage 페이지당 항목 수 (기본값: 10, 최대: 100)
   * @returns API 응답 데이터
   */
  async fetchHospitals(page: number = 1, perPage: number = 10): Promise<DataKrApiResponse> {
    if (!this.apiKey) {
      throw new Error('API 키가 설정되지 않았습니다. TOUR_API_KEY 환경변수를 확인하세요.');
    }

    const url = new URL(`${API_BASE_URL}/${ENDPOINT_2017}`);
    url.searchParams.set('page', page.toString());
    url.searchParams.set('perPage', Math.min(perPage, 100).toString());
    url.searchParams.set('returnType', 'JSON');
    url.searchParams.set('serviceKey', this.apiKey); // Query Parameter 방식 사용

    console.log('[DataKr API] 요청:', { page, perPage, url: url.toString().replace(this.apiKey, '***') });

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        // 서버 사이드에서만 호출되므로 next: { revalidate } 사용 가능
        next: { revalidate: 3600 }, // 1시간 캐시
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[DataKr API] 에러 응답:', response.status, errorText);
        throw new Error(`API 호출 실패: ${response.status} - ${errorText}`);
      }

      const data: DataKrApiResponse = await response.json();
      console.log('[DataKr API] 응답:', {
        page: data.page,
        currentCount: data.currentCount,
        totalCount: data.totalCount,
      });

      return data;
    } catch (error) {
      console.error('[DataKr API] 요청 실패:', error);
      throw error;
    }
  }

  /**
   * 모든 병원 데이터 조회 (페이지네이션 자동 처리)
   * @param maxPages 최대 조회할 페이지 수 (기본값: 무제한)
   * @returns 모든 병원 데이터 배열
   */
  async fetchAllHospitals(maxPages?: number): Promise<DataKrHospital[]> {
    const allHospitals: DataKrHospital[] = [];
    let currentPage = 1;
    let hasMore = true;
    const perPage = 100; // 최대값

    while (hasMore) {
      if (maxPages && currentPage > maxPages) {
        break;
      }

      const response = await this.fetchHospitals(currentPage, perPage);
      allHospitals.push(...response.data);

      // 다음 페이지가 있는지 확인
      const totalPages = Math.ceil(response.totalCount / perPage);
      hasMore = currentPage < totalPages;
      currentPage++;

      // API 부하 방지를 위한 딜레이 (선택사항)
      if (hasMore) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    console.log('[DataKr API] 전체 데이터 조회 완료:', allHospitals.length, '개');
    return allHospitals;
  }
}

// 싱글톤 인스턴스
let clientInstance: DataKrClient | null = null;

/**
 * DataKr 클라이언트 인스턴스 가져오기
 */
export function getDataKrClient(): DataKrClient {
  if (!clientInstance) {
    clientInstance = new DataKrClient();
  }
  return clientInstance;
}

/**
 * API 응답 데이터를 DB 스키마 형식으로 변환
 * 
 * @param apiData API 응답 데이터
 * @param coordinates 좌표 정보 (Geocoding 결과, 선택사항)
 * @returns DB 스키마 형식의 데이터
 */
export function transformHospitalData(
  apiData: DataKrHospital,
  coordinates?: { latitude: number; longitude: number } | null
): HospitalData {
  // 의료기관명에서 병원/약국 구분 (간단한 휴리스틱)
  const name = apiData.의료기관명.trim();
  const isPharmacy = name.includes('약국') || name.includes('한약방');
  const type: 'hospital' | 'pharmacy' = isPharmacy ? 'pharmacy' : 'hospital';

  // 전화번호 정규화
  const phone = apiData.연락처?.trim() || null;

  // 주소 정규화
  const address = apiData.소재지?.trim() || '';

  return {
    name,
    type,
    address,
    latitude: coordinates?.latitude || 0,
    longitude: coordinates?.longitude || 0,
    phone,
    department: null, // TODO: 의료기관명에서 진료과목 추출 또는 별도 API 필요
  };
}

/**
 * 여러 병원 데이터를 일괄 변환
 * 
 * @param apiDataList API 응답 데이터 배열
 * @param coordinatesMap 주소별 좌표 맵 (Geocoding 결과, 선택사항)
 */
export function transformHospitalDataList(
  apiDataList: DataKrHospital[],
  coordinatesMap?: Map<string, { latitude: number; longitude: number } | null>
): HospitalData[] {
  return apiDataList.map((apiData) => {
    const address = apiData.소재지?.trim() || '';
    const coordinates = coordinatesMap?.get(address);
    return transformHospitalData(apiData, coordinates || undefined);
  });
}

