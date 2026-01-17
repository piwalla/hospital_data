"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function CounselingHero() {
  return (
    <section className="relative w-screen left-[calc(-50vw+50%)] h-[20vh] min-h-[200px] md:h-[45vh] md:min-h-[400px] -mt-16 mb-12 flex items-center justify-center overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 -z-10 w-full h-full overflow-hidden">
        {/* Warm, Professional Background Image */}
        <Image
          src="/landing/hero-psych-leaf.png"
          alt="Warm Counseling Background"
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
         {/* Dark Elegant Overlay - Standarized with landing page */}
         <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      </div>

      <div className="container px-4 mx-auto text-center z-10 pt-12 md:pt-0">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Headlines */}
          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight drop-shadow-lg"
            >
              혼자 고민하지 마세요
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl text-gray-100 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-md"
            >
              산재 전문 심리 상담으로 <span className="text-[#4ADE80] font-bold">따뜻한 이야기</span>를 나눠보세요.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
