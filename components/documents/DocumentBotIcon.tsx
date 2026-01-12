"use client";



export default function DocumentBotIcon({ className }: { className?: string }) {
  // Using vectors to create a "3D-like" friendly robot
  // Primary colors will be inherited or hardcoded to match the brand (emerald/teal)
  
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="AI 서류 전문가 로봇"
    >
      <defs>
        <linearGradient id="bodyGradient" x1="100" y1="40" x2="100" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34d399" /> {/* Emerald-400 */}
          <stop offset="100%" stopColor="#059669" /> {/* Emerald-600 */}
        </linearGradient>
        <linearGradient id="screenGradient" x1="100" y1="70" x2="100" y2="130" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0f172a" /> {/* Slate-900 */}
          <stop offset="100%" stopColor="#334155" /> {/* Slate-700 */}
        </linearGradient>
        <linearGradient id="glow" x1="100" y1="0" x2="100" y2="200" gradientUnits="userSpaceOnUse">
           <stop offset="0%" stopColor="white" stopOpacity="0.4" />
           <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="10" stdDeviation="15" floodColor="#059669" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Floating Shadow */}
      <ellipse cx="100" cy="180" rx="60" ry="10" fill="#000" fillOpacity="0.1" className="animate-pulse">
        <animate attributeName="rx" values="60;50;60" dur="4s" repeatCount="indefinite" />
        <animate attributeName="fillOpacity" values="0.1;0.05;0.1" dur="4s" repeatCount="indefinite" />
      </ellipse>

      {/* Main Body/Head Group - Animates Float */}
      <g className="animate-float-slow"> 
        {/* Antenna */}
        <path d="M100 40 V 25" stroke="#059669" strokeWidth="4" strokeLinecap="round" />
        <circle cx="100" cy="25" r="5" fill="#ef4444" className="animate-pulse">
           <animate attributeName="fillOpacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
        </circle>

        {/* Head Shape */}
        <rect x="40" y="40" width="120" height="110" rx="35" fill="url(#bodyGradient)" filter="url(#shadow)" />
        
        {/* Inner Screen/Face */}
        <rect x="55" y="60" width="90" height="70" rx="20" fill="url(#screenGradient)" />
        
        {/* Eyes - Blink Animation */}
        <g fill="#0ea5e9"> {/* Sky-500 for friendly blue eyes */}
          <circle cx="80" cy="90" r="8">
             <animate attributeName="ry" values="8;0.5;8" dur="4s" repeatCount="indefinite" begin="0.5s" />
          </circle>
          <circle cx="120" cy="90" r="8">
             <animate attributeName="ry" values="8;0.5;8" dur="4s" repeatCount="indefinite" begin="0.5s" />
          </circle>
        </g>

        {/* Smile (or digital mouth) */}
        <path d="M 85 110 Q 100 118 115 110" stroke="#0ea5e9" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.8" />

        {/* Reflection/Gloss */}
        <path d="M 40 75 Q 40 40 75 40 L 125 40 Q 160 40 160 75 L 160 80 Q 160 45 125 45 L 75 45 Q 45 45 40 80 Z" fill="white" fillOpacity="0.1" />
        <ellipse cx="140" cy="55" rx="8" ry="4" fill="white" fillOpacity="0.2" transform="rotate(-30 140 55)" />

      </g>
    </svg>
  );
}
