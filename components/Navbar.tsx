"use client";

import { SignedOut, SignInButton, SignedIn, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Star, ShieldCheck, User } from "lucide-react";

// Admin Check Component
// Admin Check Component
const AdminLink = ({ className }: { className?: string }) => {
  const { user } = useUser();
  const ADMIN_EMAIL = "highstar0301@gmail.com";
  
  if (!user) return null;
  
  const isAdmin = user.emailAddresses.some(email => email.emailAddress === ADMIN_EMAIL);
  
  if (!isAdmin) return null;

  return (
    <Link
      href="/admin"
      className={cn(
        "flex items-center gap-2 text-sm transition-colors duration-200 ease-in-out font-medium",
        className || "text-white/80 hover:text-white"
      )}
    >
      <ShieldCheck className="w-5 h-5" />
      <span className="hidden sm:inline">Admin</span>
    </Link>
  );
};

const Navbar = () => {
  const pathname = usePathname();

  const tabs = [
    {
      href: "/dashboard",
      label: "나의 여정",
    },
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
      href: "/chatbot-v2",
      label: "산재 상담",
    },
    {
      href: "/counseling",
      label: "심리 상담",
    },
  ];

  /* Scroll Detection Logic */
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Pages that should have a transparent header (Hero Section overlap)
  const isTransparentPage = pathname === "/" || pathname === "/documents" || pathname === "/hospitals" || pathname === "/timeline" || pathname === "/chatbot" || pathname === "/chatbot-v2" || pathname === "/counseling" || pathname === "/dashboard" || pathname === "/community";
  
  // Determine Header Styles based on state
  const headerClass = cn(
    "z-[2000] w-full transition-all duration-300 ease-in-out",
    isTransparentPage 
      ? (isScrolled 
          ? "fixed top-0 bg-white/70 backdrop-blur-xl shadow-sm border-b border-white/40" // TransparentPage & Scrolled (Glassmorphism)
          : "fixed top-0 bg-transparent border-transparent") // TransparentPage & Top
      : "sticky top-0 bg-primary border-b border-primary/20 shadow-sm" // Other Pages
  );

  // Text Colors
  const logoColor = (isTransparentPage && isScrolled) ? "text-gray-900" : "text-white";
  const navTextColor = (isTransparentPage && isScrolled) ? "text-gray-600 hover:text-primary" : "text-white/80 hover:text-white";
  const navActiveColor = (isTransparentPage && isScrolled) ? "text-primary font-bold" : "text-white font-bold";
  const iconColor = (isTransparentPage && isScrolled) ? "text-gray-600" : "text-white/80";
  const iconActiveColor = (isTransparentPage && isScrolled) ? "text-primary fill-primary" : "text-white fill-white";

  return (
    <header className={headerClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link 
            href="/" 
            className={cn(
              "flex items-center gap-2 text-xl font-bold transition-opacity duration-200 hover:opacity-90",
              logoColor
            )}
            style={{ fontFamily: 'Paperozi, sans-serif', fontWeight: 700 }}
          >
            {/* Logo Image */}
            <div className="relative w-8 h-8 flex items-center justify-center">
              <Image
                key="user-logo"
                src="/landing/brand-logo-removebg-preview.png"
                alt="리워크케어 로고"
                fill
                className={cn(
                  "object-contain transition-all duration-300",
                  ((isTransparentPage && !isScrolled) || !isTransparentPage) ? "brightness-0 invert" : ""
                )}
                priority
              />
            </div>
            <span className="text-sm md:text-xl">리워크케어</span>
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
                    "text-sm transition-colors duration-200 ease-in-out font-medium",
                    isActive ? navActiveColor : navTextColor
                  )}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex gap-4 items-center">
            {isMounted ? (
              <>
                <SignedOut>
                  <SignInButton>
                    <Button 
                      className={cn(
                        "font-medium transition-colors",
                        (isTransparentPage && isScrolled) 
                          ? "bg-primary text-white hover:bg-primary/90" 
                          : "bg-white text-primary hover:bg-white/90"
                      )}
                    >
                      로그인
                    </Button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  {/* MVP에서는 즐겨찾기 기능을 사용하지 않으므로 숨김 처리
                  <Link
                    href="/favorites"
                    className={cn(
                      "flex items-center gap-2 text-sm transition-colors duration-200 ease-in-out",
                      pathname === "/favorites" ? navActiveColor : navTextColor
                    )}
                  >
                    <Star
                      className={cn(
                        "w-5 h-5 transition-colors",
                        pathname === "/favorites" ? iconActiveColor : iconColor
                      )}
                      strokeWidth={pathname === "/favorites" ? 2.5 : 2}
                    />
                    <span className="hidden sm:inline">즐겨찾기</span>
                  </Link>
                  */}
                  
                  {/* Admin Link */}
                  <AdminLink className={navTextColor} />

                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8 bg-pink-500"
                      }
                    }}
                  >
                    <UserButton.MenuItems>
                      <UserButton.Link
                        label="내 정보 관리"
                        labelIcon={<User className="w-4 h-4" />}
                        href="/profile"
                      />
                    </UserButton.MenuItems>
                  </UserButton>
                </SignedIn>
              </>
            ) : (
              <div className="w-20" /> /* Placeholder to reduce shift */
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
