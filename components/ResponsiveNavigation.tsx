"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, FileText, MessageSquareText, ListOrdered, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 반응형 네비게이션 컴포넌트 (모바일 전용)
 * 
 * 모바일 화면(< 768px)에서만 하단 탭 바를 표시합니다.
 * 데스크톱에서는 Navbar 컴포넌트의 상단 메뉴를 사용합니다.
 */
const ResponsiveNavigation = () => {
  const pathname = usePathname();

  const tabs = [
    {
      href: "/timeline",
      label: "진행 과정",
      icon: ListOrdered,
    },
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
    {
      href: "/counseling",
      label: "심리 상담",
      icon: Heart,
    },
  ];

  return (
    <>
      {/* 모바일 전용: 하단 탭 바 (< 768px) */}
      <nav 
        className="fixed bottom-0 left-0 right-0 bg-primary border-t border-primary/20 z-[2000] md:hidden safe-area-inset-bottom shadow-lg"
        data-testid="mobile-navigation"
      >
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
                    ? "text-primary bg-white/20"
                    : "text-white/80 active:text-white active:scale-95"
                )}
              >
                <Icon
                  className={cn(
                    "transition-all duration-200",
                    isActive ? "w-7 h-7 scale-110 text-white" : "w-6 h-6"
                  )}
                />
                <span className={cn(
                  "text-xs transition-all duration-200 text-white",
                  isActive ? "font-bold" : "font-medium"
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


