'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import RagChatbotV2 from '@/components/rag-chatbot/RagChatbotV2';
import SimpleBotIcon from '@/components/chatbot/SimpleBotIcon';

export default function FloatingChatbotButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // isOpen 상태가 변할 때 hover 상태 초기화
  useEffect(() => {
    setIsHovered(false);
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down 100px
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) return null;

  return (
    <div 
      className={`fixed z-[9999] bottom-24 md:bottom-8 right-4 md:right-8 flex flex-col items-end gap-3 pointer-events-none transition-all duration-300
        ${isVisible || isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
      `}
    >
      {/* 
         상단 챗봇 윈도우 
         - 버튼 바로 위에 flex gap(3) 만큼 띄워서 배치
         - wrapper가 fixed이므로 윈도우도 자동으로 화면에 고정됨
      */}
      <div 
        className={`pointer-events-auto transition-all duration-300 ease-in-out origin-bottom-right
          ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4 pointer-events-none absolute bottom-0 right-0'}
          shadow-2xl rounded-[2.5rem] overflow-hidden border border-white/20 ring-1 ring-black/5 bg-white/80 backdrop-blur-xl
        `}
        style={{
           width: 'min(90vw, 400px)',
           height: 'min(550px, 70dvh)', // dvh for mobile safety
           boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1) inset'
        }}
      >
        <div className="h-full relative flex flex-col">
            {/* Header for Close */}
            <div className="absolute top-4 right-4 z-10">
                <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 bg-white/50 hover:bg-white rounded-full text-gray-500 hover:text-gray-800 transition-colors backdrop-blur-md shadow-sm border border-gray-100"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
            
            <RagChatbotV2 mode="widget" />
        </div>
      </div>

      {/* 하단 플로팅 버튼 영역 */}
      <div className="relative pointer-events-auto flex items-center justify-center">
        {/* Tooltip Label */}
        {!isOpen && (
            <div className={`absolute right-full mr-4 bg-white px-4 py-2 rounded-xl shadow-lg border border-gray-100 text-[#14532d] font-bold whitespace-nowrap transition-all duration-300 origin-right
                ${isHovered ? 'scale-100 opacity-100 translate-x-0' : 'scale-90 opacity-0 translate-x-4'}
            `}>
                무엇이든 물어보세요!
                <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-t border-r border-gray-100 rotate-45 transform"></div>
            </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`group flex items-center justify-center transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95
            ${isOpen 
                ? 'bg-gray-100 text-gray-500 w-14 h-14 rounded-full' 
                : 'bg-[#14532d] text-white w-16 h-16 md:w-20 md:h-20 rounded-full'
            }
          `}
          aria-label="AI 산재 비서 열기"
        >
          <div className="relative flex items-center justify-center w-full h-full">
              {isOpen ? (
                  <X className="w-7 h-7" />
              ) : (
                  <>
                      <SimpleBotIcon className="w-9 h-9 md:w-11 md:h-11 text-white transition-transform duration-300 group-hover:scale-110" />
                      <span className="absolute top-0 right-0 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
                      </span>
                  </>
              )}
          </div>
        </button>
      </div>
    </div>
  );
}
