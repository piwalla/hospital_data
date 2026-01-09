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
import { Loader2, Send } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

import { PersonaType, DEFAULT_PERSONA, PERSONAS } from '@/lib/types/persona';
import WarmHeartIcon from './WarmHeartIcon';
import { cn } from '@/lib/utils';
import JungwonLoader from './JungwonLoader';
import GangseokLoader from './GangseokLoader';
import MiyoungLoader from './MiyoungLoader';

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

    // 최소 4초간 애니메이션을 보여주기 위해 시작 시간 기록
    const controller = new AbortController();
    const animationStartTime = Date.now();
    const MIN_ANIMATION_DURATION = 4200; // 4.2초 (사용자의 4~5초 요청 반영)

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

      // 인공적인 딜레이를 추가하여 사용자 요청(4~5초) 달성
      const elapsedTime = Date.now() - animationStartTime;
      const remainingTime = MIN_ANIMATION_DURATION - elapsedTime;
      
      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
          {(Object.keys(PERSONAS) as PersonaType[]).map((personaId) => {
            const persona = PERSONAS[personaId];
            const isSelected = selectedPersona === personaId;
            return (
              <button
                key={personaId}
                type="button"
                onClick={() => setSelectedPersona(personaId)}
                disabled={loading}
                className={cn(
                  "p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border-2 text-center flex flex-col items-center justify-center transition-colors",
                  isSelected
                    ? "border-rose-500 bg-rose-50 shadow-md shadow-rose-100/50"
                    : "border-gray-100 bg-white hover:border-rose-200"
                )}
              >
                {/* 프로필 이미지 - 모바일에서 크기 축소 */}
                <div className={cn(
                  "w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden border-[3px] sm:border-4 mb-2 sm:mb-4",
                  isSelected ? "border-rose-500" : "border-gray-50"
                )}>
                  <div className="w-full h-full relative">
                    <Image
                      src={persona.imagePath}
                      alt={persona.name}
                      fill
                      priority={isSelected}
                      className="object-cover object-top"
                      sizes="(max-width: 640px) 64px, 96px"
                    />
                  </div>
                </div>
                
                {/* 정보 텍스트 - 모바일 최적화 */}
                <div className="w-full">
                  <div className="font-bold text-sm sm:text-base text-gray-900 mb-0.5 sm:mb-1">
                    {persona.name}
                    <span className="ml-1.5 text-[9px] sm:text-[10px] font-bold text-rose-500 bg-rose-50 px-1.5 sm:px-2 py-0.5 rounded-full ring-1 ring-rose-100 whitespace-nowrap">
                      {persona.role}
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] md:text-xs text-gray-500 leading-tight sm:leading-relaxed line-clamp-2 sm:line-clamp-3">
                    {persona.description}
                  </p>
                </div>
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
          <div className="text-center py-10 sm:py-16">
            <WarmHeartIcon />
            <p className="text-sm sm:text-lg text-gray-500 mt-8 max-w-md mx-auto leading-relaxed">
              마음속 깊이 담아두었던 고민들, <br/>
              리워크케어 상담사가 따뜻하게 들어드릴게요.
            </p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={msg.role === 'user' ? 'text-right' : 'text-left'}
            >
              <div
                className={cn(
                  "inline-block max-w-[85%] sm:max-w-[80%] rounded-3xl p-4 sm:p-5 relative shadow-sm",
                  msg.role === 'user'
                    ? "bg-rose-500 text-white rounded-tr-none shadow-rose-100"
                    : "bg-white text-gray-800 border border-gray-100 rounded-tl-none shadow-gray-100 backdrop-blur-sm bg-white/90"
                )}
              >
                {msg.role === 'assistant' ? (
                  <div
                    className="prose prose-sm sm:prose-base max-w-none prose-rose prose-p:leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: markdownToHtml(msg.content) }}
                  />
                ) : (
                  <p className="text-sm sm:text-base whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                )}
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="w-full">
            <div className="bg-white/80 border border-gray-100 rounded-3xl p-6 shadow-sm backdrop-blur-sm mx-auto max-w-sm">
              {selectedPersona === 'jungwon' && <JungwonLoader />}
              {selectedPersona === 'gangseok' && <GangseokLoader />}
              {selectedPersona === 'miyoung' && <MiyoungLoader />}
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
        <div className="flex gap-2 sm:gap-3 items-end p-2 bg-gray-50/50 rounded-[2rem] border border-gray-100 backdrop-blur-sm">
          <Textarea
            placeholder="상담사에게 마음의 고민을 털어놓으세요..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={loading}
            className="flex-1 min-h-[60px] sm:min-h-[80px] border-none bg-transparent focus-visible:ring-0 resize-none px-4 py-3 placeholder:text-gray-400"
            aria-label="상담 메시지 입력"
          />
          <Button
            type="submit"
            disabled={loading || message.trim().length < 2}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-200 hover:shadow-rose-300 transition-all duration-300 flex-shrink-0"
            aria-label="메시지 전송"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5 ml-0.5" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}


