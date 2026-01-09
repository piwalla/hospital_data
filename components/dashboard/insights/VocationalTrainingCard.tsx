"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Briefcase, Coins, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

export default function VocationalTrainingCard() {
  return (
    <Card className={cn("border-white/40 bg-white/80 backdrop-blur-md shadow-premium rounded-[2.5rem] overflow-hidden transition-all hover:shadow-premium-hover relative p-1")}>
      <CardHeader className="pb-2 pt-6 px-6 sm:px-8">
        <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-slate-800 tracking-tight">
                      새로운 시작, 직업 재활
                  </CardTitle>
                  <CardDescription className="text-xs font-bold text-slate-400">
                      훈련 수당과 복귀 지원금을 확인하세요
                  </CardDescription>
                </div>
            </div>
            <Badge className="bg-orange-100/50 text-orange-700 hover:bg-orange-200/50 border-orange-200/50 font-bold backdrop-blur-sm">
                지원 대상
            </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-6 sm:px-8 pb-8 pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-gradient-to-br from-orange-50/50 to-white/50 p-5 rounded-[2rem] border border-white/60 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-orange-500 font-black text-[10px] uppercase tracking-widest">
                    <Coins className="w-3.5 h-3.5" /> 훈련 수당
                </div>
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900 tracking-tighter">최대 120</span>
                    <span className="text-base font-bold text-slate-400">만원/월</span>
                </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-50/50 to-white/50 p-5 rounded-[2rem] border border-white/60 shadow-sm space-y-2">
                 <div className="flex items-center gap-2 text-indigo-500 font-black text-[10px] uppercase tracking-widest">
                    <Briefcase className="w-3.5 h-3.5" /> 복귀 지원금
                </div>
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900 tracking-tighter">최대 80</span>
                    <span className="text-base font-bold text-slate-400">만원/월</span>
                </div>
            </div>
        </div>

        <div className="space-y-4">
             <Button className="w-full bg-slate-900 hover:bg-black text-white gap-2 font-black py-7 rounded-[1.5rem] shadow-premium transition-all">
                <GraduationCap className="w-5 h-5 text-orange-400" /> 내게 맞는 훈련 과정 찾기 <ArrowRight className="w-4 h-4" />
             </Button>
             <div className="text-center">
                <span className="text-[11px] font-bold text-slate-400 underline underline-offset-4 cursor-pointer hover:text-orange-500 transition-colors">
                    직장 복귀 지원금 제도 안내문 보기
                </span>
             </div>
        </div>
      </CardContent>
    </Card>
  );
}
