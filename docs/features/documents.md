# 서류 안내 기능

## 개요

산재 신청 및 치료 과정에서 필요한 주요 서류 8개에 대한 상세 안내를 제공하는 기능입니다. 각 서류의 작성 방법, 필요 서류, 처리 기간 등을 AI 기반 요약과 함께 제공하여 초보자도 쉽게 이해할 수 있도록 구성되어 있습니다.

## 주요 기능

### 1. 서류 목록 표시
- **8개 주요 서류**: 산재 신청 및 치료 과정에서 필요한 핵심 서류
- **카드 형식**: 각 서류를 카드 형태로 표시
- **아이콘 표시**: 각 서류별 시그니처 초록색 아이콘
- **호버 효과**: 카드 호버 시 "작성방법 보기" 버튼 강조

### 2. 서류 상세 정보
- **서류 요약**: AI 기반 서류 작성 가이드 요약
- **주요 섹션**: 
  - 재해 발생 경위 작성법
  - 목격자 정보
  - 병원 정보 및 의사 소견
  - 제출 방법
  - 처리 기간
- **필요 서류**: 해당 서류 작성 시 필요한 첨부 서류 목록
- **관련 서류**: 연관된 다른 서류 링크

### 3. AI 서류 상담 챗봇
- **서류별 맞춤 상담**: 각 서류 페이지에서 해당 서류에 대한 질문 가능
- **Gemini AI 활용**: Google Gemini API를 통한 자연어 응답
- **컨텍스트 인식**: 현재 보고 있는 서류 정보를 컨텍스트로 활용

### 4. 서류 다운로드
- **공식 양식 링크**: 근로복지공단 공식 양식 다운로드 링크 제공
- **예시 양식**: 작성 예시가 있는 양식 다운로드 (선택)

## 기술 구성

### 페이지 구조
```
app/documents/
├── page.tsx                    # 서류 목록 페이지
└── [id]/
    └── page.tsx                # 서류 상세 페이지
```

### 주요 컴포넌트
```
components/documents/
├── DocumentsList.tsx           # 서류 목록 컴포넌트
├── DocumentSummary.tsx          # 서류 요약 및 상세 정보
└── DocumentAssistant.tsx       # 서류별 AI 상담 챗봇
```

### 데이터 구조

#### 서류 데이터
- `lib/data/documents.ts`: 서류 정보 정의
  - 각 서류는 `Document` 타입으로 정의
  - 정적 데이터 (하드코딩)
  - 8개 서류:
    1. 산재신청서 (요양급여 및 휴업급여 신청서)
    2. 요양비 청구서
    3. 휴업급여 청구서
    4. 장해급여 청구서
    5. 상병보상연금 청구서
    6. 간병급여 청구서
    7. 장의비 청구서
    8. 유족급여 청구서

#### Document 타입
```typescript
interface Document {
  id: string;                    // 서류 고유 ID
  name: string;                  // 서류명
  description: string;           // 서류 설명
  category: 'application' | 'claim'; // 서류 카테고리
  officialDownloadUrl: string;   // 공식 양식 다운로드 URL
  exampleUrl?: string;            // 예시 양식 URL (선택)
  requiredDocuments: string[];    // 필요 첨부 서류 목록
  processingPeriod: string;      // 처리 기간
  relatedDocuments: string[];    // 관련 서류 ID 목록
  predefinedSummary: {           // AI 요약 정보
    summary: string;
    sections: Array<{
      title: string;
      content: string;
      order: number;
    }>;
  };
}
```

### AI 요약 생성

#### 프롬프트
- `lib/prompts/document-summary.ts`: 서류 요약 생성 프롬프트
- `lib/prompts/document-assistant.ts`: 서류 상담 챗봇 프롬프트

#### API 함수
- `lib/api/document-summary.ts`
  - `generateDocumentSummary()`: Gemini API를 통한 서류 요약 생성
  - 캐싱 기능 포함 (동일 서류는 재생성하지 않음)

### 데이터 흐름

1. **서류 목록 페이지**
   ```
   DocumentsPage
   → DocumentsList 컴포넌트
   → lib/data/documents.ts에서 서류 목록 로드
   → 각 서류를 카드로 표시
   ```

2. **서류 상세 페이지**
   ```
   DocumentDetailPage
   → findDocumentById()로 서류 정보 조회
   → DocumentSummary: 서류 요약 및 상세 정보 표시
   → DocumentAssistant: 서류별 AI 상담 챗봇 표시
   ```

3. **AI 요약 생성** (최초 접근 시)
   ```
   DocumentSummary 마운트
   → generateDocumentSummary() 호출
   → Gemini API로 요약 생성
   → 캐시에 저장 (재방문 시 재사용)
   ```

4. **AI 상담 챗봇**
   ```
   사용자 질문 입력
   → DocumentAssistant에서 Gemini API 호출
   → 현재 서류 정보를 컨텍스트로 포함
   → 자연어 응답 생성 및 표시
   ```

## 접근 권한

- **공개 페이지**: 로그인 없이도 접근 가능
- **AI 기능**: Gemini API 사용 (환경 변수 필요)

## 사용자 경험

### 반응형 디자인
- **모바일**: 
  - 서류 카드에서 아이콘과 제목이 나란히 표시
  - 제목 폰트 크기 증가 (가독성 향상)
  
- **데스크톱**:
  - 카드 그리드 레이아웃
  - 호버 효과로 인터랙션 강조

### 디자인 특징
- **시그니처 초록색**: 아이콘과 버튼에 일관된 색상 사용
- **명확한 계층 구조**: 제목, 설명, 버튼의 폰트 크기 차별화
- **접근성**: 큰 폰트, 명확한 버튼, 충분한 여백

## 주요 파일 경로

- **페이지**: `app/documents/page.tsx`, `app/documents/[id]/page.tsx`
- **컴포넌트**: `components/documents/`
- **데이터**: `lib/data/documents.ts`
- **타입**: `lib/types/document.ts`
- **API**: `lib/api/document-summary.ts`
- **프롬프트**: `lib/prompts/document-summary.ts`, `lib/prompts/document-assistant.ts`

## 환경 변수

- `GEMINI_API_KEY`: Google Gemini API 키 (AI 요약 및 상담용)

## 향후 개선 가능 사항

- 서류 작성 체크리스트 기능
- 서류 작성 진행 상황 추적
- 서류 제출 알림 기능
- 서류 작성 가이드 비디오 링크
- 사용자별 맞춤 서류 추천
- 서류 작성 예시 템플릿 다운로드

