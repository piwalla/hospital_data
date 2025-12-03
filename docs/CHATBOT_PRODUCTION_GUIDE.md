# 챗봇 프로덕션 준비 가이드

## 개요

n8n RAG 챗봇을 프로덕션 환경에 배포하기 위한 가이드입니다. 현재는 ngrok을 사용하고 있으나, 프로덕션에서는 고정 도메인을 사용하는 것이 권장됩니다.

## 1. ngrok 대신 고정 도메인 설정

### 현재 상황
- **개발 환경**: ngrok을 사용하여 n8n 웹훅을 외부에 노출
- **문제점**: ngrok은 재시작할 때마다 URL이 변경됨
- **해결책**: 프로덕션에서는 고정 도메인 사용 필요

### 옵션 1: n8n 클라우드 사용 (권장)

**장점**:
- 고정 웹훅 URL 제공
- SSL 인증서 자동 관리
- 안정적인 서비스 제공
- 무료 플랜 제공 (제한적)

**단점**:
- 유료 플랜 필요 (프로덕션 사용 시)
- 월 구독료 발생

**설정 방법**:
1. [n8n 클라우드](https://n8n.io/cloud) 가입
2. 워크플로우를 n8n 클라우드로 마이그레이션
3. 웹훅 URL을 고정 URL로 변경
4. 환경 변수 업데이트

**예상 비용**: 
- 무료 플랜: 제한적 (개인 프로젝트용)
- 프로 플랜: $20/월 (팀용)

### 옵션 2: 리버스 프록시 설정 (자체 서버)

**장점**:
- 완전한 제어 가능
- 비용 절감 (서버 비용만)
- 커스터마이징 가능

**단점**:
- 서버 관리 필요
- SSL 인증서 관리 필요
- 초기 설정 복잡

**설정 방법**:
1. VPS 또는 클라우드 서버 준비 (AWS, DigitalOcean, Vultr 등)
2. n8n 설치 및 실행
3. Nginx 또는 Caddy를 사용한 리버스 프록시 설정
4. Let's Encrypt를 사용한 SSL 인증서 발급
5. 도메인 연결

**예상 비용**: 
- VPS: $5-10/월
- 도메인: $10-15/년

**Nginx 설정 예시**:
```nginx
server {
    listen 80;
    server_name chatbot.yourdomain.com;

    location / {
        proxy_pass http://localhost:5678;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 옵션 3: Railway, Render 등 PaaS 사용

**장점**:
- 간편한 배포
- 자동 SSL 인증서
- 고정 URL 제공

**단점**:
- 월 구독료 발생
- 제한적 커스터마이징

**예상 비용**: $5-20/월

## 2. 환경 변수 프로덕션 설정

### Vercel 환경 변수 설정

1. **Vercel 대시보드 접속**
   - https://vercel.com/dashboard 접속
   - 프로젝트 선택

2. **환경 변수 추가**
   - Settings → Environment Variables
   - 다음 변수 추가:
     ```
     NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-fixed-domain.com/webhook/test123
     ```
   - Environment: Production, Preview, Development 모두 선택

3. **환경 변수 확인**
   - `.env.example` 파일에 주석으로 명시
   - 프로덕션 환경 변수는 Vercel 대시보드에서만 관리

### 로컬 개발 환경

`.env.local` 파일 (Git에 커밋하지 않음):
```env
# n8n 웹훅 URL (ngrok 또는 로컬)
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-ngrok-url.ngrok-free.dev/webhook/test123
```

### 환경별 설정 가이드

**개발 환경**:
- ngrok 사용 가능
- `.env.local` 파일 사용

**프로덕션 환경**:
- 고정 도메인 사용 필수
- Vercel 환경 변수로 설정
- `.env.production` 파일은 사용하지 않음 (Vercel에서 관리)

## 3. 에러 로깅 및 모니터링

### 옵션 1: Vercel Analytics (기본 제공)

**설정 방법**:
1. Vercel 대시보드 → Analytics 탭
2. Web Analytics 활성화
3. 에러 추적 자동 활성화

**제공 기능**:
- 페이지 뷰 통계
- 에러 발생 추적
- 성능 모니터링

### 옵션 2: Sentry (추천)

**장점**:
- 상세한 에러 추적
- 소스맵 지원
- 사용자 컨텍스트 추적
- 무료 플랜 제공

**설정 방법**:
1. [Sentry](https://sentry.io) 가입
2. Next.js 프로젝트 생성
3. `@sentry/nextjs` 패키지 설치
4. `sentry.client.config.ts`, `sentry.server.config.ts` 설정
5. 챗봇 컴포넌트에 에러 바운더리 추가

**예상 비용**: 무료 플랜 (개인 프로젝트용)

### 옵션 3: 챗봇 사용 통계 수집 (선택사항)

**구현 방법**:
1. Supabase `user_activity_logs` 테이블 활용
2. 챗봇 질문/응답 로깅
3. 대시보드에서 통계 확인

**로깅 항목**:
- 질문 내용 (개인정보 제외)
- 응답 시간
- 에러 발생 여부
- 세션 ID

## 4. 체크리스트

### 배포 전 확인사항

- [ ] n8n 워크플로우가 프로덕션 환경에서 활성화되어 있는가?
- [ ] 고정 도메인 URL이 설정되어 있는가?
- [ ] Vercel 환경 변수가 올바르게 설정되어 있는가?
- [ ] SSL 인증서가 유효한가?
- [ ] 에러 로깅이 설정되어 있는가?
- [ ] 챗봇이 정상적으로 작동하는지 테스트했는가?

### 배포 후 확인사항

- [ ] 프로덕션 URL에서 챗봇 접근 가능한가?
- [ ] 웹훅 요청이 정상적으로 전송되는가?
- [ ] 응답이 정상적으로 수신되는가?
- [ ] 에러 로그가 정상적으로 수집되는가?
- [ ] 성능이 적절한가? (응답 시간 30초 이내)

## 5. 문제 해결

### 웹훅 URL 변경 시

1. 새로운 URL 확인
2. Vercel 환경 변수 업데이트
3. 재배포 (자동 또는 수동)
4. 챗봇 테스트

### n8n 워크플로우 오류 시

1. n8n 대시보드에서 워크플로우 실행 로그 확인
2. 에러 메시지 확인
3. 워크플로우 수정
4. 재테스트

### CORS 오류 발생 시

n8n의 "Respond to Webhook" 노드에서 CORS 헤더가 올바르게 설정되어 있는지 확인:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

## 참고 자료

- [n8n 클라우드 문서](https://docs.n8n.io/hosting/installation/n8n-cloud/)
- [Vercel 환경 변수 설정](https://vercel.com/docs/concepts/projects/environment-variables)
- [Sentry Next.js 설정](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [n8n RAG 챗봇 워크플로우 분석](./N8N_RAG_CHATBOT_WORKFLOW.md)





