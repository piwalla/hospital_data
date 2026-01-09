'use client';

import React, { useState } from 'react';

interface BenefitCardProps {
  title: string;
  category: string;
  description: string;
  amount?: string | number; // 표시할 금액 텍스트
  amountLabel?: string;     // 금액 라벨 (예: "1일 지급액", "총 예상액")
  tags?: string[];
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'gray';
  children?: React.ReactNode; // 상세 내용 (테이블 등)
  isPrimary?: boolean; // 강조 카드 여부
  blurAmount?: boolean; // 금액 블러 처리 여부 (입력 유도)
}

export default function BenefitCard({
  title,
  category,
  description,
  amount,
  amountLabel = '예상 지급액',
  tags = [],
  color = 'blue',
  children,
  isPrimary = false,
  blurAmount = false,
}: BenefitCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const colorStyles = {
    blue: { border: 'border-blue-100', bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700' },
    green: { border: 'border-green-100', bg: 'bg-green-50', text: 'text-green-700', badge: 'bg-green-100 text-green-700' },
    purple: { border: 'border-purple-100', bg: 'bg-purple-50', text: 'text-purple-700', badge: 'bg-purple-100 text-purple-700' },
    orange: { border: 'border-orange-100', bg: 'bg-orange-50', text: 'text-orange-700', badge: 'bg-orange-100 text-orange-700' },
    gray: { border: 'border-gray-200', bg: 'bg-gray-50', text: 'text-gray-700', badge: 'bg-gray-100 text-gray-700' },
  };

  const style = colorStyles[color];

  return (
    <div 
      className={`relative bg-white rounded-2xl transition-all duration-300 overflow-hidden mb-6
        ${isPrimary 
          ? 'border-2 border-primary/50 ring-4 ring-primary/10 shadow-xl' 
          : `border ${style.border} shadow-sm hover:shadow-lg hover:-translate-y-1`
        }`}
    >
      {isPrimary && (
        <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl z-20">
          핵심 보상 ✨
        </div>
      )}

      <div className="p-6 md:p-7">
        <div className="flex flex-col md:flex-row justify-between items-start mb-3 gap-4">
          <div className="flex-1">
            <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold mb-2 ${style.badge}`}>
              {category}
            </span>
            <h3 className={`font-bold text-gray-900 ${isPrimary ? 'text-2xl' : 'text-xl'}`}>{title}</h3>
          </div>
          
          {amount && (
            <div className="text-right min-w-[120px]">
              <p className="text-xs text-gray-500 mb-1 font-medium">{amountLabel}</p>
              {blurAmount ? (
                <div className="relative group/blur cursor-pointer" onClick={() => (document.querySelector('input[name="averageWage"]') as HTMLElement)?.focus()}>
                    <p className={`text-xl font-extrabold ${style.text} blur-sm select-none opacity-60 transition-all group-hover/blur:blur-md`}>
                        {amount}
                    </p>
                    <div className="absolute inset-0 flex items-center justify-end">
                        <span className="text-[10px] bg-gray-800 text-white px-2 py-1 rounded-full flex items-center gap-1 shadow-sm opacity-90 group-hover/blur:opacity-100 transition-opacity whitespace-nowrap">
                           🔒 입력 필요
                        </span>
                    </div>
                </div>
              ) : (
                <p className={`font-extrabold ${style.text} ${isPrimary ? 'text-3xl' : 'text-2xl'}`}>{amount}</p>
              )}
            </div>
          )}
        </div>
        
        <p className={`text-gray-600 mb-5 leading-relaxed ${isPrimary ? 'text-base font-medium' : 'text-sm'}`}>
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {tags.map((tag, idx) => (
            <span key={idx} className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1.5 rounded-lg border border-gray-200">
              #{tag}
            </span>
          ))}
        </div>

        {/* Action / Expand */}
        {children && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`w-full text-center py-3 text-sm font-bold border-t transition-colors flex items-center justify-center gap-1
              ${isExpanded ? 'text-gray-400 border-gray-100' : `${style.text} ${style.border} hover:bg-gray-50`}
            `}
          >
            {isExpanded ? '상세 내용 접기' : '더 자세히 보기'}
            <svg className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>

      {/* Expanded Content */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className={`bg-gray-50/80 p-6 border-t ${style.border} text-sm text-gray-700 leading-relaxed`}>
          {children}
        </div>
      </div>
    </div>
  );
}
