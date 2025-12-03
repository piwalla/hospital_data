# 산재 환자 지원 플랫폼 - Interactive Timeline 구현 계획 (MVP)

## 1. 목표 정의

- 산재 환자와 가족(산재 초보자)을 위한
- "사고 → 승인 → 치료 → 장해 → 사회복귀" 전 과정을
- 시각적 타임라인으로 한눈에 이해할 수 있도록 제공
- 각 단계별:
  - 지금 해야 할 행동
  - 필수 서류 (공식 PDF 링크)
  - 가장 자주 생기는 문제와 주의사항
  - 다음 단계로 넘어가는 조건
- 1차 MVP: 로그인 없이 단순 안내용
- 2차 확장: Clerk 로그인 + 개인 진행 단계 추적 + RAG 연동

---

## 2. 법적 고지 (필수)

모든 타임라인 화면 상단 고정 노출:

> 본 페이지는 일반적인 산재 절차 안내를 목적으로 하며,  
> 실제 적용 여부는 근로복지공단의 판단과 개별 사안에 따라 달라질 수 있습니다.  
> 본 정보는 법적 효력을 갖지 않습니다.

---

## 3. UX / UI 기본 원칙

- 모바일 우선 설계 (세로 타임라인)
- 데스크탑에서는 가로 타임라인
- 단계 클릭 시 하단 슬라이드 패널 또는 모달 오픈
- 각 단계 패널 구성:
  1. 지금 해야 할 일
  2. 필수 서류 + PDF 다운로드 링크
  3. 가장 흔한 문제 / 주의사항
  4. 다음 단계로 넘어가는 조건
- 색상:
  - Primary: #2563EB (Medical Blue)
  - Background: #F8FAFC
- 단계 상태:
  - 기본(회색)
  - 활성(블루)
  - 완료(그린) → 향후 개인화 시 사용

---

## 4. 단계별 콘텐츠 구조 (MVP 기준)

### Step 1. 산재 최초 신청 (인정 단계)

- 해야 할 일:
  - 사고 즉시 병원 방문
  - 요양급여신청서 접수 (사업주 동의 불필요)
- 필수 서류:
  - 요양급여 신청서
  - 초진소견서 또는 진단서
  - 사고 경위서
  - 사업주 확인서(선택)
- 주요 문제:
  - 회사가 산재 접수 방해
  - 3년 초과 접수 시 불인정 가능
- 다음 단계:
  - 공단 요양 승인 통보

---

### Step 2. 요양 및 치료 + 휴업급여

- 해야 할 일:
  - 치료 지속
  - 매월 휴업급여 청구
- 필수 서류:
  - 휴업급여 청구서
  - 진료비 영수증
  - 요양비 청구서(비지정 병원)
  - 진료계획서(연장 시)
- 주요 문제:
  - 무단 근로 시 급여 환수
  - 요양 중단 판정 위험
- 다음 단계:
  - 치료 종결 판정

---

### Step 3. 치료 종결 및 장해 심사

- 해야 할 일:
  - 장해급여 청구 여부 결정
- 필수 서류:
  - 장해급여 청구서
  - 장해진단서
  - MRI / X-ray CD
  - 수술기록지
- 주요 문제:
  - 5년 초과 시 청구권 소멸
  - 등급 불인정 분쟁
- 다음 단계:
  - 장해 등급 확정

---

### Step 4. 사회 복귀 및 직업 재활

- 해야 할 일:
  - 원직 복귀 또는 직업훈련 신청
- 필수 서류:
  - 직업재활급여 신청서
  - 위탁훈련계획서
  - 취업확인서
- 주요 문제:
  - 복귀 거부, 재취업 실패
- 종료 조건:
  - 재취업 안정 또는 재활 종료

---

## 5. 반드시 추가 구현할 보조 섹션

- 승인 불인정·지연 대응 가이드
- 급여 전체 요약표 (휴업, 장해, 간병, 재활 등)
- 회사와의 분쟁 대응 가이드
- 가족이 대신 할 수 있는 절차 정리

---

## 6. Next.js 컴포넌트 설계

/components/timeline  
- TimelineContainer.tsx  
- TimelineStepCard.tsx  
- TimelineDetailPanel.tsx  
- DocumentDownloadButton.tsx  
- LegalNotice.tsx  

/pages 또는 /app  
- /industrial-accident/timeline/page.tsx

---

## 7. Supabase 테이블 구조 (MVP + 확장 대비)

### stages
- id
- step_number
- title
- description
- next_condition

### documents
- id
- stage_id
- title
- pdf_url
- is_required

### warnings
- id
- stage_id
- content

※ 2차에서 user_stage_progress 테이블 추가 예정

---

## 8. PDF 제공 방식 정책

- PDF 파일을 직접 서버에 저장하지 않음
- 근로복지공단 공식 링크만 제공
- Supabase에는 pdf_url만 저장

---

## 9. MVP 개발 순서 (TODO)

- [ ] 타임라인 UI 와이어프레임 설계
- [ ] 단계별 데이터 JSON 작성
- [ ] Supabase stages / documents / warnings 테이블 생성
- [ ] Seed 데이터 입력
- [ ] TimelineContainer 기본 레이아웃 구현
- [ ] StepCard + DetailPanel 연결
- [ ] PDF 다운로드 버튼 연결
- [ ] 법적 고지 UI 고정 적용
- [ ] 모바일 반응형 테스트
- [ ] 실사용자 기준 문구 1차 교정

---

## 10. 2차 고도화 (향후 계획)

- Clerk 로그인 연동
- 사용자 진행 단계 체크
- 완료/진행중 상태 UI 반영
- 개인화된 필요 서류 체크리스트
- RAG 챗봇 자동 연동
- 개인 진행 상황 기반 질문 자동 추천

---

## 11. RAG 연동을 위한 원본 데이터 저장 규칙

각 단계 데이터는 다음 형식으로 별도 저장:

[단계명]  
[해야 할 일]  
[필수 서류]  
[주의사항]  
[다음 단계 조건]

※ 이 형식을 그대로 임베딩용 텍스트로 사용

# 12. 라우팅 구조 확정

- 타임라인 메뉴 URL:
  - /industrial-accident/timeline
- 향후 개인화 확장 시:
  - /industrial-accident/progress (로그인 사용자 전용)

---

# 13. PDF 저장 및 링크 정책 (최종)

## MVP (테스트 단계)
- 커서 로컬 경로 또는 임시 URL 사용

## 실서비스 (1차 배포)
- Supabase Storage 또는 WordPress uploads 폴더에 저장
- Supabase documents 테이블의 pdf_url에:
  - Supabase Public URL
  또는
  - WordPress 절대경로 URL 저장

## 금지 사항
- 근로복지공단 PDF를 서버에 무단 복제해서 직접 배포하지 않음
- 반드시 “출처 링크 방식” 유지

---

# 14. 모바일 UX 확정 (전체 화면 모달)

- Step 카드 클릭 → Full Screen Modal 오픈
- 모달 내부 구조:
  - 상단: 단계 제목 + 닫기 버튼
  - 탭 3개:
    - 지금 해야 할 일
    - 필수 서류 (PDF 버튼)
    - 주의사항 / 분쟁 포인트
  - 하단: “다음 단계 보기” 버튼

- 모달 전환 애니메이션:
  - 모바일: 아래 → 위 슬라이드
  - 데스크탑: 페이드 + 스케일

---

# 15. 다크모드 지원 정책

## 기본 원칙
- Tailwind dark mode class 사용 (class 방식)
- Clerk 테마와 연동 고려

## 컬러 기준
- 라이트:
  - background: #F8FAFC
  - card: white
  - primary: #2563EB
- 다크:
  - background: #0F172A
  - card: #1E293B
  - primary: #60A5FA

## TODO
- [ ] Tailwind darkMode: 'class' 설정
- [ ] global theme toggle UI 추가
- [ ] 로컬스토리지 테마 저장

---

# 16. 유료 서비스 확장 대비 구조 (아키텍처 유지 조건)

## 무료(MVP)
- 타임라인 전체 열람
- PDF 다운로드
- 기본 설명 열람

## 유료(2차)
- 개인 진행 단계 체크
- 개인 맞춤 서류 체크리스트
- 개인화 RAG 상담
- 분쟁 대응 시나리오 제공

## 결제 연계 구조
- 향후 Stripe 또는 PG 모듈 연결
- Clerk user_id 기준으로 권한 체크

---

# 17. 실제 개발 세부 TODO (커서 실행용)

## 1단계: 데이터 레이어
- [ ] Supabase stages 테이블 생성
- [ ] Supabase documents 테이블 생성
- [ ] Supabase warnings 테이블 생성
- [ ] 4단계 Seed 데이터 입력
- [ ] PDF URL 필드 테스트 값 연결

## 2단계: UI 베이스
- [ ] TimelineContainer 레이아웃 구성
- [ ] Desktop 가로 / Mobile 세로 분기 처리
- [ ] Stage progression 화살표 아이콘 적용
- [ ] LegalNotice 컴포넌트 상단 고정

## 3단계: 인터랙션
- [ ] StepCard 클릭 이벤트 처리
- [ ] Full Screen Modal 오픈/클로즈 구현
- [ ] 탭 UI 구현 (해야 할 일 / 서류 / 주의사항)
- [ ] DocumentDownloadButton 연결

## 4단계: 다크모드
- [ ] 테마 토글 UI 구현
- [ ] dark class 반응 확인
- [ ] 다크모드에서 모달 가독성 테스트

## 5단계: 검증
- [ ] 모바일 실기기 테스트 (iOS / Android)
- [ ] 산재 비전문자 기준 UX 1차 피드백
- [ ] 문구 난이도 최종 조정

---

# 18. 향후 개인화 / 유료화 준비용 테이블 (지금은 생성만)

### user_stage_progress
- id
- user_id (Clerk)
- stage_id
- status (pending | active | completed)
- updated_at

### user_documents_progress
- id
- user_id
- document_id
- is_submitted
- submitted_at

---

# 19. RAG 연동 파이프라인 예비 규칙

- 타임라인 원본 데이터는 별도 markdown으로 보관
- Supabase embedding 테이블에:
  - 단계별 설명
  - 주의사항
  - 분쟁 포인트
  를 모두 벡터화 저장
- 향후 질문 예:
  - “나는 지금 2단계인데 뭐 빠진 거 없어?”
  - “회사에서 산재 처리 안 해 준다는데 어떻게 해?”

---

# 20. 성공 기준 (MVP)

- 산재 초보자가:
  - “지금 내가 어디 단계인지”
  - “지금 당장 해야 할 행동”
  - “어떤 서류를 언제 내야 하는지”
  를 3분 안에 이해할 수 있으면 성공

---

# 21. 유지보수 기준

- 매년 1회 이상:
  - 산재 법령 개정 여부 점검
  - 급여 금액, 기준 변경 반영
- PDF 링크 404 주기 점검


