# 서류 AI 요약 가이드 기능 구현 계획

**작성일**: 2025-01-14  
**예상 소요 시간**: 2-3일  
**우선순위**: 🔴 Priority 1 (핵심 기능 완성)  
**AI 모델**: Google Gemini 2.5 Flash (`gemini-2.5-flash`)

---

## 📋 개요

산재 환자들이 복잡한 서류 작성 과정에서 겪는 어려움을 해결하기 위해, AI 기반 서류 요약 가이드를 제공합니다. 사용자는 서류를 선택하면 AI가 서류의 목적, 주요 항목, 작성 방법을 쉽고 간단하게 설명해줍니다.

### 핵심 목표
- 복잡한 법률/행정 용어를 일반인이 이해하기 쉬운 언어로 변환
- 서류별 맞춤형 작성 가이드 제공
- 면책 조항 명시로 법적 책임 방지
- 빠른 응답을 위한 캐싱 전략

---

## 🎯 Phase별 구현 계획

### Phase 1: Gemini API 연동 설정 (2-3시간)

#### 1.1 패키지 설치
```bash
pnpm add @google/generative-ai
```

#### 1.2 환경변수 설정
`.env.local` 파일에 이미 설정되어 있다고 가정:
```env
GOOGLE_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

#### 1.3 Gemini 클라이언트 생성
**파일**: `lib/api/gemini.ts`

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GOOGLE_API_KEY;
const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

if (!apiKey) {
  throw new Error('GOOGLE_API_KEY is not set');
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: modelName });

export { model, genAI };
```

#### 1.4 에러 처리 및 재시도 로직
- Rate limiting 처리 (429 에러)
- 네트워크 에러 재시도 (최대 3회)
- 타임아웃 설정 (30초)
- 에러 로깅

**파일**: `lib/api/gemini.ts` (확장)

```typescript
interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  timeout?: number;
}

async function generateContentWithRetry(
  prompt: string,
  options: RetryOptions = {}
): Promise<string> {
  const { maxRetries = 3, retryDelay = 1000, timeout = 30000 } = options;
  
  // 재시도 로직 구현
}
```

---

### Phase 2: 서류 목록 관리 (3-4시간)

#### 2.1 주요 산재 서류 데이터 정의

**주요 서류 목록**:
1. **산재신청서** (산업재해 인정 신청)
2. **요양급여 신청서** (치료비 지원)
3. **휴업급여 신청서** (치료 기간 중 임금 보상)
4. **장해등급 신청서** (장애 등급 판정)
5. **요양급여 지급 신청서** (추가 치료비)
6. **상병보상금 신청서** (장해 보상)
7. **유족급여 신청서** (사망 시 가족 보상)
8. **장의비 신청서** (장례비 지원)

#### 2.2 서류 데이터 구조 설계

**파일**: `lib/types/document.ts`

```typescript
export interface Document {
  id: string;
  name: string; // 서류명 (예: "요양급여 신청서")
  category: DocumentCategory;
  description: string; // 간단한 설명
  officialUrl?: string; // 공식 서류 다운로드 링크
  exampleUrl?: string; // 작성 예시 링크
  requiredDocuments?: string[]; // 필요 서류 목록
  processingTime?: string; // 처리 기간
  createdAt: string;
  updatedAt: string;
}

export type DocumentCategory = 
  | 'application' // 신청서류
  | 'benefit' // 급여 신청
  | 'compensation' // 보상 신청
  | 'other'; // 기타

export interface DocumentSummary {
  documentId: string;
  purpose: string; // 서류의 목적과 용도
  mainSections: DocumentSection[]; // 주요 항목별 작성 가이드
  importantNotes: string[]; // 주의사항
  commonMistakes: string[]; // 자주 하는 실수
  generatedAt: string;
  cached: boolean; // 캐시된 결과인지 여부
}

export interface DocumentSection {
  title: string; // 항목명
  description: string; // 작성 방법 설명
  example?: string; // 작성 예시
  required: boolean; // 필수 여부
}
```

#### 2.3 서류 데이터 저장소

**옵션 1: 정적 데이터 (JSON 파일)**
- **파일**: `lib/data/documents.ts`
- 장점: 빠른 로딩, 간단한 관리
- 단점: 동적 업데이트 불가

**옵션 2: Supabase 테이블**
- **테이블**: `documents`
- 장점: 동적 관리, 관리자 페이지에서 수정 가능
- 단점: 초기 설정 필요

**권장**: MVP 단계에서는 정적 데이터 사용, 이후 Supabase로 마이그레이션

**파일**: `lib/data/documents.ts`

```typescript
import type { Document } from '@/lib/types/document';

export const DOCUMENTS: Document[] = [
  {
    id: 'medical-benefit-application',
    name: '요양급여 신청서',
    category: 'benefit',
    description: '산재로 인한 치료비를 지원받기 위한 신청서입니다.',
    officialUrl: 'https://www.comwel.or.kr/...',
    exampleUrl: 'https://www.comwel.or.kr/...',
    requiredDocuments: ['의료비 영수증', '진단서', '소득증명서'],
    processingTime: '7-14일',
    createdAt: '2025-01-14',
    updatedAt: '2025-01-14',
  },
  // ... 나머지 서류
];
```

---

### Phase 3: AI 요약 가이드 생성 (4-5시간)

#### 3.1 프롬프트 엔지니어링

**핵심 원칙**:
- 일반인이 이해하기 쉬운 언어 사용
- 법률/행정 용어 최소화
- 구체적인 예시 포함
- 단계별 설명

**파일**: `lib/prompts/document-summary.ts`

```typescript
export function createDocumentSummaryPrompt(document: Document): string {
  return `
당신은 산재 환자들을 돕는 친절한 상담사입니다. 다음 서류에 대해 쉽고 간단하게 설명해주세요.

서류명: ${document.name}
설명: ${document.description}

다음 형식으로 답변해주세요:

1. **이 서류는 무엇인가요?**
   - 서류의 목적과 용도를 2-3문장으로 간단히 설명

2. **주요 항목별 작성 방법**
   - 각 항목을 제목, 설명, 작성 예시(있는 경우)로 구분하여 설명
   - 필수 항목은 별도로 표시

3. **주의사항**
   - 자주 하는 실수나 놓치기 쉬운 부분
   - 제출 시 확인사항

4. **처리 기간 및 다음 단계**
   - 처리 기간: ${document.processingTime || '확인 필요'}
   - 제출 후 다음 단계 안내

**중요**: 
- 법률적/의학적 자문이 아닌 참고용 정보임을 명시
- 복잡한 용어는 쉬운 말로 풀어서 설명
- 구체적인 예시를 들어 설명
- 한국어로 답변
`;
}
```

#### 3.2 AI 요약 생성 함수

**파일**: `lib/api/document-summary.ts`

```typescript
import { model } from './gemini';
import type { Document, DocumentSummary } from '@/lib/types/document';
import { createDocumentSummaryPrompt } from '@/lib/prompts/document-summary';

export async function generateDocumentSummary(
  document: Document
): Promise<DocumentSummary> {
  const prompt = createDocumentSummaryPrompt(document);
  
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // 텍스트를 구조화된 데이터로 파싱
    return parseSummaryResponse(text, document.id);
  } catch (error) {
    console.error('[Document Summary] AI 생성 실패:', error);
    throw error;
  }
}

function parseSummaryResponse(text: string, documentId: string): DocumentSummary {
  // 마크다운 형식의 응답을 파싱하여 구조화
  // 정규표현식 또는 마크다운 파서 사용
}
```

#### 3.3 캐싱 전략

**옵션 1: Supabase 테이블 캐싱**
- **테이블**: `document_summaries`
- 서류 ID별로 캐시 저장
- TTL: 7일 (서류 내용이 자주 바뀌지 않으므로)

**옵션 2: 메모리 캐싱 (개발 단계)**
- Map 기반 인메모리 캐시
- 서버 재시작 시 초기화

**권장**: Supabase 테이블 사용

**파일**: `lib/api/document-summary.ts` (확장)

```typescript
import { createClerkSupabaseClient } from '@/lib/supabase/server';

export async function getCachedDocumentSummary(
  documentId: string
): Promise<DocumentSummary | null> {
  const supabase = await createClerkSupabaseClient();
  
  const { data, error } = await supabase
    .from('document_summaries')
    .select('*')
    .eq('document_id', documentId)
    .gte('generated_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    .single();
  
  if (error || !data) {
    return null;
  }
  
  return data as DocumentSummary;
}

export async function cacheDocumentSummary(
  summary: DocumentSummary
): Promise<void> {
  const supabase = await createClerkSupabaseClient();
  
  await supabase
    .from('document_summaries')
    .upsert({
      document_id: summary.documentId,
      ...summary,
      generated_at: new Date().toISOString(),
    });
}
```

#### 3.4 면책 조항 자동 포함

**파일**: `lib/utils/disclaimer.ts`

```typescript
export const DISCLAIMER_TEXT = `
※ 이 내용은 법률적/의학적 자문이 아니며, 참고용 정보입니다. 
정확한 내용은 근로복지공단 또는 전문가와 상의하세요.
`;

export function addDisclaimer(content: string): string {
  return `${content}\n\n---\n\n${DISCLAIMER_TEXT}`;
}
```

---

### Phase 4: 서류 가이드 UI 구현 (5-6시간)

#### 4.1 서류 목록 페이지

**파일**: `app/documents/page.tsx` (수정)

```typescript
import DocumentsList from '@/components/documents/DocumentsList';

export default function DocumentsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-[28px] font-bold mb-2">서류 안내</h1>
      <p className="text-[17px] text-[#8A8A8E] mb-8">
        산재 관련 서류 작성 가이드를 확인하세요.
      </p>
      
      <DocumentsList />
      
      {/* 면책 조항 */}
      <div className="mt-12 p-4 bg-[#FF9500]/10 border border-[#FF9500]/30 rounded-lg">
        <p className="text-[14px] text-[#8A8A8E]">
          {DISCLAIMER_TEXT}
        </p>
      </div>
    </div>
  );
}
```

#### 4.2 서류 목록 컴포넌트

**파일**: `components/documents/DocumentsList.tsx`

```typescript
"use client";

import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { Document } from '@/lib/types/document';
import { DOCUMENTS } from '@/lib/data/documents';
import DocumentSummary from './DocumentSummary';

export default function DocumentsList() {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  return (
    <Accordion type="single" collapsible className="w-full">
      {DOCUMENTS.map((document) => (
        <AccordionItem key={document.id} value={document.id}>
          <AccordionTrigger onClick={() => setSelectedDocument(document.id)}>
            <div className="flex flex-col items-start text-left">
              <span className="font-semibold text-[17px]">{document.name}</span>
              <span className="text-[14px] text-[#8A8A8E] mt-1">
                {document.description}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {selectedDocument === document.id && (
              <DocumentSummary document={document} />
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
```

#### 4.3 서류 요약 컴포넌트

**파일**: `components/documents/DocumentSummary.tsx`

```typescript
"use client";

import { useState, useEffect } from 'react';
import type { Document, DocumentSummary } from '@/lib/types/document';
import { Loader2 } from 'lucide-react';

interface DocumentSummaryProps {
  document: Document;
}

export default function DocumentSummary({ document }: DocumentSummaryProps) {
  const [summary, setSummary] = useState<DocumentSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSummary() {
      try {
        setLoading(true);
        const response = await fetch(`/api/documents/${document.id}/summary`);
        
        if (!response.ok) {
          throw new Error('요약 생성 실패');
        }
        
        const data = await response.json();
        setSummary(data.summary);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류');
      } finally {
        setLoading(false);
      }
    }

    fetchSummary();
  }, [document.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-[#2E7D32]" />
        <span className="ml-2 text-[#8A8A8E]">AI가 서류를 분석 중입니다...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">오류: {error}</p>
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <div className="space-y-6 py-4">
      {/* 서류 목적 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-[22px] font-semibold mb-3">이 서류는 무엇인가요?</h3>
        <p className="text-[17px] text-[#1C1C1E]">{summary.purpose}</p>
      </div>

      {/* 주요 항목별 작성 방법 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-[22px] font-semibold mb-4">주요 항목별 작성 방법</h3>
        <div className="space-y-4">
          {summary.mainSections.map((section, index) => (
            <div key={index} className="border-l-4 border-[#2E7D32] pl-4">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-[17px] font-semibold">{section.title}</h4>
                {section.required && (
                  <span className="text-[12px] bg-red-100 text-red-600 px-2 py-1 rounded">
                    필수
                  </span>
                )}
              </div>
              <p className="text-[17px] text-[#1C1C1E] mb-2">{section.description}</p>
              {section.example && (
                <div className="mt-2 p-3 bg-[#F2F2F7] rounded">
                  <p className="text-[14px] text-[#8A8A8E] mb-1">예시:</p>
                  <p className="text-[14px] text-[#1C1C1E]">{section.example}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 주의사항 */}
      {summary.importantNotes.length > 0 && (
        <div className="bg-[#FF9500]/10 border border-[#FF9500]/30 rounded-lg p-6">
          <h3 className="text-[22px] font-semibold mb-3 text-[#FF9500]">주의사항</h3>
          <ul className="space-y-2">
            {summary.importantNotes.map((note, index) => (
              <li key={index} className="text-[17px] text-[#1C1C1E] flex items-start">
                <span className="mr-2">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 다운로드 링크 */}
      <div className="flex gap-4">
        {document.officialUrl && (
          <a
            href={document.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#2E7D32] text-white rounded-lg hover:bg-[#2E7D32]/90 transition-colors"
          >
            공식 서류 다운로드
          </a>
        )}
        {document.exampleUrl && (
          <a
            href={document.exampleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-white border border-gray-300 text-[#1C1C1E] rounded-lg hover:bg-[#F2F2F7] transition-colors"
          >
            작성 예시 보기
          </a>
        )}
      </div>
    </div>
  );
}
```

#### 4.4 API Route 생성

**파일**: `app/api/documents/[id]/summary/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { generateDocumentSummary, getCachedDocumentSummary, cacheDocumentSummary } from '@/lib/api/document-summary';
import { DOCUMENTS } from '@/lib/data/documents';
import { addDisclaimer } from '@/lib/utils/disclaimer';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const document = DOCUMENTS.find(doc => doc.id === id);

    if (!document) {
      return NextResponse.json(
        { error: '서류를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 캐시 확인
    const cached = await getCachedDocumentSummary(id);
    if (cached) {
      console.log(`[Document Summary] 캐시된 결과 반환: ${id}`);
      return NextResponse.json({ summary: cached, cached: true });
    }

    // AI 요약 생성
    console.log(`[Document Summary] AI 요약 생성 시작: ${id}`);
    const summary = await generateDocumentSummary(document);
    
    // 면책 조항 추가
    summary.purpose = addDisclaimer(summary.purpose);

    // 캐시 저장
    await cacheDocumentSummary(summary);

    return NextResponse.json({ summary, cached: false });
  } catch (error) {
    console.error('[Document Summary] API 오류:', error);
    return NextResponse.json(
      { error: '서류 요약 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
```

---

## 📊 데이터베이스 스키마

### Supabase 마이그레이션 파일

**파일**: `supabase/migrations/YYYYMMDDHHmmss_create_document_summaries.sql`

```sql
-- 서류 요약 캐시 테이블
CREATE TABLE IF NOT EXISTS public.document_summaries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    document_id TEXT NOT NULL UNIQUE,
    purpose TEXT NOT NULL,
    main_sections JSONB NOT NULL, -- DocumentSection[]
    important_notes TEXT[] NOT NULL,
    common_mistakes TEXT[],
    generated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_document_summaries_document_id ON public.document_summaries(document_id);
CREATE INDEX IF NOT EXISTS idx_document_summaries_generated_at ON public.document_summaries(generated_at);

-- RLS 비활성화 (개발 환경)
ALTER TABLE public.document_summaries DISABLE ROW LEVEL SECURITY;

-- 권한 부여
GRANT ALL ON TABLE public.document_summaries TO anon;
GRANT ALL ON TABLE public.document_summaries TO authenticated;
GRANT ALL ON TABLE public.document_summaries TO service_role;
```

---

## 🎨 UI/UX 디자인 가이드

### 디자인 원칙
- **명확성**: 각 섹션이 명확히 구분되도록 카드 UI 사용
- **가독성**: 충분한 여백과 적절한 폰트 크기
- **접근성**: 키보드 네비게이션 및 스크린 리더 지원
- **반응형**: 모바일/태블릿/데스크톱 모두 최적화

### 색상 사용
- **Primary**: `#2E7D32` (다운로드 버튼)
- **Alert**: `#FF9500` (주의사항 박스)
- **Neutral**: `#F2F2F7` (배경), `#1C1C1E` (텍스트), `#8A8A8E` (보조 텍스트)

### 컴포넌트
- **shadcn/ui Accordion**: 서류 목록 표시
- **로딩 스피너**: AI 생성 중 표시
- **에러 메시지**: 오류 발생 시 사용자 친화적 메시지

---

## ✅ 체크리스트

### Phase 1: API 연동
- [ ] `@google/generative-ai` 패키지 설치
- [ ] 환경변수 확인 (`GOOGLE_API_KEY`, `GEMINI_MODEL`)
- [ ] Gemini 클라이언트 생성 (`lib/api/gemini.ts`)
- [ ] 에러 처리 및 재시도 로직 구현
- [ ] Rate limiting 처리

### Phase 2: 서류 데이터
- [ ] 서류 타입 정의 (`lib/types/document.ts`)
- [ ] 서류 데이터 생성 (`lib/data/documents.ts`)
- [ ] 8개 주요 서류 데이터 입력
- [ ] 공식 다운로드 링크 수집

### Phase 3: AI 요약
- [ ] 프롬프트 템플릿 작성 (`lib/prompts/document-summary.ts`)
- [ ] AI 요약 생성 함수 구현 (`lib/api/document-summary.ts`)
- [ ] 응답 파싱 로직 구현
- [ ] 캐싱 함수 구현
- [ ] Supabase 마이그레이션 파일 생성
- [ ] 면책 조항 유틸리티 추가

### Phase 4: UI 구현
- [ ] 서류 목록 페이지 수정 (`app/documents/page.tsx`)
- [ ] DocumentsList 컴포넌트 생성
- [ ] DocumentSummary 컴포넌트 생성
- [ ] API Route 생성 (`app/api/documents/[id]/summary/route.ts`)
- [ ] 로딩 상태 처리
- [ ] 에러 상태 처리
- [ ] 반응형 디자인 검증
- [ ] 접근성 검증

### 테스트
- [ ] 각 서류별 AI 요약 생성 테스트
- [ ] 캐싱 동작 확인
- [ ] 에러 처리 확인
- [ ] UI 반응형 테스트
- [ ] 로딩 시간 측정 (목표: 3초 이내)

---

## 📝 참고 자료

- [Google Gemini API 문서](https://ai.google.dev/docs)
- [@google/generative-ai 패키지](https://www.npmjs.com/package/@google/generative-ai)
- [근로복지공단 서류 안내](https://www.comwel.or.kr/)
- PRD 문서: `docs/PRD.md`
- 디자인 가이드: `docs/design.md`

---

## 🚀 다음 단계

1. **Phase 1 시작**: Gemini API 연동 설정
2. **Phase 2 진행**: 서류 데이터 수집 및 정리
3. **Phase 3 구현**: AI 요약 생성 로직
4. **Phase 4 완성**: UI 구현 및 통합 테스트

각 Phase는 독립적으로 진행 가능하지만, 순차적으로 진행하는 것을 권장합니다.













