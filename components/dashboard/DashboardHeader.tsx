"use client";

import { AdminUser } from "@/lib/mock-admin-data";
import { Gauge, Pencil } from "lucide-react";

interface DashboardHeaderProps {
  user: AdminUser;
  onEditProfile?: () => void;
}

const STEP_NAMES = [
  "산재 신청 준비", // Step 1 (index 0 for convenience if needed, but our steps are 1-based)
  "산재 신청 및 승인", // Step 1
  "요양 및 치료",     // Step 2
  "장해 평가 및 보상", // Step 3
  "직업 복귀 및 재활"  // Step 4
];

export default function DashboardHeader({ user, onEditProfile }: DashboardHeaderProps) {
  const currentStepName = STEP_NAMES[user.currentStep] || "준비 단계";

  return (
    <div className="group relative overflow-hidden bg-gradient-to-br from-[#effcf6] via-white to-white rounded-none sm:rounded-[2rem] px-6 pt-10 pb-8 sm:p-8 border-b sm:border border-emerald-100/60 shadow-lg shadow-emerald-900/5 transition-all duration-300 hover:shadow-emerald-900/10">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-emerald-100/40 to-teal-50/0 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none opacity-60" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-50/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 lg:gap-12">
        <div className="flex-1">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="px-3 py-1 rounded-full bg-white/80 border border-emerald-100/50 text-emerald-700 text-[11px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-sm">
              Level {user.currentStep}
            </span>
            <span className="text-slate-400 text-[11px] font-medium tracking-wide">
              {new Date().toLocaleDateString()} 기준
            </span>
          </div>
          
          <h1 className="text-[28px] sm:text-3xl lg:text-[2.25rem] font-black text-slate-800 leading-[1.2] tracking-tight">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="inline-block">안녕하세요,</span>
              <button 
                onClick={onEditProfile}
                title="프로필 이름 수정하기"
                className="group/name relative inline-flex items-center text-slate-900 hover:text-emerald-700 transition-colors cursor-pointer mr-1"
              >
                <span>{user.name}님!</span>
                <Pencil className="w-5 h-5 ml-1.5 text-slate-300 opacity-0 -translate-x-2 group-hover/name:opacity-100 group-hover/name:translate-x-0 transition-all duration-300" />
                <span className="absolute bottom-1 left-0 w-full h-[3px] bg-emerald-200/30 scale-x-0 group-hover/name:scale-x-100 transition-transform origin-left rounded-full" />
              </button>
            </div>
            
            <div className="mt-2 sm:mt-1">
              <span className="text-slate-400/80 font-medium text-lg sm:text-2xl mr-2">현재</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 pb-1">
                {currentStepName}
              </span>
              <span className="text-slate-800"> 단계입니다.</span>
            </div>
          </h1>
          
          <p className="mt-5 text-[15px] sm:text-lg text-slate-500 max-w-xl leading-relaxed font-medium">
            재활과 회복에만 집중하세요. <br className="block sm:hidden" />
            복잡한 절차는 <span className="text-emerald-600 font-semibold">리워크케어</span>가 챙겨드릴게요.
          </p>
        </div>

        {/* Improved Progress Section */}
        <div className="w-full lg:w-auto min-w-[280px] bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-sm relative overflow-hidden group/card hover:bg-white/80 transition-colors">
           <div className="absolute top-0 right-0 p-3 opacity-20">
              <Gauge className="w-16 h-16 text-emerald-900 rotate-12" />
           </div>

          <div className="flex justify-between items-end mb-3 relative z-10">
            <span className="text-sm font-bold text-slate-500 flex items-center gap-1.5">
              전체 진행률
            </span>
            <span className="text-3xl font-black text-slate-800 tracking-tight">
              {user.progress}<span className="text-lg text-emerald-500 ml-0.5">%</span>
            </span>
          </div>

          <div className="h-3 bg-slate-100 rounded-full overflow-hidden relative z-10">
            <div 
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.4)] relative"
              style={{ width: `${user.progress}%` }}
            >
                <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite] w-full" />
            </div>
          </div>
          
          <div className="mt-3 flex justify-end relative z-10">
             <span className="text-[11px] font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
               완료까지 {100 - user.progress}% 남음
             </span>
          </div>
        </div>
      </div>
    </div>
  );
}
