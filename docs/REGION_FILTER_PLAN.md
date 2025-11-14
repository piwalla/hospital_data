# 지역 선택 필터 기능 구현 계획

## 📋 개요

현재는 사용자의 현재 위치 기반으로만 병원/재활기관을 검색하고 있습니다. 이 기능을 확장하여 **시/도, 시/군/구 단위로 지역을 선택**하여 검색할 수 있도록 합니다.

**목표**: 사용자가 특정 지역을 선택하면 해당 지역 내의 모든 병원/재활기관을 표시

---

## 🎯 기능 요구사항

### 1. 지역 선택 UI
- **시/도 선택**: 드롭다운 또는 버튼 그룹
- **시/군/구 선택**: 선택한 시/도에 따라 동적으로 표시
  - 일반 시/군: 시/군 단위 선택
  - 광역시: 구 단위까지 선택 가능
- **검색 모드 전환**: "내 위치 주변" vs "지역 선택" 토글

### 2. 지원 지역 구조
```
서울특별시 (광역시)
  ├─ 강남구
  ├─ 강동구
  ├─ 강북구
  └─ ... (25개 구)

부산광역시 (광역시)
  ├─ 중구
  ├─ 서구
  └─ ... (16개 구)

경기도
  ├─ 수원시
  │   ├─ 영통구
  │   ├─ 팔달구
  │   └─ ...
  ├─ 성남시
  └─ ... (31개 시/군)

충청남도
  ├─ 천안시
  │   ├─ 동남구
  │   └─ 서북구
  ├─ 아산시
  └─ ... (15개 시/군)
```

### 3. 데이터 구조
- **광역시**: 서울, 부산, 대구, 인천, 광주, 대전, 울산 (7개)
- **특별시/광역시**: 구 단위 선택
- **일반 시/도**: 시/군 단위 선택
- **세종특별자치시**: 구 없음 (시 단위만)

---

## 📐 구현 계획

### Phase 1: 지역 데이터 구조 정의 (30분)

#### 1.1 지역 데이터 타입 정의
**파일**: `lib/types/region.ts` (새로 생성)

```typescript
export interface Region {
  code: string; // 행정구역 코드 (예: "11" = 서울)
  name: string; // 시/도 이름
  type: 'metropolitan' | 'province' | 'special'; // 광역시, 일반 도, 특별시
  districts?: District[]; // 시/군/구 목록
}

export interface District {
  code: string; // 시/군/구 코드
  name: string; // 시/군/구 이름
  type: 'city' | 'county' | 'gu'; // 시, 군, 구
  subDistricts?: SubDistrict[]; // 구 목록 (시의 경우)
}

export interface SubDistrict {
  code: string; // 구 코드
  name: string; // 구 이름
}

// 주요 광역시 목록
export const METROPOLITAN_CITIES = [
  { code: '11', name: '서울특별시', type: 'metropolitan' },
  { code: '26', name: '부산광역시', type: 'metropolitan' },
  { code: '27', name: '대구광역시', type: 'metropolitan' },
  { code: '28', name: '인천광역시', type: 'metropolitan' },
  { code: '29', name: '광주광역시', type: 'metropolitan' },
  { code: '30', name: '대전광역시', type: 'metropolitan' },
  { code: '31', name: '울산광역시', type: 'metropolitan' },
];

// 시/도 목록 (전체)
export const PROVINCES = [
  ...METROPOLITAN_CITIES,
  { code: '41', name: '경기도', type: 'province' },
  { code: '42', name: '강원도', type: 'province' },
  { code: '43', name: '충청북도', type: 'province' },
  { code: '44', name: '충청남도', type: 'province' },
  { code: '45', name: '전라북도', type: 'province' },
  { code: '46', name: '전라남도', type: 'province' },
  { code: '47', name: '경상북도', type: 'province' },
  { code: '48', name: '경상남도', type: 'province' },
  { code: '50', name: '제주특별자치도', type: 'special' },
  { code: '36', name: '세종특별자치시', type: 'special' },
];
```

#### 1.2 시/군/구 데이터 정의
**파일**: `lib/data/korean-regions.ts` (새로 생성)

- 한국의 모든 시/도, 시/군/구 데이터를 포함
- 광역시의 경우 구 목록 포함
- 일반 시의 경우 구가 있으면 구 목록 포함 (예: 수원시 영통구)

**데이터 소스**: 
- 공공데이터포털 행정구역 코드 API 활용
- 또는 정적 데이터 파일 (JSON)

---

### Phase 2: 지역 선택 UI 컴포넌트 (1-2시간)

#### 2.1 검색 모드 선택 UI
**위치**: `app/hospitals/page-client.tsx`

```typescript
type SearchMode = 'location' | 'region'; // 내 위치 주변 vs 지역 선택

const [searchMode, setSearchMode] = useState<SearchMode>('location');
```

**UI 구성**:
- 라디오 버튼 또는 토글 스위치
  - "내 위치 주변" (기본값)
  - "지역 선택"

#### 2.2 지역 선택 컴포넌트
**파일**: `components/RegionSelector.tsx` (새로 생성)

**기능**:
1. 시/도 선택 드롭다운
2. 선택한 시/도에 따라 시/군/구 목록 표시
3. 광역시인 경우 구 선택 드롭다운 추가 표시
4. 선택한 지역 표시 (예: "서울특별시 강남구")

**UI 디자인**:
```
[검색 모드 선택]
○ 내 위치 주변  ● 지역 선택

[지역 선택]
시/도: [서울특별시 ▼]
시/군/구: [강남구 ▼]  (광역시인 경우만 표시)
```

#### 2.3 지역 선택 상태 관리
```typescript
interface RegionSelection {
  provinceCode: string | null; // 시/도 코드
  districtCode: string | null; // 시/군/구 코드
  subDistrictCode: string | null; // 구 코드 (광역시)
}

const [selectedRegion, setSelectedRegion] = useState<RegionSelection>({
  provinceCode: null,
  districtCode: null,
  subDistrictCode: null,
});
```

---

### Phase 3: 지역 기반 필터링 로직 (2-3시간)

#### 3.1 주소 파싱 유틸리티
**파일**: `lib/utils/address-parser.ts` (새로 생성)

**기능**:
- 병원/재활기관 주소에서 시/도, 시/군/구 추출
- 다양한 주소 형식 지원
  - "서울특별시 강남구 테헤란로 123"
  - "경기도 수원시 영통구 월드컵로 456"
  - "부산광역시 해운대구 해운대해변로 789"

```typescript
export function parseAddress(address: string): {
  province: string | null;
  district: string | null;
  subDistrict: string | null;
} {
  // 주소 파싱 로직
  // 정규표현식 또는 주소 데이터베이스 활용
}
```

#### 3.2 지역 필터링 함수
**파일**: `lib/api/hospitals.ts` 수정

```typescript
export async function getHospitalsByRegion(
  provinceCode: string,
  districtCode?: string,
  subDistrictCode?: string
): Promise<Hospital[]> {
  // Supabase에서 주소 기반 필터링
  // LIKE 쿼리 또는 정규표현식 활용
}
```

**Supabase 쿼리 예시**:
```sql
-- 시/도만 선택한 경우
SELECT * FROM hospitals_pharmacies 
WHERE address LIKE '%서울특별시%';

-- 시/군/구까지 선택한 경우
SELECT * FROM hospitals_pharmacies 
WHERE address LIKE '%서울특별시%' 
  AND address LIKE '%강남구%';

-- 구까지 선택한 경우 (광역시)
SELECT * FROM hospitals_pharmacies 
WHERE address LIKE '%서울특별시%' 
  AND address LIKE '%강남구%';
```

#### 3.3 재활기관 지역 필터링
**파일**: `lib/api/rehabilitation-centers.ts` 수정

```typescript
export async function getRehabilitationCentersByRegion(
  provinceCode: string,
  districtCode?: string,
  subDistrictCode?: string
): Promise<RehabilitationCenter[]> {
  // 재활기관도 동일한 로직으로 필터링
}
```

---

### Phase 4: UI 통합 및 상태 관리 (1-2시간)

#### 4.1 검색 모드에 따른 필터링 로직 통합
**파일**: `app/hospitals/page-client.tsx` 수정

```typescript
const fetchData = async () => {
  if (searchMode === 'location') {
    // 기존 위치 기반 검색
    const [hospitals, centers] = await Promise.all([
      fetchNearbyHospitals(userLocation.lat, userLocation.lng, radiusKm),
      fetchNearbyRehabilitationCenters(userLocation.lat, userLocation.lng, radiusKm),
    ]);
  } else {
    // 지역 선택 기반 검색
    const [hospitals, centers] = await Promise.all([
      fetchHospitalsByRegion(selectedRegion),
      fetchRehabilitationCentersByRegion(selectedRegion),
    ]);
  }
};
```

#### 4.2 지도 중심 설정
- 지역 선택 시 해당 지역의 중심 좌표로 지도 이동
- 각 시/도, 시/군/구의 중심 좌표 데이터 필요

**파일**: `lib/data/region-coordinates.ts` (새로 생성)

```typescript
export const REGION_COORDINATES: Record<string, { lat: number; lng: number }> = {
  '11': { lat: 37.5665, lng: 126.9780 }, // 서울특별시
  '11-11680': { lat: 37.5172, lng: 127.0473 }, // 서울특별시 강남구
  // ...
};
```

---

### Phase 5: 데이터 준비 및 검증 (1-2시간)

#### 5.1 한국 행정구역 데이터 수집
- 공공데이터포털 행정구역 코드 API 활용
- 또는 정적 JSON 파일 생성

**데이터 구조**:
```json
{
  "provinces": [
    {
      "code": "11",
      "name": "서울특별시",
      "type": "metropolitan",
      "districts": [
        {
          "code": "11680",
          "name": "강남구",
          "type": "gu"
        }
      ]
    }
  ]
}
```

#### 5.2 주소 데이터 검증
- 현재 데이터베이스의 주소 형식 확인
- 주소 파싱 정확도 테스트
- 예외 케이스 처리 (구 주소, 신 주소, 약자 등)

---

## 🎨 UI/UX 디자인

### 검색 모드 선택
```
┌─────────────────────────────────────┐
│ 검색 방식 선택                      │
│ ○ 내 위치 주변                      │
│ ● 지역 선택                          │
└─────────────────────────────────────┘
```

### 지역 선택 UI (검색 모드가 "지역 선택"일 때만 표시)
```
┌─────────────────────────────────────┐
│ 지역 선택                           │
│                                     │
│ 시/도: [서울특별시 ▼]              │
│                                     │
│ 시/군/구: [강남구 ▼]                │
│                                     │
│ [검색하기]                          │
└─────────────────────────────────────┘
```

### 통합 UI 레이아웃
```
┌─────────────────────────────────────┐
│ 병원 찾기                           │
│                                     │
│ [검색 모드 선택]                    │
│                                     │
│ [지역 선택 UI 또는 반경 선택 UI]    │
│                                     │
│ [기관 유형 필터]                    │
└─────────────────────────────────────┘
```

---

## 📊 데이터베이스 고려사항

### 주소 필드 활용
- 현재 `hospitals_pharmacies` 테이블의 `address` 필드 활용
- `rehabilitation_centers` 테이블의 `address` 필드 활용

### 인덱스 최적화
- 주소 기반 검색 성능을 위해 인덱스 고려
- `address` 필드에 GIN 인덱스 또는 Full-Text Search 인덱스

```sql
-- 주소 검색 성능 향상을 위한 인덱스 (선택사항)
CREATE INDEX idx_hospitals_address ON hospitals_pharmacies USING gin(to_tsvector('korean', address));
```

---

## 🔄 상태 관리

### 검색 모드 전환 시
1. 검색 모드 변경 시 기존 필터 초기화
2. 지도 중심을 선택한 지역으로 이동
3. 반경 선택 UI 숨김/표시

### 지역 선택 시
1. 시/도 선택 → 시/군/구 목록 업데이트
2. 시/군/구 선택 → 구 목록 업데이트 (광역시인 경우)
3. 선택 완료 후 자동 검색 또는 "검색하기" 버튼 클릭

---

## 🧪 테스트 계획

### 단위 테스트
- [ ] 주소 파싱 함수 테스트 (다양한 주소 형식)
- [ ] 지역 필터링 함수 테스트
- [ ] 지역 데이터 구조 검증

### 통합 테스트
- [ ] 지역 선택 UI 동작 테스트
- [ ] 검색 모드 전환 테스트
- [ ] 지도 중심 이동 테스트

### 사용자 테스트
- [ ] 다양한 지역 선택 시나리오
- [ ] 광역시 vs 일반 시/도 선택 차이
- [ ] 검색 결과 정확도 검증

---

## 📝 구현 단계별 체크리스트

### Phase 1: 데이터 구조 (30분)
- [ ] `lib/types/region.ts` 생성
- [ ] `lib/data/korean-regions.ts` 생성 (시/도, 시/군/구 데이터)
- [ ] `lib/data/region-coordinates.ts` 생성 (지역별 중심 좌표)

### Phase 2: UI 컴포넌트 (1-2시간)
- [ ] `components/RegionSelector.tsx` 생성
- [ ] 검색 모드 선택 UI 추가
- [ ] `app/hospitals/page-client.tsx`에 통합

### Phase 3: 필터링 로직 (2-3시간)
- [ ] `lib/utils/address-parser.ts` 생성
- [ ] `lib/api/hospitals.ts`에 `getHospitalsByRegion` 함수 추가
- [ ] `lib/api/rehabilitation-centers.ts`에 `getRehabilitationCentersByRegion` 함수 추가
- [ ] API Route 생성 (`app/api/hospitals/by-region/route.ts`)

### Phase 4: 통합 (1-2시간)
- [ ] 검색 모드에 따른 필터링 로직 통합
- [ ] 지도 중심 이동 로직 구현
- [ ] 상태 관리 및 UI 업데이트

### Phase 5: 데이터 및 검증 (1-2시간)
- [ ] 한국 행정구역 데이터 수집 및 정리
- [ ] 주소 파싱 정확도 테스트
- [ ] 예외 케이스 처리

---

## ⚠️ 고려사항

### 1. 주소 형식 다양성
- 구 주소 vs 신 주소
- 약자 사용 (서울시 vs 서울특별시)
- 오타 및 불일치

**해결 방안**:
- 정규표현식으로 다양한 형식 지원
- 주소 정규화 함수 구현
- 부분 일치 검색 활용 (LIKE 쿼리)

### 2. 성능 최적화
- 주소 기반 LIKE 쿼리는 인덱스 활용이 제한적
- 대량 데이터 검색 시 성능 저하 가능

**해결 방안**:
- 주소 필드에 Full-Text Search 인덱스 추가
- 캐싱 전략 고려
- 페이지네이션 적용

### 3. 사용자 경험
- 지역 선택이 복잡할 수 있음
- 검색 결과가 없을 때 안내

**해결 방안**:
- 직관적인 UI/UX 디자인
- 자동완성 기능 고려
- 검색 결과 없을 때 안내 메시지

---

## 📈 예상 소요 시간

| Phase | 작업 | 예상 시간 |
|-------|------|-----------|
| Phase 1 | 데이터 구조 정의 | 30분 |
| Phase 2 | UI 컴포넌트 | 1-2시간 |
| Phase 3 | 필터링 로직 | 2-3시간 |
| Phase 4 | 통합 | 1-2시간 |
| Phase 5 | 데이터 및 검증 | 1-2시간 |
| **총계** | | **5.5-9.5시간** |

---

## 🎯 우선순위

**Priority 2 (중간)**: 사용자 경험 개선
- 현재 위치 기반 검색만으로는 부족한 경우가 있음
- 특정 지역의 병원을 찾고 싶을 때 유용

**의존성**: 없음 (독립적으로 구현 가능)

---

## 📚 참고 자료

- [공공데이터포털 - 행정구역코드](https://www.data.go.kr/)
- [한국 행정구역 구조](https://ko.wikipedia.org/wiki/대한민국의_행정_구역)
- [Supabase Full-Text Search](https://supabase.com/docs/guides/database/full-text-search)

