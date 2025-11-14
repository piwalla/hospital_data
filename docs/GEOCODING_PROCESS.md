# Geocoding 프로세스 문서

이 문서는 병원 데이터의 주소를 위도/경도 좌표로 변환하는 전체 프로세스를 설명합니다.

---

## 📋 개요

**목표**: CSV 파일에 있는 병원 주소를 Geocoding API를 사용하여 위도/경도 좌표로 변환하고 Supabase에 저장

**최종 결과**:
- 총 데이터: 6,101개
- Geocoding 성공: 6,071개
- Geocoding 실패: 30개
- **성공률: 99.51%**

---

## 🔄 전체 프로세스

### 1단계: CSV 데이터 Import (주소만 저장)

**목적**: CSV 파일에서 병원 데이터를 읽어서 주소 정보만 Supabase에 저장 (좌표는 0으로 설정)

**API 엔드포인트**: `POST /api/hospitals/import-csv`

**사용 파일**:
- `app/api/hospitals/import-csv/route.ts`
- `public/hospital_data.csv`

**주요 기능**:

1. **CSV 파일 읽기 및 인코딩 처리**
   ```typescript
   // 여러 인코딩 시도 (EUC-KR 우선, 한국 CSV 파일은 보통 EUC-KR)
   const encodings = ['euc-kr', 'cp949', 'utf-8'];
   // 한글 문자 개수를 확인하여 가장 적합한 인코딩 선택
   ```

2. **CSV 파싱**
   - 헤더 기반 동적 컬럼 매핑
   - 따옴표로 감싸진 값 처리
   - 필수 컬럼: `name`, `address`
   - 선택 컬럼: `type`, `phone`, `department`

3. **Supabase 저장**
   - 중복 체크 (이름 + 주소)
   - 기존 데이터는 업데이트, 새 데이터는 삽입
   - 좌표는 0으로 설정 (나중에 Geocoding으로 업데이트)

**사용 예시**:
```bash
# 전체 데이터 Import
POST http://localhost:3000/api/hospitals/import-csv?filename=hospital_data.csv

# 테스트 모드 (처음 10개만)
POST http://localhost:3000/api/hospitals/import-csv?filename=hospital_data.csv&test=true&limit=10
```

**결과**:
- 총 6,101개 병원 데이터 저장 완료
- 좌표는 모두 0,0으로 설정 (Geocoding 대기 상태)

---

### 2단계: 네이버 Geocoding API로 좌표 변환

**목적**: Supabase에 저장된 주소를 네이버 Maps Geocoding API로 위도/경도로 변환

**API 엔드포인트**: `POST /api/hospitals/geocode-batch`

**사용 파일**:
- `lib/api/geocoding.ts` (네이버 Geocoding 클라이언트)
- `app/api/hospitals/geocode-batch/route.ts` (배치 처리 API)

**네이버 Maps Geocoding API**:
- **Base URL**: `https://maps.apigw.ntruss.com/map-geocode/v2/geocode`
- **인증**: `X-NCP-APIGW-API-KEY-ID`, `X-NCP-APIGW-API-KEY` 헤더
- **요청 파라미터**: `query` (주소)
- **응답 형식**: JSON

**주요 기능**:

1. **좌표가 없는 데이터 조회**
   ```sql
   SELECT id, name, address
   FROM hospitals_pharmacies
   WHERE latitude = 0 AND longitude = 0
   LIMIT 100
   ```

2. **Geocoding 수행**
   - 각 주소를 네이버 API로 변환
   - API 부하 방지를 위해 150ms 딜레이
   - 성공 시 좌표를 Supabase에 업데이트

3. **에러 처리**
   - API 에러 로깅
   - 실패한 주소는 다음 단계(VWorld)에서 재시도

**사용 예시**:
```bash
# 100개씩 배치 처리
POST http://localhost:3000/api/hospitals/geocode-batch?limit=100&delayMs=150
```

**결과**:
- 처리: 6,101개
- 성공: 6,048개 (99.13%)
- 실패: 53개

**실패 원인**:
- 주소 형식 불완전 (병원명 포함, 주소 중복 등)
- 리(里) 단위 주소 (도로명 주소가 아님)
- 복잡한 층/호수 정보

---

### 3단계: VWorld Geocoding API로 실패한 주소 재시도

**목적**: 네이버 API로 실패한 주소를 VWorld API로 재시도

**API 엔드포인트**: `POST /api/hospitals/geocode-vworld`

**사용 파일**:
- `lib/api/geocoding-vworld.ts` (VWorld Geocoding 클라이언트)
- `app/api/hospitals/geocode-vworld/route.ts` (재시도 API)

**VWorld Geocoding API**:
- **Base URL**: `http://api.vworld.kr/req/address`
- **인증**: `key` 쿼리 파라미터
- **요청 파라미터**:
  - `service`: "address"
  - `request`: "getcoord"
  - `version`: "2.0"
  - `crs`: "epsg:4326" (WGS84 좌표계)
  - `address`: 변환할 주소
  - `refine`: "true" (주소 정제)
  - `format`: "json"
  - `type`: "road" (도로명 주소 우선)
- **무료 할당량**: 월 40,000건

**주요 기능**:

1. **실패한 데이터만 조회**
   - 네이버 API로 실패한 주소만 VWorld로 재시도
   - 이미 성공한 데이터는 건드리지 않음

2. **Geocoding 재시도**
   - VWorld API로 주소 변환 시도
   - 성공 시 좌표 업데이트

**사용 예시**:
```bash
# 실패한 주소 재시도
POST http://localhost:3000/api/hospitals/geocode-vworld?limit=100&delayMs=100
```

**결과**:
- 처리: 53개 (네이버에서 실패한 주소)
- 성공: 23개 (추가 성공)
- 실패: 30개 (최종 실패)

**최종 통계**:
- 네이버 API 성공: 6,048개
- VWorld API 추가 성공: 23개
- **총 성공: 6,071개 / 6,101개 (99.51%)**

---

## 🛠️ 기술적 세부사항

### CSV 인코딩 처리

**문제**: CSV 파일이 EUC-KR/CP949 인코딩으로 저장되어 있어 한글이 깨짐

**해결 방법**:
```typescript
// 여러 인코딩 시도
const encodings = ['euc-kr', 'cp949', 'utf-8'];
let bestContent = '';
let bestKoreanCount = 0;

for (const encoding of encodings) {
  const decoded = iconv.decode(buffer, encoding);
  const koreanCount = (decoded.match(/[가-힣]/g) || []).length;
  
  if (koreanCount > bestKoreanCount) {
    bestContent = decoded;
    bestEncoding = encoding;
    bestKoreanCount = koreanCount;
  }
}
```

**결과**: 한글 문자 개수가 가장 많은 인코딩을 자동 선택

### Geocoding API 비교

| API | 무료 할당량 | 정확도 | 한국 주소 최적화 | 비용 |
|-----|------------|--------|-----------------|------|
| 네이버 Maps API | 제한 없음 (유료 전환) | 높음 | ⭐⭐⭐⭐⭐ | 유료 |
| VWorld API | 월 40,000건 | 높음 | ⭐⭐⭐⭐⭐ | 무료 |

**전략**: 네이버 API를 먼저 시도하고, 실패한 주소만 VWorld API로 재시도

### 배치 처리 최적화

**문제**: 6,000개 이상의 주소를 한 번에 처리하면 시간이 오래 걸림

**해결 방법**:
1. **배치 단위 처리**: 100개씩 나누어 처리
2. **API 딜레이**: 네이버 150ms, VWorld 100ms
3. **자동 재시도**: 실패한 주소만 별도 API로 재시도

**예상 소요 시간**:
- 네이버 API: 6,101개 × 150ms = 약 15분
- VWorld API: 53개 × 100ms = 약 5초

---

## 📊 처리 결과

### 최종 통계

```
총 데이터: 6,101개
├─ Geocoding 성공: 6,071개 (99.51%)
│  ├─ 네이버 API: 6,048개
│  └─ VWorld API: 23개
└─ Geocoding 실패: 30개 (0.49%)
```

### 실패 원인 분석

1. **리(里) 단위 주소** (12개)
   - 예: "도계읍 전두1리 1반"
   - 문제: 도로명 주소가 아닌 지번 주소만 있음

2. **주소 정보 중복** (8개)
   - 예: "서울 금천구 시흥동 서울특별시 금천구 가산동"
   - 문제: 같은 정보가 중복되어 있음

3. **병원명/건물명 포함** (7개)
   - 예: "서울 동작구 신대방2동 시립보라매병원"
   - 문제: 주소에 병원명이나 건물명이 포함됨

4. **복잡한 층/호수 정보** (3개)
   - 예: "3층(301~304호), 4층~6층전체호"
   - 문제: 층 정보가 복잡함

**상세 리스트**: `docs/failed_hospitals_list.md` 참고

---

## 🔧 사용 방법

### 자동 스크립트 실행

**전체 프로세스 자동 실행**:
```bash
node scripts/run-import.js
```

이 스크립트는 다음을 자동으로 수행합니다:
1. CSV 데이터 Import (주소만 저장)
2. 네이버 Geocoding 배치 처리 (100개씩 반복)
3. VWorld Geocoding 재시도 (실패한 주소만)

### 단계별 수동 실행

**1단계: CSV Import**
```bash
POST http://localhost:3000/api/hospitals/import-csv?filename=hospital_data.csv
```

**2단계: 네이버 Geocoding**
```bash
# 100개씩 배치 처리 (반복 실행)
POST http://localhost:3000/api/hospitals/geocode-batch?limit=100&delayMs=150
```

**3단계: VWorld Geocoding (선택사항)**
```bash
# 실패한 주소만 재시도
POST http://localhost:3000/api/hospitals/geocode-vworld?limit=100&delayMs=100
```

### 테스트 모드

**작은 샘플로 테스트**:
```bash
# 10개만 Import
POST http://localhost:3000/api/hospitals/import-csv?filename=hospital_data.csv&test=true&limit=10

# 10개만 Geocoding
POST http://localhost:3000/api/hospitals/geocode-batch?limit=10&delayMs=150
```

---

## 🔍 검증 및 디버깅

### 데이터베이스 상태 확인

**API 엔드포인트**: `GET /api/hospitals/check`

**응답 예시**:
```json
{
  "success": true,
  "summary": {
    "totalCount": 6101,
    "validCoordinatesCount": 6071,
    "invalidCoordinatesCount": 30,
    "koreaRegionCount": 6071
  }
}
```

### Geocoding 결과 검증

**API 엔드포인트**: `GET /api/hospitals/verify-geocoding?limit=10`

**검증 항목**:
- 좌표가 0,0이 아닌지 확인
- 좌표가 한국 지역 내에 있는지 확인 (위도: 33-43, 경도: 124-132)
- 샘플 데이터 반환

---

## 📝 주요 파일 목록

### API 엔드포인트
- `app/api/hospitals/import-csv/route.ts` - CSV Import
- `app/api/hospitals/geocode-batch/route.ts` - 네이버 Geocoding 배치 처리
- `app/api/hospitals/geocode-vworld/route.ts` - VWorld Geocoding 재시도
- `app/api/hospitals/verify-geocoding/route.ts` - Geocoding 결과 검증
- `app/api/hospitals/check/route.ts` - 데이터베이스 상태 확인

### Geocoding 클라이언트
- `lib/api/geocoding.ts` - 네이버 Maps Geocoding 클라이언트
- `lib/api/geocoding-vworld.ts` - VWorld Geocoding 클라이언트

### 유틸리티
- `lib/utils/distance.ts` - 거리 계산 함수 (Haversine 공식)

### 스크립트
- `scripts/run-import.js` - 전체 프로세스 자동 실행
- `scripts/test-10-samples.js` - 10개 샘플 테스트
- `scripts/geocode-vworld-remaining.js` - VWorld 재시도 스크립트

---

## ⚠️ 주의사항

### API 키 관리

**네이버 Maps API**:
- `.env` 파일에 `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID`, `NAVER_MAP_CLIENT_SECRET` 설정
- 유료 서비스이므로 사용량 모니터링 필요

**VWorld API**:
- `.env` 파일에 `VWORLD_API_KEY` 설정
- 무료 할당량: 월 40,000건
- 초과 시 다음 달까지 대기

### 성능 고려사항

1. **API Rate Limit**: 네이버 API는 초당 요청 수 제한이 있을 수 있음
2. **딜레이 설정**: API 부하 방지를 위해 적절한 딜레이 필요 (150ms 권장)
3. **배치 크기**: 한 번에 처리할 데이터 수 조절 (100개 권장)

### 데이터 정확성

- 주소가 정확하지 않으면 Geocoding 실패 가능
- 실패한 주소는 수동 검증 필요
- 전화번호로 직접 확인 가능 (모든 병원에 전화번호 있음)

---

## 🎯 향후 개선 방안

1. **주소 정제 로직 추가**
   - 병원명/건물명 자동 제거
   - 중복 주소 정보 정제
   - 도로명 주소로 변환

2. **다중 API 폴백 전략**
   - 네이버 → VWorld → OpenStreetMap 순서로 시도
   - 각 API의 특성에 맞는 주소 형식으로 변환

3. **수동 검증 도구**
   - 실패한 주소를 관리자 페이지에서 수동으로 입력
   - 주소 검증 및 좌표 확인 UI

---

## 📚 참고 문서

- [공공데이터포털 API 문서](docs/api-data-kr.md)
- [네이버 Maps API 문서](docs/naver-maps-api.md)
- [Geocoding API 옵션 비교](docs/GEOCODING_OPTIONS.md)
- [실패한 병원 리스트](docs/failed_hospitals_list.md)

---

**작성일**: 2025-01-XX  
**최종 업데이트**: 2025-01-XX  
**작성자**: AI Assistant


