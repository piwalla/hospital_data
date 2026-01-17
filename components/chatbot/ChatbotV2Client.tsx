'use client';

import { useState, useEffect } from 'react';
import ChatbotHero from '@/components/chatbot/ChatbotHero';
import RagChatbotV2 from '@/components/rag-chatbot/RagChatbotV2';
import { Shield, CheckCircle } from 'lucide-react';
import { Locale, chatbotTranslations } from '@/lib/i18n/config';

export default function ChatbotV2Client() {
  const [selectedLocale, setSelectedLocale] = useState<Locale>('ko');

  useEffect(() => {
    // 초기 로드 시 로컬 스토리지 확인
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('user_locale') as Locale;
      if (savedLocale) {
        setSelectedLocale(savedLocale);
      }
    }

    // 이벤트 리스너 정의
    const handleLocaleUpdate = () => {
      const updated = localStorage.getItem('user_locale') as Locale;
      if (updated) {
        setSelectedLocale(updated);
      }
    };

    // 리스너 등록
    window.addEventListener('storage', handleLocaleUpdate);
    window.addEventListener('localeChange', handleLocaleUpdate);

    return () => {
      window.removeEventListener('storage', handleLocaleUpdate);
      window.removeEventListener('localeChange', handleLocaleUpdate);
    };
  }, []);

  const handleLocaleChange = (locale: Locale) => {
    setSelectedLocale(locale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_locale', locale);
      window.dispatchEvent(new Event('localeChange'));
    }
  };

  const t = chatbotTranslations[selectedLocale];

  return (
    <>
      <ChatbotHero locale={selectedLocale} />

      <div className="relative w-screen left-[calc(-50vw+50%)] bg-[#eff2f5] min-h-[100dvh] -mt-12">
        <div className="container mx-auto px-4 sm:px-6 pb-20 pt-12 max-w-6xl">
          <div className="space-y-12">
            {/* 챗봇 메인 컨테이너 */}
            <div className="bg-white rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden ring-1 ring-black/[0.02] relative">
              <RagChatbotV2 
                currentLocale={selectedLocale} 
                onLocaleChange={handleLocaleChange} 
              />
            </div>

            {/* 하단 푸터 가이드 */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/60 backdrop-blur-sm border border-white/80 rounded-3xl p-8 shadow-sm">
                <h3 className="text-sm font-black text-blue-800 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  {t.footerSourceTitle}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  {t.footerSourceDesc}
                </p>
              </div>

              <div className="bg-white/60 backdrop-blur-sm border border-white/80 rounded-3xl p-8 shadow-sm">
                <h3 className="text-sm font-black text-amber-800 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  {t.footerLimitTitle}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  {t.footerLimitDesc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
