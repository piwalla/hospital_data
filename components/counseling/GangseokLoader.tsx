'use client';

import { motion } from 'framer-motion';

export default function GangseokLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-6 space-y-6">
      <div className="relative w-20 h-20">
        {/* Vibrant Orange/Gold glow */}
        <motion.div
          className="absolute inset-0 rounded-full bg-orange-500/30 blur-sm"
          animate={{ scale: [1, 1.6, 1], opacity: [0.7, 0.2, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Animated outer ring */}
        <motion.div 
          className="absolute -inset-1 rounded-full border-2 border-dashed border-orange-400 opacity-50"
          animate={{ rotate: -360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />

        {/* Resilient Core */}
        <div className="relative w-full h-full flex items-center justify-center bg-white rounded-full shadow-lg border-2 border-orange-500 overflow-hidden">
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-orange-100/50"
            animate={{ height: ["0%", "100%", "0%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-orange-600 relative z-10">
            <motion.path 
              d="M12 18V6M12 6L8 10M12 6L16 10" 
              stroke="currentColor" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              animate={{ y: [2, -2, 2] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.path
              d="M5 19C5 19 8 16 12 16C16 16 19 19 19 19"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              animate={{ scaleX: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </svg>
        </div>
      </div>
      <div className="text-center space-y-1">
        <motion.p 
          className="text-base font-black text-orange-700 uppercase"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          강석 산재 선배
        </motion.p>
        <p className="text-xs text-orange-600 font-bold tracking-tight">깊은 공감과 함께 실질적인 응답을 준비하고 있습니다...</p>
      </div>
    </div>
  );
}
