'use client';

import React from 'react';

interface Props {
  currentStage: number;
  onChangeStage: (stage: number) => void;
  orientation?: 'horizontal' | 'vertical';
}

const stages = [
  { id: 1, title: '사고/발병', subtitle: '산재 승인' },
  { id: 2, title: '치료 중', subtitle: '요양 급여' },
  { id: 3, title: '치료 종결', subtitle: '장해 보상' },
  { id: 4, title: '직업 복귀', subtitle: '재활/복직' },
  { id: 5, title: '사망', subtitle: '유족 급여' },
];

export default function CompensationTimeline({ currentStage, onChangeStage, orientation = 'horizontal' }: Props) {
  const isVertical = orientation === 'vertical';

  return (
    <div className={`w-full ${isVertical ? 'h-full' : 'max-w-4xl mx-auto'} px-4 py-4 md:py-8`}>
      <div className="relative">
        {/* Connector Line Base */}
        <div className={`
            absolute bg-gray-200 rounded-full -z-10
            ${isVertical 
              ? 'left-6 top-6 bottom-6 w-1 h-[calc(100%-48px)]' 
              : 'hidden md:block top-6 left-0 w-full h-1'
            }
        `} />

        {/* Connector Line Progress */}
        <div 
           className={`
             absolute bg-primary rounded-full -z-10 transition-all duration-500 ease-in-out
             ${isVertical 
               ? 'left-6 top-6 w-1' 
               : 'hidden md:block top-6 left-0 h-1'
             }
           `}
           style={isVertical 
             ? { height: `${((currentStage - 1) / (stages.length - 1)) * 100}%`, maxHeight: 'calc(100% - 48px)' }
             : { width: `${((currentStage - 1) / (stages.length - 1)) * 100}%` }
           }
         />

        <div className={`flex ${isVertical ? 'flex-col gap-10' : 'flex-col md:flex-row justify-between items-center md:items-start gap-8 md:gap-0'}`}>
          {stages.map((stage) => {
            const isActive = currentStage === stage.id;
            const isCompleted = currentStage > stage.id;

            return (
              <button
                key={stage.id}
                onClick={() => onChangeStage(stage.id)}
                className={`group focus:outline-none text-left transition-all duration-300 w-full
                  ${isVertical 
                    ? 'grid grid-cols-[48px_1fr] gap-6 items-center' 
                    : 'flex flex-col md:flex-row items-center gap-4'
                  }
                `}
              >
                {/* Circle Container */}
                <div className="relative flex-shrink-0 w-12 h-12">
                  <div
                    className={`
                      absolute inset-0 flex items-center justify-center w-full h-full rounded-full border-[3px] transition-all duration-300 z-10 bg-white
                      ${isActive 
                        ? 'border-primary text-primary shadow-lg ring-4 ring-primary/10 scale-105' 
                        : isCompleted 
                          ? 'bg-primary border-primary text-white' 
                          : 'border-gray-200 text-gray-400 group-hover:border-gray-300 group-hover:bg-gray-50'
                      }
                    `}
                  >
                    {isCompleted ? (
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="font-bold text-lg font-sans">{stage.id}</span>
                    )}
                  </div>
                  
                  {/* Active Ripple */}
                  {isActive && (
                    <div className="absolute inset-0 -m-1 rounded-full border-2 border-primary animate-ping opacity-30" />
                  )}
                </div>

                {/* Text Label */}
                <div className={`transition-opacity duration-300 ${isVertical ? '' : 'text-center md:text-left'}`}>
                  <span className={`text-lg font-bold block mb-0.5 font-brand ${isActive ? 'text-primary' : 'text-gray-900 group-hover:text-gray-700'}`}>
                    {stage.title}
                  </span>
                  <span className={`text-sm block font-medium ${isActive ? 'text-primary/80' : 'text-gray-500'}`}>
                    {stage.subtitle}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
