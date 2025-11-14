"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, FileText } from "lucide-react";
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
  ];

  return (
    <>
      {/* 모바일: 하단 탭 바 (< 768px) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden safe-area-inset-bottom">
        <div className="max-w-7xl mx-auto flex items-center justify-around h-16">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.href || pathname?.startsWith(tab.href + "/");

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
                  isActive
                    ? "text-[#3478F6]"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                <Icon
                  className={cn(
                    "w-6 h-6 transition-all",
                    isActive && "scale-110"
                  )}
                />
                <span className="text-xs font-medium">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* 데스크톱: 상단 네비게이션 (≥ 1024px) */}
      <nav className="hidden lg:flex items-center gap-1 border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto w-full flex items-center gap-1 px-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.href || pathname?.startsWith(tab.href + "/");

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 transition-colors border-b-2",
                  isActive
                    ? "text-[#3478F6] border-[#3478F6] font-semibold"
                    : "text-gray-600 hover:text-gray-900 border-transparent"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* 태블릿: 하이브리드 (768px ~ 1023px) - 데스크톱 스타일 사용 */}
      <nav className="hidden md:flex lg:hidden items-center gap-1 border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto w-full flex items-center gap-1 px-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.href || pathname?.startsWith(tab.href + "/");

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-3 transition-colors border-b-2",
                  isActive
                    ? "text-[#3478F6] border-[#3478F6] font-semibold"
                    : "text-gray-600 hover:text-gray-900 border-transparent"
                )}
              >
                <Icon className="w-4 h-4" />
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


