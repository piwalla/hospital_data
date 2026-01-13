/**
 * @file RagChatbotV2.tsx
 * @description Google Gemini V2 챗봇 컴포넌트
 * 
 * Google Gemini API (File Search)를 사용하는 V2 챗봇입니다.
 * 기존 RagChatbot과 동일한 UI를 가지며, 백엔드 API만 V2로 연결됩니다.
 */

'use client';

import { useMemo, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
// Original imports
import { Loader2, Send, Sparkles, Share2, CheckCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import AiReadingLoader from '@/components/ui/ai-reading-loader';
import SmartBrainIcon from '@/components/chatbot/SmartBrainIcon';
import { SignInButton, useUser } from '@clerk/nextjs';
import { X } from 'lucide-react';


interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  citations?: any[];
}

interface RagChatbotV2Props {
  mode?: 'full' | 'widget';
  initialQuestion?: string;
}

export default function RagChatbotV2({ mode = 'full', initialQuestion }: RagChatbotV2Props) {
  const { user } = useUser();
  const recommendedQuestions = useMemo(
    () => [
      '요양급여가 뭔가요?',
      '산업재해 신청은 어떻게 하나요?',
      '휴업급여는 언제 받을 수 있나요?',
    ],
    []
  );
  const [question, setQuestion] = useState(initialQuestion || '');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const isWidget = mode === 'widget';
  const [error, setError] = useState<string | null>(null);

  const [isTimeout, setIsTimeout] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  // Guest Limit Logic
  const [guestCount, setGuestCount] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('guest_chat_count');
        if (saved) setGuestCount(parseInt(saved));
    }
  }, []);

  const handleShare = async (text: string, index: number) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: '산재 AI 상담원 답변',
          text: text,
        });
      } else {
        await navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleAsk = async (customQuestion?: string) => {
    const finalQuestion = (customQuestion ?? question).trim();
    if (finalQuestion.length < 2) {
      setError('질문을 2자 이상 입력해주세요.');
      return;
    }

    if (!user?.id) {
       if (guestCount >= 5) { // Limit reset to 5 for production
           setShowLoginModal(true);
           return;
       }
       // Increment Guest Count
       const newCount = guestCount + 1;
       setGuestCount(newCount);
       localStorage.setItem('guest_chat_count', newCount.toString());
    }

    setError(null);
    setIsTimeout(false);
    setLoading(true);
    setQuestion(customQuestion ? question : '');
    setMessages((prev) => [...prev, { role: 'user', content: finalQuestion }]);

    const controller = new AbortController();
    let timeoutId: NodeJS.Timeout | null = null;
    // 단계별 로딩 메시지 표시 (Gemini V2는 조금 더 빠를 수 있지만 UX 유지)
    // 단계별 로딩 메시지 표시 (Gemini V2는 조금 더 빠를 수 있지만 UX 유지) - 로깅 제거됨
    // stageTimeoutId logic removed

    // 로깅 생략 또는 V2로 표시 (API에서 처리됨)

    try {
      timeoutId = setTimeout(() => {
        controller.abort();
      }, 40000); // 40초 타임아웃 (V2는 파일 처리가 있을 수 있으므로 여유있게)

      console.log('[RagChatbotV2] Sending request to /api/chatbot-v2');

      const response = await fetch('/api/chatbot-v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: finalQuestion,
          sessionId: user?.id || 'guest',
          // Send full history + current question (which is already added to local state but not yet to 'messages' var in this closure)
          // Wait, 'messages' state is stale here?
          // No, I called setMessages above, but 'messages' variable is from render.
          // So I should construct the new array locally.
          messages: [...messages, { role: 'user', content: finalQuestion }]
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `서버 오류: ${response.status}`);
      }

      const data = await response.json();
      const answer = data?.result?.output;
      const citations = data?.citations;
      
      if (!answer) {
        throw new Error('응답을 받지 못했습니다.');
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: answer, citations }]);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setIsTimeout(true);
        setError('응답이 지연되고 있어요. 잠시 후 다시 시도해주세요.');
      } else {
        console.error('[RagChatbotV2] Error', err);
        setError(err.message || '챗봇 응답 생성 중 오류가 발생했습니다.');
      }
      setMessages((prev) => prev.slice(0, -1)); // 실패 시 user 메시지 제거
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  // 마크다운 변환 함수 (기존과 동일 + 링크 버튼 스타일링 추가)
  const markdownToHtml = (text: string): string => {
    let html = text;
    // ... 기존 변환 로직 복사 ...
    // 마크다운 라이브러리를 쓰지 않고 정규식으로 처리하는 기존 방식 유지
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-primary">$1</strong>');
    
    // [링크명](/주소) 형태의 내부 링크를 버튼 스타일로 변환
    html = html.replace(
      /\[(.*?)\]\((.*?)\)/g, 
      (match, label, url) => {
        // 외부 링크는 기존대로 A 태그 (target blank)
        if (url.startsWith('http')) {
            return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline inline-flex items-center gap-0.5">${label}<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></a>`;
        }
        // 내부 링크는 버튼 스타일로 강조
        return `<a href="${url}" class="inline-flex items-center gap-2 px-4 py-2 my-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-all duration-200 font-semibold border border-blue-200 shadow-sm group decoration-0"><span class="bg-white p-1 rounded-full group-hover:scale-110 transition-transform"><svg class="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg></span>${label}<svg class="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></a>`;
      }
    );
    
    const lines = html.split('\n');
    const processedLines: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('### ')) {
            processedLines.push(`<h3 class="text-lg font-semibold mt-4 mb-2 text-primary">${line.substring(4)}</h3>`);
            continue;
        }
        if (line.startsWith('## ')) {
            processedLines.push(`<h2 class="text-xl font-bold mt-5 mb-3 text-primary">${line.substring(3)}</h2>`);
            continue;
        }
        if (line.startsWith('> ')) {
            processedLines.push(`<blockquote class="border-l-4 border-primary/30 pl-4 py-2 my-3 bg-primary/5 italic">${line.substring(2)}</blockquote>`);
            continue;
        }
        const orderedMatch = line.match(/^(\d+)\. (.*)$/);
        if (orderedMatch) {
            processedLines.push(`<li class="ml-4 mb-1 list-disc">${orderedMatch[2]}</li>`);
            continue;
        }
        if (line.startsWith('- ') || line.startsWith('* ')) {
            processedLines.push(`<li class="ml-4 mb-1 list-disc">${line.substring(2)}</li>`);
            continue;
        }
        if (line.length > 0) {
            processedLines.push(`<p class="mb-2">${line}</p>`);
        } else {
            processedLines.push('<br />');
        }
    }
    return processedLines.join('');
  };

  return (
    <div className={`bg-white/50 backdrop-blur-xl ${isWidget ? 'p-4 h-full flex flex-col' : 'p-4 sm:p-8 md:p-10'}`} role="region" aria-label="산재 상담 챗봇 V2">
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {recommendedQuestions.map((item) => (
            <button
              key={item}
              type="button"
              className={`text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[var(--border-light)] bg-gray-50 text-foreground hover:bg-primary/10 hover:border-primary transition-colors duration-200 ${isWidget ? 'whitespace-nowrap' : ''}`}
              onClick={() => handleAsk(item)}
              disabled={loading}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className={`space-y-4 sm:space-y-6 mb-4 sm:mb-6 overflow-y-auto pr-2 ${isWidget ? 'flex-1 min-h-0' : 'max-h-[60dvh] sm:max-h-[500px] md:max-h-[600px]'}`}>
        {messages.length === 0 ? (
          <div className={`text-center space-y-8 ${isWidget ? 'py-10' : 'py-16 sm:py-24'}`}>
            <div className="flex justify-center">
              <SmartBrainIcon className={`${isWidget ? 'w-20 h-20' : 'w-32 h-32 sm:w-48 sm:h-48'}`} />
            </div>
            <div className="space-y-3">
              <h2 className={`${isWidget ? 'text-xl' : 'text-2xl sm:text-3xl'} font-black text-gray-900 tracking-tight`}>
                똑똑한 산재 AI 비서
              </h2>
              <p className={`text-gray-500 font-medium max-w-md mx-auto leading-relaxed ${isWidget ? 'text-xs' : ''}`}>
                24시간 언제나 곁에서 대기하고 있습니다.<br />
                궁금한 산재 정보를 지금 바로 물어보세요!
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
              <div className={`inline-block max-w-[85%] sm:max-w-[80%] px-5 py-4 ${
                  msg.role === 'user'
                    ? 'bg-[#14532d] text-white rounded-[2rem] rounded-tr-sm shadow-lg'
                    : 'bg-white border border-gray-100 text-gray-800 rounded-[2rem] rounded-tl-sm shadow-sm'
                }`}>
                {msg.role === 'assistant' ? (
                  <>
                    <div className="prose prose-sm sm:prose-base max-w-none" dangerouslySetInnerHTML={{ __html: markdownToHtml(msg.content) }} />
                    
                    {/* 인용구(Citations) 및 공유하기 섹션 */}
                    <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-end gap-4">
                      <div className="flex-1">
                        {msg.citations && msg.citations.length > 0 && (
                          <>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100 flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                문서 기반 답변 (신뢰도 높음)
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {msg.citations.map((cite, idx) => {
                                // Find metadata by koreanTitle matching or exact title match
                                // Since we improved 'getKoreanTitle', cite.title is already the friendly name.
                                // We need to find the entry in RAG_DOCUMENTS to get the URL.
                                // Reverse lookup or just finding by koreanTitle might be needed if cite.title is just the string.
                                // NOTE: cite object from API route has { title, uri, originalTitle }.
                                // cit.title is ALREADY the koreanTitle.
                                
                                // Let's try to find the URL. We can export `RAG_DOCUMENTS` to client or it is already there?
                                // RAG_DOCUMENTS is in 'lib/constants/rag-metadata' and is constant.
                                
                                // ISSUE: RagChatbotV2 is a Client Component. It can import RAG_DOCUMENTS.
                                // We need to find the matching entry.
                                // The keys in RAG_DOCUMENTS are the "Display Name" (e.g. 'guide2025.pdf').
                                // The API already converted it to Korean Title.
                                // We might need to pass the 'originalTitle' (Display Name) from the API.
                                // Check api/chatbot-v2/route.ts: it pushes { title, uri, originalTitle }.
                                // So cite.originalTitle should hold the key!
                                
                                // Import RAG_DOCUMENTS at top of file first? No, I can't add imports with replace_file_content easily without context.
                                // But I can assume it might be needed. 
                                // Actually, I should check if I can add imports. 
                                // I will use `view_file` first to check imports.
                                
                                return (
                                  <a 
                                    key={idx} 
                                    href={cite.downloadUrl || "#"} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className={`text-xs text-gray-600 bg-white border border-gray-200 px-2 py-1 rounded-md shadow-sm flex items-center gap-1.5 hover:bg-gray-50 transition-colors ${cite.downloadUrl ? 'cursor-pointer hover:border-blue-300 hover:text-blue-600' : 'cursor-default'}`}
                                    onClick={(e) => !cite.downloadUrl && e.preventDefault()}
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                    {cite.title || "관련 문서"}
                                    {cite.downloadUrl && <Download className="w-3 h-3 text-gray-400" />}
                                  </a>
                                );
                              })}
                            </div>
                          </>
                        )}
                      </div>
                      
                      {/* 공유하기 버튼 */}
                      <button 
                        onClick={() => handleShare(msg.content, index)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-lg text-xs font-medium transition-colors border border-gray-200"
                        title="답변 공유하기"
                      >
                        {copiedIndex === index ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                            <span className="text-green-600">복사됨</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-3.5 h-3.5" />
                            <span>공유</span>
                          </>
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-sm sm:text-base font-medium whitespace-pre-wrap">{msg.content}</p>
                )}
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="text-left">
            <div className="inline-block bg-white/50 border border-[var(--border-light)] rounded-[2rem] p-6 backdrop-blur-sm shadow-sm">
              <AiReadingLoader />
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm sm:text-base text-red-800">{error}</p>
        </div>
      )}

      {isTimeout && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm sm:text-base text-yellow-800">응답이 지연되고 있습니다.</p>
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); handleAsk(); }} className={`relative ${isWidget ? 'pt-2' : 'pt-6'}`}>
        <div className="relative group">
          <Textarea
            placeholder="산재 관련 질문을 입력해주세요..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAsk();
              }
            }}
            disabled={loading}
            className={`w-full bg-white border-gray-200 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 rounded-3xl p-6 pr-20 text-base font-medium resize-none shadow-sm transition-all ${isWidget ? 'min-h-[80px] pr-14' : 'min-h-[100px] sm:min-h-[120px]'}`}
            aria-label="질문 입력"
          />
          <Button
            type="submit"
            disabled={loading || question.trim().length < 2}
            className={`absolute right-4 bottom-4 rounded-2xl bg-[#14532d] hover:bg-[#114023] text-white shadow-lg transition-all active:scale-95 ${isWidget ? 'h-9 w-9 right-3 bottom-3' : 'h-12 w-12'}`}
            aria-label="질문 전송"
          >
            {loading ? <Loader2 className={`animate-spin ${isWidget ? 'w-4 h-4' : 'w-5 h-5'}`} /> : <Send className={`${isWidget ? 'w-4 h-4' : 'w-5 h-5'}`} />}
          </Button>
        </div>
        {!isWidget && (
            <p className="text-center text-xs text-gray-400 mt-3 font-medium">
            AI 챗봇의 답변은 부정확할 수 있으며, 법적 효력이 없습니다.
            </p>
        )}
      </form>

      {/* Login Requirement Modal */}
      {/* Login Requirement Modal - Usage of Portal to escape parent stacking context */}
      {showLoginModal && mounted && createPortal(
        <>
        <div className="fixed inset-0 z-[9990] bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" />
        <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-full max-w-sm p-4">
            <div className="bg-white rounded-[2rem] p-8 w-full shadow-2xl scale-100 animate-in zoom-in-95 duration-200 relative">
                <button 
                    onClick={() => setShowLoginModal(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="text-center space-y-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                         <SmartBrainIcon className="w-10 h-10 text-green-700" />
                    </div>
                    
                    <div className="space-y-2">
                        <h3 className="text-xl font-black text-gray-900">무료 체험이 종료되었습니다</h3>
                        <p className="text-gray-600 font-medium text-sm leading-relaxed">
                            로그인하고 <strong>무제한 AI 상담</strong>과<br/>
                            <strong>나에게 맞는 산재 정보</strong>를 확인해보세요!
                        </p>
                    </div>

                    <div className="pt-2">
                        <SignInButton mode="modal">
                            <Button size="lg" className="w-full text-base font-bold bg-[#14532d] hover:bg-[#114023] h-12 rounded-xl text-white shadow-lg shadow-green-900/20">
                                3초 만에 시작하기
                            </Button>
                        </SignInButton>
                        <button 
                            onClick={() => setShowLoginModal(false)}
                            className="mt-4 text-xs text-gray-400 hover:text-gray-600 font-medium underline underline-offset-4"
                        >
                            나중에 할게요
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </>,
        document.body
      )}
    </div>
  );
}
