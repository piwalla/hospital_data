# Google File Search RAG 구현 가이드 (V3)

본 문서는 Google File Search (Gemini 2.5 Flash) 기반 RAG 시스템을 관리하기 위한 **표준 작업 절차(SOP)**입니다. "유령 파일(Ghost File)" 문제 해결과 인용 오류 수정 과정에서 얻은 교훈을 바탕으로 통합 정리되었습니다.

**새로운 문서를 추가할 때는 시스템 안정성을 위해 이 가이드를 엄격히 준수해 주십시오.**

---

## 1. 핵심 아키텍처

- **모델**: `gemini-2.5-flash` (File Search 최적화 모델)
- **저장소 전략 (Store Strategy)**: **불변형(Immutable-like) 저장소**를 지향합니다. 깨끗한 상태의 저장소에 정해진 이름의 파일만 보관합니다. 만약 삭제되지 않는 "유령 파일"(예: `temp_upload_...`)이 발생하면, 개별 파일을 삭제하려 애쓰지 말고 **"초기화 리셋(Nuclear Reset)"** (새 저장소 생성 -> 전체 재업로드 -> ID 교체)을 수행합니다.
- **현재 저장소 ID**: `docs/rag_document_registry.md` 파일에 명시되어 있습니다.

---

## 2. 필수 명명 규칙 (Mandatory Naming Convention)

Google File Search API는 비-ASCII 문자(한글 등)와 공백 처리에 엄격한 제한이 있습니다. "외계어 제목"이 검색되거나 매핑이 깨지는 것을 방지하기 위해 다음 규칙을 따르세요:

1.  **API 파일명에 한글 금지**: Google에 업로드될 파일명은 반드시 **영문(ASCII)**으로 변환해야 합니다.
2.  **공백(Space) 금지**: 띄어쓰기 대신 밑줄(`_`)을 사용하세요.
    - ❌ 나쁜 예: `Hospital Guide 2025.pdf` (파싱 에러 또는 %20 문자 발생 가능)
    - ✅ 좋은 예: `Hospital_Guide_2025.pdf`
3.  **의미 있는 이름 사용**: 무작위 문자열 대신 파일 내용을 짐작할 수 있는 영문명을 사용하세요.
    - ❌ 나쁜 예: `temp_upload_x9d12.pdf`
    - ✅ 좋은 예: `Nursing_Care_Benefit_Standards.pdf`

---

## 3. 작업 워크플로우: 신규 문서 추가 (100개 이상 확장 시)

100개 이상의 문서를 관리하려면 **자동화와 일관성**이 핵심입니다.

### 1단계: 사전 준비 (Pre-processing)

로컬 파일은 관리를 위해 **한글 파일명**을 유지하되, 업로드 시 사용할 **영문 파일명**을 미리 결정합니다.

### 2단계: 문서 호스팅 (Supabase Storage) - 필수

Google File Search는 문서의 **내용**만 임베딩할 뿐, 사용자가 다운로드할 수 있는 **원본 파일 링크**는 제공하지 않는 경우가 많습니다. 따라서:

1.  Supabase Storage의 `uploads/documents` 버킷에 원본 PDF를 업로드합니다.
2.  해당 파일의 **Public URL**을 확보합니다.
3.  이 URL은 다음 단계(메타데이터 등록)의 `downloadUrl` 필드에 사용됩니다.

> **Note**: 이 작업을 수행하지 않으면 인용구는 표시되지만 **클릭 시 반응이 없거나 깨진 링크**가 될 수 있습니다.

### 3단계: 메타데이터 등록 (`lib/constants/rag-metadata.ts`)

**중요**: 파일을 업로드하기 **전**이나 **동시에**, 반드시 레지스트리에 해당 파일을 등록해야 합니다. 챗봇 API는 영문 인용 제목을 한글로 변환할 때 전적으로 이 레지스트리에 의존합니다.

**작성 양식:**

```typescript
"Nursing_Care_Benefit_Standards.pdf": {  // <--- 업로드할 파일명과 정확히 일치해야 함 (Key)
  originalName: "간병료 지급 기준.pdf",
  koreanTitle: "간병료 지급 기준",      // <--- 사용자에게 보여질 제목
  color: "green",
  downloadUrl: "https://.../nursing_benefit.pdf" // <--- 클릭 가능한 인용구를 위해 필수
},
```

### 3단계: 업로드 스크립트 실행

`scripts/reupload_rag_files.ts` (또는 대량 업로드용 `scripts/bulk_upload.ts`)를 사용하여 업로드합니다. **`@google/genai`** SDK 사용을 권장합니다.
**핵심 로직:**

- 로컬 파일을 읽어옵니다.
- 업로드 설정의 `displayName`과 `name` 속성을 2단계에서 정한 **영문 파일명** (예: `Nursing_Care_Benefit_Standards.pdf`)으로 지정합니다.
- **절대** API가 임의의 이름을 자동 생성하게 두지 마세요.

### 4단계: 검증 (Verification)

업로드 후 `scripts/debug_retrieval.ts`를 실행하여 새 문서와 관련된 질문을 던져봅니다.

- **성공**: 결과에 `[Chunk] Title: "Nursing_Care_Benefit_Standards.pdf"`가 표시됨.
- **실패**: `undefined`나 이전 파일명이 표시됨.

### 6단계: 인용구 최종 확인 (Manual Audit)

기술적 검증(5단계) 후에는 **실제 질문**을 통해 인용구가 올바르게 생성되는지 확인해야 합니다. 각 문서의 핵심 키워드를 포함한 질문을 준비하세요.

**테스트 질문 예시 (Test Questions):**

1. **[요양/급여]**: "간병료 지급 기준이 어떻게 되나요?" (예상인용: `Nursing_Care_Benefit_Standards.pdf` -> `간병료 지급 기준`)
2. **[법령/규칙]**: "산재보험법 시행규칙상 휴업급여 청구 방법은?" (예상인용: `Enforcement_Rule.pdf` -> `산재보험법 시행규칙`)
3. **[가이드]**: "2025년 산재 가이드의 주요 변경사항은?" (예상인용: `Hospital_Guide_2025.pdf` -> `2025 산재 가이드`)

> **Check Point**: 답변 하단에 초록색 인용 버튼이 뜨는지, 클릭 시 Supabase 버킷의 PDF가 열리는지 확인하세요.

---

## 4. 인용 로직 및 디버깅

`app/api/chatbot-v2/route.ts` 파일이 인용구(Citation)를 최종적으로 처리합니다.

### 작동 원리

1.  **검색 (Retrieval)**: Gemini가 `groundingMetadata`에 `retrievedContext.title`을 담아 반환합니다.
2.  **추출 (Extraction)**: API가 이 제목(예: `Nursing_Care_Benefit_Standards.pdf`)을 가져옵니다.
3.  **매핑 (Mapping)**: `getKoreanTitle("Nursing_Care_Benefit_Standards.pdf")`를 호출 -> `rag-metadata.ts` 조회 -> "간병료 지급 기준" 반환.
4.  **Fallback URI**: Google은 업로드된 파일에 대해 종종 `uri` 속성을 `undefined`로 반환합니다. 이때 API는 레지스트리(`rag-metadata.ts`)에 있는 `downloadUrl`을 `uri` 속성에 강제로 주입하여 프론트엔드에서 클릭 가능한 링크가 생성되도록 합니다.

### 자주 발생하는 오류 및 해결법

| 증상                              | 원인                                | 해결 방법                                                                   |
| :-------------------------------- | :---------------------------------- | :-------------------------------------------------------------------------- |
| **인용구가 영문 파일명으로 나옴** | `rag-metadata.ts`에 키(Key)가 없음. | 영문 파일명을 Key로 하여 레지스트리에 추가.                                 |
| **인용구가 아예 안 보임**         | `uri`가 없어서 프론트엔드가 숨김.   | 레지스트리에 `downloadUrl`이 있는지 확인 (API가 이를 채워줌).               |
| **유령 파일(`temp_upload`)이 뜸** | 저장소가 오염됨.                    | **초기화 리셋(Nuclear Reset)** 수행: 새 저장소 생성 -> 재업로드 -> ID 교체. |

---

## 5. 초기화 리셋 절차 (비상 조치)

삭제되지 않는 유령 파일들로 저장소가 지저분해졌다면:

1.  `scripts/nuclear_reset_store.ts` 스크립트를 실행합니다 (새로운 V(N+1) 저장소 생성).
2.  `app/api/chatbot-v2/route.ts`의 `const fileSearchStoreNames` 값을 새 ID로 변경합니다.
3.  `docs/rag_document_registry.md`의 저장소 정보를 업데이트합니다.
