# 병원 찾기 기능

## 개요

산재 치료기관(병원, 약국, 재활기관, 직업훈련기관)을 지도와 목록으로 검색하고 찾을 수 있는 기능입니다. 위치 기반 검색과 지역 선택 검색을 모두 지원하며, Naver Maps API를 활용한 인터랙티브한 지도 기능을 제공합니다.

## 주요 기능

### 1. 지도 기반 검색
- **Naver Maps 통합**: 실시간 지도 표시 및 인터랙션
- **마커 표시**: 병원, 약국, 재활기관, 직업훈련기관을 색상별 마커로 표시
- **정보 창**: 마커 클릭 시 해당 기관의 상세 정보 표시
- **지도 중심 이동**: 목록에서 기관 클릭 시 지도 중심이 해당 위치로 이동
- **사용자 위치**: GPS 기반 사용자 현재 위치 표시

### 2. 필터 기능
- **기본 필터**: "전체" / "필터" 버튼 (상단 우측)
- **고급 필터** (필터 클릭 시 표시):
  - **종류**: 병원, 약국, 재활, 직업훈련
  - **내 위치 주변**: 5km, 10km, 15km, 30km 반경 선택
  - **지역 선택**: 시/도, 시/군/구, 읍/면/동 선택

### 3. 검색 모드
- **위치 기반 검색** (`location`):
  - 사용자 위치 기반 반경 검색
  - 지도 드래그 시 자동으로 해당 위치 기준 재검색
  - 반경 선택 (5, 10, 15, 30km)
  
- **지역 선택 검색** (`region`):
  - 시/도, 시/군/구, 읍/면/동 선택
  - 선택한 지역 내 모든 기관 표시

### 4. 기관 목록
- **반응형 레이아웃**:
  - 모바일: 지도 상단, 목록 하단
  - 데스크톱: 지도 좌측 (2/3), 목록 우측 (1/3)
- **기관 정보 표시**:
  - 기관명 (20px Bold)
  - 주소
  - 전화번호 (큰 버튼, 직접 통화 가능)
  - 거리 정보 (위치 기반 검색 시)
  - 즐겨찾기 버튼
- **클릭 인터랙션**: 목록에서 기관 클릭 시 지도 중심 이동

### 5. 즐겨찾기 기능
- 로그인 사용자만 사용 가능
- 기관별 즐겨찾기 추가/제거
- 별도 즐겨찾기 페이지에서 관리 가능

## 기술 구성

### 페이지 구조
```
app/hospitals/
├── page.tsx                    # 서버 컴포넌트 (초기 데이터 로드)
└── page-client.tsx             # 클라이언트 컴포넌트 (인터랙션 처리)
```

### 주요 컴포넌트
```
components/
├── HospitalMap.tsx             # Naver Maps 지도 컴포넌트
├── HospitalDetailSheet.tsx    # 기관 상세 정보 시트 (모바일)
├── RegionSelector.tsx          # 지역 선택 드롭다운
└── FavoriteButton.tsx          # 즐겨찾기 버튼
```

### API 엔드포인트
```
app/api/hospitals/
├── nearby/route.ts             # 위치 기반 병원 검색
├── by-region/route.ts          # 지역 기반 병원 검색
└── [id]/route.ts               # 특정 병원 정보 조회

app/api/rehabilitation-centers/
├── nearby/route.ts             # 위치 기반 재활기관 검색
└── by-region/route.ts          # 지역 기반 재활기관 검색
```

### 데이터 구조

#### 데이터베이스 테이블
- `hospitals_pharmacies`: 병원 및 약국 정보
  - `id`: UUID (Primary Key)
  - `name`: 기관명
  - `type`: 'hospital' | 'pharmacy'
  - `address`: 주소
  - `latitude`, `longitude`: 좌표
  - `phone`: 전화번호
  - `department`: 진료과목
  - `institution_type`: 기관 유형
  - `last_updated`: 최종 업데이트 시간

- `rehabilitation_centers`: 재활기관 및 직업훈련기관 정보
  - `id`: UUID (Primary Key)
  - `name`: 기관명
  - `gigwan_fg_nm`: 기관 구분 ('재활스포츠기관' | '직업훈련기관')
  - `address`: 주소
  - `latitude`, `longitude`: 좌표
  - `phone`: 전화번호
  - `last_updated`: 최종 업데이트 시간

#### API 함수
- `lib/api/hospitals.ts`
  - `getAllHospitals()`: 모든 병원/약국 조회
  - `getHospitalsNearby()`: 위치 기반 반경 검색
  - `getHospitalsByRegion()`: 지역 기반 검색

- `lib/api/rehabilitation-centers.ts`
  - `getAllRehabilitationCenters()`: 모든 재활기관 조회
  - `getRehabilitationCentersNearby()`: 위치 기반 반경 검색
  - `getRehabilitationCentersByRegion()`: 지역 기반 검색

### 데이터 흐름

1. **초기 로드**
   ```
   HospitalsPage (Server Component)
   → getAllHospitals()
   → HospitalsPageClient에 데이터 전달
   ```

2. **위치 기반 검색**
   ```
   사용자 위치 획득 (GPS)
   → handleLocationChange()
   → fetchNearbyHospitals() + fetchNearbyRehabilitationCenters()
   → API Route 호출 (/api/hospitals/nearby)
   → Haversine 공식으로 거리 계산
   → 반경 내 기관만 필터링 및 정렬
   ```

3. **지역 선택 검색**
   ```
   RegionSelector에서 지역 선택
   → handleRegionCoordinatesChange()
   → getRegionCoordinates()로 좌표 변환
   → fetchHospitalsByRegion() + fetchRehabilitationCentersByRegion()
   → API Route 호출 (/api/hospitals/by-region)
   ```

4. **지도 인터랙션**
   ```
   기관 목록에서 클릭
   → handleHospitalClick() / handleRehabilitationCenterClick()
   → mapCenter 상태 업데이트
   → HospitalMap의 center prop 변경
   → 지도 중심 이동
   → 사용자가 지도 드래그 시 isMapCenteredOnSelection = false
   ```

## 접근 권한

- **공개 페이지**: 로그인 없이도 접근 가능
- **즐겨찾기**: 로그인 사용자만 사용 가능 (Clerk 인증 필요)

## 사용자 경험

### 반응형 디자인
- **모바일**: 
  - 지도가 상단에 표시
  - 목록이 하단에 스크롤 가능한 형태
  - 하단 네비게이션과 겹치지 않도록 z-index 조정

- **데스크톱**:
  - 지도 좌측 (2/3 너비)
  - 목록 우측 (1/3 너비)
  - 동시에 지도와 목록 확인 가능

### 인터랙션
- **지도 중심 이동**: 목록 클릭 시 해당 기관으로 지도 이동
- **자동 재검색**: 위치 기반 모드에서 지도 드래그 시 자동 재검색
- **즉시 통화**: 전화번호 버튼 클릭 시 바로 통화 앱 실행

## 주요 파일 경로

- **페이지**: `app/hospitals/page.tsx`, `app/hospitals/page-client.tsx`
- **컴포넌트**: `components/HospitalMap.tsx`, `components/RegionSelector.tsx`
- **API**: `lib/api/hospitals.ts`, `lib/api/rehabilitation-centers.ts`
- **API Routes**: `app/api/hospitals/`, `app/api/rehabilitation-centers/`
- **유틸리티**: `lib/utils/distance.ts`, `lib/utils/map.ts`
- **데이터**: `lib/data/region-coordinates.ts`

## 환경 변수

- `NEXT_PUBLIC_NAVER_MAPS_CLIENT_ID`: Naver Maps API 클라이언트 ID

## 향후 개선 가능 사항

- 검색어 입력 기능 (기관명 검색)
- 경로 안내 기능 (Naver Maps 길찾기 연동)
- 기관별 리뷰/평점 기능
- 최근 검색 기록
- 자주 찾는 기관 추천

