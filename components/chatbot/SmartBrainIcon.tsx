'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * SmartBrainIcon Component
 * 
 * An interactive, animated SVG icon representing an intelligent AI brain.
 * Features:
 * - Pulsing outer glow
 * - Rotating inner gears/nodes to signify "thinking"
 * - 24/7 availability badge
 */
const SmartBrainIcon = ({ className = "w-32 h-32" }: { className?: string }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer Pulsing Glow */}
      <motion.div
        className="absolute inset-0 bg-primary/20 rounded-full blur-2xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10"
      >
        {/* Brain Left Hemisphere */}
        <motion.path
          d="M50 85C35 85 20 75 15 55C10 35 25 15 50 15V85Z"
          fill="url(#brain-gradient-left)"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        
        {/* Brain Right Hemisphere */}
        <motion.path
          d="M50 85C65 85 80 75 85 55C90 35 75 15 50 15V85Z"
          fill="url(#brain-gradient-right)"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        />

        {/* Neural Connections (Animated dots) */}
        {[
          { cx: 35, cy: 30, delay: 0 },
          { cx: 65, cy: 40, delay: 0.4 },
          { cx: 30, cy: 55, delay: 0.8 },
          { cx: 70, cy: 65, delay: 1.2 },
          { cx: 50, cy: 50, delay: 1.6 },
        ].map((pt, i) => (
          <motion.circle
            key={i}
            cx={pt.cx}
            cy={pt.cy}
            r="2.5"
            fill="white"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0.7] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: pt.delay,
              ease: "easeInOut",
            }}
          />
        )
        )}

        {/* Central Core (Thinking Indicator) */}
        <motion.circle
          cx="50"
          cy="50"
          r="8"
          stroke="white"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />

        {/* Gradients */}
        <defs>
          <linearGradient id="brain-gradient-left" x1="15" y1="15" x2="50" y2="85" gradientUnits="userSpaceOnUse">
            <stop stopColor="#14532D" />
            <stop offset="1" stopColor="#22C55E" />
          </linearGradient>
          <linearGradient id="brain-gradient-right" x1="85" y1="15" x2="50" y2="85" gradientUnits="userSpaceOnUse">
            <stop stopColor="#166534" />
            <stop offset="1" stopColor="#4ADE80" />
          </linearGradient>
        </defs>
      </svg>

      {/* 24/7 Floating Badge */}
      <motion.div
        className="absolute -top-2 -right-2 bg-white px-2 py-0.5 rounded-full shadow-lg border border-primary/20 flex items-center gap-1"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span className="text-[10px] font-black text-primary tracking-tighter">24/7 ON</span>
      </motion.div>
    </div>
  );
};

export default SmartBrainIcon;
