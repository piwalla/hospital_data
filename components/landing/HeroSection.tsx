"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import CTAButton from "./CTAButton";

import { ChevronDown } from "lucide-react";


import { Locale, landingTranslations } from '@/lib/i18n/config';

export default function HeroSection({ locale = 'ko' }: { locale?: Locale }) {
  const t = landingTranslations[locale];

  return (
    // Removed bg-gradient-to-b to allow image to show through
    // Added w-screen and left-[calc(-50vw+50%)] to break out of parent container width
    // Added -mt-16 to counteract the global main pt-16 padding
    <section className="relative w-screen left-[calc(-50vw+50%)] min-h-[100dvh] -mt-16 flex items-center justify-center overflow-hidden pt-12 md:pt-0">
      {/* Background Decor */}
      <div className="absolute inset-0 -z-10 w-full h-full overflow-hidden">
        <motion.div
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.8 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative w-full h-full"
        >
          <Image
            src="/landing/hero-handshake.png"
            alt="Warm Support and Connection Background"
            fill
            className="object-cover"
            priority
          />
        </motion.div>
        <div 
           className="absolute inset-0 opacity-[0.2]"
           style={{ 
             backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', 
             backgroundSize: '48px 48px' 
           }}
        />
        {/* Dark Elegant Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      </div>

      <div className="container px-4 mx-auto text-center z-10">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Headlines */}
          <div className="space-y-4 md:space-y-8">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white leading-tight md:leading-[1.1] drop-shadow-[0_2px_15px_rgba(0,0,0,0.6)]"
            >
              <span className="block text-gray-300 text-xl sm:text-2xl md:text-5xl font-bold mb-4 md:mb-6 drop-shadow-sm opacity-90">
                {t.heroTitlePrefix}
              </span>
              
              <span className="relative inline-block">
                {/* Emphasis Glow Effect */}
                <div className="absolute -inset-x-6 -inset-y-2 bg-green-400/10 blur-3xl rounded-full -z-10 animate-pulse" />
                {t.heroTitleSuffix}
              </span>
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-base sm:text-lg md:text-3xl text-gray-200 max-w-4xl mx-auto leading-relaxed font-semibold drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)] px-4 opacity-90"
            >
              <span className="text-[#4ADE80]">
                {t.heroDescription.split('?')[0]}?
              </span>
              {t.heroDescription.split('?')[1]}
            </motion.div>
          </div>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex flex-col items-center justify-center gap-4 pt-4 md:pt-8"
          >
            <CTAButton 
              href="/chatbot-v2" 
              variant="primary" 
              className="w-auto text-base sm:text-lg md:text-2xl px-6 py-3 sm:px-12 sm:py-6 shadow-2xl hover:shadow-green-400/30 hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden"
            >
              <span className="relative z-10">{t.heroCta}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
            </CTAButton>
          </motion.div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: 2 }}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 text-white z-30 drop-shadow-md"
      >
        <ChevronDown className="w-12 h-12 animate-bounce opacity-70" />
      </motion.div>
    </section>
  );
}
