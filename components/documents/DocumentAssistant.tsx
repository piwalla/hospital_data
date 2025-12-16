/**
 * @file DocumentAssistant.tsx
 * @description 서류 전용 챗봇 컴포넌트
 */

'use client';

import { useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import RiuIcon from '@/components/icons/riu-icon';
import RiuLoader from '@/components/ui/riu-loader';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}


export default function DocumentAssistant() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAsk = async (customQuestion?: string) => {
    const finalQuestion = (customQuestion ?? question).trim();
    if (finalQuestion.length < 2) {
      setError('질문을 2자 이상 입력해주세요.');
      return;
    }

    setError(null);
    setLoading(true);
    setQuestion(customQuestion ? question : '');

    setMessages((prev) => [...prev, { role: 'user', content: finalQuestion }]);

    try {
      const response = await fetch('/api/documents/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: finalQuestion }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || '응답을 가져오지 못했습니다.');
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: data.answer }]);
    } catch (err: any) {
      setMessages((prev) => prev.slice(0, -1)); // 실패 시 user 메시지 제거
      setError(err.message || '챗봇 응답 생성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="leaf-section bg-white border border-[var(--border-light)] rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 shadow-canopy"
      role="region"
      aria-label="서류 관련 AI 챗봇"
    >
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <RiuIcon variant="question" size={40} className="sm:w-12 sm:h-12" aria-hidden="true" />
        <h2 className="text-base sm:text-lg md:text-xl text-foreground font-brand">
          AI에게 서류에 대해 물어보세요
        </h2>
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
          placeholder="질문을 입력하세요"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={loading}
          className="min-h-[80px] sm:min-h-[90px] resize-none text-sm sm:text-base focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-label="질문 입력"
          aria-describedby="question-help-text"
        />
        <p id="question-help-text" className="sr-only">산재 관련 서류에 대한 질문을 입력하세요. 최소 2자 이상 입력해야 합니다.</p>
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label={loading ? "답변 준비 중" : "질문 전송"}
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" strokeWidth={1.75} aria-hidden="true" />
                <span className="text-xs sm:text-sm" role="status" aria-live="polite">리우가 답변 중...</span>
              </>
            ) : (
              <>
                <span className="text-xs sm:text-sm">질문하기</span>
                <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={1.75} aria-hidden="true" />
              </>
            )}
          </Button>
        </div>
      </form>

      {error && (
        <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 rounded-lg bg-red-50 border border-red-200" role="alert" aria-live="assertive">
          <p className="text-xs sm:text-sm text-red-600">{error}</p>
        </div>
      )}

      {messages.length > 0 && (
        <div 
          className="mt-4 sm:mt-6 space-y-3 sm:space-y-4 max-h-[300px] sm:max-h-[400px] md:max-h-[500px] overflow-y-auto pr-1 sm:pr-2 custom-scrollbar"
          role="log"
          aria-live="polite"
          aria-label="대화 기록"
        >
          {messages.map((message, index) => {
            const baseClasses = 'p-4 rounded-lg border shadow-leaf';
            const userClasses = 'bg-accent/10 border-accent/30 text-foreground';
            const assistantClasses =
              'bg-[var(--background-alt)] border-[var(--border-light)] text-foreground prose prose-sm max-w-none';

            if (message.role === 'assistant') {
              // 마크다운을 HTML로 변환하는 함수
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
                  key={`${message.role}-${index}`}
                  className={`${baseClasses} ${assistantClasses}`}
                  dangerouslySetInnerHTML={{
                    __html: markdownToHtml(message.content),
                  }}
                  role="article"
                  aria-label={`AI 답변 ${index + 1}`}
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

      {loading && messages.length === 0 && (
        <div className="mt-4 sm:mt-6" role="status" aria-live="polite" aria-label="15년차 노무법인 전문가가 답변을 준비 중이에요.">
          <RiuLoader 
            message="15년차 노무법인 전문가가 답변을 준비 중이에요..." 
            iconVariants={['question','smile','cheer']}
            logId="DocumentAssistant:loading"
            ariaDescription="답변이 준비되면 자동으로 표시됩니다"
          />
        </div>
      )}

      <p className="mt-3 sm:mt-4 text-[10px] sm:text-xs text-muted-foreground text-center" role="note" aria-label="면책 조항">
        ※ AI가 제공하는 정보는 참고용이며 법률 자문이 아닙니다.
      </p>
    </div>
  );
}

