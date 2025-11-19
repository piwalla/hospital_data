/**
 * @file DocumentAssistant.tsx
 * @description 서류 전용 챗봇 컴포넌트
 */

'use client';

import { useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

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
    <div className="bg-white border border-[#E4E7E7] rounded-xl p-6 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <img 
          src="/Generated_Image_November_19__2025_-_4_31PM__1_-removebg-preview.png" 
          alt="Re 캐릭터" 
          className="w-12 h-12 object-contain flex-shrink-0"
        />
        <h2 className="text-[#1C1C1E]">
          AI에게 산재관련 서류를 물어보세요
        </h2>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk();
        }}
        className="space-y-3"
      >
        <Textarea
          placeholder="질문을 입력하세요"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={loading}
          className="min-h-[90px] resize-none"
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.75} />
                답변 생성 중...
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

      {messages.length > 0 && (
        <div className="mt-6 space-y-4 max-h-[320px] overflow-y-auto pr-2">
          {messages.map((message, index) => {
            const baseClasses = 'p-4 rounded-lg border';
            const userClasses = 'bg-[#2F6E4F]/5 border-[#2F6E4F]/20 text-[#1C1C1E]';
            const assistantClasses =
              'bg-[#F7F9F8] border-[#E4E7E7] text-[#1C1C1E] prose prose-sm max-w-none';

            if (message.role === 'assistant') {
              return (
                <div
                  key={`${message.role}-${index}`}
                  className={`${baseClasses} ${assistantClasses}`}
                  dangerouslySetInnerHTML={{
                    __html: message.content
                      .replace(/\n/g, '<br />')
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
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

      <p className="mt-4 text-[12px] text-[#555555] text-center">
        ※ AI가 제공하는 정보는 참고용이며 법률 자문이 아닙니다.
      </p>
    </div>
  );
}

