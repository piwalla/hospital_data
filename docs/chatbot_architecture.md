# 산재 상담 챗봇 시스템 아키텍처 (Chatbot System Architecture)

## 1. 개요 (Overview)

리워크케어의 **산재 상담 챗봇**은 **RAG (Retrieval-Augmented Generation, 검색 증강 생성)** 기술을 기반으로 구축된 AI 서비스입니다.
근로복지공단 및 법제처의 공신력 있는 데이터를 바탕으로 산재 관련 규정과 법령을 검색하여 사용자 질문에 대한 정확하고 신뢰성 있는 답변을 제공합니다.

## 2. 주요 기능 (Key Features)

### 2.1. 정확도 높은 산재 전문 상담

- **환각(Hallucination) 최소화**: LLM이 학습하지 않은 데이터나 잘못된 정보를 생성하는 것을 방지하기 위해, 미리 구축된 산재 법령 및 규정 데이터베이스를 실시간으로 검색하여 답변 근거로 사용합니다.
- **출처 기반 답변**: AI가 스스로 지어낸 이야기가 아닌, 실제 규정에 근거한 답변을 제공합니다.

### 2.2. 사용자 맞춤형 세션 관리

- **연속적인 대화**: 사용자와의 이전 대화 맥락(Context)을 기억합니다. Clerk 인증 시스템과 연동하여 사용자 ID 별로 개별 세션을 관리하여, "아까 말한 내용에 대해서 더 설명해줘"와 같은 질문이 가능합니다.
- **데이터 보안**: 로그인(Log-in)한 사용자만 접근할 수 있도록 보안 처리되어 있습니다.

### 2.3. 실시간 상태 시각화 (Interactive UI)

- **처리 과정 안내**: 챗봇이 답변을 준비하는 과정을 투명하게 보여줍니다.
  1. **규정 분석 중** (사용자 질문 의도 파악)
  2. **검색 중** (관련 법령 데이터 조회)
  3. **작성 중** (최종 답변 생성)
- 이 과정을 통해 사용자는 AI가 실제로 '일'을 하고 있음을 인지하게 되어 대기 시간의 지루함을 덜 수 있습니다.

## 3. 기술 스택 (Technology Stack)

### 3.1. Frontend (Client Implementation)

- **Framework**: **Next.js (App Router)** 기반
- **UI/UX**:
  - **Tailwind CSS**: `backdrop-blur-xl`, `bg-white/50` 등 글래스모피즘(Glassmorphism) 디자인을 적용하여 깔끔하고 현대적인 UI 제공
  - **Lucide React**: 직관적인 아이콘 사용
  - **Markdown Rendering**: AI가 응답한 마크다운(Markdown) 텍스트를 HTML로 변환하여 가독성 높게 렌더링
- **State Management**: React Hooks (`useState`, `useMemo`)를 사용하여 채팅 메시지, 로딩 상태, 에러 상태 관리

### 3.2. Backend & Middleware

- **Next.js API Route (`/api/chatbot`)**:
  - 클라이언트와 AI 서버 간의 **중계(Proxy)** 역할을 수행합니다.
  - **CORS (Cross-Origin Resource Sharing) 문제 해결**: 웹 브라우저가 n8n 서버를 직접 호출할 때 발생할 수 있는 보안 정책 문제를 해결합니다.
  - **API Key 보안**: 실제 AI 워크플로우 주소(Webhook URL)를 서버 환경 변수(`NEXT_PUBLIC_N8N_WEBHOOK_URL`)로 관리하여 외부에 노출되지 않도록 합니다.
  - **타임아웃 파이프라인**: 30초 이상의 지연 발생 시 연결을 제어하는 로직이 포함되어 있습니다.

### 3.3. AI Core & Workflow

- **n8n (Workflow Automation)**:
  - 챗봇의 **두뇌** 역할을 하는 로우코드(Low-code) 자동화 툴입니다.
  - 복잡한 AI 로직(질문 분석 -> 검색 -> LLM 호출 -> 답변 가공)을 워크플로우 형태로 구현하여 관리합니다.
- **Supabase (Vector Database)**:
  - 산재 관련 모든 문서, 법령, 가이드라인이 **임베딩(Embedding)** 형태로 저장된 데이터베이스입니다.
  - 사용자의 질문과 의미적으로 가장 유사한 문서를 고속으로 검색(Semantic Search)하는 역할을 합니다.

## 4. 데이터 처리 흐름 (Data Flow Pipeline)

1.  **User Input**: 사용자가 채팅창에 질문을 입력 (예: "휴업급여 신청 방법 알려줘")
2.  **Client Request**: `RagChatbot.tsx` 컴포넌트가 내부 API (`api/chatbot`)로 요청 전송
    - 이때 사용자의 Clerk ID를 세션 식별자로 함께 전송
3.  **Authentication & Proxy**: Next.js API Route가 요청을 검증하고, **n8n Webhook**으로 전달
4.  **RAG Process (n8n)**:
    - **Step 1**: 질문의 핵심 키워드와 의도를 분석
    - **Step 2**: Supabase Vector DB에서 관련 산재 규정/법령 문서 검색
    - **Step 3**: 검색된 문서 내용(Context)과 사용자 질문을 LLM(Chat GPT 등)에 입력
    - **Step 4**: LLM이 문서를 바탕으로 최종 답변을 생성
5.  **Response**: 생성된 답변이 **API Response** -> **Client** 순으로 전달되어 화면에 출력됨

## 5. 주요 파일 구조 (File Structure)

- `app/chatbot/page.tsx`: 채팅 페이지 메인 UI (로그인 체크, 안내 문구)
- `components/rag-chatbot/RagChatbot.tsx`: 실제 채팅 로직이 담긴 클라이언트 컴포넌트
- `app/api/chatbot/route.ts`: n8n 서버와 통신하는 백엔드 프록시 API
