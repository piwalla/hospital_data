"use client";


import React, { useEffect, useState } from "react";
import { AdminUser } from "@/lib/mock-admin-data";
import { getUserInjuryType, getUserRegionType, INJURY_TYPES, REGIONS } from "@/lib/data/community";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Locale, dashboardTranslations } from "@/lib/i18n/config";

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

import { SignInButton } from "@clerk/nextjs";

interface CommunityWidgetProps {
  user: AdminUser;
  isGuest?: boolean;
}

export default function CommunityWidget({ user, isGuest = false }: CommunityWidgetProps) {
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

  const t = dashboardTranslations[locale]?.communityWidget || dashboardTranslations['ko'].communityWidget;
  const headerT = dashboardTranslations[locale]?.header || dashboardTranslations['ko'].header;

  // Guest Bypass: Don't return null if guest, even if data missing
  if (!isGuest && !user.injuryPart && !user.region) return null;

  const displayName = (user.name && user.name !== '홍길동') ? 
    user.name : 
    (locale === 'ko' ? '회원' : headerT.guestGreeting.replace('Hello, ', '').replace('!', ''));

  // Logic: If guest, force demo keys. Else use user data.
  const injuryKey = isGuest ? 'fracture' : (user.injuryPart ? getUserInjuryType(user.injuryPart) : null);
  const regionKey = isGuest ? 'metropolitan' : (user.region ? getUserRegionType(user.region) : null);

  // Icon Mappings
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

  const renderItemContent = (
    icon: React.ReactNode, 
    label: string, 
    type: 'injury' | 'region' | 'anonymous'
  ) => (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100 group w-full cursor-pointer">
      <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-secondary transition-colors">
        {icon}
      </div>
      <div className="flex-1 text-left">
        <div className="text-lg font-black text-slate-800 flex items-center gap-1">
          {label}
        </div>
      </div>
      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
    </div>
  );

  return (
    <div className="bg-white rounded-none border-x-0 border-y sm:border sm:rounded-3xl border-slate-100 shadow-none sm:shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-6 sm:p-7 border-b border-slate-100 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <span className="w-2 h-7 bg-primary rounded-full inline-block shadow-[0_4px_12px_rgba(20,83,45,0.3)]" />
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
               {locale === 'ko' 
                  ? `${displayName}님을 위한 커뮤니티` 
                  : t.title.replace('{name}', displayName)
               }
            </h3>
         </div>
         {isGuest ? (
             <SignInButton mode="modal">
                <button className="text-sm text-slate-500 hover:text-primary font-medium">
                    {t.viewAll}
                </button>
             </SignInButton>
         ) : (
             <Link href="/community" className="text-sm text-slate-500 hover:text-primary font-medium">
                {t.viewAll}
             </Link>
         )}
      </div>

      <div className="p-6 sm:p-4 space-y-3 flex-1">
         {/* Injury Board */}
         {injuryKey && (
            isGuest ? (
                <SignInButton mode="modal">
                   <div className="w-full">
                      {renderItemContent(
                        renderInjuryIcon(injuryKey, "w-7 h-7"),
                        t.injuryBoard.replace('{injury}', INJURY_TYPES[injuryKey] || injuryKey),
                        'injury'
                      )}
                   </div>
                </SignInButton>
            ) : (
                <Link href={`/community/injury/${injuryKey}`} className="block">
                   {renderItemContent(
                     renderInjuryIcon(injuryKey, "w-7 h-7"),
                     t.injuryBoard.replace('{injury}', INJURY_TYPES[injuryKey] || injuryKey),
                     'injury'
                   )}
                </Link>
            )
         )}

         {/* Region Board */}
         {regionKey && (
            isGuest ? (
                <SignInButton mode="modal">
                   <div className="w-full">
                      {renderItemContent(
                        renderRegionIcon(regionKey, "w-7 h-7"),
                        t.regionBoard.replace('{region}', REGIONS[regionKey] || regionKey),
                        'region'
                      )}
                   </div>
                </SignInButton>
            ) : (
                <Link href={`/community/region/${regionKey}`} className="block">
                    {renderItemContent(
                      renderRegionIcon(regionKey, "w-7 h-7"),
                      t.regionBoard.replace('{region}', REGIONS[regionKey] || regionKey),
                      'region'
                    )}
                </Link>
            )
         )}

         {/* Anonymous Board */}
         {isGuest ? (
            <SignInButton mode="modal">
               <div className="w-full">
                   {renderItemContent(
                     <MessageSquareQuote className="w-7 h-7 text-slate-900" />,
                     "익명 게시판",
                     'anonymous'
                   )}
               </div>
            </SignInButton>
         ) : (
            <Link href="/community/anonymous" className="block">
               {renderItemContent(
                 <MessageSquareQuote className="w-7 h-7 text-slate-900" />,
                 "익명 게시판",
                 'anonymous'
               )}
            </Link>
         )}
      </div>
    </div>
  );
}
