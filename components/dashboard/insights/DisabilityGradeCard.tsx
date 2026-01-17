"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCheck, Stethoscope, ArrowRight } from "lucide-react";
import DisabilityGradeSimulator from "@/components/dashboard/DisabilityGradeSimulator";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { cn } from "@/lib/utils";

export default function DisabilityGradeCard() {
  const [estimatedGrade, setEstimatedGrade] = useState<number | null>(null);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  // If we already have a result (simulated local state for now)
  if (estimatedGrade) {
      return (
        <Card className={cn("border-white/40 bg-white/80 backdrop-blur-md shadow-premium rounded-none border-x-0 sm:border sm:rounded-3xl overflow-hidden transition-all hover:shadow-premium-hover relative p-1")}>
            <CardHeader className="pb-2 pt-6 px-6 sm:px-8">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl font-bold flex items-center gap-3 text-slate-800 tracking-tight">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                          <UserCheck className="w-5 h-5 text-emerald-500" />
                        </div>
                        나의 예상 장해 등급
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="px-6 sm:px-8 pb-8">
                <div className="bg-gradient-to-br from-emerald-50/50 to-white/50 p-6 rounded-[2rem] border border-white/60 shadow-sm mb-6 flex items-center justify-center">
                   <div className="text-center">
                      <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-1">분석 결과</p>
                      <div className="flex items-baseline justify-center gap-2">
                          <span className="text-5xl font-black text-emerald-600 tracking-tighter">제 {estimatedGrade}급</span>
                          <span className="text-lg font-bold text-slate-400">가능성 높음</span>
                      </div>
                   </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                    <Dialog open={isSimulatorOpen} onOpenChange={setIsSimulatorOpen}>
                        <DialogTrigger asChild>
                             <Button className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 gap-2 h-12 rounded-2xl font-bold shadow-sm">
                                <Stethoscope className="w-4 h-4" /> 다시 진단하기
                             </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl rounded-[2.5rem] border-white/40 bg-white/95 backdrop-blur-xl p-0 overflow-hidden shadow-2xl">
                            <div className="bg-slate-900 p-8 text-white">
                               <DialogTitle className="text-2xl font-black text-white">장해 등급 모의 진단</DialogTitle>
                            </div>
                            <div className="p-8">
                              <DisabilityGradeSimulator onComplete={(g) => {
                                  setEstimatedGrade(g);
                                  setIsSimulatorOpen(false);
                              }} />
                            </div>
                        </DialogContent>
                    </Dialog>
                    
                    <Button 
                        onClick={() => window.location.href = '/calculator'}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-2 h-12 rounded-2xl font-bold shadow-premium"
                    >
                        예상 보상금 확인
                    </Button>
                </div>
            </CardContent>
        </Card>
      );
  }

  // Initial State (No result yet)
  return (
    <Card className={cn("border-white/40 bg-white/80 backdrop-blur-md shadow-premium rounded-none border-x-0 sm:border sm:rounded-3xl overflow-hidden transition-all hover:shadow-premium-hover")}>
      <CardHeader className="pt-6 sm:pt-8 px-6 sm:px-8 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
             <Stethoscope className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <CardTitle className="text-2xl font-extrabold text-slate-800 tracking-tight">
                내 장해 등급은 몇 급일까?
            </CardTitle>
            <CardDescription className="text-base font-bold text-slate-400 mt-2">
                치료 종결 후 받을 수 있는 보상금을 미리 확인해보세요.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-6 sm:px-8 pb-8 pt-4">
         <Dialog open={isSimulatorOpen} onOpenChange={setIsSimulatorOpen}>
            <DialogTrigger asChild>
                <Button size="lg" className="w-full bg-slate-900 text-white hover:bg-black gap-2 shadow-premium rounded-[1.5rem] h-14 font-black transition-all">
                    1분 만에 예상 등급 확인하기 <ArrowRight className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl rounded-[2.5rem] border-white/40 bg-white/95 backdrop-blur-xl p-0 overflow-hidden shadow-2xl">
                <div className="bg-slate-900 p-8 text-white">
                    <DialogTitle className="text-2xl font-black">장해 등급 모의 진단</DialogTitle>
                </div>
                <div className="p-8">
                    <DisabilityGradeSimulator onComplete={(g) => {
                        setEstimatedGrade(g);
                        setIsSimulatorOpen(false); // Close modal to show result card
                    }} />
                </div>
            </DialogContent>
         </Dialog>
      </CardContent>
    </Card>
  );
}
