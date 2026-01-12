/**
 * @file route.ts
 * @description 서류 챗봇 API Route (RAG 연동)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { logApiError } from '@/lib/utils/error-logging';
import { logChatbotActivity } from '@/lib/utils/chatbot-analytics';
import { getRagMetadataFromDb } from '@/lib/utils/rag-registry-db';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let userId: string | undefined;
  
  try {
    // 1. 사용자 ID 가져오기
    const { userId: clerkUserId } = await auth();
    userId = clerkUserId;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 2. 환경 변수 확인
    if (!GOOGLE_API_KEY) {
      console.error('[DocumentChatAPI] GOOGLE_API_KEY가 설정되지 않았습니다.');
      throw new Error('서버 설정 오류: API Key missing');
    }

    // 3. 요청 본문 파싱
    const { question, documentContext, messages } = await request.json();

    if (!question || typeof question !== 'string' || question.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: '질문을 2자 이상 입력해주세요.' },
        { status: 400 }
      );
    }

    // 4. Gemini 모델 초기화
    const apiKey = process.env.GOOGLE_API_KEY2 || GOOGLE_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 2.5 Flash 모델 사용 (File Search 공식 지원)
    const resourceName = "fileSearchStores/hospitalguidestorev3clean-5khogee4qpu6";

    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        tools: [{ 
            // @ts-expect-error -- fileSearch is a valid tool option
            fileSearch: {
                fileSearchStoreNames: [resourceName]
            } 
        }]
    });

    // 5. 히스토리 구성
    let historyForGemini: any[] = [];
    if (messages && Array.isArray(messages)) {
      historyForGemini = messages.slice(0, -1).map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      })).filter((msg: any) => msg.parts[0].text);
    }

    // 6. 시스템 프롬프트 (서류 특화)
    const docContextText = documentContext ? `현재 사용자는 **'${documentContext}'** 서류의 상세 정보를 보고 있습니다. 
이 서류와 관련된 질문에 우선적으로 답변하되, 산재 전반에 대한 지식도 함께 활용하세요.` : "";

    const systemPromptEntry = {
        role: "user",
        parts: [{ text: `당신은 산업재해 서류 작성을 돕는 **'리워크케어 산재 도우미'**입니다. 
${docContextText}

다음 원칙을 반드시 준수하십시오:
1. **근거 기반 답변**: 반드시 제공된 문서에 포함된 내용만을 사실로 간주하고 답변하십시오.
2. **서류 작성 가이드**: 사용자가 보고 있는 서류의 작성법, 제출처, 주의사항 등을 구체적으로 안내하세요.
3. **쉬운 용어**: 환자와 가족이 이해하기 쉽게 전문 용어를 풀어서 설명하세요.
4. **인용구 활용**: 답변 내용의 출처가 되는 문서를 정확히 참조하세요.
5. **구조화된 답변**: 가독성을 위해 마크다운 형식을 적극 활용하세요.` }],
    };
    
    const systemResponseEntry = {
        role: "model",
        parts: [{ text: "네, 알겠습니다. 사용자가 보고 있는 서류 정보를 바탕으로 정확하고 친절하게 산재 서류 작성을 도와드리겠습니다. 제공된 가이드북 내용을 근거로 답변하며, 어려운 용어는 쉽게 풀어서 설명하겠습니다." }],
    };

    const chat = model.startChat({
        history: [
            systemPromptEntry,
            systemResponseEntry,
            ...historyForGemini
        ]
    });

    // 7. 답변 생성
    const result = await chat.sendMessage(question);
    const response = await result.response;
    const answer = response.text();
    
    // 8. Citations 추출 및 매핑
    const citations: any[] = [];
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;

    if (groundingMetadata?.groundingChunks) {
      const uniqueTitles = new Set<string>();
      
      const chunkPromises = groundingMetadata.groundingChunks.map(async (chunk: any) => {
        const context = chunk.retrievedContext;
        const uri = context?.uri;
        let rawTitle = context?.title;

        if (!rawTitle && uri) {
            rawTitle = uri.split('/').pop();
        }

        if (!rawTitle) return null;

        const metadata = await getRagMetadataFromDb(rawTitle);
        if (!metadata) return null;

        return {
             title: metadata.korean_title,
             uri: uri || metadata.download_url || "#"
        };
      });

      const results = await Promise.all(chunkPromises);
      results.forEach((item) => {
          if (item && !uniqueTitles.has(item.title)) {
             uniqueTitles.add(item.title);
             citations.push(item);
          }
      });
    }

    const responseTime = Date.now() - startTime;

    // 9. 로깅
    logChatbotActivity('chatbot_response', {
        userId,
        question: question.trim(),
        responseTime,
        sessionId: userId,
        metadata: { 
          version: 'v2-doc-rag',
          documentContext,
          citationCount: citations.length
        }
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      answer: answer,
      citations: citations,
    });
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    
    logApiError(error, {
      component: 'DocumentChatAPI-RAG',
      action: 'POST',
      method: 'POST',
      path: '/api/documents/chat',
      userId,
      metadata: { responseTime },
    });

    return NextResponse.json(
      {
        success: false,
        error: `AI 응답 생성 중 오류가 발생했습니다: ${error.message}`,
      },
      { status: 500 }
    );
  }
}



