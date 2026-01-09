'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, CalendarDays, ChevronRight } from 'lucide-react';
import { cn } from "@/lib/utils";

interface PaymentStatus {
  stage: 'applied' | 'reviewing' | 'scheduled' | 'paid';
  lastUpdated: string; // "2024-12-25"
  expectedDate?: string; // "2024-12-30"
}

export default function PaymentVisualizer({ status }: { status: PaymentStatus }) {
  
  // D-Day Calculation
  const getDDay = () => {
    if (!status.expectedDate) return null;
    const today = new Date();
    const target = new Date(status.expectedDate);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "오늘";
    if (diffDays > 0) return `D-${diffDays}`;
    return `D+${Math.abs(diffDays)}`;
  };

  const steps = [
    { id: 'applied', label: '신청완료' },
    { id: 'reviewing', label: '심사중' },
    { id: 'scheduled', label: '지급예정' },
    { id: 'paid', label: '지급완료' },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === status.stage);
  const dDay = getDDay();

  return (
    <Card className="w-full bg-white shadow-sm border border-[var(--border-medium)]">
      <CardHeader className="pb-3 pt-4 px-4 border-b border-[var(--border-light)]">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-slate-500" />
                <CardTitle className="text-sm font-bold text-slate-800">휴업급여 지급 현황</CardTitle>
            </div>
            {status.stage !== 'paid' && dDay && (
                <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 font-bold">
                    입금까지 {dDay}
                </Badge>
            )}
            {status.stage === 'paid' && (
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                    지급 완료됨
                </Badge>
            )}
        </div>
      </CardHeader>
      <CardContent className="pt-6 pb-6 px-2 sm:px-4">
        <div className="relative">
            {/* Progress Bar Background */}
            <div className="absolute top-3 left-0 w-full h-1 bg-slate-100 rounded-full" />
            
            {/* Active Progress Bar */}
            <div 
                className="absolute top-3 left-0 h-1 bg-blue-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
            />

            {/* Steps */}
            <div className="relative flex justify-between w-full">
                {steps.map((step, index) => {
                    const isActive = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;

                    return (
                        <div key={step.id} className="flex flex-col items-center gap-2">
                            <div 
                                className={cn(
                                    "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold z-10 border-2 transition-all duration-300",
                                    isActive 
                                        ? "bg-blue-500 border-blue-500 text-white shadow-md shadow-blue-200" 
                                        : "bg-white border-slate-200 text-slate-300"
                                )}
                            >
                                {isActive && !isCurrent ? <Check className="w-3.5 h-3.5" /> : (index + 1)}
                            </div>
                            <span className={cn(
                                "text-[10px] sm:text-xs font-medium transition-colors duration-300",
                                isActive ? "text-slate-800" : "text-slate-400",
                                isCurrent && "text-blue-600 font-bold"
                            )}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Current Status Message */}
        <div className="mt-6 p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-3">
             <div className="p-1.5 bg-white rounded-full shadow-sm">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
             </div>
             <div className="flex-1">
                <p className="text-xs text-slate-500 mb-0.5">현재 상태</p>
                <p className="text-sm font-medium text-slate-800 leading-tight">
                    {status.stage === 'applied' && "공단에 서류가 접수되었습니다."}
                    {status.stage === 'reviewing' && "담당자가 서류를 검토하고 있습니다."}
                    {status.stage === 'scheduled' && `곧 입금될 예정입니다. (${status.expectedDate || ''})`}
                    {status.stage === 'paid' && "계좌로 입금이 완료되었습니다."}
                </p>
             </div>
             <ChevronRight className="w-4 h-4 text-slate-300 self-center" />
        </div>

      </CardContent>
    </Card>
  );
}
