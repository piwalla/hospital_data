'use client';

import { motion } from 'framer-motion';

export default function MiyoungLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-6 space-y-6">
      <div className="relative w-20 h-20">
        {/* Vibrant Crimson/Rose glow */}
        <motion.div
          className="absolute inset-0 rounded-full bg-rose-500/20"
          animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
        
        {/* Nurturing core */}
        <div className="relative w-full h-full flex items-center justify-center bg-white rounded-full shadow-lg border-2 border-rose-500">
          <motion.div
            animate={{ 
              scale: [1, 1.15, 1],
              filter: ["drop-shadow(0 0 0px rgba(244,63,94,0))", "drop-shadow(0 0 8px rgba(244,63,94,0.4))", "drop-shadow(0 0 0px rgba(244,63,94,0))"]
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-rose-600">
              <path d="M19 14C20.49 12.54 21 11.11 21 9.5C21 6.46 18.54 4 15.5 4C13.83 4 12.33 4.74 11.34 5.9C10.35 4.74 8.85 4 7.18 4C4.14 4 1.68 6.46 1.68 9.5C1.68 11.11 2.5 12.54 4 14L11.34 21L19 14Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.2"/>
              <motion.path
                d="M12 11C12 11 11 12 11 13C11 14 12 15 12 15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                animate={{ pathLength: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </svg>
          </motion.div>
          {/* Saturated floating hearts */}
          <motion.div 
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-rose-500 text-lg">❤️</div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-rose-500 text-sm">✨</div>
          </motion.div>
        </div>
      </div>
      <div className="text-center space-y-1">
        <motion.p 
          className="text-base font-bold text-rose-700 italic"
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          미영 선배 보호자
        </motion.p>
        <p className="text-xs text-rose-500 font-semibold tracking-tight">당신의 아픔을 보듬으며 따뜻한 위로를 준비하고 있어요...</p>
      </div>
    </div>
  );
}
