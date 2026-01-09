'use client';

import { motion } from 'framer-motion';

export default function WarmHeartIcon() {
  return (
    <div className="relative flex items-center justify-center p-8">
      {/* 바깥쪽 부드러운 빛의 물결 (Outer Glow & Waves) */}
      <motion.div
        className="absolute w-40 h-40 rounded-full bg-rose-100/50"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.1, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-32 h-32 rounded-full bg-amber-100/40"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.4, 0.1, 0.4],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* 동적인 입자 포인트 (Floating Particles) */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-rose-300"
          animate={{
            x: [0, (i % 2 === 0 ? 30 : -30) * Math.random(), 0],
            y: [0, (i % 2 === 0 ? -40 : 40) * Math.random(), 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}

      {/* 메인 따뜻한 하트 (Warm Heart) */}
      <motion.div
        className="relative z-10"
        animate={{
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 하트 그림자/Glow */}
          <defs>
            <filter id="heartShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
              <feOffset dx="0" dy="1" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.3" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
          </defs>

          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="url(#heartGradient)"
            filter="url(#heartShadow)"
          />
        </svg>

        {/* 24/7 배지 - 따뜻한 느낌 강조 */}
        <motion.div
          className="absolute -top-1 -right-4 bg-amber-400 text-[10px] font-bold text-amber-900 px-1.5 py-0.5 rounded-full shadow-sm border border-amber-200"
          animate={{
            y: [0, -2, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          WE CARE
        </motion.div>
      </motion.div>

      {/* "따뜻한 마음으로 기다리고 있어요" 텍스트 */}
      <motion.div
        className="absolute -bottom-6 flex flex-col items-center"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <span className="text-sm font-medium text-rose-500/80">Warm Heart Counselor</span>
        <div className="flex gap-1 mt-1">
          <motion.div 
            className="w-1 h-1 rounded-full bg-rose-300" 
            animate={{ opacity: [0.2, 1, 0.2] }} 
            transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
          />
          <motion.div 
            className="w-1 h-1 rounded-full bg-rose-300" 
            animate={{ opacity: [0.2, 1, 0.2] }} 
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
          />
          <motion.div 
            className="w-1 h-1 rounded-full bg-rose-300" 
            animate={{ opacity: [0.2, 1, 0.2] }} 
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }}
          />
        </div>
      </motion.div>
    </div>
  );
}
