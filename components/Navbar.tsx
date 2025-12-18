"use client";

import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Star, Heart } from "lucide-react";

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
    {
      href: "/counseling",
      label: "심리 상담",
    },
  ];

  return (
    <header className="sticky top-0 z-[2000] bg-primary border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-xl font-bold text-white transition-opacity duration-200 hover:opacity-90"
            style={{ fontFamily: 'Paperozi, sans-serif', fontWeight: 700 }}
          >
            <div className="w-[31px] h-[31px] rounded-full bg-white flex items-center justify-center p-0.5">
              <Image
                src="/icons/파이왈라_마크-removebg-preview.png"
                alt="리워크케어 로고"
                width={28}
                height={28}
                className="w-7 h-7 object-contain"
              />
            </div>
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
                      ? "text-white font-semibold"
                      : "text-white/80 hover:text-white"
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
                <Button className="font-medium bg-white text-primary hover:bg-white/90">로그인</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link
                href="/favorites"
                className={cn(
                  "flex items-center gap-2 text-sm transition-colors duration-200 ease-in-out",
                  pathname === "/favorites"
                    ? "text-white font-semibold"
                    : "text-white/80 hover:text-white"
                )}
              >
                <Star
                  className={cn(
                    "w-5 h-5",
                    pathname === "/favorites"
                      ? "fill-white text-white"
                      : "fill-none text-white/80"
                  )}
                  strokeWidth={pathname === "/favorites" ? 2.5 : 2}
                />
                <span className="hidden sm:inline">즐겨찾기</span>
              </Link>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 bg-pink-500"
                  }
                }}
              />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
