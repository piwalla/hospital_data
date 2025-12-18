/**
 * @file RagChatbot.tsx
 * @description n8n RAG 챗봇 컴포넌트
 * 
 * n8n 웹훅을 통해 산업재해 전문 상담 챗봇과 대화할 수 있는 컴포넌트입니다.
 * RAG 기술을 활용하여 Supabase 벡터 데이터베이스에서 정확한 정보를 검색합니다.
 * 
 * 주요 기능:
 * - 질문 입력 및 답변 표시
 * - 세션별 대화 기록 유지 (Clerk userId 사용)
 * - 마크다운 형식 답변 렌더링
 * - 로딩 및 에러 상태 처리
 * 
 * @dependencies
 * - @clerk/nextjs: useUser hook (sessionId용)
 * - n8n 웹훅: NEXT_PUBLIC_N8N_WEBHOOK_URL 환경 변수 필요
 */

'use client';

import { useMemo, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Loader2, Send, MessageSquareText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import RiuLoader from '@/components/ui/riu-loader';
import { logError } from '@/lib/utils/error-logging';
import { logChatbotActivity } from '@/lib/utils/chatbot-analytics';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function RagChatbot() {
  const { user } = useUser();
  const recommendedQuestions = useMemo(
    () => [
      '요양급여가 뭔가요?',
      '산업재해 신청은 어떻게 하나요?',
      '휴업급여는 언제 받을 수 있나요?',
    ],
    []
  );
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState<'analyzing' | 'searching' | 'writing'>('analyzing');
  const [error, setError] = useState<string | null>(null);
  const [recentQuestions, setRecentQuestions] = useState<string[]>([]);
  const [isTimeout, setIsTimeout] = useState(false);

  const handleAsk = async (customQuestion?: string) => {
    const finalQuestion = (customQuestion ?? question).trim();
    if (finalQuestion.length < 2) {
      setError('질문을 2자 이상 입력해주세요.');
      return;
    }

    if (!user?.id) {
      setError('로그인이 필요합니다.');
      return;
    }

    setError(null);
    setIsTimeout(false);
    setLoading(true);
    setLoadingStage('analyzing');
    setQuestion(customQuestion ? question : '');

    setMessages((prev) => [...prev, { role: 'user', content: finalQuestion }]);
    setRecentQuestions((prev) => {
      const next = [finalQuestion, ...prev.filter((q) => q !== finalQuestion)];
      return next.slice(0, 5);
    });

    const controller = new AbortController();
    let timeoutId: number | null = null;
    let stageTimeoutId: number | null = null;
    let stageTimeoutId2: number | null = null;
    const startTime = Date.now();

    // 단계별 로딩 메시지 표시
    stageTimeoutId = window.setTimeout(() => {
      setLoadingStage('searching');
    }, 2000); // 2초 후 "검색 중"으로 변경

    stageTimeoutId2 = window.setTimeout(() => {
      setLoadingStage('writing');
    }, 5000); // 5초 후 "작성 중"으로 변경

    // 질문 로깅
    logChatbotActivity('chatbot_question', {
      userId: user.id,
      question: finalQuestion,
      sessionId: user.id,
    }).catch(() => {
      // 로깅 실패는 무시
    });

    try {
      timeoutId = window.setTimeout(() => {
        controller.abort();
      }, 30000);

      console.groupCollapsed('[RagChatbot] Outgoing request');
      console.log('User ID:', user.id);
      console.log('Question:', finalQuestion);
      console.groupEnd();

      // Next.js API Route를 통해 n8n 웹훅 호출 (CORS 문제 해결)
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: finalQuestion,
          sessionId: user.id, // Clerk userId를 sessionId로 사용
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `서버 오류: ${response.status}`);
      }

      const data = await response.json();
      
      // API Route 응답 형식: { success: true, result: { output: "..." } }
      const answer = data?.result?.output;
      
      if (!answer) {
        throw new Error('응답을 받지 못했습니다.');
      }

      const responseTime = Date.now() - startTime;

      // 응답 로깅
      logChatbotActivity('chatbot_response', {
        userId: user.id,
        question: finalQuestion,
        responseTime,
        sessionId: user.id,
      }).catch(() => {
        // 로깅 실패는 무시
      });

      setMessages((prev) => [...prev, { role: 'assistant', content: answer }]);
    } catch (err: any) {
      // 타임아웃 정리
      if (stageTimeoutId) {
        clearTimeout(stageTimeoutId);
      }
      if (stageTimeoutId2) {
        clearTimeout(stageTimeoutId2);
      }
      const responseTime = Date.now() - startTime;
      
      // 에러 로깅
      logError(err, {
        component: 'RagChatbot',
        action: 'handleAsk',
        userId: user.id,
        metadata: {
          question: finalQuestion,
          responseTime,
        },
      });

      // 에러 활동 로깅
      logChatbotActivity('chatbot_error', {
        userId: user.id,
        question: finalQuestion,
        error: err.message || 'Unknown error',
        responseTime,
        sessionId: user.id,
      }).catch(() => {
        // 로깅 실패는 무시
      });

      if (err.name === 'AbortError') {
        console.warn('[RagChatbot] Request timed out');
        setIsTimeout(true);
        setError('응답이 지연되고 있어요. 잠시 후 다시 시도해주세요.');
      } else {
        console.error('[RagChatbot] Error', err);
        setError(err.message || '챗봇 응답 생성 중 오류가 발생했습니다.');
      }
      setMessages((prev) => prev.slice(0, -1)); // 실패 시 user 메시지 제거
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (stageTimeoutId) {
        clearTimeout(stageTimeoutId);
      }
      if (stageTimeoutId2) {
        clearTimeout(stageTimeoutId2);
      }
      setLoading(false);
      setLoadingStage('analyzing');
    }
  };

  // 마크다운을 HTML로 변환하는 함수
  const markdownToHtml = (text: string): string => {
    let html = text;
    
    // 강조 변환 (**텍스트** -> <strong>텍스트</strong>)
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-primary">$1</strong>');
    
    // 줄 단위로 분리하여 처리
    const lines = html.split('\n');
    const processedLines: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // 제목 처리
      if (line.startsWith('### ')) {
        processedLines.push(`<h3 class="text-lg font-semibold mt-4 mb-2 text-primary">${line.substring(4)}</h3>`);
        continue;
      }
      
      if (line.startsWith('## ')) {
        processedLines.push(`<h2 class="text-xl font-bold mt-5 mb-3 text-primary">${line.substring(3)}</h2>`);
        continue;
      }
      
      // 인용구 처리
      if (line.startsWith('> ')) {
        processedLines.push(`<blockquote class="border-l-4 border-primary/30 pl-4 py-2 my-3 bg-primary/5 italic">${line.substring(2)}</blockquote>`);
        continue;
      }
      
      // 번호 목록 처리
      const orderedMatch = line.match(/^(\d+)\. (.*)$/);
      if (orderedMatch) {
        processedLines.push(`<li class="ml-4 mb-1 list-decimal">${orderedMatch[2]}</li>`);
        continue;
      }
      
      // 불릿 목록 처리
      if (line.startsWith('- ')) {
        processedLines.push(`<li class="ml-4 mb-1 list-disc">${line.substring(2)}</li>`);
        continue;
      }
      
      // 일반 텍스트 처리
      if (line.length > 0) {
        processedLines.push(`<p class="mb-2">${line}</p>`);
      } else {
        processedLines.push('<br />');
      }
    }
    
    return processedLines.join('');
  };

  return (
    <div 
      className="bg-white border border-[var(--border-light)] rounded-lg p-4 sm:p-6 md:p-8 shadow-sm"
      role="region"
      aria-label="산재 상담 챗봇"
    >
      {/* 추천 질문 */}
      <div className="mb-4 sm:mb-6">
        <div 
          className="flex flex-wrap gap-2 sm:gap-3"
          role="group"
          aria-label="추천 질문"
        >
          {recommendedQuestions.map((item) => (
            <button
              key={item}
              type="button"
              className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[var(--border-light)] bg-gray-50 text-foreground hover:bg-primary/10 hover:border-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handleAsk(item)}
              disabled={loading}
              aria-label={`추천 질문: ${item}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* 대화 기록 */}
      <div 
        className="space-y-4 sm:space-y-6 mb-4 sm:mb-6 max-h-[400px] sm:max-h-[500px] md:max-h-[600px] overflow-y-auto pr-2"
        role="log"
        aria-live="polite"
        aria-label="대화 기록"
      >
        {messages.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <MessageSquareText className="w-12 h-12 sm:w-16 sm:h-16 text-primary/30 mx-auto mb-4" />
            <p className="text-sm sm:text-base text-muted-foreground">
              산재 관련 궁금한 점을 자유롭게 물어보세요. RAG 기술로 정확한 정보를 제공합니다.
            </p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={msg.role === 'user' ? 'text-right' : 'text-left'}
            >
              <div
                className={`inline-block max-w-[85%] sm:max-w-[80%] rounded-lg p-3 sm:p-4 ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-gray-50 text-foreground border border-[var(--border-light)]'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <div
                    className="prose prose-sm sm:prose-base max-w-none"
                    dangerouslySetInnerHTML={{ __html: markdownToHtml(msg.content) }}
                  />
                ) : (
                  <p className="text-sm sm:text-base whitespace-pre-wrap">{msg.content}</p>
                )}
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="text-left">
            <div className="inline-block bg-gray-50 border border-[var(--border-light)] rounded-lg p-3 sm:p-4">
              <RiuLoader
                message={
                  loadingStage === 'analyzing' 
                    ? '질문을 분석하고 있어요...'
                    : loadingStage === 'searching'
                    ? '관련 정보를 찾고 있어요...'
                    : '전문가가 답변을 작성 중이에요...'
                }
                iconVariants={['question', 'smile', 'cheer']}
                logId="RagChatbot:loading"
                ariaDescription="답변 생성 중"
              />
            </div>
          </div>
        )}
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div
          className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg"
          role="alert"
          aria-live="assertive"
        >
          <p className="text-sm sm:text-base text-red-800">{error}</p>
        </div>
      )}

      {/* 타임아웃 메시지 */}
      {isTimeout && (
        <div
          className="mb-4 sm:mb-6 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
          role="alert"
          aria-live="polite"
        >
          <p className="text-sm sm:text-base text-yellow-800">
            응답이 길어지고 있습니다. 잠시 후 다시 시도하거나 질문을 조금 더 구체적으로 작성해 주세요.
          </p>
        </div>
      )}

      {/* 입력 폼 */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk();
        }}
        className="space-y-3"
        aria-label="질문 입력 폼"
      >
        <div className="flex gap-2 sm:gap-3">
          <Textarea
            placeholder="산재 관련 질문을 입력해주세요..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={loading}
            className="flex-1 min-h-[80px] sm:min-h-[100px] resize-none"
            aria-label="질문 입력"
          />
          <Button
            type="submit"
            disabled={loading || question.trim().length < 2}
            className="self-end"
            aria-label="질문 전송"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            ) : (
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </Button>
        </div>
        {recentQuestions.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
              onClick={() => {
                setMessages([]);
                setQuestion('');
                setError(null);
                setRecentQuestions([]);
                setIsTimeout(false);
              }}
              disabled={loading}
              aria-label="대화 초기화"
            >
              대화 초기화
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

