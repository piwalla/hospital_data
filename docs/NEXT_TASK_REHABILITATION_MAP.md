# 재활기관 지도 연동 작업 가이드

**작성일**: 2025-01-14  
**우선순위**: Priority 1 🔴  
**예상 소요 시간**: 3-4시간

---

## 📋 작업 개요

재활기관 2,562개를 지도에 표시하여 병원/약국과 함께 통합적으로 볼 수 있도록 합니다.

---

## 🎯 작업 목표

1. 재활기관 데이터를 지도에 마커로 표시
2. 병원/약국과 구분되는 시각적 표시 (다른 색상/아이콘)
3. 재활기관 클릭 시 상세 정보 표시
4. 반경 검색에 재활기관 포함

---

## 📝 상세 작업 단계

### Step 1: 재활기관 데이터 타입 및 API 구현

#### 1-1. 재활기관 타입 정의
**파일**: `lib/api/rehabilitation-centers.ts` (신규 생성)

```typescript
export interface RehabilitationCenter {
  id: string;
  name: string; // gigwan_nm
  type: 'rehabilitation'; // 기관 유형
  address: string;
  latitude: number;
  longitude: number;
  phone: string | null; // tel_no
  department: string | null; // gigwan_fg_nm (기관구분명)
  gigwan_fg_nm: string; // 직업훈련기관, 재활스포츠 위탁기관, 심리재활프로그램 위탁기관
  distance?: number; // 거리 정보 (km)
}
```

#### 1-2. 재활기관 조회 함수 구현
**파일**: `lib/api/rehabilitation-centers.ts`

- `getAllRehabilitationCenters()`: 모든 재활기관 조회
- `getRehabilitationCentersNearby()`: 반경 내 재활기관 조회 (Haversine 공식 사용)
- `getRehabilitationCentersByType()`: 기관구분별 조회

#### 1-3. 재활기관 API Route 생성
**파일**: `app/api/rehabilitation-centers/nearby/route.ts` (신규 생성)

- `GET /api/rehabilitation-centers/nearby?latitude=...&longitude=...&radiusKm=...`
- `getRehabilitationCentersNearby` 함수 호출
- 병원/약국 API와 동일한 구조

---

### Step 2: HospitalMap 컴포넌트 확장

#### 2-1. 재활기관 prop 추가
**파일**: `components/HospitalMap.tsx`

```typescript
interface HospitalMapProps {
  hospitals?: Hospital[];
  rehabilitationCenters?: RehabilitationCenter[]; // 추가
  // ... 기존 props
}
```

#### 2-2. 재활기관 마커 표시
**파일**: `components/HospitalMap.tsx`

- 재활기관 마커 색상 결정:
  - 옵션 1: 보라색 `#9333EA` (재활/복지 느낌)
  - 옵션 2: 주황색 `#FF9500` (PRD Alert 색상 활용)
  - 옵션 3: 청록색 `#06B6D4` (차별화)
- 마커 아이콘: 원형 또는 별 모양으로 구분

#### 2-3. 재활기관 InfoWindow 구현
**파일**: `components/HospitalMap.tsx`

- 기관명, 주소, 전화번호, 기관구분명 표시
- 닫기 버튼 포함 (병원/약국과 동일)
- 전화 걸기, 길찾기 버튼

#### 2-4. 재활기관 클릭 이벤트 처리
**파일**: `components/HospitalMap.tsx`

- `onRehabilitationCenterClick` prop 추가
- 마커 클릭 시 상세 정보 표시

---

### Step 3: 페이지 클라이언트 통합

#### 3-1. 재활기관 데이터 fetch
**파일**: `app/hospitals/page-client.tsx`

- `useState`로 재활기관 데이터 상태 관리
- `useEffect`에서 사용자 위치 기반 재활기관 fetch
- `fetchNearbyRehabilitationCenters` 함수 구현

#### 3-2. 통합 필터링 로직
**파일**: `app/hospitals/page-client.tsx`

- 병원/약국과 재활기관을 함께 반경 내 검색
- 거리 계산 및 정렬
- 통합 목록 표시

#### 3-3. HospitalMap에 재활기관 전달
**파일**: `app/hospitals/page-client.tsx`

```typescript
<HospitalMap
  hospitals={hospitals}
  rehabilitationCenters={rehabilitationCenters} // 추가
  // ... 기존 props
/>
```

---

### Step 4: 상세 정보 표시

#### 4-1. 재활기관 상세 정보 컴포넌트
**옵션 A**: `HospitalDetailSheet` 확장
- `type` prop으로 병원/약국/재활기관 구분
- 재활기관의 경우 `gigwan_fg_nm` 표시

**옵션 B**: `RehabilitationCenterDetailSheet` 신규 생성
- 재활기관 전용 컴포넌트
- 기관구분명 강조 표시

#### 4-2. Bottom Sheet 연동
**파일**: `app/hospitals/page-client.tsx`

- 재활기관 클릭 시 Bottom Sheet 열기
- `selectedRehabilitationCenter` 상태 관리

---

## 🎨 디자인 결정사항

### 마커 색상
- **병원**: 파란색 `#3478F6` (기존)
- **약국**: 녹색 `#34C759` (기존)
- **재활기관**: 보라색 `#9333EA` (추천) 또는 주황색 `#FF9500`

### 마커 아이콘
- 병원/약국: 원형 마커 (기존)
- 재활기관: 별 모양 또는 다이아몬드 모양으로 구분

---

## 📊 데이터 구조 비교

### Hospital (기존)
```typescript
{
  id: string;
  name: string;
  type: 'hospital' | 'pharmacy';
  address: string;
  latitude: number;
  longitude: number;
  phone: string | null;
  department: string | null;
}
```

### RehabilitationCenter (신규)
```typescript
{
  id: string;
  name: string; // gigwan_nm
  type: 'rehabilitation';
  address: string;
  latitude: number;
  longitude: number;
  phone: string | null; // tel_no
  department: string | null; // gigwan_fg_nm
  gigwan_fg_nm: string; // 기관구분명
}
```

**통합 타입 제안**:
```typescript
type Institution = Hospital | RehabilitationCenter;
```

---

## 🔧 구현 순서

1. **재활기관 API 구현** (1시간)
   - `lib/api/rehabilitation-centers.ts` 생성
   - `app/api/rehabilitation-centers/nearby/route.ts` 생성

2. **HospitalMap 컴포넌트 확장** (1.5시간)
   - 재활기관 prop 추가
   - 재활기관 마커 표시
   - 재활기관 InfoWindow 구현

3. **페이지 클라이언트 통합** (1시간)
   - 재활기관 데이터 fetch
   - 통합 필터링 로직
   - HospitalMap에 전달

4. **상세 정보 표시** (0.5시간)
   - Bottom Sheet 연동
   - 재활기관 정보 표시

---

## ✅ 완료 기준

- [ ] 재활기관이 지도에 마커로 표시됨
- [ ] 병원/약국과 색상/아이콘으로 구분됨
- [ ] 재활기관 클릭 시 InfoWindow 표시
- [ ] 재활기관 클릭 시 Bottom Sheet 표시
- [ ] 반경 검색에 재활기관 포함됨
- [ ] 거리 정보가 정확히 계산됨

---

## 📝 참고 파일

- `components/HospitalMap.tsx`: 지도 컴포넌트
- `app/hospitals/page-client.tsx`: 페이지 클라이언트
- `lib/api/hospitals.ts`: 병원 데이터 조회 (참고용)
- `app/api/hospitals/nearby/route.ts`: 병원 반경 검색 API (참고용)
- `components/HospitalDetailSheet.tsx`: 상세 정보 컴포넌트 (참고용)

---

## 🔄 업데이트 이력

- **2025-01-14**: 초안 작성 (재활기관 Geocoding 완료 후)

