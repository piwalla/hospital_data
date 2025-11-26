# n8n RAG 챗봇 워크플로우 분석

## 개요

이 문서는 산업재해 전문 상담 챗봇의 n8n 워크플로우 구조와 동작 방식을 설명합니다. 이 챗봇은 RAG(Retrieval-Augmented Generation) 기술을 활용하여 Supabase의 벡터 데이터베이스에서 산재 관련 정보를 검색하고, Google Gemini를 통해 사용자에게 친절하고 정확한 상담을 제공합니다.

## 워크플로우 구조

### 노드 구성

```
Webhook → Code → AI Agent → Respond to Webhook
                ↓
    [Google Gemini Chat Model]
                ↓
    [Supabase Vector Store (RAG)]
                ↓
    [Embeddings Google Gemini]
                ↓
    [Simple Memory]
```

### 노드별 상세 설명

#### 1. Webhook 노드

**역할**: 외부에서 POST 요청을 받아 워크플로우를 트리거

**설정**:
- **HTTP Method**: POST
- **Path**: `test123`
- **Response Mode**: "responseNode" (Respond to Webhook 노드 사용)

**입력 데이터 형식**:
```json
{
  "message": "요양급여가 뭔가요?",
  "sessionId": "user001"
}
```

**주의사항**:
- n8n의 Webhook 노드는 UTF-8 인코딩 처리에 문제가 있을 수 있음
- PowerShell에서 직접 실행할 때는 정상 작동하지만, Cursor 터미널을 통할 때는 한글이 깨질 수 있음

#### 2. Code in JavaScript 노드

**역할**: Webhook에서 받은 데이터를 처리하여 AI Agent에 전달할 형식으로 변환

**현재 코드**:
```javascript
const item = $input.item;

// Webhook JSON Body 직접 사용
const message = item.json?.body?.message || item.json?.message;

if (!message) {
  return {
    json: {
      error: "message 없음",
      received: item.json,
      sessionId: Date.now().toString(),
      chatInput: ""
    }
  };
}

// 세션 ID (없으면 자동 생성)
const sessionId = item.json?.sessionId || Date.now().toString();

// 최종 출력
return {
  json: {
    chatInput: message,
    sessionId
  }
};
```

**출력 데이터**:
- `chatInput`: 사용자 질문 (AI Agent로 전달)
- `sessionId`: 세션 ID (Simple Memory에서 사용)

**개선 제안** (한글 인코딩 문제 대비):
```javascript
const item = $input.item;

// Webhook JSON Body 직접 사용
let message = item.json?.body?.message || item.json?.message;

// 한글 인코딩 복구 (필요시)
if (message && typeof message === 'string') {
  try {
    // Latin1로 잘못 해석된 UTF-8 복구 시도
    const bytes = [];
    for (let i = 0; i < message.length; i++) {
      bytes.push(message.charCodeAt(i) & 0xFF);
    }
    const decoded = Buffer.from(bytes).toString('utf8');
    // 복구 성공 여부 확인 (깨진 문자가 없는지)
    if (decoded && !decoded.includes('') && decoded.length > 0) {
      message = decoded;
    }
  } catch (e) {
    // 복구 실패 시 원본 사용
  }
}

if (!message) {
  return {
    json: {
      error: "message 없음",
      received: item.json,
      sessionId: Date.now().toString(),
      chatInput: ""
    }
  };
}

// 세션 ID (없으면 자동 생성)
const sessionId = item.json?.body?.sessionId || item.json?.sessionId || Date.now().toString();

// 최종 출력
return {
  json: {
    chatInput: message,
    sessionId
  }
};
```

#### 3. AI Agent 노드 (핵심)

**역할**: LangChain Agent를 사용하여 사용자 질문에 답변 생성

**주요 설정**:
- **Prompt Type**: Define
- **Text**: `={{$json.chatInput}}\n\n`
- **Max Iterations**: 10
- **Return Intermediate Steps**: false

**System Message 핵심 내용**:

1. **역할 정의**:
   - 15년 경력의 산업재해 전문 노무사
   - 따뜻하고 세심한 상담 스타일
   - 산재 초보 재해자와 가족을 대상으로 함

2. **CRITICAL INSTRUCTION (최우선 순위)**:
   - **반드시 RAG 도구(`rag_hospital1`)를 사용하여 정보 검색**
   - 개인 지식이나 일반 정보 사용 금지
   - 검색 결과(Context)에만 기반하여 답변
   - 정보가 없으면 솔직하게 말하기

3. **응답 가이드라인**:
   - **정보 출처 제한**: 검색된 Context에만 기반
   - **눈높이 설명**: 법률 용어를 쉬운 말로 풀어서 설명
   - **사용자 의도 파악**: 모호한 질문도 문맥 파악하여 검색
   - **공감과 위로**: 답변 시작은 항상 공감과 안심
   - **출처 표기**: 답변 끝에 참고 자료 명시

4. **응답 구조**:
   1. 공감 인사
   2. 핵심 답변
   3. 상세 설명
   4. 주의 사항
   5. 출처

#### 4. Google Gemini Chat Model

**역할**: LLM으로 사용자 질문 처리 및 응답 생성

**설정**:
- **Model**: `models/gemini-2.0-flash-001`
- **Temperature**: 0.1 (안정적이고 일관된 응답)
- **TopK**: 32
- **TopP**: 0.8
- **Safety Settings**: 모든 카테고리 BLOCK_NONE

#### 5. Supabase Vector Store (RAG 핵심)

**역할**: 벡터 데이터베이스에서 산재 관련 정보 검색

**설정**:
- **Mode**: retrieve-as-tool
- **Table Name**: `rag_hospital1`
- **TopK**: 8 (상위 8개 유사 문서 검색)
- **Tool Description**: "산업재해 보상 절차, 신청 방법, 휴업/요양 급여 종류, 산재 승인 기준 등 산재와 관련된 모든 질문에 대해 답변할 때 반드시 이 도구를 사용하여 정보를 검색하세요"

**동작 방식**:
1. 사용자 질문을 임베딩으로 변환
2. 벡터 데이터베이스에서 유사한 문서 검색
3. 검색된 문서를 Context로 AI Agent에 제공
4. AI Agent가 Context를 기반으로 답변 생성

#### 6. Embeddings Google Gemini Search

**역할**: 텍스트를 벡터로 변환하는 임베딩 모델

**설정**:
- Google Gemini 임베딩 모델 사용
- Supabase Vector Store와 연결

#### 7. Simple Memory

**역할**: 세션별 대화 기록 유지

**설정**:
- **Session ID Type**: customKey
- **Session Key**: `sessionId`

**동작 방식**:
- Code 노드에서 생성한 `sessionId`를 사용
- 같은 `sessionId`로 요청하면 이전 대화 맥락을 기억
- 대화 흐름을 자연스럽게 유지

#### 8. Respond to Webhook 노드

**역할**: AI Agent의 응답을 웹훅 요청자에게 반환

**설정**:
- **Respond With**: json
- **Response Body**: `={{ { result: $json } }}`
- **Response Headers**: CORS 헤더 포함
  - `Access-Control-Allow-Origin: *`
  - `Access-Control-Allow-Methods: POST, OPTIONS`
  - `Access-Control-Allow-Headers: Content-Type`

**동작 방식**:
1. AI Agent 노드에서 생성된 응답을 받음
2. JSON 형식으로 변환하여 `{ result: ... }` 구조로 래핑
3. CORS 헤더와 함께 HTTP 응답으로 반환

**응답 형식**:
```json
{
  "result": {
    "output": "많이 놀라셨겠습니다. 요양급여는 산재로 인정받은 후 병원에서 치료를 받을 때 발생하는 비용을 지원받는 제도입니다..."
  }
}
```

**CORS 설정 이유**:
- 웹 브라우저에서 직접 호출할 수 있도록 CORS 헤더 추가
- 프론트엔드 애플리케이션에서 API 호출 시 필요

## RAG 데이터베이스 생성 워크플로우

RAG 챗봇이 사용하는 벡터 데이터베이스(`rag_hospital1`)를 생성하는 별도의 워크플로우가 있습니다. 이 워크플로우는 PDF 문서를 업로드하면 자동으로 텍스트를 추출하고, 임베딩을 생성하여 Supabase 벡터 데이터베이스에 저장합니다.

### 워크플로우 구조

```
On form submission → Supabase Vector Store1
                            ↓
                    [Default Data Loader]
                            ↓
                    [Recursive Character Text Splitter]
                            ↓
                    [Embeddings Google Gemini]
```

### 노드별 상세 설명

#### 1. On form submission (Form Trigger)

**역할**: PDF 문서 업로드를 위한 웹 폼 제공

**설정**:
- **Form Title**: "Rag documents"
- **Field Type**: file
- **Accept File Types**: pdf
- **Multiple Files**: false
- **Required Field**: true

**사용 방법**:
1. n8n에서 제공하는 폼 URL에 접속
2. PDF 파일을 업로드
3. 폼 제출 시 워크플로우 자동 실행

#### 2. Supabase Vector Store1

**역할**: 벡터 데이터를 Supabase에 저장

**설정**:
- **Mode**: insert (데이터 삽입 모드)
- **Table Name**: `rag_hospital1`
- **Embeddings**: Embeddings Google Gemini 노드와 연결

**동작 방식**:
1. 텍스트 청크를 받음
2. 각 청크를 임베딩으로 변환
3. 벡터와 메타데이터를 함께 Supabase에 저장

#### 3. Default Data Loader

**역할**: PDF 파일에서 텍스트 추출

**설정**:
- **Data Type**: binary
- **Loader**: pdfLoader
- **Text Splitting Mode**: custom
- **Split Pages**: false

**동작 방식**:
1. Form Trigger에서 업로드된 PDF 파일을 받음
2. PDF에서 텍스트 추출
3. 텍스트를 Recursive Character Text Splitter로 전달

#### 4. Recursive Character Text Splitter

**역할**: 긴 텍스트를 작은 청크로 분할

**설정**:
- **Chunk Overlap**: 200 (청크 간 겹치는 문자 수)
- **Split Code**: markdown

**동작 방식**:
1. 추출된 텍스트를 의미 있는 단위로 분할
2. 각 청크는 약 200자씩 겹치도록 설정 (문맥 유지)
3. 분할된 청크를 Supabase Vector Store로 전달

**청크 분할의 이유**:
- 벡터 검색의 정확도 향상
- 긴 문서를 작은 단위로 나누어 관련 부분만 검색 가능
- 청크 간 겹침으로 문맥 손실 최소화

#### 5. Embeddings Google Gemini

**역할**: 텍스트 청크를 벡터로 변환

**설정**:
- Google Gemini 임베딩 모델 사용
- Supabase Vector Store와 연결

**동작 방식**:
1. Recursive Character Text Splitter에서 받은 텍스트 청크를 벡터로 변환
2. 변환된 벡터를 Supabase Vector Store에 저장

### 워크플로우 실행 흐름

1. **PDF 업로드**: 사용자가 폼을 통해 PDF 파일 업로드
2. **텍스트 추출**: Default Data Loader가 PDF에서 텍스트 추출
3. **텍스트 분할**: Recursive Character Text Splitter가 텍스트를 청크로 분할
4. **임베딩 생성**: Embeddings Google Gemini가 각 청크를 벡터로 변환
5. **벡터 저장**: Supabase Vector Store1이 벡터와 메타데이터를 데이터베이스에 저장

### 데이터베이스 구조

**테이블**: `rag_hospital1`

**주요 컬럼**:
- `id`: 고유 식별자
- `content`: 텍스트 청크 내용
- `embedding`: 벡터 임베딩 (벡터 타입)
- `metadata`: 문서 메타데이터 (선택사항)

### 사용 시나리오

1. **초기 데이터 구축**:
   - 산재 관련 PDF 문서들을 업로드
   - 각 문서가 자동으로 청크로 분할되고 벡터화되어 저장

2. **데이터 업데이트**:
   - 새로운 문서가 추가되면 폼을 통해 업로드
   - 기존 데이터와 함께 검색 가능

3. **데이터 관리**:
   - Supabase 대시보드에서 직접 데이터 확인 및 관리 가능
   - 필요시 수동으로 데이터 삭제 또는 수정

### 주의사항

- **PDF 품질**: 스캔된 이미지 PDF는 OCR이 필요할 수 있음
- **청크 크기**: Chunk Overlap 설정에 따라 검색 정확도가 달라질 수 있음
- **임베딩 비용**: Google Gemini API 사용량에 따라 비용 발생
- **저장 공간**: 벡터 데이터는 상대적으로 많은 저장 공간 필요

### 개선 가능한 부분

- **다양한 파일 형식 지원**: Word, Excel 등 다른 형식 지원
- **메타데이터 자동 추출**: 파일명, 업로드 날짜 등 메타데이터 자동 추가
- **중복 체크**: 동일한 문서의 중복 업로드 방지
- **배치 처리**: 여러 파일을 한 번에 업로드 가능하도록 개선

## 워크플로우 실행 흐름

1. **요청 수신**: Webhook 노드가 POST 요청 수신
   ```json
   {
     "message": "요양급여가 뭔가요?",
     "sessionId": "user001"
   }
   ```

2. **데이터 처리**: Code 노드가 데이터를 처리하여 `chatInput`과 `sessionId` 생성

3. **AI Agent 실행**: 
   - System Message에 따라 RAG 도구 사용 강제
   - 사용자 질문을 임베딩으로 변환
   - Supabase Vector Store에서 유사 문서 검색 (TopK: 8)
   - 검색된 Context를 기반으로 Gemini가 답변 생성

4. **응답 생성**: AI Agent가 검색된 Context를 기반으로 답변 생성

5. **응답 반환**: Respond to Webhook 노드를 통해 JSON 형식으로 응답 전송
   - CORS 헤더 포함
   - `{ result: { output: "..." } }` 형식으로 래핑

## 웹훅 테스트 방법

### 정상 작동하는 PowerShell 명령어

```powershell
$body = '{"message":"요양급여가 뭔가요?","sessionId":"user001"}'
$bytes = [System.Text.Encoding]::UTF8.GetBytes($body)

Invoke-RestMethod `
  -Uri "https://gristly-sacrosciatic-ethelyn.ngrok-free.dev/webhook/test123" `
  -Method POST `
  -ContentType "application/json; charset=utf-8" `
  -Body $bytes
```

**핵심 포인트**:
- JSON 문자열을 직접 작성
- UTF-8 바이트로 변환하여 전송
- Content-Type에 charset 명시
- 파일 생성, Git Bash, curl 불필요

### 다른 메시지로 테스트

```powershell
$body = '{"message":"산업재해가 무엇입니까?","sessionId":"user001"}'
$bytes = [System.Text.Encoding]::UTF8.GetBytes($body)

Invoke-RestMethod `
  -Uri "https://gristly-sacrosciatic-ethelyn.ngrok-free.dev/webhook/test123" `
  -Method POST `
  -ContentType "application/json; charset=utf-8" `
  -Body $bytes
```

## 인코딩 문제 해결

### 문제 상황

- PowerShell에서 직접 실행: ✅ 정상 작동
- Cursor 터미널을 통한 실행: ❌ 한글 깨짐

### 원인

- Cursor 터미널의 인코딩 설정이 UTF-8이 아닐 수 있음
- n8n의 Webhook 노드가 UTF-8을 제대로 처리하지 못할 수 있음

### 해결 방법

1. **Code 노드에 복구 로직 추가** (권장)
   - 위의 "개선 제안" 코드 사용
   - Latin1로 잘못 해석된 UTF-8을 복구

2. **Cursor 터미널 인코딩 설정**
   ```powershell
   [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
   $OutputEncoding = [System.Text.Encoding]::UTF8
   chcp 65001
   ```

3. **PowerShell 프로필에 인코딩 설정 추가**
   - `$PROFILE` 파일에 인코딩 설정 추가

## 워크플로우 평가

### 장점

✅ **RAG 강제 사용**: System Message에서 RAG 도구 사용을 필수로 지정하여 정확한 정보 제공 보장

✅ **명확한 역할 정의**: 산재 전문 노무사 역할로 일관된 톤 유지

✅ **세션 메모리**: 대화 맥락 유지로 자연스러운 대화 흐름

✅ **벡터 검색**: Supabase Vector Store를 통한 정확한 정보 검색

✅ **안정적인 모델**: Gemini 2.0 Flash + Temperature 0.1로 일관된 응답

### 개선 가능한 부분

- Code 노드에 인코딩 복구 로직 추가 (Cursor 환경 대비)
- 에러 처리 강화
- 로깅 추가 (디버깅 용이)

## 참고 자료

- [n8n 공식 문서](https://docs.n8n.io/)
- [LangChain 문서](https://python.langchain.com/)
- [Supabase Vector Store 문서](https://supabase.com/docs/guides/ai/vector-columns)
- [Google Gemini API 문서](https://ai.google.dev/docs)

## 업데이트 이력

- 2025-11-26: 초기 문서 작성
  - 워크플로우 구조 분석 및 테스트 방법 정리
  - RAG 데이터베이스 생성 워크플로우 추가
  - Respond to Webhook 노드 추가 및 CORS 설정 반영

