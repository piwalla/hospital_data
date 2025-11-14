# 테스트 가이드

이 문서는 리워크케어 프로젝트의 주요 기능을 테스트하는 방법을 안내합니다.

## 1. API 클라이언트 테스트

### 테스트 엔드포인트
```
GET /api/hospitals/test
```

### 실행 방법
1. 개발 서버 실행:
   ```bash
   pnpm dev
   ```

2. 브라우저에서 접속:
   ```
   http://localhost:3000/api/hospitals/test
   ```

### 예상 결과
```json
{
  "success": true,
  "message": "API 클라이언트 테스트 성공",
  "data": {
    "totalCount": 5216,
    "currentCount": 5,
    "sample": [...]
  }
}
```

---

## 2. 데이터 동기화 테스트

### 동기화 API 엔드포인트
```
POST /api/hospitals/sync?maxPages=1&useGeocoding=false
```

### 파라미터
- `maxPages`: 조회할 최대 페이지 수 (기본값: 10)
- `useGeocoding`: Geocoding 사용 여부 (기본값: true)

### 실행 방법

#### 방법 1: curl 사용
```bash
# Geocoding 없이 테스트 (빠름)
curl -X POST "http://localhost:3000/api/hospitals/sync?maxPages=1&useGeocoding=false"

# Geocoding 포함 테스트 (느림, API 호출량 많음)
curl -X POST "http://localhost:3000/api/hospitals/sync?maxPages=1&useGeocoding=true"
```

#### 방법 2: 브라우저에서 직접 호출
```
http://localhost:3000/api/hospitals/sync?maxPages=1&useGeocoding=false
```

#### 방법 3: Postman 또는 Thunder Client 사용
- Method: `POST`
- URL: `http://localhost:3000/api/hospitals/sync?maxPages=1&useGeocoding=false`

### 예상 결과
```json
{
  "success": true,
  "message": "병원 데이터 동기화 완료",
  "savedCount": 100,
  "useGeocoding": false
}
```

### 주의사항
- **Geocoding 사용 시**: API 호출량이 많아 시간이 오래 걸립니다 (주소당 약 150ms 딜레이)
- **테스트 권장**: 처음에는 `useGeocoding=false`로 테스트하고, 정상 작동 확인 후 `useGeocoding=true`로 진행
- **전체 데이터 동기화**: `maxPages=53` (전체 5,216개 데이터, 페이지당 100개)

---

## 3. Geocoding API 테스트

### 개별 테스트
Geocoding은 데이터 동기화 과정에서 자동으로 실행됩니다.

### 수동 테스트 (개발자 콘솔)
```typescript
import { getGeocodingClient } from '@/lib/api/geocoding';

const client = getGeocodingClient();
const result = await client.geocode('서울특별시 중구 세종대로 110');
console.log(result); // { latitude: 37.5666, longitude: 126.9784 }
```

---

## 4. 지도 컴포넌트 테스트

### 접속
```
http://localhost:3000/hospitals
```

### 확인 사항
1. **지도 로드**: 네이버 지도가 정상적으로 표시되는지 확인
2. **위치 권한**: 브라우저에서 위치 권한 요청이 나타나는지 확인
3. **병원 마커**: 데이터가 있다면 병원 마커가 표시되는지 확인
4. **반응형 레이아웃**:
   - 모바일: 지도가 상단, 목록이 하단
   - 데스크톱: 목록이 좌측, 지도가 우측

### 문제 해결

#### 지도가 표시되지 않는 경우
1. 브라우저 콘솔에서 에러 확인
2. `.env` 파일에 `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID`가 설정되어 있는지 확인
3. 네이버 클라우드 플랫폼 콘솔에서 도메인 등록 확인 (`localhost:3000`)

#### 위치 권한 거부 시
- 기본 위치(서울시청)로 지도가 표시됩니다
- 정상 동작입니다

---

## 5. 전체 테스트 시나리오

### 시나리오 1: 처음부터 끝까지 (소량 데이터)
```bash
# 1. API 테스트
curl http://localhost:3000/api/hospitals/test

# 2. 데이터 동기화 (Geocoding 없이)
curl -X POST "http://localhost:3000/api/hospitals/sync?maxPages=1&useGeocoding=false"

# 3. 브라우저에서 지도 확인
# http://localhost:3000/hospitals
```

### 시나리오 2: Geocoding 포함 테스트
```bash
# 1. 데이터 동기화 (Geocoding 포함, 1페이지만)
curl -X POST "http://localhost:3000/api/hospitals/sync?maxPages=1&useGeocoding=true"

# 2. 브라우저에서 지도 확인 (마커가 표시되어야 함)
# http://localhost:3000/hospitals
```

### 시나리오 3: 전체 데이터 동기화 (주의: 시간 오래 걸림)
```bash
# Geocoding 없이 전체 동기화
curl -X POST "http://localhost:3000/api/hospitals/sync?maxPages=53&useGeocoding=false"

# 또는 Geocoding 포함 (매우 오래 걸림, API 호출량 많음)
curl -X POST "http://localhost:3000/api/hospitals/sync?maxPages=53&useGeocoding=true"
```

---

## 6. 환경변수 확인

테스트 전 다음 환경변수가 설정되어 있는지 확인하세요:

```env
# 공공데이터포털 API
TOUR_API_KEY=aba6428813f7272c3d7a7918ec194233d0862839e5d1df1df223f03e1d01592a

# 네이버 지도 API
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=892s22du59
NAVER_MAP_CLIENT_SECRET=SjeYD7PTrwibiQidxKSqIIcivLFBwiHdkJbY5LT0

# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

---

## 7. 로그 확인

모든 주요 작업은 콘솔에 로그를 남깁니다:

- `[API]`: API 호출 관련
- `[Sync]`: 데이터 동기화 관련
- `[Geocoding]`: Geocoding 관련
- `[Cache]`: Supabase 캐싱 관련
- `[HospitalMap]`: 지도 컴포넌트 관련

개발 서버 콘솔과 브라우저 개발자 도구 콘솔을 모두 확인하세요.

