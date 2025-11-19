"use client";

import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const pathname = usePathname();

  const tabs = [
    {
      href: "/hospitals",
      label: "병원 찾기",
    },
    {
      href: "/documents",
      label: "서류 안내",
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E4E7E7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-2xl font-bold text-[#1C1C1E] hover:text-[#2F6E4F] transition-colors duration-200"
            style={{ fontFamily: 'Paperozi, sans-serif', fontWeight: 700 }}
          >
            <img 
              src="/Generated_Image_November_19__2025_-_4_32PM__1_-removebg-preview.png" 
              alt="Re 캐릭터" 
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
                      ? "text-[#2F6E4F] font-semibold"
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
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
