"use client";

import { Info, CheckCircle2, XCircle } from "lucide-react";
import { BOARD_GUIDELINES } from "@/lib/data/community";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface BoardNoticeProps {
  category: string;
}

export default function BoardNotice({ category }: BoardNoticeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const guidelines = BOARD_GUIDELINES[category];

  if (!guidelines) return null;

    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-8 transition-all duration-300 hover:shadow-md">
      <div 
        className="flex items-center justify-between p-5 cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-colors" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg shrink-0">
             <Info className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">
              게시판 이용 안내
            </h3>
            {!isOpen && (
              <p className="text-sm text-slate-500 line-clamp-1 mt-0.5">
                {guidelines.purpose}
              </p>
            )}
          </div>
        </div>
        <Button variant="ghost" size="sm" className="shrink-0 text-slate-400 hover:text-slate-600">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </Button>
      </div>

      {isOpen && (
        <div className="p-5 pt-2 border-t border-slate-100 bg-white animate-in slide-in-from-top-1 duration-200">
           <div className="mb-6 p-4 bg-slate-50 rounded-xl text-slate-700 text-sm leading-relaxed border border-slate-100/50">
             {guidelines.purpose}
           </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-emerald-700 flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-lg w-fit">
                <CheckCircle2 className="w-4 h-4" />
                권장하는 활동
              </h4>
              <ul className="text-sm text-slate-600 space-y-2 pl-1">
                {guidelines.allowed.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-rose-700 flex items-center gap-2 bg-rose-50 px-3 py-1.5 rounded-lg w-fit">
                <XCircle className="w-4 h-4" />
                금지하는 활동
              </h4>
              <ul className="text-sm text-slate-600 space-y-2 pl-1">
                {guidelines.forbidden.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
}
