"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function MyJourneyHero() {
  return (
    <section className="relative w-screen left-[calc(-50vw+50%)] h-[20vh] min-h-[200px] md:h-[45vh] md:min-h-[400px] -mt-16 mb-12 flex items-center justify-center overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 -z-10 w-full h-full overflow-hidden">
        {/* Journey/Guidance Background Image */}
        <Image
          src="/landing/hero-my-journey.png"
          alt="My Journey Background"
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

      <div className="container px-4 mx-auto text-center z-10">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Headlines */}
          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight drop-shadow-lg"
            >
              복잡한 산재, <span className="text-[#4ADE80]">길잡이</span>가 되어 드립니다
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-sm sm:text-lg md:text-xl text-gray-100 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-md"
            >
              리워크케어가 개인 대시보드에 정리해 드립니다.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
