"use client";

import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

const Navbar = () => {
  const pathname = usePathname();

  const tabs = [
    {
      href: "/timeline",
      label: "진행 과정",
    },
    {
      href: "/hospitals",
      label: "병원 찾기",
    },
    {
      href: "/documents",
      label: "서류 안내",
    },
    {
      href: "/chatbot",
      label: "산재 상담",
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[var(--background)]/95 backdrop-blur-sm border-b border-[var(--border-light)] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-2xl font-bold text-foreground hover:text-primary transition-colors duration-200"
            style={{ fontFamily: 'Paperozi, sans-serif', fontWeight: 700 }}
          >
            <img 
              src="/파이왈라_마크-removebg-preview.png" 
              alt="파이왈라 마크" 
              className="w-8 h-8 object-contain"
            />
            리워크케어
          </Link>
          
          {/* 네비게이션 메뉴 */}
          <nav className="hidden md:flex items-center gap-8">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href || pathname?.startsWith(tab.href + "/");

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    "text-sm transition-colors duration-200 ease-in-out",
                    isActive
                      ? "text-primary font-semibold font-brand"
                      : "text-[#555555] hover:text-[#1C1C1E]"
                  )}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex gap-4 items-center">
            <SignedOut>
              <SignInButton mode="modal">
                <Button className="font-medium">로그인</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link
                href="/favorites"
                className={cn(
                  "flex items-center gap-2 text-sm transition-colors duration-200 ease-in-out",
                  pathname === "/favorites"
                    ? "text-[#2F6E4F] font-semibold"
                    : "text-[#555555] hover:text-[#1C1C1E]"
                )}
              >
                <Star
                  className={cn(
                    "w-5 h-5",
                    pathname === "/favorites"
                      ? "fill-[#FBBF24] text-[#FBBF24]"
                      : "fill-none"
                  )}
                  strokeWidth={pathname === "/favorites" ? 2.5 : 2}
                />
                <span className="hidden sm:inline">즐겨찾기</span>
              </Link>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
