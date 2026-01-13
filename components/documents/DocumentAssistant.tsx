/**
 * @file DocumentAssistant.tsx
 * @description 서류 전용 챗봇 컴포넌트
 */

'use client';

import { useState } from 'react';
import { Loader2, Send, Sparkles, ShieldCheck, ShieldAlert, BookOpen, AlertCircle, ExternalLink } from 'lucide-react';
import DocumentBotIcon from './DocumentBotIcon';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';


interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  citations?: any[];
  id?: string;
}

interface DocumentAssistantProps {
  documentName?: string;
}


export default function DocumentAssistant({ documentName }: DocumentAssistantProps) {
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
        body: JSON.stringify({ 
          question: finalQuestion,
          documentContext: documentName,
          messages: messages.map(m => ({ role: m.role, content: m.content }))
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || '응답을 가져오지 못했습니다.');
      }

      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: data.answer,
        citations: data.citations 
      }]);
    } catch (err: any) {
      setMessages((prev) => prev.slice(0, -1));
      setError(err.message || '챗봇 응답 생성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="leaf-section bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl p-5 sm:p-7 shadow-sm"
      role="region"
      aria-label="서류 관련 AI 전문가 상담"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 pb-6 border-b border-slate-100">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] shrink-0">
          <Sparkles className="w-6 h-6" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            산재 서류 AI 상담
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-[var(--primary)]/10 text-[var(--primary)]">
              Beta
            </span>
          </h2>

        </div>
      </div>

      {/* Chat Area Container */}
      <div className="relative min-h-[300px] max-h-[500px] sm:max-h-[600px] overflow-hidden mb-6 flex flex-col">
        
        {/* Empty State (with 3D Image & Animation) */}
        {messages.length === 0 && !loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center animate-fade-in pointer-events-none">
            <div className="w-32 h-32 sm:w-40 sm:h-40 mb-2 relative">
              <DocumentBotIcon className="w-full h-full drop-shadow-2xl" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2 font-brand">
              무엇을 도와드릴까요?
            </h3>
            <p className="text-sm text-slate-500 max-w-[280px] break-keep leading-relaxed">
              작성 방법부터 필수 서류까지,<br />
              <span className="text-primary font-bold">근로복지공단 가이드</span>를 기반으로 답변해 드립니다.
            </p>
          </div>
        )}

        {/* Message List */}
        <div 
          className="flex-1 overflow-y-auto space-y-4 px-1 pr-2 custom-scrollbar" 
          role="log" 
          aria-label="대화 내역"
        >
          {messages.map((message) => (
            <div
              key={message.id || Math.random().toString()}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-[1.25rem] p-4 text-sm leading-relaxed shadow-sm relative group ${
                  message.role === 'user'
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-white border border-slate-100 text-slate-800'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2 text-primary font-bold text-xs pb-2 border-b border-slate-100">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI 서류 전문가</span>
                  </div>
                )}
                <div
                  dangerouslySetInnerHTML={{ __html: markdownToCustomHtml(message.content) }}
                  className="prose prose-sm max-w-none break-words"
                />
                
                {/* Citations */}
                {message.citations && message.citations.length > 0 && (
                   <div className="mt-3 pt-3 border-t border-slate-100">
                     <div className="flex items-center gap-1.5 mb-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                       <BookOpen className="w-3 h-3" />
                       <span>참고 문서</span>
                     </div>
                     <div className="space-y-1.5">
                       {message.citations.map((citation, index) => {
                          const isObject = typeof citation === 'object' && citation !== null;
                          const title = isObject ? citation.title : citation;
                          const uri = isObject ? citation.uri : null;
                          
                          return (
                            <a 
                              key={index} 
                              href={uri || '#'} 
                              target={uri ? "_blank" : undefined}
                              rel={uri ? "noopener noreferrer" : undefined}
                              className={`text-xs bg-slate-50 px-2 py-1.5 rounded border border-slate-200 text-slate-600 flex items-start gap-1.5 leading-snug break-all transition-colors ${uri ? 'hover:bg-slate-100 cursor-pointer' : ''}`}
                              onClick={(e) => !uri && e.preventDefault()}
                            >
                              <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-slate-200 text-[9px] font-bold text-slate-600 shrink-0 mt-0.5">{index + 1}</span>
                              <span className="line-clamp-2 hover:line-clamp-none transition-all flex-1">{title}</span>
                              {uri && <ExternalLink className="w-3 h-3 text-slate-400 shrink-0 mt-0.5 ml-1" />}
                            </a>
                          );
                       })}
                     </div>
                   </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
               <div className="max-w-[85%] bg-white border border-slate-100 rounded-[1.25rem] p-4 shadow-sm flex items-center gap-3">
                 <Loader2 className="w-4 h-4 text-[var(--primary)] animate-spin" />
                 <span className="text-sm text-slate-500">답변을 생성하고 있습니다...</span>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk();
        }}
        className="relative"
      >
        <Textarea
          placeholder="궁금한 내용을 입력하세요"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={loading}
          className="min-h-[50px] max-h-[150px] py-4 pl-4 pr-12 resize-none text-sm bg-slate-50 border-slate-200 focus:bg-white focus:border-[var(--primary)] transition-all rounded-xl shadow-inner"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleAsk();
            }
          }}
        />
        <Button
          type="submit"
          disabled={loading || !question.trim()}
          size="icon"
          className="absolute right-2 bottom-2 w-9 h-9 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary)]/90 transition-colors shadow-sm disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          ) : (
            <Send className="w-4 h-4 text-white ml-0.5" />
          )}
          <span className="sr-only">전송</span>
        </Button>
      </form>

      {error && (
        <div className="mt-3 text-xs text-red-500 px-1 font-medium flex items-center gap-1">
          <ShieldAlert className="w-3 h-3" />
          {error}
        </div>
      )}

      <div className="mt-4 text-[10px] text-slate-400 text-center space-y-1.5">
        <p className="flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3 h-3 shrink-0" />
          <span>개인정보 보호를 위해 주민등록번호 등 민감정보는 입력하지 마세요.</span>
        </p>
        <p className="flex items-center justify-center gap-1.5 text-slate-500">
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span>AI 답변은 참고용이며, 정확한 내용은 반드시 근로복지공단에 최종 확인하시기 바랍니다.</span>
        </p>
      </div>
    </div>
  );
}

// Markdown to HTML helper (Internal)
function markdownToCustomHtml(text: string): string {
  let html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
    .replace(/^[\-\*] (.*$)/gm, '<ul><li>$1</li></ul>')
    .replace(/^\d+\. (.*$)/gm, '<ol><li>$1</li></ol>')
    .replace(/\n/g, '<br />');
    
  // Cleanup lists
  html = html.replace(/<\/ul><br \/><ul>/g, '');
  html = html.replace(/<\/ol><br \/><ol>/g, '');
  
  return html;
}


