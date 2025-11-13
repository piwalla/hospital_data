# 공공데이터포털 산재보험 지정의료기관 API 명세

## API 개요

**제공 기관**: 근로복지공단 (Komwel)  
**API 유형**: RESTful OpenAPI  
**데이터 포맷**: JSON + XML  
**Base URL**: `https://api.odcloud.kr/api/3044320/v1`  
**Swagger URL**: https://infuser.odcloud.kr/oas/docs?namespace=3044320/v1  
**인증 방식**: API Key (Header 또는 Query Parameter)  
**응답 형식**: JSON / XML (기본: JSON)  

---

## 🔑 인증 정보

### API Key 설정 방법

#### 1. Header 방식 (권장)
```http
Authorization: [YOUR_API_KEY]
```

#### 2. Query Parameter 방식
```http
?serviceKey=[YOUR_API_KEY]
```

### API 환경별 인증키 적용
**중요**: API 환경 또는 호출 조건에 따라 인증키 적용 방식이 다를 수 있습니다.  
포털에서 제공되는 **Encoding/Decoding 된 인증키**를 적용하면서 구동되는 키를 사용하시기 바랍니다.

### 제공된 일반 인증키 (참고용)
```
aba6428813f7272c3d7a7918ec194233d0862839e5d1df1df223f03e1d01592a
```

### API Key 발급 절차
1. [공공데이터포털](https://www.data.go.kr) 회원가입
2. 마이페이지 → 오픈API → 활용신청
3. "근로복지공단_산재보험 지정의료기관 현황정보" 검색 및 신청
4. **승인 후 발급받은 실제 인증키 사용** (위 참고키는 테스트용)

---

## 📋 API 엔드포인트 목록

| 연도 | 엔드포인트 ID | 설명 | 데이터 기간 |
|------|---------------|------|-------------|
| 2017 | `uddi:d9ecddd6-d2c4-4e54-8a1c-da36aeeaecc5_201906131805` | 2017년 말 기준 지정의료기관 | ~2017.12.31 |
| 2015 | `uddi:9bb8bac7-eb16-4fe5-9a12-b9132cbb167a_201906131804` | 2015년 말 기준 지정의료기관 | ~2015.12.31 |
| 2013 | `uddi:0f0f344d-0d3e-4bc1-84ab-d40eff6facf7_201906131801` | 2013년 말 기준 지정의료기관 | ~2013.12.31 |

---

## 🏥 주요 API: 2017년 데이터 (권장)

### 엔드포인트
```
GET https://api.odcloud.kr/api/3044320/v1/uddi:d9ecddd6-d2c4-4e54-8a1c-da36aeeaecc5_201906131805
```

### 쿼리 파라미터

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|----------|------|------|--------|------|
| `page` | integer | ❌ | 1 | 페이지 번호 |
| `perPage` | integer | ❌ | 10 | 페이지당 항목 수 (최대 100) |
| `returnType` | string | ❌ | JSON | 응답 형식 (JSON/XML) |

### 요청 예시

```bash
curl -X GET \
  "https://api.odcloud.kr/api/3044320/v1/uddi:d9ecddd6-d2c4-4e54-8a1c-da36aeeaecc5_201906131805?page=1&perPage=10&returnType=JSON" \
  -H "Authorization: YOUR_API_KEY"
```

### 응답 형식 (JSON)

```json
{
  "page": 1,
  "perPage": 5,
  "totalCount": 5216,
  "currentCount": 5,
  "matchCount": 5216,
  "data": [
    {
      "연도": 2017,
      "의료기관명": "서울 중구 필동 굿모닝병원 진료부 346 (광화문)",
      "우편번호": "10302",
      "소재지": "(서울특별시 중구) 중구 필동 굿모닝병원 진료부",
      "연락처": "031-922-7575"
    }
  ]
}
```

**📊 실제 테스트 결과**: 총 5,216개의 산재 지정 의료기관 데이터가 존재합니다.
**⚠️ 주의**: 터미널에서 확인 시 한글이 깨져 보일 수 있지만, 실제 애플리케이션에서는 정상 표시됩니다.

### 응답 필드 설명

| 필드명 | 타입 | 설명 | 예시 |
|--------|------|------|------|
| `연도` | integer | 데이터 기준 연도 | 2017 |
| `의료기관명` | string | 병원/의원 이름 | "서울대학교병원" |
| `우편번호` | string | 5자리 우편번호 | "03080" |
| `소재지` | string | 전체 주소 | "서울특별시 종로구 대학로 101" |
| `연락처` | string | 전화번호 | "02-2072-0000" |

---

## 📊 기타 연도별 API들

### 2015년 데이터
```
GET https://api.odcloud.kr/api/3044320/v1/uddi:9bb8bac7-eb16-4fe5-9a12-b9132cbb167a_201906131804
```

**응답 구조**: 2017년 API와 동일 (연도 필드만 2015)

### 2013년 데이터
```
GET https://api.odcloud.kr/api/3044320/v1/uddi:0f0f344d-0d3e-4bc1-84ab-d40eff6facf7_201906131801
```

**응답 구조**: 2017년 API와 동일 (연도 필드만 2013)

---

## ⚠️ API 사용 제한 및 주의사항

### 호출 제한
- **일일 제한**: API Key별 최대 호출 횟수 제한
- **속도 제한**: 초당 요청 수 제한 가능
- **페이지네이션**: 대량 데이터의 경우 필수 사용

### 데이터 특성
- **정적 데이터**: 지정 시점 기준의 과거 데이터
- **커버리지**: 전국 산재 지정 의료기관
- **업데이트**: 연 1회 (12월 말 기준)
- **포맷**: 주소 정보는 행정구역 기준

### 에러 코드

| HTTP 상태 | 설명 |
|-----------|------|
| `200` | 성공 |
| `401` | 인증 실패 (API Key 오류) |
| `500` | 서버 오류 |

---

## 🔧 개발 가이드

### 1. API Key 환경변수 설정
```bash
# .env.local
NEXT_PUBLIC_DATA_KR_API_KEY=your_api_key_here

# 참고용 인증키 (실제 사용 시 포털에서 발급받은 키로 교체)
# NEXT_PUBLIC_DATA_KR_API_KEY=aba6428813f7272c3d7a7918ec194233d0862839e5d1df1df223f03e1d01592a
```

### 2. API 클라이언트 구현 예시 (TypeScript)
```typescript
interface HospitalData {
  연도: number;
  의료기관명: string;
  우편번호: string;
  소재지: string;
  연락처: string;
}

interface ApiResponse {
  page: number;
  perPage: number;
  totalCount: number;
  currentCount: number;
  matchCount: number;
  data: HospitalData[];
}

export async function fetchHospitals(page = 1, perPage = 10): Promise<ApiResponse> {
  const apiKey = process.env.NEXT_PUBLIC_DATA_KR_API_KEY;
  const baseUrl = 'https://api.odcloud.kr/api/3044320/v1';
  const endpoint = 'uddi:d9ecddd6-d2c4-4e54-8a1c-da36aeeaecc5_201906131805';

  const response = await fetch(
    `${baseUrl}/${endpoint}?page=${page}&perPage=${perPage}&returnType=JSON`,
    {
      headers: {
        'Authorization': apiKey,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`API 호출 실패: ${response.status}`);
  }

  return response.json();
}
```

### 3. 데이터 변환 및 캐싱 로직
```typescript
// API 데이터를 프로젝트 포맷으로 변환
export function transformHospitalData(apiData: HospitalData[]): Hospital[] {
  return apiData.map(item => ({
    id: generateUUID(),
    name: item.의료기관명,
    type: 'hospital' as const, // 'hospital' | 'pharmacy'
    address: item.소재지,
    latitude: 0, // 주소 → 좌표 변환 필요
    longitude: 0, // 주소 → 좌표 변환 필요
    phone: item.연락처,
    department: null, // API에 진료과 정보 없음
    last_updated: new Date(),
  }));
}
```

---

## 📚 참고 자료

- **공식 문서**: [공공데이터포털 OpenAPI](https://www.data.go.kr)
- **Swagger 문서**: [API 상세 스펙](https://infuser.odcloud.kr/oas/docs?namespace=3044320/v1)
- **활용 신청**: 마이페이지 → 오픈API → 활용신청

---

## 🎯 프로젝트 적용 계획

### Phase 1.2: 병원 찾기 기능 구현
- [ ] API 키 발급 및 환경변수 설정
- [ ] API 클라이언트 함수 구현
- [ ] 데이터 변환 로직 구현
- [ ] Supabase 캐시 저장 로직
- [ ] 지도 연동 및 마커 표시
- [ ] 위치 기반 검색 기능

### 향후 개선사항
- **실시간 데이터**: 최신 지정의료기관 정보 확보
- **세부 정보**: 진료과목, 진료시간 등 추가 데이터
- **지도 연동**: 네이버/카카오 지도 API와의 통합
