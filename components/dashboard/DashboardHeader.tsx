"use client";

import { AdminUser } from "@/lib/mock-admin-data";
import { Pencil } from "lucide-react";

interface DashboardHeaderProps {
  user: AdminUser;
  onEditProfile?: () => void;
}


import { Locale, dashboardTranslations } from "@/lib/i18n/config";
import { useEffect, useState } from "react";

export default function DashboardHeader({ user, onEditProfile }: DashboardHeaderProps) {
  const [locale, setLocale] = useState<Locale>('ko');

  useEffect(() => {
    // Initial load
    const savedLocale = localStorage.getItem('user_locale') as Locale;
    if (savedLocale && dashboardTranslations[savedLocale]) {
      setLocale(savedLocale);
    }

    // Event listener for dynamic updates
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

  const t = dashboardTranslations[locale]?.header || dashboardTranslations['ko'].header;
  
  // Adjusted currentStep logic to be safe 0-4
  const stepIndex = Math.min(Math.max(user.currentStep, 0), 4);
  const currentStepName = t.stepNames[stepIndex] || t.stepNames[0];

  return (
    <div className="group relative overflow-hidden bg-gradient-to-br from-[#e5f3eb] via-white to-white rounded-none sm:rounded-3xl px-6 pt-10 pb-8 sm:p-8 border-b sm:border border-primary/10 shadow-lg shadow-primary/5 transition-all duration-300 hover:shadow-primary/10">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-secondary/40 to-teal-50/0 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none opacity-60" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-50/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 lg:gap-12">
        <div className="flex-1">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="px-3 py-1 rounded-full bg-white/80 border border-secondary text-primary text-[11px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-sm">
              {t.level} {user.currentStep}
            </span>
            <span className="text-slate-500 text-sm font-black tracking-wide">
              {new Date().toLocaleDateString()} {t.basedOn}
            </span>
          </div>
          
          <h1 className="text-[28px] sm:text-3xl lg:text-[2.25rem] font-black text-slate-800 leading-[1.2] tracking-tight">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="inline-block">{t.greeting.replace('{name}', '').replace('님!', '').replace('!', '').replace(',', '').trim()},</span>
              <button 
                onClick={onEditProfile}
                title={t.editProfile}
                className="group/name relative inline-flex items-center text-slate-900 hover:text-primary transition-colors cursor-pointer mr-1"
              >
                <span>{(user.name && user.name !== '홍길동') ? `${user.name}${locale === 'ko' ? '님!' : '!'}` : t.guestGreeting}</span>
                <Pencil className="w-5 h-5 ml-1.5 text-slate-300 opacity-0 -translate-x-2 group-hover/name:opacity-100 group-hover/name:translate-x-0 transition-all duration-300" />
                <span className="absolute bottom-1 left-0 w-full h-[3px] bg-secondary scale-x-0 group-hover/name:scale-x-100 transition-transform origin-left rounded-full" />
              </button>
            </div>
            
            <div className="mt-2 sm:mt-1">
              <span className="text-slate-600 font-black text-lg sm:text-2xl mr-2">
                {t.status.split('{step}')[0]}
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-700 pb-1">
                {currentStepName}
              </span>
              <span className="text-slate-800">
                {t.status.split('{step}')[1]}
              </span>
            </div>
          </h1>
          
        </div>

        {/* Improved Progress Section */}
        <div className="w-full lg:w-auto min-w-[280px] bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-sm relative overflow-hidden group/card hover:bg-white/80 transition-colors">

          <div className="flex justify-between items-end mb-3 relative z-10">
            <span className="text-base font-black text-primary flex items-center gap-1.5">
              {t.allProgress}
            </span>
            <span className="text-3xl font-black text-slate-800 tracking-tight">
              {user.progress}<span className="text-lg text-primary ml-0.5">%</span>
            </span>
          </div>

          <div className="h-3 bg-slate-100 rounded-full overflow-hidden relative z-10">
            <div 
              className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(20,83,45,0.4)] relative"
              style={{ width: `${user.progress}%` }}
            >
                <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite] w-full" />
            </div>
          </div>
          
          <div className="mt-3 flex justify-end relative z-10">
             <span className="text-sm font-black text-primary bg-secondary px-3 py-1 rounded-lg border border-secondary shadow-sm">
               {t.remaining.replace('{pct}', (100 - user.progress).toString())}
             </span>
          </div>
        </div>
      </div>
    </div>
  );
}
