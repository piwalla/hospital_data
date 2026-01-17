"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, FileText, MessageSquareText, ListOrdered, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";
import { Locale, locales, navTranslations } from "@/lib/i18n/config";

/**
 * 반응형 네비게이션 컴포넌트 (모바일 전용)
 * 
 * 모바일 화면(< 768px)에서만 하단 탭 바를 표시합니다.
 * 데스크톱에서는 Navbar 컴포넌트의 상단 메뉴를 사용합니다.
 */
const ResponsiveNavigation = () => {
  const pathname = usePathname();

  /* Locale & Translation Logic */
  const [locale, setLocale] = React.useState<Locale>('ko');

  React.useEffect(() => {
    const stored = localStorage.getItem('user_locale');
    if (stored && locales.includes(stored as Locale)) {
      setLocale(stored as Locale);
    }

    const handleLocaleChange = () => {
      const updated = localStorage.getItem('user_locale');
      if (updated && locales.includes(updated as Locale)) {
        setLocale(updated as Locale);
      }
    };

    window.addEventListener('storage', handleLocaleChange);
    window.addEventListener('localeChange', handleLocaleChange);
    
    return () => {
      window.removeEventListener('storage', handleLocaleChange);
      window.removeEventListener('localeChange', handleLocaleChange);
    };
  }, []);

  const displayLocale = locale === 'ko' ? 'ko' : 'en';
  const t = navTranslations[displayLocale];

  const tabs = [
    {
      href: "/dashboard",
      label: t.dashboard,
      icon: LayoutDashboard,
    },
    {
      href: "/chatbot-v2",
      label: t.chatbot,
      icon: MessageSquareText,
    },
    {
      href: "/timeline",
      label: t.timeline,
      icon: ListOrdered,
    },
    {
      href: "/hospitals",
      label: t.hospitals,
      icon: MapPin,
    },
    {
      href: "/documents",
      label: t.documents,
      icon: FileText,
    },
  ];

  if (pathname === "/") return null;

  return (
    <>
      {/* 모바일 전용: 하단 탭 바 (< 768px) */}
      <nav 
        className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-200 z-[2000] md:hidden safe-area-inset-bottom shadow-[0_-4px_16px_rgba(0,0,0,0.04)]"
        data-testid="mobile-navigation"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-around h-[70px] relative px-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.href || pathname?.startsWith(tab.href + "/");

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-300 ease-in-out relative",
                  isActive
                    ? "text-emerald-600"
                    : "text-slate-400 active:scale-90"
                )}
              >
                <div className={cn(
                  "relative p-1.5 rounded-2xl transition-all duration-300",
                  isActive ? "bg-emerald-50 text-emerald-600" : ""
                )}>
                  <Icon
                    className={cn(
                      "transition-all duration-300",
                      isActive ? "w-6 h-6" : "w-6 h-6"
                    )}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {isActive && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
                  )}
                </div>
                <span className={cn(
                  "text-[10px] sm:text-xs transition-all duration-300",
                  isActive ? "font-bold text-emerald-600" : "font-medium text-slate-500"
                )}>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default ResponsiveNavigation;


