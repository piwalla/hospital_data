# 산재 진행 과정 (타임라인) 기능

## 개요

산재 환자와 가족을 위한 "사고 발생 → 신고 → 치료 → 복귀" 전 과정을 시각적 타임라인으로 한눈에 이해할 수 있도록 제공하는 기능입니다. 초보자도 쉽게 이해할 수 있도록 단순하고 명확한 용어로 구성되어 있습니다.

## 주요 기능

### 1. 타임라인 단계 표시
- **4단계 구조**: 산재 신청부터 치료, 복귀까지 4단계로 구성
- **세로 레이아웃**: 모든 화면 크기에서 세로로 단계가 표시됨
- **단계별 정보**: 각 단계마다 제목, 설명, 해야 할 일, 서류, 주의사항 제공

### 2. 단계별 상세 정보
- **해야 할 일**: 각 단계에서 수행해야 하는 주요 작업 2개
- **필요한 서류**: 해당 단계에서 필요한 서류 목록 (4개)
- **주의사항**: 중요한 주의사항 2개

### 3. 단계 상세 페이지
- 각 단계를 클릭하면 별도 상세 페이지로 이동
- 탭 형식으로 "해야 할 일", "서류", "주의사항" 정보 제공
- 이전/다음 단계로 이동 가능

### 4. 법적 고지
- 페이지 하단에 법적 고지 표시
- 일반적인 안내 목적임을 명시

## 기술 구성

### 페이지 구조
```
app/timeline/
├── page.tsx                    # 메인 타임라인 페이지
└── [stepNumber]/
    └── page.tsx                # 단계별 상세 페이지
```

### 주요 컴포넌트
```
components/timeline/
├── TimelineContainer.tsx       # 타임라인 컨테이너 (단계 목록 표시)
├── TimelineStepCard.tsx       # 각 단계 카드
├── TimelineStepContent.tsx    # 단계 상세 내용 (탭 기능)
├── TimelineDetailPanel.tsx    # 상세 패널 (모달)
├── DocumentDownloadButton.tsx # 서류 다운로드 버튼
└── LegalNotice.tsx             # 법적 고지 컴포넌트
```

### 데이터 구조

#### 데이터베이스 테이블
- `stages`: 타임라인 단계 정보
  - `id`: UUID (Primary Key)
  - `step_number`: 단계 번호 (1-4)
  - `title`: 단계 제목 (예: "사고 발생 후 산재 신고하기")
  - `description`: 단계 설명
  - `created_at`, `updated_at`: 타임스탬프

- `timeline_documents`: 각 단계별 필요 서류
  - `id`: UUID (Primary Key)
  - `stage_id`: stages 테이블 외래키
  - `name`: 서류 이름
  - `description`: 서류 설명
  - `order_index`: 표시 순서
  - `download_url`: 다운로드 링크 (선택)

- `timeline_warnings`: 각 단계별 주의사항
  - `id`: UUID (Primary Key)
  - `stage_id`: stages 테이블 외래키
  - `title`: 주의사항 제목
  - `content`: 주의사항 내용
  - `order_index`: 표시 순서

#### API 함수
- `lib/api/timeline.ts`
  - `getAllStagesWithDetails()`: 모든 단계와 관련 서류, 주의사항 조회

### 데이터 흐름

1. **페이지 로드**
   ```
   TimelinePage (Server Component)
   → getAllStagesWithDetails()
   → Supabase에서 stages, timeline_documents, timeline_warnings 조회
   → TimelineContainer에 데이터 전달
   ```

2. **단계 클릭**
   ```
   TimelineStepCard 클릭
   → /timeline/[stepNumber] 페이지로 이동
   → TimelineStepContent에서 탭별 정보 표시
   ```

## 접근 권한

- **공개 페이지**: 로그인 없이도 접근 가능
- 인증이 필요 없는 Supabase 클라이언트 사용 (`createPublicSupabaseClient`)

## 사용자 경험

### 초보자 친화적 설계
- 복잡한 법률 용어 대신 쉬운 표현 사용
  - 예: "산재 최초 신청 (인정 단계)" → "사고 발생 후 산재 신고하기"
- 단계별 명확한 설명 제공
- 시각적으로 단계 진행 상황 파악 가능

### 반응형 디자인
- 모바일: 세로 레이아웃, 한 열로 표시
- 데스크톱: 세로 레이아웃 유지 (가로 배치 없음)
- 모든 화면 크기에서 일관된 경험 제공

## 주요 파일 경로

- **페이지**: `app/timeline/page.tsx`, `app/timeline/[stepNumber]/page.tsx`
- **컴포넌트**: `components/timeline/`
- **API**: `lib/api/timeline.ts`
- **타입**: `lib/types/timeline.ts`
- **마이그레이션**: `supabase/migrations/*_create_timeline_tables.sql`

## 향후 개선 가능 사항

- 단계별 진행률 표시
- 사용자별 맞춤 안내 (로그인 사용자)
- 서류 작성 가이드 링크 통합
- 단계별 체크리스트 기능

