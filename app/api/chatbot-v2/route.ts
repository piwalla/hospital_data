/**
 * @file route.ts
 * @description Google Gemini File Search Chatbot API Route (V2)
 * 
 * Google Gemini API의 Long Context 기능을 활용하여
 * 업로드된 산재 규정 PDF 파일을 기반으로 답변을 생성합니다.
 * 
 * 주요 기능:
 * - GoogleGenerativeAI SDK 활용
 * - 업로드된 파일 URI (files/m63xezv6kbii) 사용
 * - 사용자 질문에 대한 정확한 답변 생성
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { logApiError } from '@/lib/utils/error-logging';
import { logChatbotActivity } from '@/lib/utils/chatbot-analytics';
// Imports removed as logic migrated to DB
// import { getKoreanTitle, getDownloadUrl } from '@/lib/constants/rag-metadata';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;


export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let userId: string | undefined;
  let requestBody: { message?: string; sessionId?: string; messages?: any[] } = {};

  try {
    // 1. 사용자 인증
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
      console.error('[ChatbotAPI-V2] GOOGLE_API_KEY가 설정되지 않았습니다.');
      throw new Error('서버 설정 오류: API Key missing');
    }

    // 3. 요청 본문 파싱
    requestBody = await request.json();
    const { message, sessionId, messages } = requestBody;

    // Validate input: Either 'message' OR 'messages' array (where last item is current message)
    // Common pattern: Client sends full 'messages' array.
    let finalQuestion = "";
    let historyForGemini: any[] = [];

    if (messages && Array.isArray(messages) && messages.length > 0) {
        // Chat History Mode
        const lastMsg = messages[messages.length - 1];
        finalQuestion = lastMsg.content;
        
        // Convert previous messages to Gemini History
        // Exclude the last message (which is the current question sent via sendMessage)
        // Exclude 'system' messages if any, handled separately
        const previousMessages = messages.slice(0, -1);
        
        historyForGemini = previousMessages.map((msg: any) => ({
            role: msg.role === 'user' ? 'user' : 'model', // Map 'assistant' -> 'model'
            parts: [{ text: msg.content }]
        })).filter((msg: any) => msg.parts[0].text); // Filter empty

    } else if (message) {
        // Single Turn Mode
        finalQuestion = message.trim();
    } else {
        return NextResponse.json({ success: false, error: '질문이 없습니다.' }, { status: 400 });
    }

    if (!finalQuestion || finalQuestion.length < 2) {
       return NextResponse.json({ success: false, error: '질문을 2자 이상 입력해주세요.' }, { status: 400 });
    }

    const finalSessionId = sessionId || userId;

    // 4. Gemini 모델 초기화
    // Tier 1 키(GOOGLE_API_KEY2)가 있으면 우선 사용, 없으면 무료 키 사용
    const apiKey = process.env.GOOGLE_API_KEY2 || GOOGLE_API_KEY;
    if (!apiKey) throw new Error("API Key not found");

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 2.5 Flash 모델 사용 (File Search 공식 지원)
    // 문서: https://ai.google.dev/gemini-api/docs/file-search
    const resourceName = "fileSearchStores/hospitalguidestorev3clean-5khogee4qpu6";

    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        tools: [{ 
            // @ts-expect-error -- fileSearch is a valid tool option but types might be outdated
            fileSearch: {
                fileSearchStoreNames: [resourceName]
            } 
        }]
    });

    console.log('[ChatbotAPI-V2] Generating response using Gemini 2.5 Flash with File Search...');
    console.log(`[ChatbotAPI-V2] History Length: ${historyForGemini.length}`);

    // System Instruction (Defined as first history item for best context adherence in some patterns, 
    // or use systemInstruction property if using 1.5/2.5 latest SDK)
    // Using history injection for system prompt is standard for robust context.
    
    const systemPromptEntry = {
        role: "user",
        parts: [{ text: `당신은 산업재해를 입은 환자와 그 가족을 돕는 **'리워크케어 산재 도우미'**입니다. 
당신의 목표는 제공된 문서를 바탕으로 사용자의 궁금증을 해결하고, 불안한 마음을 위로하며 실질적인 정보를 제공하는 것입니다.

다음 **5가지 원칙**을 반드시 준수하여 답변을 생성하십시오:

1.  **근거 기반 답변 (No Hallucination):**
    *   반드시 **제공된 문서('2025 산재 보험 가이드', '장해진단서 작성원칙' 등)**에 포함된 내용만을 사실로 간주하고 답변하십시오.
    *   문서에 없는 내용은 추측하여 답하지 말고, "해당 내용은 현재 제공된 문서에서 확인할 수 없습니다."라고 솔직하게 말하십시오.
    *   최종적인 보상 여부나 등급 판정은 근로복지공단의 고유 권한임을 항상 염두에 두고, 단정적인 표현보다는 "기준에 따르면 ~할 가능성이 있습니다"와 같은 표현을 사용하십시오.
    *   **중요:** 사용자의 이전 질문과 당신의 답변 이력(Context)을 기억하여 대화를 매끄럽게 이어가십시오. (예: "앞서 말씀드린 것처럼...", "그 부분은 ~입니다.")

2.  **쉬운 용어 설명 (Plain Language):**
    *   사용자는 의학/법률 비전문가입니다. 문서의 전문 용어를 환자의 눈높이에 맞춰 **풀어서 설명**하십시오.
    *   (변환 예시):
        *   '운동가능영역(ROM)' → '관절이 움직이는 범위(각도)'
        *   '압박률' → '척추 뼈가 눌려서 납작해진 정도'
        *   '동요관절' → '관절이 덜그럭거리며 흔들리는 상태'
        *   '치유' → '치료를 해도 더 이상 증상이 나아지지 않는 상태(증상 고정)'

3.  **구체적인 예시 활용 (Use Examples):**
    *   설명이 복잡한 등급 기준이나 계산법은 구체적인 **'가상의 사례'**를 들어 설명하십시오.
    *   (예: "만약 엄지손가락의 뼈가 일부 절단되었다면 13급, 관절까지 잃었다면 10급에 해당할 수 있습니다.")

4.  **전문적이지만 따뜻한 어조 (Empathetic & Professional):**
    *   사용자의 어려움에 공감하는 따뜻한 말투(해요체)를 사용하되, 정보 전달은 명확하고 전문적으로 하십시오.
    *   사용자의 질문이 모호할 경우, 더 정확한 답변을 위해 필요한 추가 정보(예: 수술 여부, 정확한 진단명 등)를 되물어 주십시오.

5.  **구조화된 답변 (Markdown):**
    *   가독성을 위해 핵심 내용은 **볼드체**로 강조하고, 단계별 절차나 조건은 리스트(목록) 형식을 사용하여 정리해 주세요.` }],
    };
    
    const systemResponseEntry = {
        role: "model",
        parts: [{ text: "네, 알겠습니다. 리워크케어 산재 도우미로서, 제공된 문서를 바탕으로 환자와 가족분들의 궁금증을 해결하고 따뜻하게 위로하며 구체적이고 실질적인 정보를 드리겠습니다. 어려운 용어는 쉽게 풀어서 설명하고, 근거 없는 내용은 답변하지 않겠습니다. 이전 대화 맥락을 기억하여 답변하겠습니다." }],
    };

    const chat = model.startChat({
        history: [
            systemPromptEntry,
            systemResponseEntry,
            ...historyForGemini
        ]
    });

    const result = await chat.sendMessage(finalQuestion);
    const response = await result.response;
    const answer = response.text();
    
    // 인용구(Citation) 메타데이터 추출
    const candidates = response.candidates;
    const candidate = candidates?.[0];
    
    // 1. Google Search Grounding (citationMetadata)
    const citationMetadata = candidate?.citationMetadata;
    
    // 2. Vertex AI/Gemini File Search Grounding (groundingMetadata)
    // The SDK types might not have groundingMetadata yet
    const groundingMetadata = candidate?.groundingMetadata;

    // DEBUG: Log raw metadata
    console.log('[ChatbotAPI-V2] Citation Metadata:', JSON.stringify(citationMetadata, null, 2));
    console.log('[ChatbotAPI-V2] Grounding Metadata:', JSON.stringify(groundingMetadata, null, 2));
    
    // 3. Process & Map Citations
    let citations: any[] = [];
    
    if (groundingMetadata?.groundingChunks) {
      const uniqueTitles = new Set<string>();
      
      // Map chunks to promises to fetch metadata in parallel
      const chunkPromises = groundingMetadata.groundingChunks.map(async (chunk: any) => {
        // Try to get title from metadata, fallback to URI or index
        const context = chunk.retrievedContext;
        const uri = context?.uri;
        let rawTitle = context?.title;

        // Fallback 1: Check if URI filename matches a known key
        if (!rawTitle && uri) {
            const filename = uri.split('/').pop();
            rawTitle = filename;
        }

        if (!rawTitle) return null;

        // Fetch Metadata from Supabase DB

        const metadata = await import('@/lib/utils/rag-registry-db').then(mod => mod.getRagMetadataFromDb(rawTitle));
        
        if (!metadata) {
            // If not found in DB, try to display raw title (better than nothing)
            // But usually we want to filter out known bad/temp files.
            return null;
        }

        const koreanTitle = metadata.korean_title;
        const downloadUrl = metadata.download_url;
        
        // Return structured citation object
        return {
             koreanTitle,
             downloadUrl,
             rawTitle,
             uri: uri || downloadUrl || "#"
        };
      });

      // Wait for all DB lookups
      const results = await Promise.all(chunkPromises);

      // Filter nulls and duplicates
      results.forEach((item) => {
          if (item && !uniqueTitles.has(item.koreanTitle)) {
             uniqueTitles.add(item.koreanTitle);
             citations.push({
                 title: item.koreanTitle,
                 uri: item.uri,
                 originalTitle: item.rawTitle,
                 downloadUrl: item.downloadUrl || null
             });
          }
      });

    } else if (citationMetadata?.citationSources) {
       // Legacy/Standard citation fallback
       citations = citationMetadata.citationSources.map((source: any) => ({
           title: "관련 문서",
           uri: source.uri
       }));
    }

    console.log(`[ChatbotAPI-V2] Final Citations (Mapped): ${JSON.stringify(citations)}`);
    
    console.log('[ChatbotAPI-V2] Response generated successfully.');

    // 6. 로깅
    logChatbotActivity('chatbot_response', {
      userId,
      question: finalQuestion,
      responseTime: Date.now() - startTime,
      sessionId: finalSessionId,
      metadata: { 
        version: 'v2-gemini-2.5-file-search',
        citationCount: citations.length
      }
    }).catch(() => {});

    return NextResponse.json({ 
      answer: answer, 
      success: true,
      citations: citations, // 프론트엔드로 전달
      result: {
        output: answer,
      },
    });

  } catch (error: any) {

    console.error('[ChatbotAPI-V2] Error:', error);

    logApiError(error, {
      component: 'ChatbotAPI-V2',
      action: 'POST',
      method: 'POST',
      path: '/api/chatbot-v2',
      userId,
    });

    return NextResponse.json(
      {
        success: false,
        error: `AI 응답 생성 중 오류가 발생했습니다: ${error.message}`, // 디버깅용 에러 메시지 노출
      },
      { status: 500 }
    );
  }
}
