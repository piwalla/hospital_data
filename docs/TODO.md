# 리워크케어(ReWorkCare) Phase 1 개발 작업 목록

**최근 업데이트**: 2025-01-26 - 서류 가이드 접근성 검증 완료 ✅, 산재 절차 타임라인 기능 계획 추가
- 서류 가이드 반응형 디자인 검증 및 개선 완료
- 서류 가이드 접근성 검증 완료 (키보드 네비게이션, 스크린 리더, 색상 대비, 포커스 관리)
- 에러 로깅 및 모니터링 구현 완료
- 서류 목록 페이지 완료 (Accordion 기반 UI)
- DocumentsList 컴포넌트 완료 (서류 목록 표시)
- DocumentSummary 컴포넌트 완료 (AI 요약 표시, 로딩/에러 처리)
- API Route 완료 (캐시 확인, AI 요약 생성, 에러 처리)
- 전체 서류 AI 요약 가이드 기능 구현 완료

---

## 🎯 Phase 1 MVP: 산재 환자 지원 플랫폼 기본 기능 구현

### Phase 1.1: 프로젝트 초기 설정 및 인프라 구축
- [x] **데이터베이스 스키마 설정** (setup_schema.sql, setup_storage.sql)
  - [x] Clerk 연동용 users 테이블 생성
  - [x] hospitals_pharmacies 테이블 생성 (공간 인덱스 포함)
  - [x] user_activity_logs 테이블 생성
  - [x] uploads 스토리지 버킷 설정 (public, 이미지 전용)
- [x] **GitHub Repository 설정**
  - [x] 원격 저장소 연결 (https://github.com/piwalla/hospital_data.git)
  - [x] 초기 커밋 및 푸시
- [x] **Next.js 15 프로젝트 초기화**
  - [x] Next.js 15 + TypeScript + Tailwind CSS v4 설정
  - [x] shadcn/ui 컴포넌트 라이브러리 설치 및 설정
  - [x] 기본 폴더 구조 생성 (app/, components/, lib/, hooks/)
  - [x] 환경변수 파일 생성 (.env.example, .env.local)
- [x] **Supabase 클라이언트 설정**
  - [x] lib/supabase/ 디렉토리 생성
  - [x] server.ts, client.ts, clerk-client.ts 파일 생성
  - [x] 환경변수 연결 및 타입 정의
- [x] **Clerk 인증 설정**
  - [x] Clerk SDK 설치 및 초기화
  - [x] middleware.ts 생성 (라우트 보호)
  - [x] 사용자 동기화 훅 구현 (use-sync-user.ts)
- [x] **기본 UI 컴포넌트 및 레이아웃**
  - [x] 디자인 토큰 설정 (색상, 타이포그래피)
  - [x] RootLayout 및 기본 페이지 구조
  - [x] 반응형 네비게이션 구현
    - [x] 모바일 (< 768px): 하단 탭 네비게이션 컴포넌트
    - [x] 데스크톱 (≥ 1024px): 상단 네비게이션 또는 사이드바
    - [x] 태블릿 (768px ~ 1023px): 하이브리드 레이아웃
    - [x] 화면 크기별 자동 전환 로직 (Tailwind CSS 반응형 클래스)

### Phase 1.2: 병원 찾기 기능 구현

**현재 진행 상황**: 기본 기능 구현 완료, 데이터 동기화 완료, 지도 UX 개선 완료, 재활기관 데이터 추가 완료
**최근 업데이트**: 2025-01-14 - 재활기관 API 연동 및 데이터 Import 완료 (2,368개)
- [x] **공공데이터포털 API 연동**
  - [x] API 문서 확인 및 정리 (docs/api-data-kr.md)
  - [x] API 인증키 테스트 및 데이터 구조 확인 (총 5,216개 기관)
  - [x] API 클라이언트 생성 (lib/api/data-kr.ts)
  - [x] 산재 지정 의료기관 데이터 조회 함수
  - [x] 데이터 변환 및 캐싱 로직 구현 (lib/api/cache-hospitals.ts)
  - [x] 동기화 API 엔드포인트 생성 (app/api/hospitals/sync/route.ts)
  - [x] 병원 데이터 조회 유틸리티 (lib/api/hospitals.ts)
- [x] **CSV 파일 기반 데이터 Import 및 Geocoding** ✅ 완료
  - [x] CSV 파일 파싱 및 인코딩 처리 (EUC-KR/CP949 자동 감지)
  - [x] CSV Import API 생성 (app/api/hospitals/import-csv/route.ts)
    - [x] 주소만 Supabase에 저장 (Geocoding 별도 처리)
    - [x] 테스트 모드 지원 (처음 N개만 처리)
  - [x] 네이버 Geocoding API 연동
    - [x] Geocoding 클라이언트 (lib/api/geocoding.ts)
    - [x] 배치 Geocoding API (app/api/hospitals/geocode-batch/route.ts)
    - [x] 성공률: 6,048개 / 6,101개 (99.13%)
  - [x] VWorld Geocoding API 추가 연동
    - [x] VWorld Geocoding 클라이언트 (lib/api/geocoding-vworld.ts)
    - [x] 실패한 주소 재시도 API (app/api/hospitals/geocode-vworld/route.ts)
    - [x] 추가 성공: 23개
  - [x] 최종 처리 결과: 6,071개 성공 / 6,101개 (99.51% 성공률)
  - [x] 실패한 병원 리스트 문서화 (docs/failed_hospitals_list.md)
- [x] **지도 컴포넌트 구현**
  - [x] Naver Maps API 문서 확인 및 정리 (docs/naver-maps-api.md)
  - [x] Naver Maps API 키 인증 성공 (데이터 응답 확인)
  - [x] Dynamic Map SDK 작동 확인 및 문서 업데이트 (도메인 제한 기록)
  - [x] Naver Maps API 연동 (components/HospitalMap.tsx)
  - [x] 위치 권한 요청 및 처리
  - [x] 사용자 위치 기반 지도 초기화
  - [x] 반응형 지도 레이아웃 (모바일: 세로, 데스크톱: 가로 2-3 컬럼)
  - [x] 병원 마커 표시 및 정보창
  - [x] Geocoding API 연동 ✅ 완료
    - [x] 네이버 Maps Geocoding API 클라이언트 (lib/api/geocoding.ts)
    - [x] VWorld Geocoding API 클라이언트 (lib/api/geocoding-vworld.ts)
    - [x] 배치 Geocoding 처리 로직
    - [x] 실패한 주소 재시도 메커니즘 (네이버 → VWorld)
    - [x] Geocoding 결과 검증 API (app/api/hospitals/verify-geocoding/route.ts)
  - [x] **지도 UX 개선** ✅ 완료
    - [x] 지도 확대/축소 시 리셋 문제 해결
      - [x] 지도 인스턴스 재사용 로직 구현 (mapInstanceRef)
      - [x] hospitals 변경 시 지도 리셋 방지 (마커만 업데이트)
      - [x] zoom_changed 이벤트 리스너 제거 (확대/축소 시 병원 재검색 방지)
      - [x] center prop 변경 시 지도 중심만 업데이트 (setCenter 사용)
    - [x] InfoWindow 닫기 기능 추가
      - [x] InfoWindow 우측 상단에 닫기 버튼(X) 추가
      - [x] 지도 빈 공간 클릭 시 InfoWindow 닫기
      - [x] 같은 마커 재클릭 시 InfoWindow 토글 (열기/닫기)
      - [x] 다른 마커 클릭 시 이전 InfoWindow 자동 닫기
      - [x] currentInfoWindowRef로 현재 열려있는 InfoWindow 추적
    - [x] **반경에 따른 지도 확대/축소 레벨 자동 조정** ✅ 완료 (2025-01-14)
      - [x] 반경에 따른 zoom 레벨 계산 함수 생성 (lib/utils/map.ts)
        - [x] 5km: zoom 14 (가장 확대)
        - [x] 10km: zoom 13
        - [x] 15km: zoom 12
        - [x] 30km: zoom 11 (가장 축소)
      - [x] page-client.tsx에서 zoom prop 전달
      - [x] HospitalMap에서 zoom prop 변경 시 지도 zoom 업데이트
      - [x] 반경 선택 시 지도가 자동으로 적절한 확대/축소 레벨로 조정
- [x] **병원 마커 표시 및 필터링** (기본 구현 완료)
  - [x] 병원/약국 위치에 마커 표시 (HospitalMap 컴포넌트)
  - [x] 마커 클릭 시 정보창 표시 (네이버 지도 InfoWindow)
  - [x] InfoWindow 닫기 기능 구현 ✅ 완료
    - [x] 닫기 버튼(X) 추가 (우측 상단, 호버 효과 포함)
    - [x] 지도 클릭 시 InfoWindow 닫기 이벤트 리스너
    - [x] 마커 재클릭 시 InfoWindow 토글 기능
    - [x] 여러 마커 간 InfoWindow 전환 시 이전 창 자동 닫기
  - [x] API 클라이언트 테스트 완료 (5,216개 데이터 확인)
  - [x] 데이터 동기화 테스트 완료 (100개 저장 성공)
  - [x] **지역 선택 필터 기능** (Priority 2) 🟡 ✅ 완료 (2025-01-14)
    - [x] 지역 데이터 구조 정의 (시/도, 시/군/구)
      - [x] `lib/types/region.ts`: 지역 타입 정의
      - [x] `lib/data/korean-regions.ts`: 한국 시/도, 시/군/구 데이터 (광역시 7개 + 일반 시/도 9개)
      - [x] `lib/data/region-coordinates.ts`: 지역별 중심 좌표 데이터
    - [x] 주소 파싱 유틸리티 구현 (`lib/utils/address-parser.ts`)
      - [x] 주소에서 시/도, 시/군/구 추출 함수
      - [x] 다양한 주소 형식 지원
    - [x] 지역 기반 필터링 함수 구현
      - [x] `lib/api/hospitals.ts`: `getHospitalsByRegion()` 함수 추가
      - [x] `lib/api/rehabilitation-centers.ts`: `getRehabilitationCentersByRegion()` 함수 추가
      - [x] API Route 생성 (`app/api/hospitals/by-region/route.ts`, `app/api/rehabilitation-centers/by-region/route.ts`)
      - [x] 주소 검색 개선 (약자 변환 지원: "인천광역시" → "인천"도 검색)
    - [x] 지역 선택 UI 컴포넌트 생성 (`components/RegionSelector.tsx`)
      - [x] 시/도, 시/군/구 선택 드롭다운
      - [x] 광역시 구 선택 지원
      - [x] 시의 하위 구 선택 지원
    - [x] 검색 모드 전환 UI (내 위치 주변 vs 지역 선택)
      - [x] 검색 모드 선택 버튼 추가
      - [x] 모드에 따라 반경 선택 UI 또는 지역 선택 UI 표시
    - [x] 지역 선택 시 지도 중심 이동 로직
      - [x] 지역 선택 시 해당 지역 중심 좌표로 지도 이동
    - [x] 검색 모드에 따른 필터링 로직 통합
      - [x] `app/hospitals/page-client.tsx`에 검색 모드 상태 관리 추가
      - [x] 지역 선택 모드에서 지도 이동 시 재검색 방지 (`enableLocationChange` prop 추가)
      - [x] 지역 선택 시 자동 검색 및 지도 업데이트
    - [x] 예상 소요 시간: 5.5-9.5시간
    - [x] 참고: `docs/REGION_FILTER_PLAN.md` (상세 계획)
  - [x] **기관 유형 및 진료과목 데이터 추가** (Priority 2) 🟡 ✅ 완료 (2025-01-14)
    - [x] 기관 유형 및 진료과목 추출 로직 구현 (lib/utils/institution-classifier.ts)
    - [x] Supabase 마이그레이션 파일 생성 (institution_type, department_extracted 컬럼 추가)
    - [x] SQL 함수 생성 (extract_institution_type, extract_departments)
    - [x] 전체 데이터 업데이트 완료 (6,101개 레코드)
    - [x] 기관 유형 분포: 의원 2,115개, 한의원 1,645개, 병원 1,297개, 기타 567개, 요양병원 424개, 대학병원 30개, 종합병원 23개
    - [x] 진료과목 분포: 정형외과,외과 1,362개, 치과 483개, 신경외과,외과 164개 등 총 23개 조합
    - [x] Hospital 타입에 institution_type, department_extracted 필드 추가
    - [x] 화면에 기관 유형 및 진료과목 배지 표시 (병원 목록 카드, 지도 InfoWindow, 상세 정보 Bottom Sheet)
  - [x] **진료과목별 필터링 기능** (Priority 2) 🟡 ✅ 완료 (2025-01-14)
    - [x] 진료과목 데이터 분석 및 필터 옵션 정의 (12개 주요 진료과목)
    - [x] 필터 UI 컴포넌트 생성 (버튼 기반 멀티 셀렉트)
      - [x] 상위 6개 진료과목 버튼 표시 (정형외과, 치과, 신경외과, 외과, 재활의학과, 영상의학과)
      - [x] 더보기 버튼으로 나머지 진료과목 드롭다운 표시
      - [x] 선택된 진료과목 초기화 버튼
    - [x] 필터링 로직 구현 (병원의 department_extracted에 선택된 진료과목 포함 여부 확인)
    - [x] 지도 및 목록에 필터 적용 (filteredHospitals에 진료과목 필터 통합)
    - [x] 필터 상태 관리 (selectedDepartments 상태로 관리)
    - [x] 기관 유형 필터 변경 시 진료과목 필터 자동 초기화
    - [x] 병원 필터 또는 전체 필터일 때만 진료과목 필터 표시
    - [x] 예상 소요 시간: 2-3시간
    - [x] 참고: 기관 유형 및 진료과목 데이터는 이미 추가 완료
  - [x] **기관 유형별 필터링** (Priority 2) 🟡 ✅ 완료
    - [x] 필터 UI 추가 (전체, 병원, 약국, 직업훈련기관, 재활스포츠기관)
    - [x] 필터링 로직 구현 (지도 마커, 목록 모두 필터링)
    - [x] 필터 상태에 따른 마커 색상/아이콘 변경 (병원: 파란색, 약국: 초록색, 재활기관: 보라색)
    - [x] 필터별 개수 표시 및 UI 업데이트
    - [x] 심리재활프로그램 위탁기관 필터 제거 (데이터 없음)
  - [x] 반경 5km 내 검색 로직 ✅ 완료 (아래 항목 참고)
- [x] **재활기관 데이터 추가** ✅ 완료 (2025-01-14)
  - [x] 재활기관 API 확인 및 테스트
    - [x] 공공데이터포털 API 확인 (근로복지공단_산재재활기관관리정보)
    - [x] API 엔드포인트 확인 (getSjbWkGigwanInfoList)
    - [x] API 테스트 완료 (2,415개 데이터 확인)
    - [x] 제공 데이터 구조 확인 (기관명, 기관구분, 주소, 전화번호 등)
  - [x] 재활기관 테이블 생성
    - [x] Supabase 마이그레이션 파일 생성 (20250114000000_create_rehabilitation_centers_table.sql)
    - [x] 테이블 스키마 정의 (기관명, 기관구분, 주소, 좌표, 전화번호 등)
    - [x] 인덱스 생성 (기관구분, 기관명)
  - [x] 재활기관 Import API 구현
    - [x] 전체 데이터 Import API (app/api/rehabilitation-centers/import-all/route.ts)
    - [x] 테스트 Import API (app/api/rehabilitation-centers/test-import/route.ts)
    - [x] 페이지네이션 처리 (25페이지, 페이지당 100개)
    - [x] 중복 체크 및 업데이트 로직
  - [x] Geocoding API 구현
    - [x] Geocoding API (app/api/rehabilitation-centers/geocode/route.ts)
    - [x] 좌표가 없는 데이터만 Geocoding 처리
    - [x] Geocoding 실패 원인 수정 (latitude/longitude 필드명)
  - [x] 전체 데이터 Import 완료
    - [x] Import된 데이터: 2,368개 (97.1%)
    - [x] 기관구분: 직업훈련기관 2,555개, 재활스포츠기관 24개
    - [x] 누락된 데이터: 47개 (기관명/주소 없는 항목으로 API 필터링됨)
    - [x] Geocoding: 별도 처리 필요 (현재 0개)
  - [x] **재활기관 Geocoding 처리** (Priority 1) 🔴 ✅ 완료 (2025-01-14)
    - [x] Geocoding API 개선 (limit, delayMs 파라미터 추가)
    - [x] 재활기관용 VWorld Geocoding 재시도 API 생성 (`app/api/rehabilitation-centers/geocode-vworld/route.ts`)
    - [x] Geocoding 실행 스크립트 생성 (`scripts/geocode-rehabilitation-centers.js`)
    - [x] 주소 정리 API 생성 (`app/api/rehabilitation-centers/cleanup-addresses/route.ts`)
      - [x] 괄호 제거 및 주소 정리 로직 구현
      - [x] 주소 정리 후 Geocoding 재시도 스크립트 생성 (`scripts/cleanup-and-geocode-rehabilitation.js`)
    - [x] 배치 Geocoding 처리 (500개씩 3회, 300개 1회)
    - [x] Geocoding 결과 검증 (Supabase MCP로 확인)
    - [x] 실패한 주소 정리 및 재시도 (19개 주소 정리, 10개 추가 성공)
    - [x] 최종 결과: 2,562개 성공 / 2,579개 (99.34% 성공률)
    - [x] 실패한 17개: 주소 정보 없음(3개), 복잡한 주소 형식(5개), 중복 데이터(3개), 기타(6개)
  - [x] **재활기관 지도 연동** (Priority 1) 🔴 ✅ 완료 (2025-01-14)
    - [x] 재활기관 데이터 타입 정의 (`lib/api/rehabilitation-centers.ts` 생성)
    - [x] 재활기관 조회 함수 구현 (`getRehabilitationCentersNearby`, `getAllRehabilitationCenters`, `getRehabilitationCentersByType`)
    - [x] 재활기관 API Route 생성 (`app/api/rehabilitation-centers/nearby/route.ts`)
    - [x] `HospitalMap` 컴포넌트에 재활기관 데이터 prop 추가
    - [x] 재활기관 마커 표시 (병원/약국과 다른 색상)
      - [x] 마커 색상 결정: 보라색 `#9333EA`
    - [x] 재활기관 InfoWindow 구현 (기관구분명 표시)
      - [x] InfoWindow에 기관구분명 표시 (직업훈련기관, 재활스포츠기관 등)
      - [x] 전화 및 길찾기 버튼 포함
    - [x] **재활기관 상세 정보 Bottom Sheet 연동** (Priority 1) 🔴 ✅ 완료 (2025-01-14)
      - [x] `HospitalDetailSheet` 확장하여 재활기관 지원 추가
      - [x] `rehabilitationCenter` prop 추가
      - [x] 재활기관 클릭 핸들러 수정 (`handleRehabilitationCenterClick`)
      - [x] 재활기관 상세 정보 표시 (기관구분명, 주소, 전화번호)
      - [x] 재활기관 배지 표시 (보라색 #9333EA)
      - [x] 전화 걸기 및 길찾기 버튼 연동
    - [x] `app/hospitals/page-client.tsx`에서 재활기관 데이터 fetch 및 통합
      - [x] 재활기관 반경 검색 API 호출
      - [x] 병원과 재활기관 동시 검색 (Promise.all)
      - [x] 재활기관 목록 UI 추가
    - [x] 병원/약국/재활기관 통합 필터링 로직 구현
      - [x] 필터 타입 정의 (전체, 병원, 약국, 직업훈련기관, 재활스포츠기관)
      - [x] 필터링된 데이터로 지도 및 목록 업데이트
    - [x] 데이터 확인: 직업훈련기관 2,555개, 재활스포츠기관 24개
- [x] **병원 상세 정보 표시** ✅ 완료
  - [x] Bottom Sheet 컴포넌트 생성 (shadcn/ui sheet 설치 완료)
  - [x] 모바일: 드래그로 열기/닫기 기능 (Radix UI 기본 제공)
  - [x] 데스크톱: 클릭으로 열기/닫기 기능
  - [x] 병원 정보 표시 (이름, 주소, 전화번호, 진료과목)
  - [x] 전화 걸기 버튼 (`tel:` 링크)
  - [x] 길찾기 버튼 (네이버 지도 앱/웹 연동)
  - [x] 마커 클릭 시 Bottom Sheet 열기 연동
  - [x] 목록 항목 클릭 시 Bottom Sheet 열기 연동
- [x] **반경 5km 내 검색 로직** ✅ 완료
  - [x] 사용자 위치 기반 필터링 로직
  - [x] 거리 계산 함수 (Haversine 공식) - lib/utils/distance.ts
  - [x] 가까운 순으로 정렬
  - [x] 거리 표시 (예: "1.2km", "500m")
  - [x] 필터링된 병원 수 UI 업데이트
  - [x] 목록에 거리 정보 추가
  - [x] getHospitalsNearby() 함수 개선 (정확한 거리 계산)
- [ ] **사용자 활동 로깅** (Priority 4) 🔵
  - [ ] 로깅 함수 생성 (`logUserActivity()`) - `lib/utils/logging.ts`
  - [ ] 병원 검색 및 조회 로그 기록
  - [ ] 위치 정보 및 필터 사용 로그
  - [ ] user_activity_logs 테이블에 저장
  - [ ] 주요 이벤트에 로깅 추가 (병원 클릭, 필터 변경, 지도 이동 등)
  - [ ] 예상 소요 시간: 2-3시간

### Phase 1.3: 서류 AI 요약 가이드 기능 구현
- [x] **Google Gemini API 연동 설정** (2-3시간) ✅ 완료 (2025-01-14)
  - [x] `@google/genai` 패키지 설치
  - [x] 환경변수 확인 (`GOOGLE_API_KEY`, `GEMINI_MODEL=gemini-2.5-flash`)
  - [x] Gemini 클라이언트 생성 (`lib/api/gemini.ts`)
  - [x] 에러 처리 및 재시도 로직 구현
  - [x] Rate limiting 처리 (429 에러)
  - [x] 네트워크 에러 재시도 (최대 3회)
  - [x] 타임아웃 설정 (30초)
  - [x] 테스트 API Route 생성 (`app/api/test-gemini/route.ts`)
  - [x] 기본 API 호출 테스트 완료
- [x] **서류 목록 관리** (3-4시간) ✅ 완료 (2025-01-14)
  - [x] 서류 타입 정의 (`lib/types/document.ts`)
    - [x] Document 인터페이스
    - [x] DocumentSummary 인터페이스
    - [x] DocumentSection 인터페이스
    - [x] DocumentCategory 타입
  - [x] 주요 산재 서류 데이터 정의 (8개 서류)
    - [x] 산재신청서
    - [x] 요양급여 신청서
    - [x] 휴업급여 신청서
    - [x] 장해등급 신청서
    - [x] 요양급여 지급 신청서
    - [x] 상병보상금 신청서
    - [x] 유족급여 신청서
    - [x] 장의비 신청서
  - [x] 서류 데이터 파일 생성 (`lib/data/documents.ts`)
    - [x] 각 서류의 기본 정보 (이름, 설명, 카테고리)
    - [x] 공식 다운로드 링크
    - [x] 작성 예시 링크
    - [x] 필요 서류 목록
    - [x] 처리 기간
    - [x] 관련 서류 연결
- [x] **AI 요약 가이드 생성** (4-5시간) ✅ 완료 (2025-01-14)
  - [x] 프롬프트 엔지니어링 (`lib/prompts/document-summary.ts`)
    - [x] 일반인이 이해하기 쉬운 언어 사용
    - [x] 법률/행정 용어 최소화
    - [x] 구체적인 예시 포함
    - [x] 단계별 설명 형식
  - [x] AI 요약 생성 함수 구현 (`lib/api/document-summary.ts`)
    - [x] `generateDocumentSummary()` 함수
    - [x] Gemini API 연동
  - [x] 응답 파싱 로직 구현 (마크다운 → 구조화된 데이터)
    - [x] 전체 요약 추출
    - [x] 섹션별 작성 방법 추출
    - [x] 주의사항 추출
  - [x] Supabase 캐싱 전략 구현 (7일 TTL)
    - [x] `document_summaries` 테이블 생성 (마이그레이션)
    - [x] 캐시 조회 함수 (`getCachedDocumentSummary`)
    - [x] 캐시 저장 함수 (`cacheDocumentSummary`)
  - [x] 면책 조항 자동 포함 로직 (`lib/utils/disclaimer.ts`)
    - [x] 면책 조항 텍스트 정의
    - [x] 자동 추가 함수
- [x] **서류 가이드 UI 구현** (5-6시간) ✅ 완료 (2025-01-14)
  - [x] 서류 목록 페이지 수정 (`app/documents/page.tsx`)
    - [x] 페이지 레이아웃
    - [x] 면책 조항 표시
  - [x] DocumentsList 컴포넌트 생성 (`components/documents/DocumentsList.tsx`)
    - [x] shadcn/ui Accordion 컴포넌트 사용
    - [x] 서류 목록 표시
    - [x] 서류 선택 상태 관리
  - [x] DocumentSummary 컴포넌트 생성 (`components/documents/DocumentSummary.tsx`)
    - [x] AI 요약 결과 표시
    - [x] 로딩 상태 처리 (스피너)
    - [x] 에러 상태 처리
    - [x] 주요 항목별 작성 방법 표시
    - [x] 주의사항 표시 (Alert 색상)
    - [x] 다운로드 링크 버튼
    - [x] 작성 예시 링크 버튼
  - [x] API Route 생성 (`app/api/documents/[id]/summary/route.ts`)
    - [x] 캐시 확인 로직
    - [x] AI 요약 생성 호출
    - [x] 캐시 저장
    - [x] 에러 처리
    - [x] forceRefresh 파라미터 지원
  - [x] **반응형 디자인 검증** ✅ 완료 (2025-01-26)
    - [x] 모바일 화면(375px)에서 레이아웃 확인 및 개선
      - [x] 패딩 반응형 조정 (p-3 sm:p-4 md:p-6)
      - [x] 아이콘 크기 반응형 조정 (40px sm:48px md:56px)
      - [x] 텍스트 크기 반응형 조정 (text-xs sm:text-sm md:text-base)
      - [x] 그리드 레이아웃 반응형 조정 (grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4)
    - [x] 태블릿 화면(768px)에서 레이아웃 확인
    - [x] 데스크톱 화면(1920px)에서 레이아웃 확인
  - [x] **접근성 검증** ✅ 완료 (2025-01-26)
    - [x] 키보드 네비게이션 지원 확인 및 개선
      - [x] Tab 키로 모든 인터랙티브 요소 접근 가능 확인
      - [x] Enter 키로 서류 카드 클릭 가능 확인
      - [x] 포커스 링 스타일 개선 (`focus-visible:ring-2 focus-visible:ring-primary`)
    - [x] 스크린 리더 지원 확인 및 개선
      - [x] ARIA 라벨 추가 (서류 카드, 버튼, 입력 필드 등)
      - [x] 로딩 상태 알림 (`aria-live="polite"`, `role="status"`)
      - [x] 에러 메시지 알림 (`role="alert"`, `aria-live="assertive"`)
      - [x] 대화 기록 영역 (`role="log"`, `aria-live="polite"`)
      - [x] 스크린 리더 전용 텍스트 추가 (`.sr-only` 클래스)
      - [x] `role="region"`, `role="list"`, `role="article"` 추가
    - [x] 색상 대비 확인 (WCAG AA)
      - [x] Primary 색상과 배경색 대비 확인
      - [x] 텍스트 색상과 배경색 대비 확인
      - [x] Alert 색상과 배경색 대비 확인
      - [x] 하드코딩된 색상을 CSS 변수로 교체 (`#FF9500` → `var(--alert)`)
    - [x] 포커스 관리 확인
      - [x] 포커스 링 표시 확인 (`focus-visible` 스타일)
      - [x] 포커스 순서 논리적 확인 (Tab 키 순서)
      - [x] 클릭 피드백 추가 (`active:scale-[0.98]`)

- [x] **서류 전용 챗봇 구현** (신규) ✅ 완료 (2025-01-14)
  - [x] 챗봇 프롬프트 설계 (`lib/prompts/document-assistant.ts`)
  - [x] 챗봇 API Route 생성 (`app/api/documents/chat/route.ts`)
    - [x] 질문 입력 검증
    - [x] 서류 데이터 및 캐시된 요약 컨텍스트 구성
    - [x] Gemini API 호출 및 응답 생성
  - [x] 챗봇 UI 컴포넌트 생성 (`components/documents/DocumentAssistant.tsx`)
    - [x] UI 상단 고정 카드 형태
    - [x] 질의 입력 폼 및 응답 표시
    - [x] 추천 질문 버튼
  - [x] `/documents` 페이지에 챗봇 통합
  - [x] 503/에러 처리 및 사용자 안내 메시지
- [ ] **참고 문서**: `docs/DOCUMENTS_AI_GUIDE_PLAN.md` (상세 계획)

### Phase 1.3.5: n8n RAG 챗봇 연동 (신규) 🔴
- [x] **n8n RAG 챗봇 페이지 생성** (Priority 1) 🔴 ✅ 완료 (2025-11-26)
  - [x] 환경 변수 설정
    - [x] `.env.local`에 `NEXT_PUBLIC_N8N_WEBHOOK_URL` 추가
    - [x] `.env.example`에도 동일하게 추가 (주석 포함)
    - [x] **ngrok URL 업데이트 가이드 문서 작성** (`docs/N8N_WEBHOOK_URL_UPDATE.md`)
      - [x] ngrok 실행 방법
      - [x] ngrok URL 확인 방법
      - [x] `.env.local` 파일에서 `NEXT_PUBLIC_N8N_WEBHOOK_URL` 업데이트 방법
      - [x] 개발 서버 재시작 필요 안내
      - [x] 주의사항: ngrok 재시작 시 URL 변경됨
  - [x] 페이지 생성 (`app/chatbot/page.tsx`)
    - [x] 서버 컴포넌트로 생성
    - [x] Clerk `auth()`를 사용하여 로그인 확인
    - [x] 로그인하지 않은 경우 홈으로 리다이렉트
    - [x] 로그인한 경우 `RagChatbot` 컴포넌트 렌더링
    - [x] 페이지 제목 및 레이아웃은 기존 `app/documents/page.tsx` 스타일 참고
  - [x] 챗봇 컴포넌트 생성 (`components/rag-chatbot/RagChatbot.tsx`)
    - [x] 클라이언트 컴포넌트 (`'use client'`)
    - [x] 기존 `components/documents/DocumentAssistant.tsx` 구조 참고
    - [x] 주요 기능:
      - [x] 질문 입력 폼 (Textarea)
      - [x] 메시지 목록 표시 (user/assistant)
      - [x] 로딩 상태 처리
      - [x] 에러 처리
    - [x] n8n 웹훅 호출:
      - [x] `fetch`를 사용하여 POST 요청
      - [x] `message`: 사용자 입력
      - [x] `sessionId`: Clerk `useUser().user?.id` 사용
      - [x] 응답: `data.result.output`에서 답변 추출
    - [x] 마크다운 렌더링: 기존 DocumentAssistant의 `markdownToHtml` 함수 재사용 또는 유사한 로직 구현
  - [x] 타입 정의
    - [x] `ChatMessage` 인터페이스 정의 (컴포넌트 내부에 포함)
  - [x] 스타일링
    - [x] 기존 DocumentAssistant와 동일한 디자인 시스템 사용
    - [x] Tailwind CSS 클래스 재사용
    - [x] RiuIcon, RiuLoader 등 기존 UI 컴포넌트 활용
  - [x] 네비게이션 링크 추가
    - [x] `components/Navbar.tsx`에 "산재 상담" 탭 추가
    - [x] `components/ResponsiveNavigation.tsx`에 모바일/태블릿 탭 추가
  - [x] **테스트 및 검증** (Priority 1) 🔴 ✅ 완료 (2025-11-26)
    - [x] 챗봇 기본 기능 테스트
      - [x] 질문 입력 및 답변 수신 확인
      - [x] 세션 ID 기반 대화 기록 유지 확인
      - [x] 마크다운 렌더링 확인
    - [x] 에러 처리 테스트
      - [x] 웹훅 URL 미설정 시 에러 메시지 표시 확인
      - [x] 네트워크 오류 시 에러 처리 확인
      - [x] n8n 워크플로우 오류 시 에러 처리 확인
    - [x] 로그인 상태 확인
      - [x] 비로그인 사용자 접근 시 홈으로 리다이렉트 확인
      - [x] 로그인 사용자만 챗봇 사용 가능 확인
    - [x] ngrok URL 변경 시 동작 확인
      - [x] 환경 변수 업데이트 후 서버 재시작 시 정상 작동 확인
  - [ ] **사용자 경험 개선** (Priority 2) 🟡
    - [x] 추천 질문 버튼 추가
      - [x] "요양급여가 뭔가요?", "산업재해 신청은 어떻게 하나요?" 등 자주 묻는 질문 버튼
      - [x] 클릭 시 자동으로 질문 입력 및 전송
    - [x] 대화 기록 초기화 버튼 추가
      - [x] 새로운 세션 시작 기능
    - [x] 입력 히스토리 기능 (선택사항)
      - [x] 이전 질문 다시 보기 버튼 (최근 5개)
    - [ ] 로딩 상태 개선
      - [ ] 스트리밍 응답 지원 (향후 개선)
      - [x] 타임아웃 처리 추가
  - [x] **반응형 디자인 검증** (Priority 2) 🟡 ✅ 완료 (2025-01-26)
    - [x] 모바일 화면(375px)에서 챗봇 UI 확인 및 개선
      - [x] 패딩 반응형 조정 (p-4 sm:p-6)
      - [x] 아이콘 크기 반응형 조정 (40px sm:48px)
      - [x] 텍스트 크기 반응형 조정 (text-xs sm:text-sm)
      - [x] 메시지 목록 max-height 반응형 조정 (300px sm:400px md:500px)
      - [x] 버튼 크기 및 간격 반응형 조정
    - [x] 태블릿 화면(768px)에서 챗봇 UI 확인
    - [x] 데스크톱 화면(1920px)에서 챗봇 UI 확인
    - [x] 메시지 목록 스크롤 동작 확인
    - [x] 입력 폼 반응형 레이아웃 확인 (flex-col sm:flex-row)
  - [ ] **접근성 검증** (Priority 3) 🟢
    - [ ] 키보드 네비게이션 지원 확인
    - [ ] 스크린 리더 지원 확인 (ARIA 라벨)
    - [ ] 색상 대비 확인 (WCAG AA)
    - [ ] 포커스 관리 확인
  - [ ] **프로덕션 준비** (Priority 2) 🟡
    - [x] **프로덕션 준비 가이드 문서 작성** (`docs/CHATBOT_PRODUCTION_GUIDE.md`) ✅ 완료
      - [x] ngrok 대신 고정 도메인 설정 옵션 정리 (n8n 클라우드, 리버스 프록시, PaaS)
      - [x] 환경 변수 프로덕션 설정 가이드 작성
      - [x] 에러 로깅 및 모니터링 옵션 정리 (구조화된 로깅, Supabase 저장)
      - [x] 배포 전/후 체크리스트 작성
      - [x] 문제 해결 가이드 작성
    - [ ] ngrok 대신 고정 도메인 설정 검토
      - [ ] n8n 클라우드 사용 검토
      - [ ] 리버스 프록시 설정 검토
      - [ ] 도메인 및 SSL 인증서 설정
    - [ ] 환경 변수 프로덕션 설정
      - [x] Vercel 환경 변수 설정 가이드 작성 ✅ 완료
    - [x] **에러 로깅 및 모니터링** ✅ 완료 (2025-01-26)
      - [x] 에러 로깅 유틸리티 함수 생성 (`lib/utils/error-logging.ts`)
        - [x] `logError()` 함수 구현 (클라이언트/서버)
        - [x] `logApiError()` 함수 구현 (API 라우트 전용)
      - [x] 챗봇 사용 통계 로깅 함수 생성 (`lib/utils/chatbot-analytics.ts`)
        - [x] `logChatbotActivity()` 함수 구현
        - [x] Supabase `user_activity_logs` 테이블에 저장
        - [x] API 라우트 생성 (`app/api/analytics/chatbot/route.ts`)
      - [x] API 라우트 에러 로깅 개선
        - [x] `app/api/documents/chat/route.ts`에 에러 로깅 및 통계 수집 추가
        - [x] `app/api/documents/[id]/summary/route.ts`에 에러 로깅 추가
      - [x] 챗봇 컴포넌트에 사용 통계 수집 추가
        - [x] `components/rag-chatbot/RagChatbot.tsx`에 질문/응답/에러 로깅 추가
      - [x] 전역 에러 핸들러 추가 (`app/error.tsx`)
        - [x] Error Boundary 구현
        - [x] 구조화된 에러 로깅
      - [x] 참고: Vercel Analytics는 사용하지 않기로 결정 (패키지 설치 문제)
  - [ ] 예상 소요 시간: 3-4시간 (기본 구현 완료), 추가 개선 2-3시간
  - [ ] 참고 문서: `docs/N8N_RAG_CHATBOT_WORKFLOW.md` (워크플로우 상세 분석)

### Phase 1.3.6: 산재 절차 타임라인 기능 구현 (신규) 🔴
- [ ] **Supabase 테이블 생성** (Priority 1) 🔴
  - [ ] `stages` 테이블 생성 (단계 정보)
    - [ ] 컬럼: `id` (UUID, PK), `step_number` (INTEGER), `title` (TEXT), `description` (TEXT), `next_condition` (TEXT), `created_at` (TIMESTAMPTZ), `updated_at` (TIMESTAMPTZ)
    - [ ] 인덱스: `step_number` (UNIQUE)
    - [ ] RLS 비활성화 (개발 환경)
  - [ ] `documents` 테이블 생성 (단계별 필수 서류)
    - [ ] 컬럼: `id` (UUID, PK), `stage_id` (UUID, FK → stages.id), `title` (TEXT), `pdf_url` (TEXT), `is_required` (BOOLEAN), `created_at` (TIMESTAMPTZ), `updated_at` (TIMESTAMPTZ)
    - [ ] 인덱스: `stage_id`
    - [ ] RLS 비활성화 (개발 환경)
  - [ ] `warnings` 테이블 생성 (단계별 주의사항)
    - [ ] 컬럼: `id` (UUID, PK), `stage_id` (UUID, FK → stages.id), `content` (TEXT), `created_at` (TIMESTAMPTZ), `updated_at` (TIMESTAMPTZ)
    - [ ] 인덱스: `stage_id`
    - [ ] RLS 비활성화 (개발 환경)
  - [ ] 4단계 Seed 데이터 입력
    - [ ] Step 1: 산재 최초 신청 (인정 단계)
    - [ ] Step 2: 요양 및 치료 + 휴업급여
    - [ ] Step 3: 치료 종결 및 장해 심사
    - [ ] Step 4: 사회 복귀 및 직업 재활
    - [ ] 각 단계별 필수 서류 데이터 입력
    - [ ] 각 단계별 주의사항 데이터 입력
  - [ ] PDF URL 필드 테스트 값 연결
    - [ ] 공식 링크 우선 제공 (근로복지공단 공식 사이트)
    - [ ] 공식 링크가 없는 경우 로컬 PDF 파일 제공 (`/pdf/` 폴더)
  - [ ] 예상 소요 시간: 2-3시간
  - [ ] 참고 문서: `docs/flow_page.md` (상세 계획)
- [ ] **타임라인 UI 구현** (Priority 1) 🔴
  - [ ] TimelineContainer 기본 레이아웃 구현 (`components/timeline/TimelineContainer.tsx`)
    - [ ] 반응형 레이아웃: 모바일 세로 타임라인 / 데스크톱 가로 타임라인
    - [ ] 모바일 (< 768px): 세로 타임라인 (위에서 아래로 흐름)
    - [ ] 데스크톱 (≥ 768px): 가로 타임라인 (왼쪽에서 오른쪽으로 흐름)
    - [ ] Stage progression 화살표 아이콘 적용 (단계 간 연결)
    - [ ] 기존 Warm & Rounded 테마 유지
    - [ ] 기존 색상 시스템 활용 (Primary Green)
  - [ ] TimelineStepCard 컴포넌트 생성 (`components/timeline/TimelineStepCard.tsx`)
    - [ ] 단계 카드 UI (단계 번호, 제목, 간단한 설명)
    - [ ] 단계 상태 표시 (기본/활성/완료) - 향후 개인화 기능용
    - [ ] 클릭 가능한 카드 인터랙션
    - [ ] 호버 효과 및 포커스 관리
  - [ ] TimelineDetailPanel 컴포넌트 생성 (`components/timeline/TimelineDetailPanel.tsx`)
    - [ ] Full Screen Modal (모바일) / 슬라이드 패널 (데스크톱) 구현
    - [ ] 기존 Sheet, Dialog 컴포넌트 재사용
    - [ ] 모달/패널 내부 탭 구조:
      1. 지금 해야 할 일
      2. 필수 서류 (PDF 다운로드 버튼 포함)
      3. 주의사항 / 분쟁 포인트
    - [ ] 하단: "다음 단계 보기" 버튼
    - [ ] 모달 전환 애니메이션 (모바일: 아래 → 위 슬라이드, 데스크톱: 페이드 + 스케일)
  - [ ] LegalNotice 컴포넌트 생성 (`components/timeline/LegalNotice.tsx`)
    - [ ] 법적 고지 상단 고정 표시
    - [ ] 면책 조항 텍스트: "본 페이지는 일반적인 산재 절차 안내를 목적으로 하며, 실제 적용 여부는 근로복지공단의 판단과 개별 사안에 따라 달라질 수 있습니다. 본 정보는 법적 효력을 갖지 않습니다."
    - [ ] Alert 색상 배경 적용
  - [ ] DocumentDownloadButton 컴포넌트 생성 (`components/timeline/DocumentDownloadButton.tsx`)
    - [ ] PDF 다운로드 버튼
    - [ ] 기존 PDF 뷰어 페이지(`/view-pdf`) 연동
    - [ ] 공식 링크와 로컬 PDF 구분 처리
  - [ ] 예상 소요 시간: 4-6시간
- [ ] **인터랙션 구현** (Priority 1) 🔴
  - [ ] 단계 카드 클릭 이벤트 처리
    - [ ] 클릭 시 상세 정보 패널/모달 오픈
    - [ ] 현재 단계 하이라이트
  - [ ] Full Screen Modal 오픈/클로즈 구현
    - [ ] 모바일: Full Screen Modal
    - [ ] 데스크톱: 슬라이드 패널 (Sheet 컴포넌트 활용)
    - [ ] 닫기 버튼 및 배경 클릭 시 닫기
  - [ ] 탭 UI 구현 (해야 할 일 / 서류 / 주의사항)
    - [ ] 탭 전환 기능
    - [ ] 각 탭별 콘텐츠 표시
    - [ ] 활성 탭 시각적 표시
  - [ ] PDF 다운로드 버튼 연결
    - [ ] 공식 링크: 새 탭에서 열기
    - [ ] 로컬 PDF: `/view-pdf` 페이지로 이동
    - [ ] 다운로드 기능 (선택사항)
  - [ ] "다음 단계 보기" 버튼
    - [ ] 다음 단계로 스크롤 또는 이동
    - [ ] 마지막 단계에서는 숨김 처리
  - [ ] 예상 소요 시간: 3-4시간
- [ ] **네비게이션 통합** (Priority 1) 🔴
  - [ ] Navbar에 "진행 과정" 메뉴 추가
    - [ ] `components/Navbar.tsx`의 `tabs` 배열에 새 항목 추가
    - [ ] href: `/timeline`
    - [ ] label: "진행 과정" 또는 "산재 절차"
    - [ ] 기존 메뉴와 일관된 스타일 적용
  - [ ] ResponsiveNavigation에 "진행 과정" 탭 추가
    - [ ] `components/ResponsiveNavigation.tsx`의 `tabs` 배열에 새 항목 추가
    - [ ] 아이콘: `Timeline` 또는 `List` (lucide-react)
    - [ ] 모바일 하단 탭 바에 4개 탭 표시 (공간 고려 필요)
    - [ ] 기존 탭과 일관된 스타일 적용
  - [ ] 예상 소요 시간: 30분-1시간
- [ ] **라우팅 설정** (Priority 1) 🔴
  - [ ] `/timeline` 페이지 생성 (`app/timeline/page.tsx`)
    - [ ] 서버 컴포넌트로 생성
    - [ ] Supabase에서 단계 데이터 fetch
    - [ ] TimelineContainer 컴포넌트 렌더링
    - [ ] LegalNotice 컴포넌트 상단 고정
  - [ ] 기존 라우트와 충돌 확인 및 해결
    - [ ] `/timeline` 경로가 기존 라우트와 충돌하지 않는지 확인
    - [ ] 필요시 경로 조정
  - [ ] 예상 소요 시간: 30분-1시간
- [ ] **반응형 디자인 검증** (Priority 2) 🟡
  - [ ] 모바일 화면(375px)에서 타임라인 UI 확인
    - [ ] 세로 타임라인 레이아웃 검증
    - [ ] Full Screen Modal 동작 확인
    - [ ] 터치 인터랙션 최적화
  - [ ] 태블릿 화면(768px)에서 타임라인 UI 확인
  - [ ] 데스크톱 화면(1920px)에서 타임라인 UI 확인
    - [ ] 가로 타임라인 레이아웃 검증
    - [ ] 슬라이드 패널 동작 확인
  - [ ] 예상 소요 시간: 1-2시간
- [ ] **접근성 검증** (Priority 3) 🟢
  - [ ] 키보드 네비게이션 지원 확인
    - [ ] Tab 키로 모든 인터랙티브 요소 접근 가능
    - [ ] Enter 키로 단계 카드 클릭 가능
    - [ ] 포커스 링 스타일 확인
  - [ ] 스크린 리더 지원 확인
    - [ ] ARIA 라벨 추가 (단계 카드, 버튼 등)
    - [ ] 단계 상태 알림 (`aria-live="polite"`)
    - [ ] 법적 고지 알림 (`role="alert"`)
  - [ ] 색상 대비 확인 (WCAG AA)
  - [ ] 포커스 관리 확인
  - [ ] 예상 소요 시간: 1-2시간
- [ ] **성공 기준 검증** (Priority 2) 🟡
  - [ ] 산재 초보자가 다음을 **3분 안에** 이해할 수 있는지 테스트:
    - [ ] "지금 내가 어디 단계인지"
    - [ ] "지금 당장 해야 할 행동"
    - [ ] "어떤 서류를 언제 내야 하는지"
  - [ ] 실사용자 기준 UX 1차 피드백
  - [ ] 문구 난이도 최종 조정
  - [ ] 예상 소요 시간: 1-2시간
- [ ] **2차 확장 준비 (향후)** (Priority 4) 🔵
  - [ ] `user_stage_progress` 테이블 생성 (개인화 기능용)
    - [ ] 컬럼: `id` (UUID, PK), `user_id` (TEXT, Clerk user ID), `stage_id` (UUID, FK), `status` (TEXT: pending/active/completed), `updated_at` (TIMESTAMPTZ)
    - [ ] 인덱스: `user_id`, `stage_id`
  - [ ] `user_documents_progress` 테이블 생성 (개인화 기능용)
    - [ ] 컬럼: `id` (UUID, PK), `user_id` (TEXT, Clerk user ID), `document_id` (UUID, FK), `is_submitted` (BOOLEAN), `submitted_at` (TIMESTAMPTZ)
    - [ ] 인덱스: `user_id`, `document_id`
  - [ ] 예상 소요 시간: 1시간 (테이블 생성만)
- [ ] **총 예상 소요 시간**: 12-18시간
- [ ] **참고 문서**: 
  - [ ] `docs/flow_page.md` (상세 구현 계획)
  - [ ] `docs/PRD.md` (2.3 산재 절차 타임라인 가이드)
- [ ] **타임라인 UI/UX 개선 (토스 스타일, 중장년층 친화적)** (Priority 1) 🔴 ⭐ 새로 추가
  - [x] **1단계: 폰트 크기 및 가독성 개선** (2-3시간) 🔴 ✅ 완료 (2025-01-27)
    - [x] TimelineStepCard 컴포넌트 개선
      - [x] 제목 폰트 크기 증가: `text-lg sm:text-xl` → `text-xl sm:text-2xl md:text-3xl`
      - [x] 설명 텍스트 크기 증가: `text-sm sm:text-base` → `text-base sm:text-lg`
      - [x] 배지 텍스트 크기 증가: `text-xs sm:text-sm` → `text-sm sm:text-base`
      - [x] 카드 패딩 증가: `p-4 sm:p-6` → `p-6 sm:p-8`
      - [x] 카드 간격 증가: `gap-4 sm:gap-6` → `gap-6 sm:gap-8`
      - [x] 단계 번호 원형 배지 크기 증가: `w-10 h-10 sm:w-12 sm:h-12` → `w-14 h-14 sm:w-16 sm:h-16`
      - [x] 단계 번호 폰트 크기 증가: `text-lg sm:text-xl` → `text-xl sm:text-2xl`
      - [x] 화살표 아이콘 크기 증가: `w-5 h-5 sm:w-6 sm:h-6` → `w-6 h-6 sm:w-7 sm:h-7`
    - [x] TimelineStepContent 컴포넌트 개선
      - [x] 탭 버튼 크기 증가: 패딩 `px-3 py-2 sm:px-4` → `px-5 py-3 sm:px-6 sm:py-4`
      - [x] 탭 버튼 폰트: `text-xs sm:text-sm md:text-base` → `text-base sm:text-lg`
      - [x] 탭 버튼 아이콘: `w-4 h-4` → `w-5 h-5 sm:w-6 sm:h-6`
      - [x] 탭 버튼 간격 증가: `gap-2 sm:gap-3` → `gap-3 sm:gap-4`
      - [x] 콘텐츠 카드 패딩 증가: `p-4` → `p-5 sm:p-6`
      - [x] 콘텐츠 카드 간격 증가: `space-y-3` → `space-y-4 sm:space-y-5`
      - [x] 아이콘 크기 증가: `w-5 h-5` → `w-6 h-6 sm:w-7 sm:h-7`
      - [x] 이전/다음 버튼 크기 증가: `size="lg"` 적용
      - [x] 버튼 텍스트 크기: `text-base sm:text-lg`로 명시
    - [x] 페이지 헤더 개선
      - [x] 제목과 설명 간격 증가: `mt-2 sm:mt-3` → `mt-4 sm:mt-6`
      - [x] 전체 페이지 간격 증가: `space-y-6 sm:space-y-8 md:space-y-12` → `space-y-8 sm:space-y-10 md:space-y-16`
  - [x] **2단계: 버튼 및 터치 영역 개선** (1-2시간) 🔴 ✅ 완료 (2025-01-27)
    - [x] DocumentDownloadButton 컴포넌트 개선
      - [x] 버튼 크기: `size="sm"` → `size="default"`
      - [x] 아이콘 크기 증가: `w-4 h-4` → `w-5 h-5 sm:w-6 sm:h-6`
      - [x] 텍스트 표시: 모바일에서도 텍스트 표시 (`hidden sm:inline` → 항상 표시)
      - [x] 최소 터치 영역: `min-h-[44px]` 보장
      - [x] 버튼 텍스트 크기: `text-base sm:text-lg`로 명시
      - [x] PDF 없음 텍스트 크기 증가: `text-xs sm:text-sm` → `text-sm sm:text-base`
    - [x] 네비게이션 버튼 개선
      - [x] 버튼 크기: 기본 → `size="lg"` (이미 완료)
      - [x] 버튼 간격: `gap-3` → `gap-4 sm:gap-6`
      - [x] 아이콘 크기: `w-4 h-4` → `w-5 h-5 sm:w-6 sm:h-6` (이미 완료)
      - [x] 버튼 텍스트 크기: `text-base sm:text-lg`로 명시 (이미 완료)
      - [x] 최소 높이: `min-h-[48px]` 보장
  - [x] **3단계: 진행 상황 시각화 추가** (2-3시간) 🟡 ✅ 완료 (2025-01-27)
    - [x] 현재 단계 표시 기능 추가
      - [x] 현재 단계인지 표시하는 prop 추가 (`isCurrentStep`)
      - [x] 현재 단계일 경우 배경색 변경: `bg-white` → `bg-primary/20`
      - [x] 현재 단계일 경우 테두리 강조: `border-[var(--border-medium)]` → `border-2 border-primary`
      - [x] "현재 단계" 배지 추가 (초록색 배경, 흰색 텍스트)
      - [x] URL 쿼리 파라미터로 현재 단계 전달 (`?step=N`)
      - [x] 단계 상세 페이지에서 메인 페이지로 돌아갈 때 현재 단계 전달
    - [x] 진행률 표시 추가
      - [x] 상단에 진행률 바 추가 (현재 단계가 있을 때만 표시)
      - [x] "4단계 중 N단계" 텍스트 표시
      - [x] 시각적 진행률 바 (프로그레스 바, 애니메이션 효과 포함)
      - [x] 접근성 개선 (aria-label, role="progressbar" 추가)
  - [x] **4단계: 초보자 안내 메시지 추가** (2-3시간) 🟡 ✅ 완료 (2025-01-27)
    - [x] 첫 방문 안내 추가
      - [x] FirstVisitBanner 컴포넌트 생성
      - [x] 페이지 상단에 안내 배너 추가
      - [x] "처음이신가요? 아래 단계를 순서대로 확인해보세요" 메시지
      - [x] Info 아이콘과 함께 표시
      - [x] 닫기 버튼 제공 (X 아이콘)
      - [x] localStorage를 사용한 "다시 보지 않기" 기능
      - [x] 각 단계 카드에 간단한 안내 텍스트 추가: "이 단계에서는 해야 할 일, 필요한 서류, 주의사항을 확인할 수 있습니다."
    - [x] 각 탭에 안내 텍스트 추가
      - [x] "해야 할 일" 탭: "이 단계에서 꼭 해야 하는 일들입니다" (CheckCircle2 아이콘)
      - [x] "필수 서류" 탭: "이 단계에서 필요한 서류들입니다" (FileText 아이콘)
      - [x] "주의사항" 탭: "이 단계에서 꼭 알아두어야 할 내용입니다" (AlertTriangle 아이콘)
      - [x] 각 탭별 색상과 아이콘으로 구분된 안내 박스 표시
  - [x] **5단계: 색상 및 시각적 개선** (1-2시간) 🔴 ✅ 완료 (2025-01-27)
    - [x] 색상 대비 강화
      - [x] 텍스트 색상 대비 확인 및 강화
      - [x] 제목: `text-[#111827]` (거의 검정) 유지
      - [x] 본문: `text-muted-foreground` → `text-[#374151]` (더 진한 회색)로 변경 (가독성 향상)
      - [x] 보조 텍스트: `text-muted-foreground` → `text-[#6B7280]` (중간 회색)로 변경
      - [x] 배경색과 텍스트 색상 대비율 4.5:1 이상 보장 (WCAG AA 기준 준수)
      - [x] 활성 상태 색상 강조: `hover:bg-primary/5` → `hover:bg-primary/10`
      - [x] 탭 버튼 비활성 텍스트: `text-muted-foreground` → `text-[#6B7280]` (더 진한 회색)
    - [x] 아이콘 및 시각적 요소 개선
      - [x] 모든 아이콘 크기 일괄 증가 (최소 20px 이상 확인 완료)
      - [x] 아이콘과 텍스트 간격 증가: `gap-2` → `gap-3 sm:gap-4`
      - [x] 안내 박스 아이콘 크기 증가: `w-5 h-5 sm:w-6 sm:h-6` → `w-6 h-6 sm:w-7 sm:h-7`
      - [x] 안내 박스 패딩 증가: `p-4` → `p-4 sm:p-5`
      - [x] 체크 아이콘, 경고 아이콘 등 시각적 요소 강조 (크기 및 색상 확인)
  - [x] **6단계: 반응형 디자인 개선** (1-2시간) 🟡 ✅ 완료 (2025-01-27)
    - [x] 모바일 최적화
      - [x] 모바일에서도 충분한 터치 영역 보장 (최소 44x44px) - 모든 배지와 버튼에 `min-h-[44px]` 적용
      - [x] 모바일에서 텍스트가 작아지지 않도록 최소 크기 보장 - `text-sm` → `text-base`로 변경
      - [x] 가로 스크롤 방지 (탭 버튼은 예외) - 탭 버튼만 `overflow-x-auto` 적용, 다른 요소는 가로 스크롤 없음
      - [x] 충분한 여백 확보 - 패딩과 간격 확인 완료
    - [x] 데스크톱 최적화
      - [x] 데스크톱에서도 큰 폰트와 여백 유지 - `sm:`, `md:` 브레이크포인트로 큰 폰트 유지
      - [x] 최대 너비 제한으로 가독성 향상 - `max-w-7xl` (메인 페이지), `max-w-4xl` (상세 페이지) 적용
      - [x] 호버 효과 강화 - `hover:bg-primary/10`, `active:bg-primary/15` 추가
  - [x] **7단계: 접근성 개선** (2-3시간) 🟢 ✅ 완료 (2025-01-27)
    - [x] 키보드 네비게이션 개선
      - [x] 모든 인터랙티브 요소에 키보드 포커스 스타일 추가 - `focus:ring-2 focus:ring-primary focus:ring-offset-2` 적용
      - [x] Tab 순서 최적화 - `tabIndex` 속성으로 탭 순서 제어
      - [x] Enter/Space 키로 모든 버튼 작동 보장 - `onKeyDown` 핸들러 추가
    - [x] 스크린 리더 지원 강화
      - [x] aria-label 개선 및 추가 - 모든 인터랙티브 요소에 명확한 aria-label 추가
      - [x] aria-describedby로 추가 설명 제공 - 단계 카드에 설명 연결
      - [x] role 속성 적절히 사용 - `role="tab"`, `role="tabpanel"`, `role="tablist"`, `role="region"`, `role="list"`, `role="group"`, `role="navigation"` 등 적용
      - [x] 진행 상황을 스크린 리더로 알릴 수 있도록 개선 - `aria-live="polite"`, `aria-atomic="true"` 추가, 진행률 퍼센트 포함
      - [x] 탭 패턴 구현 - ARIA 탭 패턴 완전 구현 (role="tab", role="tabpanel", aria-controls, aria-labelledby)
      - [x] 숨겨진 레이블 추가 - `sr-only` 클래스로 스크린 리더 전용 레이블 추가
  - [ ] **총 예상 소요 시간**: 11-18시간
  - [ ] **참고 문서**: 
    - [ ] `docs/features/timeline-improvement-plan.md` (상세 개선 계획)
    - [ ] `docs/features/timeline.md` (기능 문서)

### Phase 1.4: 디자인 시스템 일관성 검증 (Priority 3) 🟢
- [x] **PRD 타이포그래피 시스템 검증 및 적용** ✅ 완료 (2025-01-26)
  - [x] 현재 컴포넌트에서 타이포그래피 사용 현황 확인
  - [x] PRD 규격과 다른 부분 수정 (h1: 30px, h2: 22px, body: 17px, caption: 14px)
  - [x] H1 타이포그래피: 30px 적용 확인 ✅
  - [x] **H2 타이포그래피 수정 (Priority 1)** 🔴 ✅ 완료
    - [x] 현재: 18px (실제 렌더링)
    - [x] 목표: 22px (design.md 기준)
    - [x] 문제: `app/globals.css`에 h2 스타일이 정의되어 있으나 Tailwind 클래스와 충돌 가능
    - [x] 해결: `app/hospitals/page-client.tsx`의 h2에 명시적으로 `text-[22px]` 적용
    - [x] 영향: "반경 5km 내 기관 (46개)" 제목 등 모든 h2 요소
    - [x] 예상 소요 시간: 30분
  - [x] **Body 타이포그래피 수정** ✅ 완료 (2025-01-26)
    - [x] 현재: 16px
    - [x] 목표: 17px (PRD 기준)
    - [x] 해결: `app/globals.css`의 body 스타일을 `text-[16px]` → `text-[17px]`로 수정
  - [x] Caption 타이포그래피: 14px 적용 확인 ✅
  - [x] 컴포넌트별 타이포그래피 일관성 검증 완료
  - [x] 참고: `app/globals.css` (229-237줄: 타이포그래피 스케일 정의)
- [x] **색상 팔레트 일관성 검증** ✅ 완료 (2025-01-26)
  - [x] 컴포넌트에서 하드코딩된 색상 검색 (`#2F6E4F`, `#9333EA`, `#FFD54F`, `#34C759` 등)
  - [x] CSS 변수 또는 Tailwind 색상 클래스로 통일
    - [x] `app/globals.css`에 기관별 색상 변수 추가 (`--color-hospital`, `--color-pharmacy`, `--color-rehabilitation`)
    - [x] `lib/constants/colors.ts` 생성 (동적 HTML 문자열용 색상 상수)
    - [x] 주요 컴포넌트의 하드코딩 색상을 CSS 변수 기반으로 교체
      - [x] `text-[#2F6E4F]` → `text-primary`
      - [x] `bg-[#2F6E4F]` → `bg-primary`
      - [x] `text-[#9333EA]` → `text-[var(--color-rehabilitation)]`
      - [x] `text-[#555555]` → `text-muted-foreground`
      - [x] `text-[#1C1C1E]` → `text-foreground`
      - [x] `border-[#E8F5E9]` → `border-[var(--border-light)]`
  - [ ] Alert 색상 (`#FF9500`) 사용 현황 확인 (면책 조항 등) - 선택사항
  - [x] **배경색 수정 (Priority 1)** 🔴 ✅ 완료
    - [x] 현재: 순백색 (`#FFFFFF`)
    - [x] 목표: `#F2F2F7` (아주 연한 회색, design.md 기준)
    - [x] 문제: 순백색은 눈의 피로를 증가시킬 수 있음
    - [x] 해결: `app/globals.css`의 `--background` 값을 `#F2F2F7`로 변경
    - [x] 예상 소요 시간: 10분
  - [x] **Neutral 색상 체계 적용 (Priority 2)** 🟡 ✅ 완료
    - [x] 기본 텍스트: `#1C1C1E` (현재: Tailwind gray-600 등 사용)
    - [x] 보조 텍스트: `#8A8A8E` (현재: Tailwind gray-500 등 사용)
    - [x] 문제: 디자인 시스템과 일치하지 않음
    - [x] 해결: CSS 변수로 정의하고 `app/hospitals/page-client.tsx` 등에 적용
    - [x] 영향: 모든 텍스트 색상 (label, paragraph, caption 등)
    - [x] 예상 소요 시간: 1시간
  - [x] **필터 버튼 비활성 상태 색상 통일 (Priority 2)** 🟡 ✅ 완료
    - [x] 현재: `bg-gray-100 text-gray-700`
    - [x] 목표: `bg-[#F2F2F7] text-[#8A8A8E]` (Neutral 색상 체계 적용)
    - [x] 해결: 모든 필터 버튼의 비활성 상태를 `bg-[#F2F2F7] text-[#8A8A8E] hover:bg-[#E5E5EA]`로 통일
    - [x] 예상 소요 시간: 30분
  - [ ] 예상 소요 시간: 1시간
  - [ ] 참고: `app/globals.css` (54-59줄: PRD 색상 정의)
- [ ] **UI 컴포넌트 스타일 개선**
  - [x] **정보 카드 스타일 개선 (Priority 2)** 🟡 ✅ 완료
    - [x] 현재: 기본 border와 padding만 적용
    - [x] 목표: "둥근 모서리, 부드러운 그림자 효과" (design.md 기준)
    - [x] 해결: `app/hospitals/page-client.tsx`의 병원/재활기관 카드에 `shadow-sm hover:shadow-md` 추가, 목록 컨테이너에도 `shadow-sm` 추가
    - [x] 예상 소요 시간: 20분
  - [x] **필터 UI 디자인 개선 (Priority 1)** 🔴 ✅ 완료 (2025-01-14)
    - [x] **Phase 1: 버튼 스타일 개선** (1시간) ✅
      - [x] 비활성 상태: 흰색 배경, 회색 테두리, 회색 텍스트
      - [x] 활성 상태: 타입별 색상 배경(초록/보라), 흰색 텍스트, 그림자
      - [x] 둥근 모서리 및 일관된 스타일 적용
    - [x] **Phase 2: 그룹핑 및 레이아웃 개선** (30분) ✅
      - [x] `role="group"`과 `aria-label`로 그룹 명확화
      - [x] 그룹 간 간격 `gap-6` (24px)
      - [x] 버튼 간 간격 `gap-2` (8px)
      - [x] 모바일에서 구분선 숨김 (`hidden md:block`)
    - [x] **Phase 3: 타이포그래피 개선** (20분) ✅
      - [x] 텍스트 크기: `text-sm` (14px)
      - [x] 활성: `font-semibold` (600), 비활성: `font-medium` (500)
      - [x] 최소 너비: `min-w-[60px]`
    - [x] **Phase 4: 인터랙션 개선** (30분) ✅
      - [x] 호버 효과: 테두리/텍스트 색상 변경, 배경 미세 변화
      - [x] 클릭 효과: `active:scale-95`
      - [x] 트랜지션: `transition-all duration-200 ease-in-out`
      - [x] 포커스 링: `focus:ring-2` (키보드 접근성)
    - [x] **Phase 5: 반응형 최적화** (30분) ✅
      - [x] 모바일: `px-3 py-1.5` (작은 패딩)
      - [x] 데스크톱: `md:px-4 md:py-2` (표준 패딩)
      - [x] `flex-wrap`으로 자동 줄바꿈
    - [x] **Phase 6: 접근성 개선** (20분) ✅
      - [x] `role="group"` 추가
      - [x] `aria-label` 추가 (각 버튼과 그룹)
      - [x] `aria-pressed` 추가 (활성 상태)
      - [x] 키보드 포커스 링 지원
    - [x] 예상 소요 시간: 3시간 10분
    - [x] 참고: `docs/ui.plan.md` (상세 계획)
- [ ] **헤더 디자인 개선 (Priority 1)** 🔴 ⭐ 새로 추가
  - [x] **Phase 1: Paperozi 폰트 설정** (30분) ✅ 완료
    - [x] `app/globals.css`에 Paperozi @font-face 정의 추가 (9개 weight: 100-900)
    - [x] CSS 변수 추가 (`--font-brand: 'Paperozi', ...`)
    - [x] Tailwind 설정 업데이트 (`@theme inline`에 `--font-brand` 추가)
    - [x] 폰트 로딩 테스트 (브라우저 개발자 도구에서 확인)
  - [x] **Phase 2: Navbar 컴포넌트 디자인 개선** (1시간) ✅ 완료
    - [x] 브랜드명에 Paperozi 폰트 적용 (font-weight: 700)
    - [x] 브랜드명 크기 조정 (text-2xl, 24px)
    - [x] 브랜드명 색상 설정 (`#1C1C1E` 기본, 호버 시 `#3478F6`)
    - [x] 호버 효과 추가 (Primary 색상으로 전환, transition-colors)
    - [x] 헤더 배경색 설정 (`bg-white/95` 반투명 흰색)
    - [x] 그림자 효과 추가 (shadow-sm)
    - [x] Sticky positioning 추가 (sticky top-0 z-50)
    - [x] Backdrop blur 효과 추가 (backdrop-blur-sm)
    - [x] 레이아웃 및 간격 최적화 (max-w-7xl, px-4 sm:px-6 lg:px-8)
    - [x] 반응형 디자인 검증 (모바일, 태블릿, 데스크톱)
  - [x] **Phase 3: ResponsiveNavigation 스타일 개선** (30분) ✅ 완료
    - [x] 데스크톱 네비게이션 스타일 개선
      - [x] 헤더와 통합된 디자인 (backdrop-blur-sm, bg-white/95)
      - [x] 활성 탭 표시 개선 (배경색 bg-[#3478F6]/5 추가)
      - [x] 호버 효과 추가 (hover:text-[#1C1C1E] hover:bg-[#F2F2F7])
      - [x] Neutral 색상 체계 적용 (비활성: #8A8A8E)
    - [x] 태블릿 네비게이션 스타일 개선 (데스크톱과 동일)
    - [x] 모바일 하단 탭 바 스타일 개선
      - [x] 배경 블러 효과 (backdrop-blur-sm)
      - [x] 그림자 효과 추가 (shadow-lg)
      - [x] Neutral 색상 체계 적용 (비활성: #8A8A8E)
      - [x] 활성 상태 시각적 피드백 강화 (font-semibold)
      - [x] 전환 효과 개선 (transition-all duration-200)
  - [x] **Phase 4: 디자인 시스템 통합** (30분) ✅ 완료
    - [x] `docs/design.md` 업데이트 확인 (이미 완료)
    - [x] 모든 헤더 관련 컴포넌트에서 일관된 스타일 적용 확인
      - [x] Navbar와 ResponsiveNavigation 배경색 일관성 확인 (bg-white/95)
      - [x] Backdrop blur 효과 일관성 확인 (backdrop-blur-sm)
      - [x] 최대 너비 일관성 확인 (max-w-7xl)
      - [x] 패딩 일관성 확인 (px-4 sm:px-6 lg:px-8)
    - [x] 접근성 검증 (색상 대비, 폰트 크기)
      - [x] 브랜드명 폰트 크기: 24px (최소 16px 이상 ✅)
      - [x] 탭 텍스트 폰트 크기: 17px (최소 16px 이상 ✅)
      - [x] 색상 대비 확인 (활성: #3478F6, 비활성: #8A8A8E)
    - [x] 크로스 브라우저 테스트 (Chrome 확인 완료, 다른 브라우저는 수동 테스트 권장)
  - [x] 예상 소요 시간: 2-3시간
  - [x] 참고: `docs/HEADER_DESIGN_IMPROVEMENT.md` (상세 계획)
  - [x] **전체 헤더 디자인 개선 완료** ✅ (2025-01-14)
- [ ] **Warm & Rounded 테마 리뉴얼 (신규)** 🔴
  - [ ] 디자인 토큰 재정의
    - [ ] `app/globals.css`에서 배경을 `#FFFCF5` / `#F5F9F6` 투톤으로 재구성
    - [ ] Primary `#2F6E4F`, Secondary `#A5D6A7`, Accent `#FFD54F` 변수 추가
    - [ ] 기본 letter-spacing을 `tracking-tight (-0.02em)`으로 통일
    - [ ] radius/ shadow 토큰을 `rounded-2xl` + `shadow-[0_8px_30px_rgba(0,0,0,0.04)]` 계열로 정의
  - [ ] Tailwind 설정 업데이트
    - [ ] `tailwind.config.ts` 생성 후 색상·폰트·shadow preset 등록
    - [ ] Theme 변수를 components 전체에서 사용할 수 있도록 리팩터링
  - [ ] 공통 UI 컴포넌트 리팩터링
    - [ ] `components/ui/button.tsx`, `input.tsx`, `textarea.tsx`, `dialog.tsx`, `sheet.tsx`에 둥근 모서리와 leaf shadow 적용
    - [ ] 카드/섹션 공용 Surface 스타일 정의 (rounded-2xl + warm gradient)
  - [ ] 리우(Riu) 캐릭터 통합
    - [ ] `components/icons/RiuIcon.tsx`, `RiuLoader` 등 SVG/애니메이션 컴포넌트 생성
    - [ ] 로딩/빈 상태 및 헤더에 PNG 대신 컴포넌트로 교체
    - [ ] HospitalMap, Documents 등 주요 섹션에 캐릭터 배치 가이드 반영
  - [ ] Warm & Rounded 페이지 개편
    - [ ] 서류 안내 페이지 카드·챗봇·면책 배너 리디자인 (열매 포인트, soft shadow)
    - [ ] 병원 찾기 필터/리스트/Bottom Sheet에 soft mint 배경과 rounded 적용
    - [ ] 섹션 구분을 연녹색 배경 대비 또는 `border-green-100`로 대체
  - [ ] 지도/마커 업데이트
    - [ ] HospitalMap 마커를 리우 얼굴이 들어간 원형 스타일로 교체 (기관별 색상)
    - [ ] 사용자 위치·로딩 표시를 Riu 애니메이션으로 대체
  - [ ] Tree motif 디테일 추가
    - [ ] 중요 카드에 warm yellow (#FFD54F) 포인트와 leaf shadow 적용
    - [ ] 배경 전반에 은은한 leaf pattern 또는 gradient 적용 (LCP 영향 검증)
- [ ] **로딩/Empty 상태 애니메이션 일원화** 🟡
  - [ ] `components/ui/riu-loader.tsx` 제작 (점프/잎사귀 애니메이션)
  - [ ] DocumentSummary, DocumentAssistant, HospitalsPageClient 빈 상태에서 공통 컴포넌트 사용
  - [ ] 상태별 접근성 텍스트 및 console.log 로깅 추가
- [x] **네비게이션 디자인 개선 (Priority 1)** 🔴 ✅ 완료 (2025-01-14)
  - [x] **Phase 1: 데스크톱 네비게이션 개선** (1시간) ✅
    - [x] 활성 탭 시각적 강화 (배경색 bg-[#3478F6]/15, 하단 인디케이터 3px, font-bold)
    - [x] 비활성 탭 색상 조정 (#8A8A8E → #6E6E73)
    - [x] 호버 효과 개선 (배경 + 텍스트 색상)
    - [x] 탭 패딩 조정 (px-6 py-4)
    - [x] 아이콘 색상 동기화 (활성/비활성)
    - [x] 탭 간 간격 조정 (gap-0)
  - [x] **Phase 2: 모바일 하단 탭 바 개선** (1시간) ✅
    - [x] 활성 탭 배경색 추가 (bg-[#3478F6]/10)
    - [x] 상단 인디케이터 추가 (3px 높이)
    - [x] 활성 탭 아이콘 크기 확대 (w-7 h-7)
    - [x] 비활성 탭 색상 조정 (#6E6E73)
    - [x] 터치 피드백 추가 (active:scale-95)
    - [x] 배경 불투명도 조정 (bg-white/98)
    - [x] 그림자 개선 (shadow-xl)
  - [x] **Phase 3: 전환 효과 및 애니메이션** (30분) ✅
    - [x] 상태 전환 애니메이션 개선 (transition-all duration-200 ease-in-out)
    - [x] 호버 효과 세부 조정
    - [x] 활성 상태 표시 애니메이션
  - [x] **Phase 4: 접근성 및 반응형 검증** (30분) ✅
    - [x] 색상 대비 검증 (WCAG AA)
    - [x] 터치 타겟 크기 검증 (모바일: 64px 높이, WCAG 권장 44px 이상)
    - [x] 반응형 브레이크포인트 검증
  - [x] 예상 소요 시간: 3시간
  - [x] 참고: `docs/NAVIGATION_DESIGN_IMPROVEMENT.md` (상세 계획)
- [x] **UI 심플화 및 색상 시스템 개선 (Priority 1)** 🔴 ✅ 완료 (2025-01-14)
  - [x] **메뉴 디자인 심플화** (30분) ✅
    - [x] 아이콘 제거 (텍스트만 표시)
    - [x] 배경색 및 인디케이터 제거
    - [x] 호버 효과만 유지 (hover:text-[#1C1C1E])
    - [x] 간격 조정 (gap-8)
  - [x] **병원 찾기 화면 재디자인** (1.5시간) ✅
    - [x] "병원 찾기" 제목 제거
    - [x] 설명 텍스트 제거
    - [x] 상단 여백 최소화 (py-8 → pt-4 pb-2)
    - [x] 필터 UI 심플화
      - [x] 라벨 제거 ("검색 반경 선택", "기관 유형 선택")
      - [x] 배경색 제거 (활성: 색상 텍스트만, 비활성: 회색 텍스트)
      - [x] 그림자 제거
      - [x] 구분선 추가 (반경 선택과 기관 유형 사이)
    - [x] 재활스포츠기관 숫자 제거 ("(24개)" → "")
    - [x] 전체 구성요소 위로 이동
  - [x] **Primary 색상 변경** (1시간) ✅
    - [x] design.md 업데이트 (#3478F6 → #2E7D32)
    - [x] CSS 변수 업데이트 (--primary, --ring)
    - [x] 컴포넌트 색상 변경
      - [x] Navbar (브랜드명 호버, 활성 메뉴)
      - [x] 필터 UI (검색 반경, 전체/병원 필터)
      - [x] HospitalMap (병원 마커, InfoWindow 버튼, 로딩 스피너)
      - [x] 병원 카드 호버 테두리
  - [x] **기관 개수 표시 개선** (30분) ✅
    - [x] 제목 단순화 ("반경 5km 내 기관 (68개)" → "반경 5km 이내")
    - [x] 상세 정보 표시 형식 변경 ("58 · 10" → "병원 10개, 약국 5개, 직업훈련 5개")
    - [x] 조건부 표시 (0개인 타입은 표시 안 함)
    - [x] 레이아웃 개선 (flex flex-wrap)
  - [x] 예상 소요 시간: 3.5시간
  - [x] 참고: `docs/HOSPITALS_PAGE_REDESIGN.md` (상세 계획)

### Phase 1.5: 최적화 및 배포 준비
- [ ] **성능 최적화**
  - [ ] 지도 로딩 시간 2초 이내 최적화
  - [ ] 페이지 초기 로드 3초 이내 목표
  - [ ] 이미지 및 정적 파일 최적화
- [ ] **반응형 디자인 완성**
  - [ ] 브레이크포인트별 레이아웃 검증
    - [ ] 모바일 (320px ~ 767px): 하단 탭 네비게이션, 세로 레이아웃
    - [ ] 태블릿 (768px ~ 1023px): 하이브리드 레이아웃 검증
    - [ ] 데스크톱 (≥ 1024px): 상단 네비게이션, 가로 2-3 컬럼 그리드
  - [ ] 모바일 우선 디자인 검증 (320px+)
  - [ ] 데스크톱 최적화 (마우스 인터랙션, 넓은 화면 활용)
  - [ ] 터치 인터랙션 최적화 (모바일)
  - [ ] 반응형 그리드 시스템 검증
- [x] **챗봇 접근성 검증** ✅ 완료 (2025-01-26)
  - [x] 키보드 네비게이션 지원 확인 및 개선
    - [x] Tab 키로 모든 인터랙티브 요소 접근 가능 확인
    - [x] Enter 키로 질문 전송 가능 확인 (form onSubmit)
    - [x] 추천 질문 버튼 키보드 접근 가능 확인
    - [x] 포커스 링 스타일 개선 (`focus:ring-2 focus:ring-primary`)
  - [x] 스크린 리더 지원 확인 및 개선
    - [x] ARIA 라벨 추가 (질문 입력 필드, 버튼 등)
    - [x] 로딩 상태 알림 (`aria-live="polite"`, `role="status"`)
    - [x] 에러 메시지 알림 (`role="alert"`, `aria-live="assertive"`)
    - [x] 대화 기록 영역 (`role="log"`, `aria-live="polite"`)
    - [x] 스크린 리더 전용 텍스트 추가 (`.sr-only` 클래스)
  - [x] 색상 대비 확인 (WCAG AA)
    - [x] Primary 색상과 배경색 대비 확인
    - [x] 텍스트 색상과 배경색 대비 확인
    - [x] 버튼 색상 대비 확인
  - [x] 포커스 관리 확인
    - [x] 포커스 링 표시 확인 (`focus-visible` 스타일)
    - [x] 포커스 순서 논리적 확인 (Tab 키 순서)
  - [x] 참고: `components/rag-chatbot/RagChatbot.tsx`, `app/globals.css`
  - [x] 예상 소요 시간: 1-2시간
- [ ] **접근성 및 사용성 개선**
  - [ ] WCAG 2.1 AA 준수 검증
  - [ ] 키보드 네비게이션 지원
  - [ ] 스크린 리더 지원 (ARIA 라벨)
- [ ] **배포 설정**
  - [ ] Vercel 배포 설정
  - [ ] 환경변수 프로덕션 설정
  - [ ] 도메인 및 SSL 설정
- [ ] **테스트 및 QA**
  - [ ] 단위 테스트 작성 (Jest + RTL)
  - [ ] 통합 테스트 구현
  - [ ] E2E 테스트 (Playwright)
  - [ ] 크로스 브라우저 테스트

---

## 📋 Phase 1 완료 기준 (PRD.md 기준)

### 기능적 완료 기준
- ✅ 병원 찾기: 지도 로딩 성공률 > 98%
- ✅ 서류 가이드: AI 응답 정확도 > 90%
- ✅ API 안정성: 전체 API 응답 성공률 > 95%

### 사용자 경험 기준
- ✅ 페이지 로드: 초기 < 3초, 상호작용 < 2초
- ✅ 반응형 디자인: 모든 디바이스(모바일, 태블릿, 데스크톱)에서 최적화된 경험
- ✅ 모바일 최적화: 모바일 사용자 비율 > 70%
- ✅ 데스크톱 최적화: 넓은 화면을 활용한 효율적인 레이아웃
- ✅ 접근성: WCAG 2.1 AA 준수

### 기술적 기준
- ✅ 서버 응답: 평균 < 500ms
- ✅ 가용성: uptime > 99.5%
- ✅ 데이터 정확성: 병원 정보 정확도 > 99%

---

---

## 📌 다음 작업 가이드

자세한 다음 단계 작업 가이드는 `docs/NEXT_WORK_PRIORITIES.md`를 참고하세요.

### ✅ 완료된 작업
1. ✅ **병원 상세 정보 표시 (Bottom Sheet)** - 완료
2. ✅ **반경 5km 내 검색 로직** - 완료
3. ✅ **CSV 데이터 Import 및 Geocoding** - 완료 (6,071개 성공, 99.51% 성공률)
4. ✅ **지도 UX 개선** - 완료 (확대/축소 리셋 문제 해결, InfoWindow 닫기 기능)
5. ✅ **재활기관 데이터 추가** - 완료 (2,368개 Import)
6. ✅ **재활기관 Geocoding 처리** - 완료 (2,562개 성공, 99.34% 성공률)
   - 주소 정리 및 재시도로 10개 추가 성공
   - 실패한 17개는 주소 정보 부족 또는 복잡한 형식
7. ✅ **재활기관 지도 연동** - 완료 (2025-01-14)
   - 재활기관 데이터 타입 및 API 구현
   - 재활기관 마커 표시 (보라색 #9333EA)
   - 재활기관 InfoWindow 구현
   - 페이지 클라이언트 통합 (병원/재활기관 동시 검색)
8. ✅ **기관 유형별 필터링** - 완료 (2025-01-14)
   - 전체, 병원, 약국, 직업훈련기관, 재활스포츠기관 필터
   - 필터별 지도 마커 및 목록 업데이트
9. ✅ **네비게이션 디자인 개선** - 완료 (2025-01-14)
   - Phase 1: 데스크톱 네비게이션 개선 완료
     - 활성 탭 시각적 강화 (배경색, 인디케이터 3px, font-bold)
     - 비활성 탭 색상 조정 (#6E6E73)
     - 호버 효과 및 아이콘 색상 동기화
   - Phase 2: 모바일 하단 탭 바 개선 완료
     - 활성 탭 배경색 및 상단 인디케이터 추가
     - 아이콘 크기 확대 (w-7 h-7)
     - 터치 피드백 및 그림자 개선
   - Phase 3: 전환 효과 및 애니메이션 완료
   - Phase 4: 접근성 및 반응형 검증 완료
10. ✅ **필터 UI 디자인 개선** - 완료 (2025-01-14)
    - Phase 1-6 모두 완료 (버튼 스타일, 그룹핑, 타이포그래피, 인터랙션, 반응형, 접근성)
    - 전문적인 버튼 기반 UI로 전환
    - 활성/비활성 상태 명확한 시각적 구분
    - ARIA 속성 및 키보드 네비게이션 지원
    - 모바일/데스크톱 반응형 최적화
11. ✅ **반경에 따른 지도 확대/축소 레벨 자동 조정** - 완료 (2025-01-14)
    - 반경 선택(5km, 10km, 15km, 30km)에 따라 지도 zoom 레벨 자동 조정
    - 5km: zoom 14 (가장 확대, 상세하게 보기)
    - 10km: zoom 13 (중간 확대)
    - 15km: zoom 12 (중간 축소)
    - 30km: zoom 11 (가장 축소, 넓게 보기)
    - 반경 변경 시 지도가 자동으로 적절한 확대/축소 레벨로 조정
12. ✅ **기관 유형 및 진료과목 데이터 추가** - 완료 (2025-01-14)
    - 기관명에서 기관 유형 및 진료과목 추출 로직 구현
    - Supabase에 institution_type, department_extracted 컬럼 추가
    - SQL 함수로 전체 데이터 업데이트 완료 (6,101개)
    - 화면에 기관 유형 및 진료과목 배지 표시
    - 기관 유형: 7개 유형 (의원, 한의원, 병원, 기타, 요양병원, 대학병원, 종합병원)
    - 진료과목: 23개 조합 (정형외과, 신경외과, 재활의학과, 치과 등)
13. ✅ **진료과목별 필터링 기능** - 완료 (2025-01-14)
    - 진료과목 필터 UI 구현 (버튼 기반 멀티 셀렉트)
    - 상위 6개 진료과목 버튼 + 더보기 드롭다운
    - 선택된 진료과목에 따라 병원 자동 필터링
    - 지도 및 목록에 필터 적용
    - 기관 유형 필터와 통합 (병원/전체 필터일 때만 표시)
14. ✅ **지역 선택 필터 기능** - 완료 (2025-01-14)
    - 지역 데이터 구조 정의 (시/도, 시/군/구, 중심 좌표)
    - 주소 파싱 유틸리티 구현 (다양한 주소 형식 지원)
    - 지역 기반 필터링 함수 구현 (병원 및 재활기관)
    - 지역 선택 UI 컴포넌트 생성 (시/도 → 시/군/구 → 구 선택)
    - 검색 모드 전환 UI (내 위치 주변 vs 지역 선택)
    - 지역 선택 시 지도 중심 자동 이동
    - 지역 선택 모드에서 지도 이동 시 재검색 방지
    - 주소 검색 개선 (약자 변환 지원: "인천광역시" → "인천"도 검색)

### 🎯 추천 작업 순서 (우선순위별)

#### Phase A: 타임라인 기능 구현 (Priority 1) 🔴 - 신규 기능
**예상 소요 시간**: 2-3일

1. **Supabase 테이블 생성** (P1-1) - 2-3시간
   - stages, documents, warnings 테이블 생성
   - 4단계 Seed 데이터 입력
   - PDF URL 필드 테스트 값 연결

2. **타임라인 UI 구현** (P1-2) - 4-6시간
   - TimelineContainer 기본 레이아웃 (반응형)
   - TimelineStepCard 컴포넌트
   - TimelineDetailPanel 컴포넌트
   - LegalNotice 컴포넌트

3. **인터랙션 구현** (P1-3) - 3-4시간
   - 단계 카드 클릭 이벤트
   - Full Screen Modal / 슬라이드 패널
   - 탭 UI 구현
   - PDF 다운로드 버튼 연결

4. **네비게이션 통합** (P1-4) - 30분-1시간
   - Navbar에 "진행 과정" 메뉴 추가
   - ResponsiveNavigation에 "진행 과정" 탭 추가

5. **라우팅 설정** (P1-5) - 30분-1시간
   - `/timeline` 페이지 생성
   - 기존 라우트와 충돌 확인

6. **반응형 디자인 검증** (P2-1) - 1-2시간
   - 모바일/태블릿/데스크톱 레이아웃 검증

7. **접근성 검증** (P3-1) - 1-2시간
   - 키보드 네비게이션, 스크린 리더 지원

8. **성공 기준 검증** (P2-2) - 1-2시간
   - 3분 안에 이해 가능한지 테스트

#### Phase B: 데이터 완성 (Priority 1) 🔴 - 즉시 필요
**예상 소요 시간**: 1일

1. ✅ **재활기관 Geocoding 처리** (P1-1) - 완료
   - 재활기관 2,562개 Geocoding 완료 (99.34% 성공률)
   - 주소 정리 및 재시도 완료

2. ✅ **재활기관 지도 연동** (P1-2) - 완료
   - 병원/약국과 함께 재활기관도 지도에 표시
   - 기관 유형별 필터링 UI 추가
   - 재활기관 마커 표시 (보라색 #9333EA)
   - 재활기관 InfoWindow 구현 (기관구분명 표시)

#### Phase B: 필터링 기능 (Priority 2) 🟡 - 사용자 경험 개선
**예상 소요 시간**: 완료 ✅

3. ✅ **기관 유형별 필터링** (P2-2) - 완료
   - 전체, 병원, 약국, 직업훈련기관, 재활스포츠기관 필터 구현
   - 필터별 지도 마커 및 목록 업데이트
   - 필터별 개수 표시

4. ✅ **네비게이션 디자인 개선** (P1-1) - 완료
   - Phase 1: 데스크톱 네비게이션 개선 (1시간)
   - Phase 2: 모바일 하단 탭 바 개선 (1시간)
   - Phase 3: 전환 효과 및 애니메이션 (30분)
   - Phase 4: 접근성 및 반응형 검증 (30분)
   - 예상 시간: 3시간
   - 참고: `docs/NAVIGATION_DESIGN_IMPROVEMENT.md`

5. ✅ **지역 선택 필터 기능** (P2-1) - 완료 (2025-01-14)
   - 시/도, 시/군/구 단위로 지역 선택하여 검색
   - 광역시의 경우 구 단위까지 선택 가능
   - 검색 모드 전환 (내 위치 주변 vs 지역 선택)
   - 주소 검색 개선 (약자 변환 지원)
   - 지역 선택 모드에서 지도 이동 시 재검색 방지
   - 예상 시간: 5.5-9.5시간
   - 의존성: 없음
   - 참고: `docs/REGION_FILTER_PLAN.md` (상세 계획)

6. ✅ **진료과목별 필터링** (P2-2) - 완료 (2025-01-14)
   - 정형외과, 내과 등 진료과목별 필터링
   - 버튼 기반 멀티 셀렉트 필터 UI
   - 예상 시간: 2-3시간
   - 의존성: 없음

#### Phase C: 디자인 시스템 정리 (Priority 3) 🟢 - 개선
**예상 소요 시간**: 반나절

1. ✅ **헤더 디자인 개선** (P1-1) - 완료
   - Paperozi 웹폰트 설정 및 적용
   - Navbar 컴포넌트 전문적 디자인 개선
   - ResponsiveNavigation 스타일 개선
   - 예상 시간: 2-3시간
   - 의존성: 없음
   - 참고: `docs/HEADER_DESIGN_IMPROVEMENT.md` (상세 계획)

2. ✅ **디자인 시스템 일관성 개선** (P3-1) - 완료
   - ✅ **H2 타이포그래피 수정** (Priority 1): 18px → 22px
   - ✅ **배경색 수정** (Priority 1): #FFFFFF → #F2F2F7
   - ✅ **Neutral 색상 체계 적용** (Priority 2): #1C1C1E, #8A8A8E
   - ✅ **정보 카드 스타일 개선** (Priority 2): 그림자 효과 추가
   - ✅ **필터 버튼 비활성 상태 색상 통일** (Priority 2): Neutral 색상 체계 적용
   - 완료 시간: 약 2시간

3. **색상 팔레트 일관성 검증** (P3-2) - 부분 완료 ⏳
   - ✅ 필터 버튼 비활성 상태 색상 통일 (완료)
   - [ ] 하드코딩된 색상을 CSS 변수로 통일 (진행 필요)
     - [ ] `#2E7D32` (Primary 색상), `#34C759` (Success/약국 색상), `#9333EA` (재활기관 색상) 등 하드코딩된 색상 검색
     - [ ] CSS 변수로 통일 (`--primary`, `--secondary` 등 활용)
   - 예상 시간: 1시간

#### Phase D: 분석 기반 마련 (Priority 4) 🔵 - 장기
**예상 소요 시간**: 1일

7. **사용자 활동 로깅** (P4-1)
   - 사용자 행동 분석을 위한 로깅 시스템 구축
   - 예상 시간: 2-3시간

### 📊 작업 우선순위 매트릭스

| 우선순위 | 작업 | 영향도 | 난이도 | 예상 시간 | 의존성 | 상태 |
|---------|------|--------|--------|-----------|--------|------|
| 🔴 P1 | 타임라인 Supabase 테이블 생성 | 높음 | 낮음 | 2-3h | 없음 | ⏳ |
| 🔴 P1 | 타임라인 UI 구현 | 높음 | 중간 | 4-6h | 테이블 생성 | ⏳ |
| 🔴 P1 | 타임라인 인터랙션 구현 | 높음 | 중간 | 3-4h | UI 구현 | ⏳ |
| 🔴 P1 | 타임라인 네비게이션 통합 | 높음 | 낮음 | 30m-1h | 없음 | ⏳ |
| 🔴 P1 | 타임라인 라우팅 설정 | 높음 | 낮음 | 30m-1h | 없음 | ⏳ |
| 🟡 P2 | 타임라인 반응형 디자인 검증 | 중간 | 낮음 | 1-2h | UI 구현 | ⏳ |
| 🟡 P2 | 타임라인 성공 기준 검증 | 중간 | 낮음 | 1-2h | 전체 구현 | ⏳ |
| 🟢 P3 | 타임라인 접근성 검증 | 낮음 | 낮음 | 1-2h | 전체 구현 | ⏳ |
| 🔴 P1 | 재활기관 Geocoding | 높음 | 낮음 | 1-2h | 없음 | ✅ |
| 🔴 P1 | 재활기관 지도 연동 | 높음 | 중간 | 3-4h | Geocoding 완료 | ✅ |
| 🟡 P2 | 기관 유형별 필터링 | 중간 | 낮음 | 1-2h | 재활기관 지도 연동 | ✅ |
| 🔴 P1 | 네비게이션 디자인 개선 | 높음 | 낮음 | 3h | 없음 | ✅ |
| 🔴 P1 | 필터 UI 디자인 개선 | 높음 | 낮음 | 3h 10m | 없음 | ✅ |
| 🟡 P2 | 지역 선택 필터 기능 | 중간 | 중간 | 5.5-9.5h | 없음 | ✅ |
| 🟡 P2 | 진료과목별 필터링 | 중간 | 중간 | 2-3h | 없음 | ✅ |
| 🔴 P1 | H2 타이포그래피 수정 | 중간 | 낮음 | 30m | 없음 | ✅ |
| 🔴 P1 | 배경색 수정 | 중간 | 낮음 | 10m | 없음 | ✅ |
| 🟡 P2 | Neutral 색상 체계 적용 | 중간 | 낮음 | 1h | 없음 | ✅ |
| 🟡 P2 | 정보 카드 스타일 개선 | 낮음 | 낮음 | 20m | 없음 | ✅ |
| 🟡 P2 | 필터 버튼 비활성 상태 색상 통일 | 중간 | 낮음 | 30m | 없음 | ✅ |
| 🔴 P1 | 헤더 디자인 개선 | 높음 | 낮음 | 2-3h | 없음 | ✅ |
| 🔴 P1 | 필터 UI 디자인 개선 | 높음 | 낮음 | 3h 10m | 없음 | ✅ |
| 🟢 P3 | 하드코딩 색상 CSS 변수 통일 | 낮음 | 낮음 | 30m-1h | 없음 | ⏳ |
| 🟢 P3 | 타이포그래피 검증 | 낮음 | 낮음 | 1-2h | 없음 | ⏳ |
| 🔵 P4 | 사용자 활동 로깅 | 중간 | 중간 | 2-3h | 없음 | ⏳ |

### 💡 작업 시작 전 확인사항

#### 재활기관 Geocoding 시작 전
- [ ] Geocoding API가 정상 작동하는지 테스트 (10개 샘플)
- [ ] API 호출 제한 확인 (Naver: 일일 제한, VWorld: 일일 제한)
- [ ] Geocoding 실패 시 재시도 로직 확인

#### 재활기관 지도 연동 시작 전
- [ ] 재활기관 Geocoding 완료 확인 (좌표가 0이 아닌 데이터 확인)
- [ ] 재활기관 데이터 구조 확인 (`rehabilitation_centers` 테이블)
- [ ] 병원/약국 마커 색상과 구분되는 재활기관 마커 색상 결정

#### 필터링 기능 시작 전
- [ ] 현재 데이터에 어떤 진료과목이 있는지 확인 (SQL 쿼리)
- [ ] 필터 UI 디자인 결정 (체크박스 vs 드롭다운 vs 토글)
- [ ] 필터 상태 관리 방식 결정 (상태 관리 vs URL 쿼리)

---

## 📋 앞으로 해야 할 일 (우선순위별)

### 🔴 Priority 1: 핵심 기능 완성

#### 1. 서류 AI 요약 가이드 기능 구현 (Phase 1.3)
**예상 소요 시간**: 2-3일  
**상태**: ⏳ 미시작  
**의존성**: 없음  
**AI 모델**: Google Gemini 2.5 Flash (`gemini-2.5-flash`)

**세부 작업**:

**Phase 1: Gemini API 연동 설정** (2-3시간)
- [ ] `@google/genai` 패키지 설치
- [ ] 환경변수 확인 (`GOOGLE_API_KEY`, `GEMINI_MODEL=gemini-2.5-flash`)
- [ ] Gemini 클라이언트 생성 (`lib/api/gemini.ts`)
- [ ] 에러 처리 및 재시도 로직 구현
  - [ ] Rate limiting 처리 (429 에러)
  - [ ] 네트워크 에러 재시도 (최대 3회)
  - [ ] 타임아웃 설정 (30초)
  - [x] 에러 로깅 ✅ 완료 (2025-01-26)
    - [x] `logApiError()` 함수 사용하여 API 라우트 에러 로깅

**Phase 2: 서류 목록 관리** (3-4시간)
- [ ] 서류 타입 정의 (`lib/types/document.ts`)
  - [ ] `Document` 인터페이스
  - [ ] `DocumentSummary` 인터페이스
  - [ ] `DocumentSection` 인터페이스
  - [ ] `DocumentCategory` 타입
- [ ] 주요 산재 서류 데이터 정의 (8개 서류)
  - [ ] 산재신청서
  - [ ] 요양급여 신청서
  - [ ] 휴업급여 신청서
  - [ ] 장해등급 신청서
  - [ ] 요양급여 지급 신청서
  - [ ] 상병보상금 신청서
  - [ ] 유족급여 신청서
  - [ ] 장의비 신청서
- [ ] 서류 데이터 파일 생성 (`lib/data/documents.ts`)
  - [ ] 각 서류의 기본 정보 (이름, 설명, 카테고리)
  - [ ] 공식 다운로드 링크
  - [ ] 작성 예시 링크
  - [ ] 필요 서류 목록
  - [ ] 처리 기간

**Phase 3: AI 요약 가이드 생성** (4-5시간)
- [ ] 프롬프트 엔지니어링 (`lib/prompts/document-summary.ts`)
  - [ ] 일반인이 이해하기 쉬운 언어 사용
  - [ ] 법률/행정 용어 최소화
  - [ ] 구체적인 예시 포함
  - [ ] 단계별 설명 형식
- [ ] AI 요약 생성 함수 구현 (`lib/api/document-summary.ts`)
  - [ ] `generateDocumentSummary()` 함수
  - [ ] 응답 파싱 로직 (마크다운 → 구조화된 데이터)
- [ ] Supabase 캐싱 전략 구현
  - [ ] `document_summaries` 테이블 생성 (마이그레이션 파일)
  - [ ] 캐시 조회 함수 (`getCachedDocumentSummary`)
  - [ ] 캐시 저장 함수 (`cacheDocumentSummary`)
  - [ ] TTL: 7일
- [ ] 면책 조항 자동 포함 로직 (`lib/utils/disclaimer.ts`)
  - [ ] 면책 조항 텍스트 정의
  - [ ] 자동 추가 함수

**Phase 4: 서류 가이드 UI 구현** (5-6시간)
- [ ] 서류 목록 페이지 수정 (`app/documents/page.tsx`)
  - [ ] 페이지 레이아웃
  - [ ] 면책 조항 표시
- [ ] DocumentsList 컴포넌트 생성 (`components/documents/DocumentsList.tsx`)
  - [ ] shadcn/ui Accordion 컴포넌트 사용
  - [ ] 서류 목록 표시
  - [ ] 서류 선택 상태 관리
- [ ] DocumentSummary 컴포넌트 생성 (`components/documents/DocumentSummary.tsx`)
  - [ ] AI 요약 결과 표시
  - [ ] 로딩 상태 처리 (스피너)
  - [ ] 에러 상태 처리
  - [ ] 주요 항목별 작성 방법 표시
  - [ ] 주의사항 표시 (Alert 색상)
  - [ ] 다운로드 링크 버튼
  - [ ] 작성 예시 링크 버튼
- [ ] API Route 생성 (`app/api/documents/[id]/summary/route.ts`)
  - [ ] 캐시 확인 로직
  - [ ] AI 요약 생성 호출
  - [ ] 캐시 저장
  - [ ] 에러 처리
- [ ] 반응형 디자인 검증
- [ ] 접근성 검증

**테스트**
- [ ] 각 서류별 AI 요약 생성 테스트
- [ ] 캐싱 동작 확인
- [ ] 에러 처리 확인
- [ ] UI 반응형 테스트
- [ ] 로딩 시간 측정 (목표: 3초 이내)

**참고 문서**: 
- `docs/DOCUMENTS_AI_GUIDE_PLAN.md` (상세 계획)
- [Google Gemini API 문서](https://ai.google.dev/docs)
- [@google/genai 패키지](https://www.npmjs.com/package/@google/genai)

---

### 🟢 Priority 3: 디자인 시스템 정리

#### 2. 색상 팔레트 일관성 검증 (부분 완료)
**예상 소요 시간**: 1시간  
**상태**: ⏳ 진행 필요  
**의존성**: 없음

**세부 작업**:
- [ ] 하드코딩된 색상 검색 (20분)
  - [ ] `#2E7D32` (Primary 색상)
  - [ ] `#34C759` (Success/약국 색상)
  - [ ] `#9333EA` (재활기관 색상)
  - [ ] 기타 하드코딩된 색상
- [ ] CSS 변수로 통일 (40분)
  - [ ] `app/globals.css`에 색상 변수 정의
  - [ ] 컴포넌트에서 하드코딩된 색상을 CSS 변수로 교체
  - [ ] Tailwind 색상 클래스 활용 검토

**참고**: `app/globals.css` (54-59줄: PRD 색상 정의)

#### 3. 타이포그래피 시스템 검증
**예상 소요 시간**: 1-2시간  
**상태**: ⏳ 미시작  
**의존성**: 없음

**세부 작업**:
- [ ] 컴포넌트별 타이포그래피 사용 현황 확인 (30분)
  - [ ] 모든 컴포넌트에서 텍스트 크기 검색
  - [ ] PRD 규격과 다른 부분 식별
    - h1: 28px ✅
    - h2: 22px ✅
    - body: 17px
    - caption: 14px
- [ ] 타이포그래피 표준화 (1-1.5시간)
  - [ ] PRD 규격과 다른 부분 수정
  - [ ] Tailwind CSS 유틸리티 클래스로 표준화
  - [ ] 일관성 검증

**참고**: `app/globals.css` (129-141줄: 타이포그래피 스케일 정의)

---

### 🔵 Priority 4: 분석 기반 마련

#### 4. 사용자 활동 로깅
**예상 소요 시간**: 2-3시간  
**상태**: ⏳ 미시작  
**의존성**: 없음

**세부 작업**:
- [ ] 로깅 함수 생성 (1시간)
  - [ ] `lib/utils/logging.ts` 생성
  - [ ] `logUserActivity()` 함수 구현
  - [ ] 로그 타입 정의 (검색, 조회, 필터 변경 등)
- [ ] 주요 이벤트에 로깅 추가 (1-2시간)
  - [ ] 병원 검색 로그
  - [ ] 병원 클릭 로그
  - [ ] 필터 변경 로그
  - [ ] 지도 이동 로그
  - [ ] 위치 정보 로그
  - [ ] 지역 선택 로그
  - [ ] `user_activity_logs` 테이블에 저장

**참고**: `user_activity_logs` 테이블은 이미 생성되어 있음

---

### 🚀 Priority 5: 최적화 및 배포 준비

#### 5. 성능 최적화
**예상 소요 시간**: 1-2일  
**상태**: ⏳ 미시작  
**의존성**: 없음

**세부 작업**:
- [ ] 지도 로딩 최적화 (2-3시간)
  - [ ] 지도 로딩 시간 2초 이내 목표
  - [ ] 마커 렌더링 최적화 (가상화 고려)
  - [ ] 지도 타일 캐싱
- [ ] 페이지 초기 로드 최적화 (3-4시간)
  - [ ] 초기 로드 3초 이내 목표
  - [ ] 코드 스플리팅
  - [ ] 이미지 최적화 (Next.js Image 컴포넌트)
  - [ ] 정적 파일 최적화

#### 6. 반응형 디자인 완성
**예상 소요 시간**: 반나절  
**상태**: ⏳ 미시작  
**의존성**: 없음

**세부 작업**:
- [ ] 브레이크포인트별 레이아웃 검증 (2-3시간)
  - [ ] 모바일 (320px ~ 767px)
  - [ ] 태블릿 (768px ~ 1023px)
  - [ ] 데스크톱 (≥ 1024px)
  - [ ] 터치 인터랙션 최적화

#### 7. 접근성 및 사용성 개선
**예상 소요 시간**: 반나절  
**상태**: ⏳ 미시작  
**의존성**: 없음

**세부 작업**:
- [ ] WCAG 2.1 AA 준수 검증 (2-3시간)
  - [ ] 색상 대비 검증
  - [ ] 키보드 네비게이션 지원
  - [ ] 스크린 리더 지원 (ARIA 라벨)

#### 8. 배포 설정
**예상 소요 시간**: 반나절  
**상태**: ⏳ 미시작  
**의존성**: 없음

**세부 작업**:
- [ ] Vercel 배포 설정 (1-2시간)
  - [ ] Vercel 프로젝트 생성
  - [ ] GitHub 연동
  - [ ] 환경변수 프로덕션 설정
  - [ ] 도메인 및 SSL 설정

#### 9. 테스트 및 QA
**예상 소요 시간**: 2-3일  
**상태**: ⏳ 미시작  
**의존성**: 없음

**세부 작업**:
- [ ] 단위 테스트 작성 (1일)
  - [ ] Jest + React Testing Library 설정
  - [ ] 주요 컴포넌트 테스트
  - [ ] 유틸리티 함수 테스트
- [ ] 통합 테스트 구현 (반나절)
  - [ ] API 엔드포인트 테스트
  - [ ] 데이터베이스 연동 테스트
- [ ] E2E 테스트 (Playwright) (1일)
  - [ ] 주요 사용자 시나리오 테스트
  - [ ] 병원 찾기 플로우 테스트
  - [ ] 필터링 기능 테스트
  - [ ] 지역 선택 기능 테스트
- [ ] 크로스 브라우저 테스트 (반나절)
  - [ ] Chrome, Firefox, Safari, Edge
  - [ ] 모바일 브라우저 (iOS Safari, Chrome)

---

## 🔄 Phase 2 준비 작업 (향후 확장)
- [ ] RAG 기반 AI 챗봇 도입
- [ ] 사용자 커뮤니티 기능
- [ ] 명상 콘텐츠 AI 추천
- [ ] 가족 케어 매칭 시스템
- [ ] 구독 모델 및 결제 시스템
