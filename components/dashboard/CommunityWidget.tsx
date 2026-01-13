"use client";

import React from "react";
import { AdminUser } from "@/lib/mock-admin-data";
import { getUserInjuryType, getUserRegionType, INJURY_TYPES, REGIONS } from "@/lib/data/community";
import Link from "next/link";
import { cn } from "@/lib/utils";

import {   
  ArrowRight, 
  Bone, 
  Brain, 
  Flame, 
  HelpingHand, 
  Building2, 
  Map, 
  TentTree, 
  MessageSquareQuote,
  Activity
} from "lucide-react";

interface CommunityWidgetProps {
  user: AdminUser;
}

export default function CommunityWidget({ user }: CommunityWidgetProps) {
  if (!user.injuryPart && !user.region) return null;

  const injuryKey = user.injuryPart ? getUserInjuryType(user.injuryPart) : null;
  const regionKey = user.region ? getUserRegionType(user.region) : null;

  // Icon Mappings - Changed to return the component or a function to avoid cloneElement issues
  const renderInjuryIcon = (key: string | null, className: string) => {
    switch (key) {
      case 'fracture': return <Bone className={cn(className, "text-slate-900")} />;
      case 'nerve': return <Brain className={cn(className, "text-slate-900")} />;
      case 'burn': return <Flame className={cn(className, "text-slate-900")} />;
      case 'amputation': return <HelpingHand className={cn(className, "text-slate-900")} />;
      case 'other': return <Activity className={cn(className, "text-slate-900")} />;
      default: return <Activity className={cn(className, "text-slate-900")} />;
    }
  };

  const renderRegionIcon = (key: string | null, className: string) => {
    switch (key) {
      case 'metropolitan': return <Building2 className={cn(className, "text-slate-900")} />;
      case 'non_metropolitan': return <TentTree className={cn(className, "text-slate-900")} />;
      default: return <Map className={cn(className, "text-slate-900")} />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-none sm:shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-7 border-b border-slate-100 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <span className="w-2 h-7 bg-emerald-500 rounded-full inline-block shadow-[0_4px_12px_rgba(16,185,129,0.3)]" />
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
               {user.name}님을 위한 커뮤니티
            </h3>
         </div>
         <Link href="/community" className="text-sm text-slate-500 hover:text-emerald-600 font-medium">
            전체보기
         </Link>
      </div>

      <div className="p-4 space-y-3 flex-1">
         {injuryKey && (
            <Link 
              href={`/community/injury/${injuryKey}`}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100 group"
            >
               <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                  {renderInjuryIcon(injuryKey, "w-7 h-7")}
               </div>
               <div className="flex-1">
                  <div className="text-lg font-black text-slate-800 flex items-center gap-1">
                    {INJURY_TYPES[injuryKey]} 게시판
                  </div>
               </div>
               <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
            </Link>
         )}

         {regionKey && (
            <Link 
              href={`/community/region/${regionKey}`}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100 group"
            >
               <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-teal-50 transition-colors">
                  {renderRegionIcon(regionKey, "w-7 h-7")}
               </div>
               <div className="flex-1">
                  <div className="text-lg font-black text-slate-800 flex items-center gap-1">
                    {REGIONS[regionKey]} 게시판
                  </div>
               </div>
               <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
            </Link>
         )}

         <Link 
           href="/community/anonymous"
           className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100 group"
         >
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-slate-100 transition-colors">
               <MessageSquareQuote className="w-7 h-7 text-slate-900" />
            </div>
            <div className="flex-1">
               <div className="text-lg font-black text-slate-800 flex items-center gap-1">
                 익명 게시판
               </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
         </Link>
      </div>
    </div>
  );
}
