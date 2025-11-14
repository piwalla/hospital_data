# 데이터베이스 상태 확인 가이드

## 문제 진단

반경 30km로 검색했는데도 병원이 나오지 않는 경우, 다음을 확인해야 합니다:

1. **데이터베이스에 데이터가 있는지**
2. **병원 데이터의 좌표가 유효한지** (0,0이 아닌지)
3. **API로 검색이 가능한지**

## 확인 방법

### 1. 데이터베이스 상태 확인 API 호출

브라우저에서 다음 URL을 열거나, 터미널에서 curl로 확인:

```bash
# 브라우저에서
http://localhost:3000/api/hospitals/check

# 또는 curl로
curl http://localhost:3000/api/hospitals/check
```

응답 예시:
```json
{
  "success": true,
  "summary": {
    "totalCount": 100,
    "validCoordinatesCount": 50,
    "invalidCoordinatesCount": 50,
    "koreaRegionCount": 50
  },
  "sampleData": [...],
  "message": {
    "hasData": true,
    "hasValidCoordinates": true,
    "needsGeocoding": true
  }
}
```

### 2. 문제 원인별 해결 방법

#### 문제 1: 데이터베이스에 데이터가 없음 (`totalCount: 0`)

**해결 방법**: API 동기화 실행

```bash
# 브라우저에서
POST http://localhost:3000/api/hospitals/sync?maxPages=1&useGeocoding=false

# 또는 curl로
curl -X POST "http://localhost:3000/api/hospitals/sync?maxPages=1&useGeocoding=false"
```

#### 문제 2: 좌표가 모두 0,0 (`validCoordinatesCount: 0`)

**원인**: Geocoding이 실행되지 않았거나 실패함

**해결 방법 1**: Geocoding 포함 동기화 (시간이 오래 걸림)

```bash
# 주의: 시간이 오래 걸립니다 (주소당 약 150ms)
POST http://localhost:3000/api/hospitals/sync?maxPages=1&useGeocoding=true
```

**해결 방법 2**: 엑셀 파일로 좌표 데이터 직접 입력 (권장)

엑셀 파일에 다음 컬럼이 있으면:
- 병원명
- 주소
- 위도 (latitude)
- 경도 (longitude)
- 전화번호 (선택)
- 진료과목 (선택)

이 데이터를 Supabase에 직접 입력하는 것이 더 빠르고 정확합니다.

#### 문제 3: 좌표가 한국 영역 밖 (`koreaRegionCount: 0`)

**원인**: 좌표가 잘못 입력되었거나 다른 국가 좌표

**해결 방법**: 좌표 데이터 확인 및 수정

## 엑셀 파일로 데이터 입력하는 방법

### 장점
1. ✅ **정확성**: 수동으로 검증된 좌표 사용
2. ✅ **속도**: Geocoding API 호출 불필요
3. ✅ **비용**: API 호출 비용 절감
4. ✅ **신뢰성**: 공공데이터와 직접 매칭 가능

### 단계

1. **엑셀 파일 준비**
   - 컬럼: `name`, `address`, `latitude`, `longitude`, `phone`, `department`, `type`
   - CSV 형식으로 저장

2. **Supabase에 업로드**
   - Supabase Dashboard → Table Editor → `hospitals_pharmacies`
   - Import Data → CSV 파일 선택
   - 또는 SQL로 직접 INSERT

3. **SQL 예시** (엑셀 데이터를 SQL로 변환)

```sql
INSERT INTO public.hospitals_pharmacies (name, type, address, latitude, longitude, phone, department)
VALUES
  ('서울대학교병원', 'hospital', '서울특별시 종로구 대학로 101', 37.5666, 126.9784, '02-2072-2114', '정형외과'),
  ('세브란스병원', 'hospital', '서울특별시 서대문구 연세로 50-1', 37.5625, 126.9386, '02-2228-5800', '신경외과');
```

## API로 검색 가능 여부 확인

### 테스트 방법

```bash
# 서울시청 좌표 기준 30km 반경 검색
curl "http://localhost:3000/api/hospitals/nearby?latitude=37.5666&longitude=126.9784&radiusKm=30"
```

응답이 빈 배열이면:
- 데이터베이스에 데이터가 없거나
- 좌표가 0,0이거나
- 해당 반경 내에 실제로 병원이 없을 수 있습니다.

## 권장 사항

**엑셀 파일로 데이터 입력을 권장합니다:**

1. 공공데이터포털에서 산재 지정 의료기관 목록 다운로드
2. 각 병원의 정확한 좌표를 확인 (네이버 지도, 구글 지도 등)
3. 엑셀에 정리 후 Supabase에 일괄 입력
4. 이 방법이 더 정확하고 빠릅니다


