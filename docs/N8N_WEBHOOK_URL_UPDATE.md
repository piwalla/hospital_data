# n8n 웹훅 URL 업데이트 가이드

## 개요

n8n RAG 챗봇은 ngrok을 통해 외부에서 접근 가능한 웹훅 URL을 사용합니다. ngrok은 재시작할 때마다 URL이 변경되므로, 컴퓨터를 새로 켤 때마다 URL을 확인하고 환경 변수를 업데이트해야 합니다.

## ngrok URL 업데이트 절차

### 1. ngrok 실행

터미널에서 ngrok을 실행합니다:

```bash
ngrok http 5678
```

**참고**: n8n은 기본적으로 `http://localhost:5678`에서 실행됩니다.

### 2. ngrok URL 확인

ngrok이 실행되면 다음과 같은 화면이 표시됩니다:

```
Forwarding  https://xxxx-xxxx-xxxx.ngrok-free.dev -> http://localhost:5678
```

여기서 `https://xxxx-xxxx-xxxx.ngrok-free.dev` 부분이 ngrok URL입니다.

**또는** ngrok 웹 인터페이스에서 확인:
- 브라우저에서 `http://localhost:4040` 접속
- "Forwarding" 섹션에서 HTTPS URL 확인

### 3. 웹훅 URL 구성

n8n 웹훅 URL은 다음과 같이 구성됩니다:

```
https://[ngrok-url]/webhook/test123
```

예시:
- ngrok URL: `https://gristly-sacrosciatic-ethelyn.ngrok-free.dev`
- 웹훅 URL: `https://gristly-sacrosciatic-ethelyn.ngrok-free.dev/webhook/test123`

### 4. 환경 변수 업데이트

프로젝트 루트의 `.env.local` 파일을 열고 다음 값을 업데이트합니다:

```env
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://[새로운-ngrok-url]/webhook/test123
```

**예시**:
```env
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://gristly-sacrosciatic-ethelyn.ngrok-free.dev/webhook/test123
```

### 5. 개발 서버 재시작

환경 변수를 변경한 후에는 개발 서버를 재시작해야 합니다:

1. 현재 실행 중인 개발 서버 중지 (Ctrl+C)
2. 개발 서버 재시작:
   ```bash
   pnpm dev
   ```

## 주의사항

### ⚠️ 중요

- **ngrok은 재시작할 때마다 URL이 변경됩니다**
- 컴퓨터를 새로 켤 때마다 ngrok URL을 확인하고 환경 변수를 업데이트해야 합니다
- ngrok이 실행되지 않으면 챗봇이 작동하지 않습니다
- 프로덕션 환경에서는 고정 도메인을 사용하는 것을 권장합니다

### 체크리스트

ngrok URL을 업데이트할 때 다음을 확인하세요:

- [ ] n8n이 `http://localhost:5678`에서 실행 중인가?
- [ ] ngrok이 실행 중인가?
- [ ] ngrok URL을 확인했는가?
- [ ] `.env.local` 파일의 `NEXT_PUBLIC_N8N_WEBHOOK_URL`을 업데이트했는가?
- [ ] 개발 서버를 재시작했는가?

## 문제 해결

### 챗봇이 응답하지 않는 경우

1. **ngrok이 실행 중인지 확인**
   ```bash
   # ngrok 프로세스 확인
   # Windows: 작업 관리자에서 확인
   # 또는 터미널에서 ngrok 실행 상태 확인
   ```

2. **n8n이 실행 중인지 확인**
   - 브라우저에서 `http://localhost:5678` 접속
   - n8n 대시보드가 표시되는지 확인

3. **웹훅 URL이 올바른지 확인**
   - `.env.local` 파일의 URL 확인
   - ngrok URL과 일치하는지 확인
   - `/webhook/test123` 경로가 포함되어 있는지 확인

4. **n8n 워크플로우가 활성화되어 있는지 확인**
   - n8n 대시보드에서 워크플로우 상태 확인
   - 워크플로우가 "Active" 상태인지 확인

5. **브라우저 콘솔에서 에러 확인**
   - 개발자 도구(F12) 열기
   - Console 탭에서 에러 메시지 확인
   - Network 탭에서 웹훅 요청 상태 확인

## 향후 개선 사항

- [ ] 고정 도메인 사용 (프로덕션 환경)
- [ ] 환경 변수 자동 감지 및 업데이트 스크립트
- [ ] ngrok URL 변경 알림 기능

## 참고 자료

- [n8n 공식 문서](https://docs.n8n.io/)
- [ngrok 공식 문서](https://ngrok.com/docs)
- [n8n RAG 챗봇 워크플로우 분석](./N8N_RAG_CHATBOT_WORKFLOW.md)








