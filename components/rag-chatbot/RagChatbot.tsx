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
    setQuestion(customQuestion ? question : '');

    setMessages((prev) => [...prev, { role: 'user', content: finalQuestion }]);
    setRecentQuestions((prev) => {
      const next = [finalQuestion, ...prev.filter((q) => q !== finalQuestion)];
      return next.slice(0, 5);
    });

    const controller = new AbortController();
    let timeoutId: number | null = null;

    try {
      const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
      
      if (!webhookUrl) {
        throw new Error('웹훅 URL이 설정되지 않았습니다. 환경 변수를 확인해주세요.');
      }

      timeoutId = window.setTimeout(() => {
        controller.abort();
      }, 30000);

      console.groupCollapsed('[RagChatbot] Outgoing request');
      console.log('User ID:', user.id);
      console.log('Question:', finalQuestion);
      console.groupEnd();

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: finalQuestion,
          sessionId: user.id, // Clerk userId를 sessionId로 사용
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`서버 오류: ${response.status}`);
      }

      const data = await response.json();
      
      // n8n 응답 형식: { result: { output: "..." } }
      const answer = data?.result?.output;
      
      if (!answer) {
        throw new Error('응답을 받지 못했습니다.');
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: answer }]);
    } catch (err: any) {
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
      setLoading(false);
    }
  };

  // 마크다운을 HTML로 변환하는 함수 (DocumentAssistant와 동일한 로직)
  const markdownToHtml = (text: string): string => {
    let html = text;
    
    // 강조 변환 (**텍스트** -> <strong>텍스트</strong>) - 먼저 처리
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-[#2F6E4F]">$1</strong>');
    
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
        processedLines.push(`<h3 class="text-lg font-semibold mt-4 mb-2 text-[#2F6E4F]">${line.substring(4)}</h3>`);
        continue;
      }
      
      if (line.startsWith('## ')) {
        if (inOrderedList) { processedLines.push('</ol>'); inOrderedList = false; }
        if (inUnorderedList) { processedLines.push('</ul>'); inUnorderedList = false; }
        processedLines.push(`<h2 class="text-xl font-bold mt-5 mb-3 text-[#2F6E4F]">${line.substring(3)}</h2>`);
        continue;
      }
      
      // 인용구 처리
      if (line.startsWith('> ')) {
        if (inOrderedList) { processedLines.push('</ol>'); inOrderedList = false; }
        if (inUnorderedList) { processedLines.push('</ul>'); inUnorderedList = false; }
        processedLines.push(`<blockquote class="border-l-4 border-[#FFD54F] pl-4 py-2 my-3 bg-[#FFD54F]/10 italic">${line.substring(2)}</blockquote>`);
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
    <div className="leaf-section bg-white border border-[#E8F5E9] rounded-2xl p-6 mb-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="flex items-center gap-3 mb-4">
        <RiuIcon variant="question" size={48} />
        <div className="flex flex-col gap-1">
          <h2 className="text-[#1C1C1E]">산재 전문 노무사에게 질문하세요</h2>
          <p className="text-sm text-[#8A8A8E]">
            실제 상담사와 연결되기 전, 궁금한 점을 빠르게 알아보세요.
          </p>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex flex-wrap gap-2">
          {recommendedQuestions.map((item) => (
            <button
              key={item}
              type="button"
              className="text-sm px-3 py-1.5 rounded-full border border-[#E8F5E9] bg-[#F5F9F6] text-[#2F6E4F] hover:bg-[#E8F5E9] transition-colors duration-150"
              onClick={() => handleAsk(item)}
              disabled={loading}
            >
              {item}
            </button>
          ))}
        </div>

        {recentQuestions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {recentQuestions.map((item) => (
              <button
                key={item}
                type="button"
                className="text-xs px-3 py-1.5 rounded-full border border-[#E8F5E9] bg-white text-[#555555] hover:bg-[#F5F9F6] transition-colors duration-150"
                onClick={() => setQuestion(item)}
                disabled={loading}
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
      >
        <Textarea
          placeholder="예: 요양급여가 뭔가요? 산업재해 신청은 어떻게 하나요?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={loading}
          className="min-h-[90px] resize-none"
        />
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
          <button
            type="button"
            className="text-sm text-[#8A8A8E] hover:text-[#2F6E4F] transition-colors duration-150"
            onClick={() => {
              setMessages([]);
              setError(null);
            }}
            disabled={loading || messages.length === 0}
          >
            대화 초기화
          </button>
          <Button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.75} />
                답변 준비 중...
              </>
            ) : (
              <>
                질문하기
                <Send className="w-4 h-4" strokeWidth={1.75} />
              </>
            )}
          </Button>
        </div>
      </form>

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {isTimeout && (
        <div className="mt-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
          <p className="text-sm text-[#8A6D3B]">
            응답이 길어지고 있습니다. 잠시 후 다시 시도하거나 질문을 조금 더 구체적으로 작성해 주세요.
          </p>
        </div>
      )}

      {messages.length > 0 && (
        <div className="mt-6 space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          {messages.map((message, index) => {
            const baseClasses = 'p-4 rounded-2xl border shadow-sm';
            const userClasses = 'bg-[#2F6E4F]/5 border-[#2F6E4F]/20 text-[#1C1C1E]';
            const assistantClasses =
              'bg-[#F5F9F6] border-[#E8F5E9] text-[#1C1C1E] prose prose-sm max-w-none';

            if (message.role === 'assistant') {
              return (
                <div
                  key={`${message.role}-${index}`}
                  className={`${baseClasses} ${assistantClasses}`}
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
              >
                {message.content}
              </div>
            );
          })}
        </div>
      )}

      {loading && messages.length === 0 && (
        <div className="mt-6">
          <RiuLoader message="15년차 노무법인 전문가가 답변을 준비 중이에요..." iconVariants={['question','smile','cheer']} />
        </div>
      )}

      <p className="mt-4 text-[12px] text-[#555555] text-center">
        ※ AI가 제공하는 정보는 참고용이며 법률 자문이 아닙니다.
      </p>
    </div>
  );
}

