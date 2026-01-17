"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ArrowRight, Lock } from 'lucide-react';
import { SignInButton } from "@clerk/nextjs";

interface RecommendedBenefitsWidgetProps {
  currentStep: number;  // 0: Prep, 1: Application, 2: Treatment, 3: End/Rehab, 4: Return
  averageWage?: number; // Optional, if calculated
  userName?: string;
  isGuest?: boolean;
}

interface BenefitItem {
  id: string; // Legacy ID (kept for key)
  modalId: string; // The modal to open
  tabId?: string; // Optional specific tab within the modal
  question: string;
  answer: string;
}


import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Locale, dashboardTranslations } from "@/lib/i18n/config";

export function RecommendedBenefitsWidget({ currentStep, averageWage, userName, isGuest = false }: RecommendedBenefitsWidgetProps) {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>('ko');

  useEffect(() => {
    const savedLocale = localStorage.getItem('user_locale') as Locale;
    if (savedLocale && dashboardTranslations[savedLocale]) {
      setLocale(savedLocale);
    }

    const handleLocaleChange = () => {
      const updatedLocale = localStorage.getItem('user_locale') as Locale;
      if (updatedLocale && dashboardTranslations[updatedLocale]) {
        setLocale(updatedLocale);
      }
    };

    window.addEventListener('user_locale', handleLocaleChange);
    window.addEventListener('localeChange', handleLocaleChange);
    window.addEventListener('storage', handleLocaleChange);

    return () => {
      window.removeEventListener('user_locale', handleLocaleChange);
      window.removeEventListener('localeChange', handleLocaleChange);
      window.removeEventListener('storage', handleLocaleChange);
    };
  }, []);

  const t = dashboardTranslations[locale]?.benefits || dashboardTranslations['ko'].benefits;
  const headerT = dashboardTranslations[locale]?.header || dashboardTranslations['ko'].header;
  
  const displayName = (userName && userName !== '홍길동') ? 
    userName : 
    (locale === 'ko' ? '회원' : headerT.guestGreeting.replace('Hello, ', '').replace('!', ''));

  // Determine benefits based on step
  const getBenefits = () => {
    switch (currentStep) {
      case 2: // Treatment
        return {
          title: t.title,
          items: [
            { 
              id: 'TRANSPORT', 
              modalId: 'TRANSPORT',
              tabId: 'BASIC',
              question: t.items['TRANSPORT'].question,
              answer: t.items['TRANSPORT'].answer
            },
            { 
              id: 'TREATMENT',
              modalId: 'TREATMENT',
              tabId: 'ITEMS', // Assistive Devices Tab
              question: t.items['TREATMENT'].question, 
              answer: t.items['TREATMENT'].answer
            },
             { 
              id: 'SICK_LEAVE',
              modalId: 'SICK_LEAVE', 
              question: t.items['NURSING']?.question || '간병료', 
              answer: t.items['NURSING']?.answer || '간병인 비용 지원'
            }
          ] as BenefitItem[]
        };
      case 3: // End of Treatment
        return {
          title: t.postTreatmentTitle || "Compensation continues after treatment",
          items: [
            { 
              id: 'DISABILITY', 
              modalId: 'DISABILITY',
              question: t.items['DISABILITY']?.question || '장해급여', 
              answer: t.items['DISABILITY']?.answer || '장해 등급별 연금/일시금 지급'
            },
            { 
              id: 'NURSING', 
              modalId: 'NURSING',
              question: t.items['NURSING_POST']?.question || t.items['NURSING']?.question || '간병급여', 
              answer: t.items['NURSING_POST']?.answer || t.items['NURSING']?.answer || '간병 비용 지원'
            },
            { 
              id: 'REHAB', 
              modalId: 'REHAB',
              tabId: 'SPORTS',
              question: t.items['REHAB']?.question || '재활스포츠', 
              answer: t.items['REHAB']?.answer || '월 최대 60만원 지원'
            }
          ] as BenefitItem[]
        };
      case 4: // Return to Work (New)
        return {
          title: (t.returnTitle || 'Support items {name} should know').replace('{name}', displayName),
          items: [
             { 
              id: 'TRAINING_ALLOWANCE',
              modalId: 'REHAB',
              tabId: 'ALLOWANCE', 
              question: t.items['TRAINING_ALLOWANCE']?.question || '직업훈련수당', 
              answer: t.items['TRAINING_ALLOWANCE']?.answer || '월 지원금'
            },
             { 
              id: 'RETURN_GRANT',
              modalId: 'REHAB',
              tabId: 'GRANT', 
              question: t.items['RETURN_GRANT']?.question || '직장복귀지원금', 
              answer: t.items['RETURN_GRANT']?.answer || '월 지원금'
            },
             { 
              id: 'TRAINING_COST',
              modalId: 'REHAB',
              tabId: 'COST', 
              question: t.items['TRAINING_COST']?.question || '직업훈련비용', 
              answer: t.items['TRAINING_COST']?.answer || '1인당 최대 600만원'
            }
          ] as BenefitItem[]
        };
      default:
        return {
             title: t.defaultTitle || "지금 알아야 하는 보상이에요",
             items: [
                { 
                  id: 'TREATMENT',
                  modalId: 'TREATMENT',
                  tabId: 'BASIC',
                  question: t.items['TREATMENT']?.question || '요양급여 (병원비)',
                  answer: t.items['TREATMENT']?.answer || '치료비 전액 지원 (본인부담 0원)'
                },
                 { 
                  id: 'SICK_LEAVE',
                  modalId: 'SICK_LEAVE', 
                  question: t.items['SICK_LEAVE']?.question || '휴업급여 (생활비)', 
                  answer: t.items['SICK_LEAVE']?.answer || '평균임금의 70% 지급'
                }
             ] as BenefitItem[]
        };
    }
  };

  const benefits = getBenefits();

  const handleNavigate = (modalId: string, tabId?: string) => {
    if (isGuest) return; 
    
    let url = `/compensation/guide?modal=${modalId}`;
    if (averageWage) url += `&wage=${averageWage}`;
    if (tabId) url += `&tab=${tabId}`;
    router.push(url);
  };

  return (
    <Card className={cn("border-white/40 bg-white/80 backdrop-blur-md shadow-premium rounded-none border-x-0 sm:border sm:rounded-3xl overflow-hidden transition-all hover:shadow-premium-hover")}>
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-dashed border-slate-100 px-6 sm:px-8 pt-5 sm:pt-7">
        <div className="flex items-center gap-3">
            <span className="w-2 h-7 bg-primary rounded-full inline-block shadow-[0_4px_12px_rgba(20,83,45,0.3)]" />
            <div>
              <CardTitle className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {benefits.title}
              </CardTitle>
            </div>
        </div>
      </CardHeader>
      <CardContent className="px-6 sm:px-8 pt-5 sm:pt-6 pb-6 sm:pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {benefits.items.map((item) => (
            <div 
              key={item.id}
              onClick={() => handleNavigate(item.modalId, item.tabId)}
              className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 cursor-pointer group transition-all"
            >
              <div className="flex flex-col space-y-3">

                  <div className="space-y-1">
                     <p className="text-xl font-bold text-primary leading-tight">
                        {item.question}
                     </p>
                     <p className="text-2xl font-black text-slate-900 leading-tight">
                        {item.answer}
                     </p>
                  </div>
                  <div className="pt-2 flex justify-end">
                    <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary transition-colors">
                      <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-white transition-colors" />
                    </div>
                  </div>
              </div>
            </div>
          ))}

          {/* New "View All" Card */}
           {isGuest ? (
             <div className="rounded-2xl bg-slate-50/50 border border-slate-100 shadow-sm hover:shadow-md hover:border-primary/50 cursor-pointer group transition-all h-full"> 
               <SignInButton mode="modal">
                  <div className="p-4 sm:p-5 h-full flex flex-col justify-between">
                    <div className="space-y-1">
                      <p className="text-2xl font-black text-slate-900 leading-tight">
                          {t.viewAll}
                      </p>
                      <p className="text-xs text-slate-500 font-bold flex items-center gap-1">
                         <Lock className="w-3 h-3" /> 로그인하고 전체보기
                      </p>
                    </div>
                    <div className="pt-2 flex justify-end">
                      <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary transition-colors">
                        <ArrowRight className="w-3 h-3 text-primary group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </div>
               </SignInButton>
             </div>
           ) : (
           <div 
            onClick={() => router.push('/compensation/guide')}
            className="p-4 sm:p-5 rounded-2xl bg-slate-50/50 border border-slate-100 shadow-sm hover:shadow-md hover:border-primary/50 cursor-pointer group transition-all"
          >
            <div className="flex flex-col space-y-3 h-full justify-between">

                <div className="space-y-1">
                   <p className="text-2xl font-black text-slate-900 leading-tight">
                      {t.viewAll}
                   </p>
                </div>
                <div className="pt-2 flex justify-end">
                   <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary transition-colors">
                     <ArrowRight className="w-3 h-3 text-primary group-hover:text-white transition-colors" />
                   </div>
                </div>
            </div>
          </div>
           )}
        </div>
      </CardContent>
    </Card>
  );
}
