"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, FileText, MessageSquareText } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 반응형 네비게이션 컴포넌트
 * 
 * 화면 크기에 따라 자동으로 네비게이션 구조를 변경합니다:
 * - 모바일 (< 768px): 하단 탭 바
 * - 데스크톱 (≥ 1024px): 상단 네비게이션
 * - 태블릿 (768px ~ 1023px): 하이브리드 레이아웃
 */
const ResponsiveNavigation = () => {
  const pathname = usePathname();

  const tabs = [
    {
      href: "/hospitals",
      label: "병원 찾기",
      icon: MapPin,
    },
    {
      href: "/documents",
      label: "서류 안내",
      icon: FileText,
    },
    {
      href: "/chatbot",
      label: "산재 상담",
      icon: MessageSquareText,
    },
  ];

  return (
    <>
      {/* 모바일: 하단 탭 바 (< 768px) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#FFFCF5]/98 backdrop-blur-sm border-t border-[#E8F5E9] z-50 md:hidden safe-area-inset-bottom shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="max-w-7xl mx-auto flex items-center justify-around h-16 relative">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.href || pathname?.startsWith(tab.href + "/");

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1.5 flex-1 h-full transition-all duration-200 ease-in-out relative",
                  isActive
                    ? "text-[#2F6E4F] bg-[#2F6E4F]/10"
                    : "text-[#555555] active:text-[#1C1C1E] active:scale-95"
                )}
              >
                {/* 상단 인디케이터 */}
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#2F6E4F]" />
                )}
                <Icon
                  className={cn(
                    "transition-all duration-200",
                    isActive ? "w-7 h-7 scale-110" : "w-6 h-6"
                  )}
                />
                <span className={cn(
                  "text-xs transition-all duration-200",
                  isActive ? "font-bold" : "font-medium"
                )}>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* 데스크톱: 상단 네비게이션 (≥ 1024px) */}
      <nav className="hidden lg:flex items-center gap-0 border-b border-[#E8F5E9] bg-[#FFFCF5]/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto w-full flex items-center gap-0 px-4 sm:px-6 lg:px-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.href || pathname?.startsWith(tab.href + "/");

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex items-center gap-2 px-6 py-4 transition-all duration-200 ease-in-out",
                  isActive
                    ? "text-[#2F6E4F] font-bold bg-[#2F6E4F]/15"
                    : "text-[#555555] hover:text-[#1C1C1E] hover:bg-[#F5F9F6] font-medium"
                )}
                style={isActive ? { borderBottom: '3px solid #2F6E4F' } : { borderBottom: '3px solid transparent' }}
              >
                <Icon className={cn(
                  "w-5 h-5 transition-colors duration-200",
                  isActive ? "text-[#2F6E4F]" : "text-[#555555]"
                )} strokeWidth={1.75} />
                <span className="text-sm">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* 태블릿: 하이브리드 (768px ~ 1023px) - 데스크톱 스타일 사용 */}
      <nav className="hidden md:flex lg:hidden items-center gap-0 border-b border-[#E8F5E9] bg-[#FFFCF5]/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto w-full flex items-center gap-0 px-4 sm:px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.href || pathname?.startsWith(tab.href + "/");

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 transition-all duration-200 ease-in-out",
                  isActive
                    ? "text-[#2F6E4F] font-bold bg-[#2F6E4F]/15"
                    : "text-[#555555] hover:text-[#1C1C1E] hover:bg-[#F5F9F6] font-medium"
                )}
                style={isActive ? { borderBottom: '3px solid #2F6E4F' } : { borderBottom: '3px solid transparent' }}
              >
                <Icon className={cn(
                  "w-4 h-4 transition-colors duration-200",
                  isActive ? "text-[#2F6E4F]" : "text-[#555555]"
                )} strokeWidth={1.75} />
                <span className="text-sm">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default ResponsiveNavigation;


