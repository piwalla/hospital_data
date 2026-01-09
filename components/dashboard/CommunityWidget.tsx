"use client";

import { AdminUser } from "@/lib/mock-admin-data";
import { getUserInjuryType, getUserRegionType, INJURY_TYPES, REGIONS } from "@/lib/data/community";
import Link from "next/link";

import { 
  Users2, 
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

  // Icon Mappings
  const getInjuryIconComponent = (key: string | null) => {
    switch (key) {
      case 'fracture': return <Bone className="w-6 h-6 text-emerald-500" />;
      case 'nerve': return <Brain className="w-6 h-6 text-teal-500" />;
      case 'burn': return <Flame className="w-6 h-6 text-slate-500" />;
      case 'amputation': return <HelpingHand className="w-6 h-6 text-slate-500" />;
      case 'other': return <Activity className="w-6 h-6 text-emerald-500" />;
      default: return <Activity className="w-6 h-6 text-slate-400" />;
    }
  };

  const getRegionIconComponent = (key: string | null) => {
    switch (key) {
      case 'metropolitan': return <Building2 className="w-6 h-6 text-teal-500" />;
      case 'non_metropolitan': return <TentTree className="w-6 h-6 text-emerald-500" />;
      default: return <Map className="w-6 h-6 text-slate-400" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-none sm:shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <Users2 className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-bold text-slate-800">
               맞춤 커뮤니티
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
               <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                  {getInjuryIconComponent(injuryKey)}
               </div>
               <div className="flex-1">
                  <div className="text-sm font-bold text-slate-800 flex items-center gap-1">
                    {INJURY_TYPES[injuryKey]} 게시판
                  </div>
                  <div className="text-sm text-slate-500">
                    같은 부상의 동료들과 소통하기
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
               <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-teal-50 transition-colors">
                  {getRegionIconComponent(regionKey)}
               </div>
               <div className="flex-1">
                  <div className="text-sm font-bold text-slate-800 flex items-center gap-1">
                    {REGIONS[regionKey]} 게시판
                  </div>
                  <div className="text-sm text-slate-500">
                    우리 지역 정보 공유하기
                  </div>
               </div>
               <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
            </Link>
         )}

         <Link 
           href="/community/anonymous"
           className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100 group"
         >
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-slate-100 transition-colors">
               <MessageSquareQuote className="w-6 h-6 text-slate-500" />
            </div>
            <div className="flex-1">
               <div className="text-sm font-bold text-slate-800 flex items-center gap-1">
                 익명 게시판
               </div>
               <div className="text-sm text-slate-500">
                 솔직한 고민 털어놓기
               </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
         </Link>
      </div>
    </div>
  );
}
