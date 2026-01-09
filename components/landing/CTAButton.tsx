"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CTAButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary"; // primary: Green, secondary: Outline/White
  className?: string;
}

export default function CTAButton({ href, children, variant = "primary", className }: CTAButtonProps) {
  const baseStyles = "inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold transition-all duration-200 active:scale-95";
  
  const variants = {
    primary: "bg-[#2F6E4F] text-white hover:bg-[#4ADE80] hover:text-green-900 shadow-lg shadow-green-900/20 hover:shadow-green-400/50", // Primary Green to Neon Green hover
    secondary: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm"
  };

  return (
    <Link 
      href={href} 
      className={cn(baseStyles, variants[variant], className)}
    >
      {children}
      <ArrowRight className="w-4 h-4 opacity-80" />
    </Link>
  );
}
