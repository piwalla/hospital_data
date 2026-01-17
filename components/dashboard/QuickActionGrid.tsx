"use client";


import { 
  FileText, Phone, MapPin, AlertCircle, 
  ArrowRightLeft, Scale, HeartHandshake, GraduationCap, MessageSquare, Calculator
} from "lucide-react";
import Link from "next/link";

// ... (imports remain similar, will be handled by context if needed, but for replace_file_content I need to be careful with scope. I will replace the whole component function to be safe and clean)


import { useEffect, useState } from "react";
import { Locale, dashboardTranslations } from "@/lib/i18n/config";

interface QuickActionGridProps {
  currentStep: number;
  userName?: string;
}

export default function QuickActionGrid({ currentStep, userName }: QuickActionGridProps) {
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

  const t = dashboardTranslations[locale]?.quickActions || dashboardTranslations['ko'].quickActions;
  const headerT = dashboardTranslations[locale]?.header || dashboardTranslations['ko'].header;
  
  const displayName = (userName && userName !== '홍길동') ? 
    userName : 
    (locale === 'ko' ? '회원' : headerT.guestGreeting.replace('Hello, ', '').replace('!', '')); // Removed '님' here as it is added in the template

  const getActions = () => {
    switch(currentStep) {
      case 1: // Application
        return [
          { label: t.download, icon: FileText, href: '/documents', disabled: false },
          { label: t.guide, icon: AlertCircle, href: '/timeline', disabled: false },
          { label: t.hospitals, icon: MapPin, href: '/hospitals', disabled: false },
          { label: t.calculator, icon: Calculator, href: '/calculator', disabled: false },
          { label: t.counseling, icon: HeartHandshake, href: '/counseling', disabled: false },
          { label: t.aiChat, icon: MessageSquare, href: '/chatbot-v2', disabled: false },
        ];
      case 2: // Treatment
        return [
          { label: t.hospitals, icon: MapPin, href: '/hospitals', disabled: false },
          { label: t.hospitalTransfer, icon: ArrowRightLeft, href: '/documents/hospital-transfer-application', disabled: false },
          { label: t.sickLeave, icon: FileText, href: '/documents/sick-leave-benefit-application', disabled: false },
          { label: t.calculator, icon: Calculator, href: '/calculator', disabled: false },
          { label: t.counseling, icon: HeartHandshake, href: '/counseling', disabled: false },
          { label: t.aiChat, icon: MessageSquare, href: '/chatbot-v2', disabled: false },
        ];
      case 3: // Disability
        return [
          { label: t.hospitals, icon: MapPin, href: '/hospitals', disabled: false },
          { label: t.disability, icon: FileText, href: '/documents/disability-rating-application', disabled: false },
          { label: t.inquiry, icon: Scale, href: 'https://www.comwel.or.kr/comwel/help/cyber/cyber_list.jsp?req_tp=1', disabled: false },
          { label: t.calculator, icon: Calculator, href: '/calculator', disabled: false },
          { label: t.counseling, icon: HeartHandshake, href: '/counseling', disabled: false },
          { label: t.aiChat, icon: MessageSquare, href: '/chatbot-v2', disabled: false },
        ];
      case 4: // Return
        return [
          { label: t.hospitals, icon: MapPin, href: '/hospitals', disabled: false },
          { label: t.training, icon: GraduationCap, href: '/documents/employment-support-application', disabled: false },
          { label: t.counseling, icon: HeartHandshake, href: '/counseling', disabled: false },
          { label: t.aiChat, icon: MessageSquare, href: '/chatbot-v2', disabled: false },
        ];
      default:
        return [
          { label: t.aiChat, icon: MessageSquare, href: '/chatbot-v2', disabled: false },
          { label: t.counseling, icon: HeartHandshake, href: '/counseling', disabled: false },
          { label: t.hospitals, icon: MapPin, href: '/hospitals', disabled: false },
          { label: t.calculator, icon: Calculator, href: '/calculator', disabled: false },
          { label: t.guide, icon: AlertCircle, href: '/timeline', disabled: false },
        ];
    }
  };

  const actions = getActions();

  return (
    <div className="bg-white rounded-none border-x-0 border-y sm:border sm:rounded-3xl border-slate-100 shadow-sm h-full overflow-hidden transition-all hover:shadow-md"> 
      <div className="pb-4 px-6 pt-5 sm:px-8 sm:pt-8 mb-2 sm:mb-0">

        <h3 className="text-xl sm:text-2xl font-black text-slate-900 px-1 flex items-center gap-3">
            <span className="w-2 h-7 bg-primary rounded-full inline-block shadow-[0_4px_12px_rgba(20,83,45,0.3)]" />
            {t.commonTitle ? t.commonTitle.replace('{name}', displayName) : (locale === 'ko' ? `${displayName}님께 필요한 추가 기능` : displayName)}
        </h3>
      </div>
      <div className="px-6 pb-6 sm:px-8 sm:pb-10 pt-2 sm:pt-4">
        <div className="grid grid-cols-3 gap-x-4 gap-y-8 sm:gap-6">
            {actions.map((action, idx) => {
              if (action.disabled) {
                return (
                  <div key={idx} className="flex flex-col items-center gap-3 cursor-not-allowed opacity-40 grayscale">
                      <div className="w-[72px] h-[72px] sm:w-[64px] sm:h-[64px] rounded-3xl flex items-center justify-center border border-slate-100 bg-slate-50 text-slate-300 relative">
                          <action.icon className="w-8 h-8 sm:w-7 sm:h-7" />
                      </div>
                      <span className="text-base sm:text-sm font-medium text-center leading-tight text-slate-300">
                          {action.label}
                      </span>
                  </div>
                );
              }
              
              return (
                <Link key={idx} href={action.href} className="flex flex-col items-center gap-3 sm:gap-4 group">
                    <div className={`w-[72px] h-[72px] sm:w-[64px] sm:h-[64px] rounded-3xl flex items-center justify-center transition-all duration-300 relative
                        bg-slate-50 border border-slate-100 text-slate-900 shadow-sm
                        group-hover:bg-primary group-hover:border-primary group-hover:text-white group-hover:shadow-[0_12px_24px_-8px_rgba(20,83,45,0.5)] group-hover:-translate-y-1.5
                    `}>
                        <action.icon className="w-8 h-8 sm:w-7 sm:h-7 stroke-[2] transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <span className="text-lg font-black text-center leading-tight text-slate-800 transition-colors duration-200 group-hover:text-primary">
                        {action.label}
                    </span>
                </Link>
              );
            })}
        </div>
      </div>
    </div>
  );
}
