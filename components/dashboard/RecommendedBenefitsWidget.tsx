'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Stethoscope, Briefcase, HeartPulse, Activity } from 'lucide-react';

interface RecommendedBenefitsWidgetProps {
  currentStep: number;  // 0: Prep, 1: Application, 2: Treatment, 3: End/Rehab, 4: Return
  averageWage?: number; // Optional, if calculated
}

import { cn } from "@/lib/utils";

export function RecommendedBenefitsWidget({ currentStep, averageWage }: RecommendedBenefitsWidgetProps) {
  const router = useRouter();

  // Determine benefits based on step
  const getBenefits = () => {
    switch (currentStep) {
      case 2: // Treatment
        return {
          title: "치료에만 집중하세요",
          items: [
            { 
              id: 'SICK_LEAVE', 
              question: '쉬는 동안 생활비는 어떡하죠?',
              answer: '월급의 70%가 휴업급여로 나옵니다',
              icon: <Activity className="w-5 h-5 text-emerald-500" />
            },
            { 
              id: 'NURSING_TX', 
              question: '간병비도 지원되나요?', 
              answer: '가족이나 전문가 간병 비용도 지원됩니다',
              icon: <Stethoscope className="w-5 h-5 text-teal-500" />
            },
             { 
              id: 'LOAN', 
              question: '급한 생활비가 필요하면요?', 
              answer: '생계비 대부 제도를 활용할 수 있습니다',
              icon: <Briefcase className="w-5 h-5 text-slate-500" />
            }
          ]
        };
      case 3: // End of Treatment
        return {
          title: "치료 후에도 보장받으세요",
          items: [
            { 
              id: 'DISABILITY', 
              question: '몸이 예전 같지 않다면요?', 
              answer: '장해 등급에 따른 보상금이 지급됩니다',
              icon: <HeartPulse className="w-5 h-5 text-emerald-500" />
            },
            { 
              id: 'REHAB', 
              question: '다시 일하고 싶으시다면?', 
              answer: '직업 훈련과 재활 스포츠 비용을 지원합니다',
              icon: <Briefcase className="w-5 h-5 text-slate-500" />
            }
          ]
        };
      default:
        return {
             title: "치료에만 전념하는 환경",
             items: [
                { 
                  id: 'TREATMENT', 
                  question: '병원비는 직접 내야 하나요?',
                  answer: '아니요, 공단에서 병원으로 직접 지불합니다',
                  icon: <Stethoscope className="w-5 h-5 text-emerald-500" />
                },
                 { 
                  id: 'SICK_LEAVE', 
                  question: '쉬는 기간 생활비 고민?', 
                  answer: '걱정 마세요, 휴업급여 70%가 지원됩니다',
                  icon: <Activity className="w-5 h-5 text-teal-500" />
                }
             ]
        };
    }
  };

  const benefits = getBenefits();

  const handleNavigate = (modalId: string) => {
    if (averageWage) {
        router.push(`/compensation/guide?wage=${averageWage}&modal=${modalId}`);
    } else {
        router.push(`/compensation/guide?modal=${modalId}`);
    }
  };

  return (
    <Card className={cn("border-white/40 bg-white/80 backdrop-blur-md shadow-premium rounded-[2.5rem] overflow-hidden transition-all hover:shadow-premium-hover")}>
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-emerald-50/50 px-6 sm:px-8 pt-6">
        <div className="flex items-center gap-3">
            <div className="bg-emerald-50 w-10 h-10 rounded-full flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-800 tracking-tight">
                  {benefits.title}
              </CardTitle>
              <CardDescription className="text-xs font-bold text-slate-400">
                  산재 상담사와 함께하는 보상 가이드
              </CardDescription>
            </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-slate-400 hover:text-emerald-600 transition-colors font-bold text-sm group" 
          onClick={() => router.push('/compensation/guide')}
        >
          가이드 전체 보기 <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardHeader>
      <CardContent className="px-6 sm:px-8 pt-6 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {benefits.items.map((item) => (
            <div 
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className="p-5 rounded-[2rem] bg-white border border-slate-100/50 shadow-sm hover:shadow-md hover:border-emerald-200 cursor-pointer group transition-all"
            >
              <div className="flex flex-col space-y-3">
                  <div className="w-10 h-10 rounded-[1.2rem] bg-slate-50 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                     {item.icon}
                  </div>
                  <div className="space-y-1">
                     <p className="text-sm font-bold text-slate-400 group-hover:text-emerald-600 transition-colors">
                        {item.question}
                     </p>
                     <p className="text-base font-black text-slate-800 leading-tight">
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
        </div>
      </CardContent>
    </Card>
  );
}
