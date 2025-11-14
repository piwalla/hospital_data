# 변경 이력 (Changelog)

## 2025-11-13

### ✅ 완료된 작업

#### 1. 병원 상세 정보 표시 (Bottom Sheet) 구현
- **파일**: `components/HospitalDetailSheet.tsx` (신규 생성)
- **기능**:
  - shadcn/ui `sheet` 컴포넌트 설치 및 적용
  - 병원 상세 정보 표시 (이름, 주소, 전화번호, 진료과목)
  - 전화 걸기 버튼 (Primary CTA)
  - 길찾기 버튼 (Secondary CTA, 네이버 지도 앱/웹 연동)
  - 모바일: 드래그로 열기/닫기 (Radix UI 기본 제공)
  - 데스크톱: 클릭으로 열기/닫기

- **연동 작업**:
  - `components/HospitalMap.tsx`: 마커 클릭 시 Bottom Sheet 열기
  - `app/hospitals/page-client.tsx`: 목록 항목 클릭 시 Bottom Sheet 열기
  - `app/hospitals/page.tsx`: 서버/클라이언트 컴포넌트 분리

#### 2. 네이버 지도 API v3 마이그레이션
- **파일**: `components/HospitalMap.tsx`
- **변경 사항**:
  - SDK 로드 URL 변경: `openapi.map.naver.com` → `oapi.map.naver.com`
  - 파라미터 변경: `ncpClientId` → `ncpKeyId`
  - 신규 NCP Maps API v3 적용

- **문제 해결**:
  - 지도 화면이 1초 뒤에 사라지는 문제 해결
  - "NAVER Maps JavaScript API v3 신규 Maps API 전환 안내" 메시지 대응

- **문서**:
  - `docs/NAVER_MAPS_API_MIGRATION.md` 생성 (마이그레이션 가이드)

### 📝 생성된 파일
1. `components/HospitalDetailSheet.tsx` - 병원 상세 정보 Bottom Sheet 컴포넌트
2. `app/hospitals/page-client.tsx` - 병원 찾기 페이지 클라이언트 컴포넌트
3. `components/ui/sheet.tsx` - shadcn/ui sheet 컴포넌트 (설치됨)
4. `docs/NAVER_MAPS_API_MIGRATION.md` - 네이버 지도 API 마이그레이션 가이드

### 🔧 수정된 파일
1. `components/HospitalMap.tsx` - 신규 API 적용 및 Bottom Sheet 연동
2. `app/hospitals/page.tsx` - 서버/클라이언트 컴포넌트 분리
3. `docs/TODO.md` - 완료된 작업 표시 및 다음 단계 업데이트

### ✅ 테스트 결과
- **지도 표시**: 정상 작동 확인
- **Bottom Sheet**: 마커 및 목록 클릭 시 정상 작동
- **전화 걸기**: `tel:` 링크 정상 작동
- **길찾기**: 네이버 지도 앱/웹 연동 정상 작동

### 📋 다음 작업
- 반경 5km 내 검색 로직 구현
- 진료과목별 필터링 기능
- 사용자 활동 로깅

---

## 2025-11-13 (이전 작업)

### ✅ 완료된 작업
- 공공데이터포털 API 연동
- 지도 컴포넌트 기본 구현
- Geocoding API 연동
- 데이터 동기화 테스트 완료


