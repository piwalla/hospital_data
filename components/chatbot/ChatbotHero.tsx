"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Locale, chatbotTranslations } from "@/lib/i18n/config";

interface ChatbotHeroProps {
  locale?: Locale;
}

export default function ChatbotHero({ locale = 'ko' }: ChatbotHeroProps) {
  const t = chatbotTranslations[locale];

  // For Korean, we want to keep the specific highlighting
  const renderTitle = () => {
    if (locale === 'ko') {
      return (
        <>
          24시간 <span className="text-[#4ADE80]">언제나</span>, 산재 전문 상담 챗봇
        </>
      );
    }
    return t.pageHeroTitle;
  };

  return (
    <section className="relative w-screen left-[calc(-50vw+50%)] h-[20vh] min-h-[200px] md:h-[45vh] md:min-h-[400px] -mt-16 mb-12 flex items-center justify-center overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 -z-10 w-full h-full overflow-hidden">
        {/* Modern Tech Background Image */}
        <Image
          src="/landing/hero-chatbot-bubble.png"
          alt="AI Counseling Background"
          fill
          className="object-cover opacity-80"
          priority
        />
        <div 
           className="absolute inset-0 opacity-[0.15]"
           style={{ 
             backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', 
             backgroundSize: '48px 48px' 
           }}
        />
        {/* Dark Elegant Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      <div className="container px-4 mx-auto text-center z-10 pt-12 md:pt-0">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Headlines */}
          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight drop-shadow-lg"
            >
              {renderTitle()}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-sm sm:text-lg md:text-xl text-gray-100 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-md"
            >
              {t.pageHeroSubtitle}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
