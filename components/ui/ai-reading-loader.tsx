/**
 * @file ai-reading-loader.tsx
 * @description AI가 책/문서를 읽고 있는 애니메이션 로더 컴포넌트
 */

'use client';

interface AiReadingLoaderProps {
  message?: string;
}

export default function AiReadingLoader({ 
  message = "산재 챗봇이 관련 규정을 찾아보고 있어요" 
}: AiReadingLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6">
      <div className="relative w-40 h-40">
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-2xl"
        >
          {/* Defs for gradients/filters */}
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="screenGradient" x1="60" y1="60" x2="140" y2="120" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#d1fae5" />
              <stop offset="100%" stopColor="#a7f3d0" />
            </linearGradient>
            <linearGradient id="bodyGradient" x1="50" y1="50" x2="150" y2="150" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>

          {/* Floating Group */}
          <g className="animate-[bob_3s_ease-in-out_infinite]">
            
            {/* Robot Body/Head Container */}
            <rect x="50" y="40" width="100" height="90" rx="24" fill="url(#bodyGradient)" className="shadow-lg" />
            
            {/* Robot Face Screen */}
            <rect x="60" y="55" width="80" height="60" rx="16" fill="#1f2937" />
            
            {/* Eyes Container */}
            <g className="animate-[scan_2s_ease-in-out_infinite]">
              {/* Left Eye */}
              <circle cx="85" cy="85" r="8" fill="#34d399" filter="url(#glow)">
                <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
              </circle>
              {/* Right Eye */}
              <circle cx="115" cy="85" r="8" fill="#34d399" filter="url(#glow)">
                <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
              </circle>
            </g>

            {/* Scanning Beam (Light Cone) */}
            <path 
              d="M100 90 L70 150 L130 150 Z" 
              fill="url(#screenGradient)" 
              opacity="0.2" 
              className="animate-[pulse_2s_ease-in-out_infinite]"
            />

            {/* Antenna */}
            <g transform="translate(100, 40)">
              <line x1="0" y1="0" x2="0" y2="-15" stroke="#059669" strokeWidth="6" strokeLinecap="round" />
              <circle cx="0" cy="-20" r="6" fill="#fbbf24" className="animate-bounce" />
            </g>

            {/* Book (Held in front) */}
            <g transform="translate(100, 160)">
              {/* Left Page */}
              <path 
                d="M-40 -10 C-40 -10, -20 5, 0 0 V 30 C 0 30, -20 35, -40 20 Z" 
                fill="#f9fafb" 
                stroke="#e5e7eb" 
                strokeWidth="1"
              />
              {/* Right Page */}
              <path 
                d="M40 -10 C40 -10, 20 5, 0 0 V 30 C 0 30, 20 35, 40 20 Z" 
                fill="#f9fafb" 
                stroke="#e5e7eb" 
                strokeWidth="1"
              />
              {/* Book Cover/Spine */}
              <path d="M0 0 V 30" stroke="#9ca3af" strokeWidth="2" />
              <path d="M-40 20 L0 30 L40 20" fill="none" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" />

              {/* Text Lines (Moving) */}
              <g className="animate-[appear_1.5s_infinite]">
                <line x1="-30" y1="5" x2="-10" y2="10" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
                <line x1="-30" y1="12" x2="-5" y2="17" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
                <line x1="10" y1="10" x2="30" y2="5" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
                <line x1="5" y1="17" x2="30" y2="12" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
              </g>
            </g>

            {/* Hands */}
            <circle cx="50" cy="140" r="14" fill="#059669" />
            <circle cx="150" cy="140" r="14" fill="#059669" />

          </g>

          <style jsx>{`
            @keyframes bob {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-8px); }
            }
            @keyframes scan {
              0%, 100% { transform: translateX(0); }
              25% { transform: translateX(-3px); }
              75% { transform: translateX(3px); }
            }
            @keyframes appear {
              0% { opacity: 0.3; }
              50% { opacity: 1; }
              100% { opacity: 0.3; }
            }
          `}</style>
        </svg>
      </div>

      <div className="space-y-2 text-center">
        <h3 className="text-lg font-bold text-gray-900 animate-pulse">
          {message}
        </h3>
      </div>
    </div>
  );
}
