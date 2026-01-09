"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import { FileSearch, Clock } from "lucide-react";
import { getStatisticByKeyword } from "@/lib/data/industrial-accident-statistics";

import { cn } from "@/lib/utils";

export default function ApprovalStatusCard() {
  // TODO: 실제 유저 데이터(상병)에 따라 키워드 변경 필요
  const userInjuryKeyword = "허리"; // 예시: 허리 디스크
  const stats = getStatisticByKeyword(userInjuryKeyword);

  const status = {
    probability: stats.approvalRate,
    dDay: Math.ceil(stats.avgDuration), // 평균 소요기간 사용
    description: stats.description
  };

  return (
    <Card className={cn("border-white/40 bg-white/80 backdrop-blur-md shadow-premium rounded-[2.5rem] overflow-hidden transition-all hover:shadow-premium-hover relative p-1")}>
      <CardHeader className="pb-4 pt-6 px-6 sm:px-8">
         <CardTitle className="text-xl font-bold flex items-center gap-3 text-slate-800 tracking-tight">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <FileSearch className="w-5 h-5 text-blue-500" />
            </div>
            {stats.label} 승인 정밀 분석
         </CardTitle>
         <CardDescription className="text-xs font-bold text-slate-400 mt-1">
            2023년 공단 공식 통계 기반 데이터
         </CardDescription>
      </CardHeader>
      
      <CardContent className="px-6 sm:px-8 pb-8 space-y-6">
        {/* Metric 1: Approval Rate */}
        <div className="bg-blue-50/30 p-5 rounded-[2rem] border border-blue-100/50 shadow-sm space-y-3">
            <div className="flex justify-between items-end">
                <span className="text-xs font-black text-blue-500 uppercase tracking-widest">유사 사례 승인률</span>
                <span className="text-3xl font-black text-blue-600 tracking-tighter">{status.probability}%</span>
            </div>
            <div className="w-full h-2.5 bg-white/60 rounded-full overflow-hidden border border-blue-50">
                <div 
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.3)]"
                    style={{ width: `${status.probability}%` }}
                />
            </div>
        </div>

        {/* Metric 2: Duration */}
        <div className="flex items-center justify-between p-5 bg-slate-50 rounded-[2rem] border border-slate-100/50">
             <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <Clock className="w-4 h-4 text-slate-400" />
                 </div>
                 <span className="text-sm font-bold text-slate-600">평균 심사 기간</span>
             </div>
             <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-800 tracking-tight">{status.dDay}</span>
                <span className="text-sm font-bold text-slate-400">일</span>
             </div>
        </div>
        
        <p className="text-[10px] text-slate-400 font-medium text-center leading-relaxed">
          * 상기 데이터는 통계치이며 개인별 상황에 따라 상이할 수 있습니다.
        </p>
      </CardContent>
    </Card>
  );
}
