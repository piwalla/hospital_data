'use client';

import { motion } from 'framer-motion';

export default function JungwonLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-6 space-y-6">
      <div className="relative w-20 h-20">
        {/* Multi-layered vibrant indigo pulse */}
        <motion.div
          className="absolute inset-0 rounded-full bg-indigo-500/20"
          animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-0 rounded-full bg-indigo-400/30"
          animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        />
        
        {/* Central professional core */}
        <div className="relative w-full h-full flex items-center justify-center bg-white rounded-full shadow-lg border-2 border-indigo-500">
          <motion.div 
            className="absolute inset-0 rounded-full border-t-4 border-indigo-600 border-r-transparent border-b-transparent border-l-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="flex flex-col items-center justify-center"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-indigo-600">
              <path d="M12 20V10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M18 20V4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M6 20V14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="12" cy="10" r="1.5" fill="currentColor" />
              <circle cx="18" cy="4" r="1.5" fill="currentColor" />
              <circle cx="6" cy="14" r="1.5" fill="currentColor" />
            </svg>
          </motion.div>
        </div>
      </div>
      <div className="text-center space-y-1">
        <motion.p 
          className="text-base font-bold text-indigo-700"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          정원 전문 심리상담사
        </motion.p>
        <p className="text-xs text-indigo-500 font-medium tracking-tight">당신의 이야기를 분석하고 최선의 조언을 준비 중입니다...</p>
      </div>
    </div>
  );
}
