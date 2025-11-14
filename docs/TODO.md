# 리워크케어(ReWorkCare) Phase 1 개발 작업 목록

**최근 업데이트**: 2025-01-14 - UI 심플화 및 색상 시스템 개선 완료 ✅
- 메뉴 디자인 심플화 (아이콘 제거, 텍스트만, 호버 효과만)
- 병원 찾기 화면 재디자인 (제목/설명 제거, 필터 UI 심플화)
- Primary 색상 변경 (파란색 → 진한 초록색 #2E7D32)
- 기관 개수 표시 개선 (타입별 상세 표시)

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
  - [ ] **지역 선택 필터 기능** (Priority 2) 🟡 ⭐ 새로 추가
    - [ ] 지역 데이터 구조 정의 (시/도, 시/군/구)
    - [ ] 지역 선택 UI 컴포넌트 생성 (`components/RegionSelector.tsx`)
    - [ ] 검색 모드 전환 UI (내 위치 주변 vs 지역 선택)
    - [ ] 주소 파싱 유틸리티 구현 (`lib/utils/address-parser.ts`)
    - [ ] 지역 기반 필터링 함수 구현 (`getHospitalsByRegion`, `getRehabilitationCentersByRegion`)
    - [ ] 지역 선택 시 지도 중심 이동 로직
    - [ ] 검색 모드에 따른 필터링 로직 통합
    - [ ] 예상 소요 시간: 5.5-9.5시간
    - [ ] 참고: `docs/REGION_FILTER_PLAN.md` (상세 계획)
  - [ ] **진료과목별 필터링 기능** (Priority 2) 🟡
    - [ ] 진료과목 데이터 분석 (현재 데이터에 어떤 진료과목이 있는지 확인)
    - [ ] 필터 UI 컴포넌트 생성 (체크박스 또는 드롭다운)
    - [ ] 필터링 로직 구현 (`lib/api/hospitals.ts`에 `getHospitalsByDepartment` 함수)
    - [ ] 지도 및 목록에 필터 적용
    - [ ] 필터 상태 관리 (URL 쿼리 파라미터 또는 상태 관리)
    - [ ] 예상 소요 시간: 2-3시간
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
    - [ ] 재활기관 상세 정보 Bottom Sheet 연동 (선택사항)
      - [ ] `HospitalDetailSheet` 확장 또는 `RehabilitationCenterDetailSheet` 생성
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
- [ ] **OpenAI API 연동 설정**
  - [ ] OpenAI SDK 설치 및 설정
  - [ ] API 키 환경변수 연결
  - [ ] 에러 처리 및 재시도 로직
- [ ] **서류 목록 관리**
  - [ ] 주요 산재 서류 데이터 정의
  - [ ] 서류 카테고리 및 기본 정보 구조
- [ ] **AI 요약 가이드 생성**
  - [ ] 프롬프트 엔지니어링 (gpt-4-turbo)
  - [ ] 서류별 맞춤 요약 생성 함수
  - [ ] 면책 조항 자동 포함 로직
- [ ] **서류 가이드 UI 구현**
  - [ ] 아코디언 컴포넌트로 서류 목록 표시
  - [ ] AI 요약 결과 표시
  - [ ] 서식 다운로드 및 작성 예시 링크
- [ ] **사용자 활동 로깅**
  - [ ] 서류 조회 및 AI 요청 로그 기록
  - [ ] 다운로드 및 공유 활동 추적

### Phase 1.4: 디자인 시스템 일관성 검증 (Priority 3) 🟢
- [ ] **PRD 타이포그래피 시스템 검증 및 적용**
  - [ ] 현재 컴포넌트에서 타이포그래피 사용 현황 확인
  - [ ] PRD 규격과 다른 부분 수정 (h1: 28px, h2: 22px, body: 17px, caption: 14px)
  - [x] H1 타이포그래피: 28px 적용 확인 ✅
  - [x] **H2 타이포그래피 수정 (Priority 1)** 🔴 ✅ 완료
    - [x] 현재: 18px (실제 렌더링)
    - [x] 목표: 22px (design.md 기준)
    - [x] 문제: `app/globals.css`에 h2 스타일이 정의되어 있으나 Tailwind 클래스와 충돌 가능
    - [x] 해결: `app/hospitals/page-client.tsx`의 h2에 명시적으로 `text-[22px]` 적용
    - [x] 영향: "반경 5km 내 기관 (46개)" 제목 등 모든 h2 요소
    - [x] 예상 소요 시간: 30분
  - [ ] 컴포넌트별 타이포그래피 일관성 검증
  - [ ] 필요시 Tailwind CSS 유틸리티 클래스로 표준화
  - [ ] 예상 소요 시간: 1-2시간
  - [ ] 참고: `app/globals.css` (129-141줄: 타이포그래피 스케일 정의)
- [ ] **색상 팔레트 일관성 검증**
  - [ ] 컴포넌트에서 하드코딩된 색상 검색 (`#3478F6`, `#34C759`, `#FF9500` 등)
  - [ ] CSS 변수 또는 Tailwind 색상 클래스로 통일
  - [ ] Alert 색상 (`#FF9500`) 사용 현황 확인 (면책 조항 등)
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
  - [ ] **필터 버튼 그룹 시각적 계층 개선 (Priority 3)** 🟢
    - [ ] 현재: 모든 필터 버튼이 동일한 크기와 스타일
    - [ ] 개선: 반경 선택과 기관 유형 선택을 시각적으로 구분
    - [ ] 예상 소요 시간: 1시간
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

### 🎯 추천 작업 순서 (우선순위별)

#### Phase A: 데이터 완성 (Priority 1) 🔴 - 즉시 필요
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
**예상 소요 시간**: 1일

3. ✅ **기관 유형별 필터링** (P2-2) - 완료
   - 전체, 병원, 약국, 직업훈련기관, 재활스포츠기관 필터 구현
   - 필터별 지도 마커 및 목록 업데이트
   - 필터별 개수 표시

4. ⭐ **네비게이션 디자인 개선** (P1-1) - 새로 추가 🔴
   - Phase 1: 데스크톱 네비게이션 개선 (1시간)
   - Phase 2: 모바일 하단 탭 바 개선 (1시간)
   - Phase 3: 전환 효과 및 애니메이션 (30분)
   - Phase 4: 접근성 및 반응형 검증 (30분)
   - 예상 시간: 3시간
   - 참고: `docs/NAVIGATION_DESIGN_IMPROVEMENT.md`

5. ⭐ **지역 선택 필터 기능** (P2-1) - 새로 추가
   - 시/도, 시/군/구 단위로 지역 선택하여 검색
   - 광역시의 경우 구 단위까지 선택 가능
   - 검색 모드 전환 (내 위치 주변 vs 지역 선택)
   - 예상 시간: 5.5-9.5시간
   - 의존성: 없음
   - 참고: `docs/REGION_FILTER_PLAN.md` (상세 계획)
6. ⭐ **진료과목별 필터링** (P2-2)
   - 정형외과, 내과 등 진료과목별 필터링
   - 예상 시간: 2-3시간
   - 의존성: 없음

#### Phase C: 디자인 시스템 정리 (Priority 3) 🟢 - 개선
**예상 소요 시간**: 반나절

4.5. ⭐ **헤더 디자인 개선** (P1-1) - 새로 추가
   - Paperozi 웹폰트 설정 및 적용
   - Navbar 컴포넌트 전문적 디자인 개선
   - ResponsiveNavigation 스타일 개선
   - 예상 시간: 2-3시간
   - 의존성: 없음
   - 참고: `docs/HEADER_DESIGN_IMPROVEMENT.md` (상세 계획)

5. ✅ **디자인 시스템 일관성 개선** (P3-1) - 완료
   - ✅ **H2 타이포그래피 수정** (Priority 1): 18px → 22px
   - ✅ **배경색 수정** (Priority 1): #FFFFFF → #F2F2F7
   - ✅ **Neutral 색상 체계 적용** (Priority 2): #1C1C1E, #8A8A8E
   - ✅ **정보 카드 스타일 개선** (Priority 2): 그림자 효과 추가
   - ✅ **필터 버튼 비활성 상태 색상 통일** (Priority 2): Neutral 색상 체계 적용
   - 완료 시간: 약 2시간

6. ✅ **색상 팔레트 일관성 검증** (P3-2) - 부분 완료
   - ✅ 필터 버튼 비활성 상태 색상 통일 (완료)
   - [ ] 하드코딩된 색상을 CSS 변수로 통일 (진행 필요)
     - [ ] `#3478F6`, `#34C759`, `#9333EA` 등 하드코딩된 색상 검색
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
| 🔴 P1 | 재활기관 Geocoding | 높음 | 낮음 | 1-2h | 없음 | ✅ |
| 🔴 P1 | 재활기관 지도 연동 | 높음 | 중간 | 3-4h | Geocoding 완료 | ✅ |
| 🟡 P2 | 기관 유형별 필터링 | 중간 | 낮음 | 1-2h | 재활기관 지도 연동 | ✅ |
| 🔴 P1 | 네비게이션 디자인 개선 | 높음 | 낮음 | 3h | 없음 | ✅ |
| 🟡 P2 | 지역 선택 필터 기능 | 중간 | 중간 | 5.5-9.5h | 없음 | ⏳ |
| 🟡 P2 | 진료과목별 필터링 | 중간 | 중간 | 2-3h | 없음 | ⏳ |
| 🔴 P1 | H2 타이포그래피 수정 | 중간 | 낮음 | 30m | 없음 | ✅ |
| 🔴 P1 | 배경색 수정 | 중간 | 낮음 | 10m | 없음 | ✅ |
| 🟡 P2 | Neutral 색상 체계 적용 | 중간 | 낮음 | 1h | 없음 | ✅ |
| 🟡 P2 | 정보 카드 스타일 개선 | 낮음 | 낮음 | 20m | 없음 | ✅ |
| 🟡 P2 | 필터 버튼 비활성 상태 색상 통일 | 중간 | 낮음 | 30m | 없음 | ✅ |
| 🔴 P1 | 헤더 디자인 개선 | 높음 | 낮음 | 2-3h | 없음 | ✅ |
| 🔴 P1 | 네비게이션 디자인 개선 | 높음 | 낮음 | 3h | 없음 | ⏳ |
| 🟢 P3 | 하드코딩 색상 CSS 변수 통일 | 낮음 | 낮음 | 30m-1h | 없음 | ⏳ |
| 🟢 P3 | 타이포그래피 검증 | 낮음 | 낮음 | 1-2h | 없음 | ⏳ |
| 🟢 P3 | 필터 버튼 그룹 개선 | 낮음 | 낮음 | 1h | 없음 | ⏳ |
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

## 🔄 Phase 2 준비 작업 (향후 확장)
- [ ] RAG 기반 AI 챗봇 도입
- [ ] 사용자 커뮤니티 기능
- [ ] 명상 콘텐츠 AI 추천
- [ ] 가족 케어 매칭 시스템
- [ ] 구독 모델 및 결제 시스템
