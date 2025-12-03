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
import { Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import RiuIcon from '@/components/icons/riu-icon';
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

  // 마크다운을 HTML로 변환하는 함수 (DocumentAssistant와 동일한 로직)
  const markdownToHtml = (text: string): string => {
    let html = text;
    
    // 강조 변환 (**텍스트** -> <strong>텍스트</strong>) - 먼저 처리
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-primary font-brand">$1</strong>');
    
    // 줄 단위로 분리하여 처리
    const lines = html.split('\n');
    const processedLines: string[] = [];
    let inOrderedList = false;
    let inUnorderedList = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // 제목 처리
      if (line.startsWith('### ')) {
        if (inOrderedList) { processedLines.push('</ol>'); inOrderedList = false; }
        if (inUnorderedList) { processedLines.push('</ul>'); inUnorderedList = false; }
        processedLines.push(`<h3 class="text-lg font-semibold mt-4 mb-2 text-primary font-brand">${line.substring(4)}</h3>`);
        continue;
      }
      
      if (line.startsWith('## ')) {
        if (inOrderedList) { processedLines.push('</ol>'); inOrderedList = false; }
        if (inUnorderedList) { processedLines.push('</ul>'); inUnorderedList = false; }
        processedLines.push(`<h2 class="text-xl font-bold mt-5 mb-3 text-primary font-brand">${line.substring(3)}</h2>`);
        continue;
      }
      
      // 인용구 처리
      if (line.startsWith('> ')) {
        if (inOrderedList) { processedLines.push('</ol>'); inOrderedList = false; }
        if (inUnorderedList) { processedLines.push('</ul>'); inUnorderedList = false; }
        processedLines.push(`<blockquote class="border-l-4 border-accent pl-4 py-2 my-3 bg-accent/10 italic">${line.substring(2)}</blockquote>`);
        continue;
      }
      
      // 번호 목록 처리
      const orderedMatch = line.match(/^(\d+)\. (.*)$/);
      if (orderedMatch) {
        if (inUnorderedList) { processedLines.push('</ul>'); inUnorderedList = false; }
        if (!inOrderedList) {
          processedLines.push('<ol class="list-decimal list-inside space-y-1 my-2">');
          inOrderedList = true;
        }
        processedLines.push(`<li class="ml-4 mb-1">${orderedMatch[2]}</li>`);
        continue;
      }
      
      // 불릿 목록 처리
      if (line.startsWith('- ')) {
        if (inOrderedList) { processedLines.push('</ol>'); inOrderedList = false; }
        if (!inUnorderedList) {
          processedLines.push('<ul class="list-disc list-inside space-y-1 my-2">');
          inUnorderedList = true;
        }
        processedLines.push(`<li class="ml-4 mb-1">${line.substring(2)}</li>`);
        continue;
      }
      
      // 일반 텍스트 처리
      if (inOrderedList) { processedLines.push('</ol>'); inOrderedList = false; }
      if (inUnorderedList) { processedLines.push('</ul>'); inUnorderedList = false; }
      
      if (line.length > 0) {
        processedLines.push(`<p class="mb-2">${line}</p>`);
      } else {
        processedLines.push('<br />');
      }
    }
    
    // 열려있는 목록 닫기
    if (inOrderedList) processedLines.push('</ol>');
    if (inUnorderedList) processedLines.push('</ul>');
    
    return processedLines.join('');
  };

  return (
    <div 
      className="leaf-section bg-white border border-[var(--border-light)] rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 mb-8 shadow-canopy"
      role="region"
      aria-label="산재 상담 챗봇"
    >
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-6">
        <RiuIcon variant="question" size={40} className="sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16" aria-hidden="true" />
        <div className="flex flex-col gap-1 md:gap-1.5">
          <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl text-foreground">산재 전문 노무사에게 질문하세요</h2>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
            실제 상담사와 연결되기 전, 궁금한 점을 빠르게 알아보세요.
          </p>
        </div>
      </div>

      <div className="space-y-2 sm:space-y-3 md:space-y-4 mb-4 sm:mb-5 md:mb-6">
        <div 
          className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-2.5"
          role="group"
          aria-label="추천 질문"
        >
          {recommendedQuestions.map((item) => (
            <button
              key={item}
              type="button"
              className="text-xs sm:text-sm md:text-base px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full border border-border-light bg-muted text-primary hover:bg-border-light transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handleAsk(item)}
              disabled={loading}
              aria-label={`추천 질문: ${item}`}
            >
              {item}
            </button>
          ))}
        </div>

        {recentQuestions.length > 0 && (
          <div 
            className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-2.5"
            role="group"
            aria-label="최근 질문"
          >
            {recentQuestions.map((item) => (
              <button
                key={item}
                type="button"
                className="text-[10px] sm:text-xs md:text-sm px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full border border-border-light bg-white text-muted-foreground hover:bg-muted transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setQuestion(item)}
                disabled={loading}
                aria-label={`최근 질문 입력: ${item}`}
              >
                최근 질문: {item}
              </button>
            ))}
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk();
        }}
        className="space-y-3"
        aria-label="질문 입력 폼"
      >
        <Textarea
          placeholder="예: 요양급여가 뭔가요? 산업재해 신청은 어떻게 하나요?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={loading}
          className="min-h-[80px] sm:min-h-[90px] md:min-h-[100px] lg:min-h-[120px] resize-none text-sm sm:text-base md:text-lg focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="질문 입력"
          aria-describedby="question-help-text"
          aria-required="true"
        />
        <p id="question-help-text" className="sr-only">
          산재 관련 질문을 입력하세요. 최소 2자 이상 입력해야 합니다.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
          <button
            type="button"
            className="text-xs sm:text-sm md:text-base text-muted-foreground hover:text-primary transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {
              setMessages([]);
              setError(null);
            }}
            disabled={loading || messages.length === 0}
            aria-label="대화 기록 초기화"
            aria-disabled={loading || messages.length === 0}
          >
            대화 초기화
          </button>
          <Button
            type="submit"
            disabled={loading}
            className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5 w-full sm:w-auto text-sm sm:text-base md:text-lg px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label={loading ? "답변 준비 중" : "질문 전송"}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 animate-spin" strokeWidth={1.75} aria-hidden="true" />
                <span className="text-xs sm:text-sm md:text-base">답변 준비 중...</span>
              </>
            ) : (
              <>
                <span className="text-xs sm:text-sm md:text-base">질문하기</span>
                <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" strokeWidth={1.75} aria-hidden="true" />
              </>
            )}
          </Button>
        </div>
      </form>

      {error && (
        <div 
          className="mt-3 sm:mt-4 md:mt-5 p-2.5 sm:p-3 md:p-4 rounded-lg bg-red-50 border border-red-200"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <p className="text-xs sm:text-sm md:text-base text-red-600">{error}</p>
        </div>
      )}

      {isTimeout && (
        <div 
          className="mt-2 sm:mt-3 md:mt-4 p-2.5 sm:p-3 md:p-4 rounded-lg bg-yellow-50 border border-yellow-200"
          role="alert"
          aria-live="polite"
          aria-atomic="true"
        >
          <p className="text-xs sm:text-sm md:text-base text-[#8A6D3B]">
            응답이 길어지고 있습니다. 잠시 후 다시 시도하거나 질문을 조금 더 구체적으로 작성해 주세요.
          </p>
        </div>
      )}

      {messages.length > 0 && (
        <div 
          className="mt-4 sm:mt-6 md:mt-8 space-y-3 sm:space-y-4 md:space-y-5 max-h-[300px] sm:max-h-[400px] md:max-h-[500px] lg:max-h-[600px] overflow-y-auto pr-1 sm:pr-2 md:pr-3 custom-scrollbar"
          role="log"
          aria-label="대화 기록"
          aria-live="polite"
          aria-atomic="false"
        >
          {[...messages].reverse().map((message, index) => {
            const baseClasses = 'p-3 sm:p-4 md:p-5 lg:p-6 rounded-xl sm:rounded-2xl border shadow-leaf text-sm sm:text-base md:text-lg';
            const userClasses = 'bg-accent/10 border-accent/30 text-foreground';
            const assistantClasses =
              'bg-[var(--background-alt)] border-[var(--border-light)] text-foreground prose prose-sm md:prose-base max-w-none';

            if (message.role === 'assistant') {
              return (
                <div
                  key={`${message.role}-${index}`}
                  className={`${baseClasses} ${assistantClasses}`}
                  role="article"
                  aria-label={`챗봇 답변 ${index + 1}`}
                  dangerouslySetInnerHTML={{
                    __html: markdownToHtml(message.content),
                  }}
                />
              );
            }

            return (
              <div
                key={`${message.role}-${index}`}
                className={`${baseClasses} ${userClasses}`}
                role="article"
                aria-label={`사용자 질문 ${index + 1}`}
              >
                {message.content}
              </div>
            );
          })}
        </div>
      )}

      {loading && (
        <div 
          className="mt-4 sm:mt-6 md:mt-8"
          role="status"
          aria-live="polite"
          aria-label="답변 준비 중"
        >
          <RiuLoader 
            message={
              loadingStage === 'analyzing' 
                ? '질문을 분석하고 있어요...'
                : loadingStage === 'searching'
                ? '관련 정보를 찾고 있어요...'
                : '전문가가 답변을 작성 중이에요...'
            }
            iconVariants={['question','smile','cheer']}
            logId="RagChatbot:loading"
            ariaDescription="답변이 준비되면 자동으로 표시됩니다"
          />
        </div>
      )}

      <p className="mt-3 sm:mt-4 md:mt-5 text-[10px] sm:text-xs md:text-sm text-muted-foreground text-center" role="note" aria-label="면책 조항">
        ※ AI가 제공하는 정보는 참고용이며 법률 자문이 아닙니다.
      </p>
    </div>
  );
}

