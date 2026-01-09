"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionChecklistProps {
  actions: { id: string; title: string; description?: string }[];
  initialCompletedIds: string[];
}

export default function ActionChecklist({ actions, initialCompletedIds }: ActionChecklistProps) {
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set(initialCompletedIds));

  const toggleAction = (id: string) => {
    const newCompleted = new Set(completedIds);
    if (newCompleted.has(id)) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
    }
    setCompletedIds(newCompleted);
    // In a real app, we would make an API call here to persist the change
  };

  const pendingCount = actions.length - actions.filter(a => completedIds.has(a.id)).length;

  return (
    <div className="border-white/40 bg-white/80 backdrop-blur-md shadow-premium rounded-[2.5rem] flex flex-col h-full overflow-hidden transition-all hover:shadow-premium-hover relative group">
      <div className="p-6 sm:p-8 border-b border-emerald-50/30 bg-white/40 backdrop-blur-sm flex justify-between items-center relative z-10">
        <h3 className="font-exrabold text-xl text-slate-900 flex items-center gap-3 tracking-tight">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center shadow-inner">
             <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          </div>
          단계별 필수 체크리스트
        </h3>
        {pendingCount > 0 ? (
          <span className="px-3 py-1.5 rounded-full bg-slate-100/80 text-slate-600 text-sm font-black shadow-sm border border-slate-200 backdrop-blur-md">
            {pendingCount}개 남음
          </span>
        ) : (
          <span className="px-3 py-1.5 rounded-full bg-emerald-100/80 text-emerald-700 text-sm font-black shadow-sm border border-emerald-200 backdrop-blur-md flex items-center gap-1">
            <Check className="w-3 h-3" strokeWidth={4} /> 완료
          </span>
        )}
      </div>
      
      <div className="p-4 sm:p-6 overflow-y-auto flex-1 custom-scrollbar">
        {actions.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-2 shadow-inner">
               <Check className="w-8 h-8 text-slate-300" />
            </div>
            <p className="font-bold text-slate-500">현재 단계에서 확인해야 할<br/>항목이 없습니다.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {actions.map((action) => {
              const isChecked = completedIds.has(action.id);
              return (
                <li key={action.id}>
                  <button
                    onClick={() => toggleAction(action.id)}
                    className={cn(
                      "w-full text-left p-4 rounded-[1.5rem] transition-all duration-300 flex items-start gap-4 group border relative overflow-hidden",
                      isChecked 
                        ? "bg-slate-50/50 border-slate-100/60" 
                        : "bg-white hover:bg-emerald-50/30 border-white hover:border-emerald-200 shadow-sm hover:shadow-md"
                    )}
                  >
                    <div className={cn(
                      "mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300",
                      isChecked
                        ? "bg-slate-300 border-slate-300 text-white shadow-inner scale-95"
                        : "border-slate-200 bg-white group-hover:border-emerald-400 group-hover:shadow-[0_0_0_3px_rgba(16,185,129,0.1)]"
                    )}>
                      <Check className={cn("w-3.5 h-3.5 transition-transform duration-300", isChecked ? "scale-100" : "scale-0")} strokeWidth={4} />
                    </div>
                    <div className="relative z-10 w-full">
                      <span className={cn(
                        "font-bold text-base block transition-all duration-300 tracking-tight",
                        isChecked ? "text-slate-400 line-through decoration-2 decoration-slate-200" : "text-slate-800 group-hover:text-emerald-900"
                      )}>
                        {action.title}
                      </span>
                      {action.description && (
                        <span className={cn(
                          "text-sm block mt-1.5 transition-all duration-300 font-medium leading-relaxed",
                          isChecked ? "text-slate-300" : "text-slate-500 group-hover:text-slate-600"
                        )}>
                          {action.description}
                        </span>
                      )}
                    </div>
                    {!isChecked && (
                       <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                       </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
