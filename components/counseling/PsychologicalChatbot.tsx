/**
 * @file PsychologicalChatbot.tsx
 * @description 심리 상담 챗봇 컴포넌트
 * 
 * 산재 환자의 심리적 부담감 완화를 위한 AI 기반 심리 상담 챗봇입니다.
 * Google Gemini API를 활용하여 공감적이고 지지적인 상담을 제공합니다.
 * 
 * 주요 기능:
 * - 심리 상담 질문 입력 및 답변 표시
 * - 대화 기록 유지
 * - 마크다운 형식 답변 렌더링
 * - 로딩 및 에러 상태 처리
 * - 위기 상황 감지 및 전문가 연결 안내
 */

'use client';

import { useState } from 'react';
import { Loader2, Send, Heart } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import RiuLoader from '@/components/ui/riu-loader';
import { PersonaType, DEFAULT_PERSONA, PERSONAS } from '@/lib/types/persona';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function PsychologicalChatbot() {
  const recommendedQuestions = [
    '치료 기간 동안 불안감이 심해요',
    '경제적 부담이 너무 커서 스트레스가 많아요',
    '회사와의 관계가 악화되어 힘들어요',
    '미래가 불확실해서 두려워요',
  ];

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<PersonaType>(DEFAULT_PERSONA);

  const handleSend = async (customMessage?: string) => {
    const finalMessage = (customMessage ?? message).trim();
    if (finalMessage.length < 2) {
      setError('메시지를 2자 이상 입력해주세요.');
      return;
    }

    setError(null);
    setLoading(true);
    setMessage(customMessage ? message : '');

    setMessages((prev) => [...prev, { role: 'user', content: finalMessage }]);

    const controller = new AbortController();
    const startTime = Date.now();

    try {
      const timeoutId = window.setTimeout(() => {
        controller.abort();
      }, 30000);

      const response = await fetch('/api/counseling/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: finalMessage,
          conversationHistory: messages,
          persona: selectedPersona,
        }),
        signal: controller.signal,
      });

      window.clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `서버 오류: ${response.status}`);
      }

      const data = await response.json();
      const answer = data.answer;

      if (!answer) {
        throw new Error('응답을 받지 못했습니다.');
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: answer }]);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('응답 시간이 초과되었습니다. 다시 시도해주세요.');
      } else {
        setError(err.message || '상담 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setLoading(false);
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
      aria-label="심리 상담 챗봇"
    >
      {/* 페르소나 선택 */}
      <div className="mb-4 sm:mb-6">
        <h3 className="text-sm sm:text-base font-semibold text-foreground mb-3">
          누구와 상담하시겠어요?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {(Object.keys(PERSONAS) as PersonaType[]).map((personaId) => {
            const persona = PERSONAS[personaId];
            const isSelected = selectedPersona === personaId;
            return (
              <button
                key={personaId}
                type="button"
                onClick={() => setSelectedPersona(personaId)}
                disabled={loading}
                className={`
                  p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 text-left
                  ${isSelected
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-[var(--border-light)] bg-white hover:border-primary/50 hover:bg-primary/2'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                  focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                `}
                aria-label={`${persona.name} (${persona.role}) 선택`}
                aria-pressed={isSelected}
              >
                <div className="flex flex-col items-center mb-3">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-2 border-2 border-gray-200">
                    <Image
                      src={persona.imagePath}
                      alt={`${persona.name} (${persona.role})`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 80px, 96px"
                    />
                  </div>
                  <div className="font-semibold text-sm sm:text-base text-foreground text-center">
                    {persona.name}
                    <span className="text-xs text-muted-foreground ml-1">({persona.role})</span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 text-center">
                  {persona.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

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
              onClick={() => handleSend(item)}
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
            <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-primary/30 mx-auto mb-4" />
            <p className="text-sm sm:text-base text-muted-foreground">
              마음의 고민을 편하게 이야기해보세요. 공감과 지지를 바탕으로 상담을 제공합니다.
            </p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={msg.role === 'user' ? 'text-right' : 'text-left'}
            >
              <div
                className={`inline-block max-w-[85%] sm:max-w-[80%] rounded-lg p-3 sm:p-4 relative ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-gray-50 text-foreground border border-[var(--border-light)]'
                }`}
              >
                {msg.role === 'user' && (
                  <div
                    className="absolute -right-2 bottom-2 z-10"
                    style={{
                      width: 0,
                      height: 0,
                      borderLeft: '10px solid var(--primary)',
                      borderTop: '8px solid transparent',
                      borderBottom: '8px solid transparent',
                    }}
                  />
                )}
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
                message="답변을 준비하고 있습니다..."
                iconVariants={['smile', 'cheer']}
                logId="PsychologicalChatbot:loading"
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

      {/* 입력 폼 */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="space-y-3"
        aria-label="메시지 입력 폼"
      >
        <div className="flex gap-2 sm:gap-3">
          <Textarea
            placeholder="마음의 고민을 편하게 이야기해보세요..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={loading}
            className="flex-1 min-h-[80px] sm:min-h-[100px] resize-none"
            aria-label="상담 메시지 입력"
          />
          <Button
            type="submit"
            disabled={loading || message.trim().length < 2}
            className="self-end"
            aria-label="메시지 전송"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            ) : (
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}


