"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import CTAButton from "./CTAButton";

import { ChevronDown } from "lucide-react";


export default function HeroSection() {
  return (
    // Removed bg-gradient-to-b to allow image to show through
    // Added w-screen and left-[calc(-50vw+50%)] to break out of parent container width
    // Added -mt-16 to counteract the global main pt-16 padding
    <section className="relative w-screen left-[calc(-50vw+50%)] min-h-[100vh] -mt-16 flex items-center justify-center overflow-hidden pt-12 md:pt-0">
      {/* Background Decor */}
      <div className="absolute inset-0 -z-10 w-full h-full overflow-hidden">
        <Image
          src="/landing/hero-handshake.png"
          alt="Warm Support and Connection Background"
          fill
          className="object-cover opacity-80"
          priority
        />
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
        {/* Increased max-w from 3xl to 5xl to reduce clustering */}
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Headlines */}
          <div className="space-y-4 md:space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight md:leading-[1.1] drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
            >
              <span className="block text-gray-300 text-xl sm:text-2xl md:text-4xl font-bold mb-2 md:mb-4 drop-shadow-sm">복잡한 산재,</span>
              혼자 감당하지 마세요.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-base sm:text-lg md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed font-semibold drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)] px-4"
            >
              누구에게 물어봐야 할지 막막하셨죠? 산재 신청부터 보상까지,<br className="hidden md:block"/>
              엉킨 실타래를 풀듯 <span className="text-[#4ADE80] font-bold">리워크케어가 차근차근 알려드릴게요.</span>
            </motion.p>
          </div>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex flex-col items-center justify-center gap-4 pt-4 md:pt-8"
          >
            {/* Primary CTA - 강조 */}
            <CTAButton href="/chatbot-v2" variant="primary" className="w-auto text-base sm:text-lg px-6 py-3 sm:px-8 sm:py-4 shadow-xl hover:shadow-2xl hover:-translate-y-0.5">
              산재 AI 무료로 사용하기
            </CTAButton>
          </motion.div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 text-white z-30 drop-shadow-md"
      >
        <ChevronDown className="w-10 h-10 animate-bounce" />
      </motion.div>
    </section>
  );
}
