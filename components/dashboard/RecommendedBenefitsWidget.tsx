'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';

interface RecommendedBenefitsWidgetProps {
  currentStep: number;  // 0: Prep, 1: Application, 2: Treatment, 3: End/Rehab, 4: Return
  averageWage?: number; // Optional, if calculated
  userName?: string;
}

interface BenefitItem {
  id: string; // Legacy ID (kept for key)
  modalId: string; // The modal to open
  tabId?: string; // Optional specific tab within the modal
  question: string;
  answer: string;
}

import { cn } from "@/lib/utils";

export function RecommendedBenefitsWidget({ currentStep, averageWage, userName = "회원" }: RecommendedBenefitsWidgetProps) {
  const router = useRouter();

  // Determine benefits based on step
  const getBenefits = () => {
    switch (currentStep) {
      case 2: // Treatment
        return {
          title: "치료받는 동안 받을 수 있는 지원금이에요",
          items: [
            { 
              id: 'TRANSPORT', 
              modalId: 'TRANSPORT',
              tabId: 'BASIC',
              question: '이송비 (교통비)',
              answer: '병원 이동 교통비 지원'
            },
            { 
              id: 'TREATMENT',
              modalId: 'TREATMENT',
              tabId: 'ITEMS', // Assistive Devices Tab
              question: '재활보조기구', 
              answer: '휠체어/보청기 등 실비 지원'
            },
             { 
              id: 'SICK_LEAVE',
              modalId: 'SICK_LEAVE', 
              question: '휴업급여 (생활비)', 
              answer: '평균임금의 70% 지급'
            }
          ] as BenefitItem[]
        };
      case 3: // End of Treatment
        return {
          title: "치료가 끝나도 보상은 계속돼요",
          items: [
            { 
              id: 'DISABILITY', 
              modalId: 'DISABILITY',
              question: '장해급여 (보상금)', 
              answer: '장해 등급별 연금/일시금 지급'
            },
            { 
              id: 'NURSING', 
              modalId: 'NURSING',
              question: '간병급여 (종결 후)', 
              answer: '상시/수시 간병 비용 지원'
            },
            { 
              id: 'REHAB', 
              modalId: 'REHAB',
              tabId: 'SPORTS',
              question: '재활스포츠 지원', 
              answer: '월 최대 60만원 지원'
            }
          ] as BenefitItem[]
        };
      case 4: // Return to Work (New)
        return {
          title: `${userName}님이 알고 있어야 하는 지원 내역`,
          items: [
             { 
              id: 'TRAINING_ALLOWANCE',
              modalId: 'REHAB',
              tabId: 'ALLOWANCE', 
              question: '직업 훈련 수당', 
              answer: '월 최대 120만원 지원'
            },
             { 
              id: 'RETURN_GRANT',
              modalId: 'REHAB',
              tabId: 'GRANT', 
              question: '직장 복귀 지원금', 
              answer: '월 최대 80만원 지원'
            },
             { 
              id: 'TRAINING_COST',
              modalId: 'REHAB',
              tabId: 'COST', 
              question: '직업 훈련 비용', 
              answer: '1인당 최대 600만원'
            }
          ] as BenefitItem[]
        };
      default:
        return {
             title: "지금 알아야 하는 보상이에요",
             items: [
                { 
                  id: 'TREATMENT',
                  modalId: 'TREATMENT',
                  tabId: 'BASIC',
                  question: '요양급여 (병원비)',
                  answer: '치료비 전액 지원 (본인부담 0원)'
                },
                 { 
                  id: 'SICK_LEAVE',
                  modalId: 'SICK_LEAVE', 
                  question: '휴업급여 (생활비)', 
                  answer: '평균임금의 70% 지급'
                }
             ] as BenefitItem[]
        };
    }
  };

  const benefits = getBenefits();

  const handleNavigate = (modalId: string, tabId?: string) => {
    let url = `/compensation/guide?modal=${modalId}`;
    if (averageWage) url += `&wage=${averageWage}`;
    if (tabId) url += `&tab=${tabId}`;
    router.push(url);
  };

  return (
    <Card className={cn("border-white/40 bg-white/80 backdrop-blur-md shadow-premium rounded-[2.5rem] overflow-hidden transition-all hover:shadow-premium-hover")}>
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-emerald-50/50 px-6 sm:px-8 pt-7">
        <div className="flex items-center gap-3">
            <span className="w-2 h-7 bg-emerald-500 rounded-full inline-block shadow-[0_4px_12px_rgba(16,185,129,0.3)]" />
            <div>
              <CardTitle className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {benefits.title}
              </CardTitle>
            </div>
        </div>
      </CardHeader>
      <CardContent className="px-6 sm:px-8 pt-6 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {benefits.items.map((item) => (
            <div 
              key={item.id}
              onClick={() => handleNavigate(item.modalId, item.tabId)}
              className="p-5 rounded-[2rem] bg-white border border-slate-100/50 shadow-sm hover:shadow-md hover:border-emerald-200 cursor-pointer group transition-all"
            >
              <div className="flex flex-col space-y-3">

                  <div className="space-y-1">
                     <p className="text-xl font-black text-emerald-700 leading-tight">
                        {item.question}
                     </p>
                     <p className="text-2xl font-black text-slate-900 leading-tight">
                        {item.answer}
                     </p>
                  </div>
                  <div className="pt-2 flex justify-end">
                    <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                      <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-white transition-colors" />
                    </div>
                  </div>
              </div>
            </div>
          ))}

          {/* New "View All" Card */}
          <div 
            onClick={() => router.push('/compensation/guide')}
            className="p-5 rounded-[2rem] bg-emerald-50/30 border border-emerald-100 shadow-sm hover:shadow-md hover:border-emerald-300 cursor-pointer group transition-all"
          >
            <div className="flex flex-col space-y-3 h-full justify-between">

                <div className="space-y-1">
                   <p className="text-2xl font-black text-slate-900 leading-tight">
                      산재 보상 전체 보기
                   </p>
                </div>
                <div className="pt-2 flex justify-end">
                   <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                     <ArrowRight className="w-3 h-3 text-emerald-600 group-hover:text-white transition-colors" />
                   </div>
                </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
