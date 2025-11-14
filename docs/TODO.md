# 리워크케어(ReWorkCare) Phase 1 개발 작업 목록

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

**현재 진행 상황**: 기본 기능 구현 완료, 데이터 동기화 완료, 지도 UX 개선 완료
**최근 업데이트**: 2025-01-14 - 지도 확대/축소 리셋 문제 해결 및 InfoWindow 닫기 기능 추가
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
  - [ ] 진료과목별 필터링 기능
  - [x] 반경 5km 내 검색 로직 ✅ 완료 (아래 항목 참고)
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
- [ ] **사용자 활동 로깅**
  - [ ] 로깅 함수 생성 (`logUserActivity()`)
  - [ ] 병원 검색 및 조회 로그 기록
  - [ ] 위치 정보 및 필터 사용 로그
  - [ ] user_activity_logs 테이블에 저장

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

### Phase 1.4: 최적화 및 배포 준비
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

자세한 다음 단계 작업 가이드는 `docs/NEXT_STEPS.md`를 참고하세요.

**추천 진행 순서**:
1. ✅ **병원 상세 정보 표시 (Bottom Sheet)** - 완료
2. ✅ **반경 5km 내 검색 로직** - 완료
3. ✅ **CSV 데이터 Import 및 Geocoding** - 완료 (6,071개 성공, 99.51% 성공률)
4. ✅ **지도 UX 개선** - 완료 (확대/축소 리셋 문제 해결, InfoWindow 닫기 기능)
5. ⭐ **진료과목별 필터링** - 다음 우선순위
6. 사용자 활동 로깅

---

## 🔄 Phase 2 준비 작업 (향후 확장)
- [ ] RAG 기반 AI 챗봇 도입
- [ ] 사용자 커뮤니티 기능
- [ ] 명상 콘텐츠 AI 추천
- [ ] 가족 케어 매칭 시스템
- [ ] 구독 모델 및 결제 시스템
