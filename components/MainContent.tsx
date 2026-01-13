"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface MainContentProps {
  children: React.ReactNode;
}

export default function MainContent({ children }: MainContentProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <main 
      className={cn(
        "flex-1 w-full max-w-full overflow-x-hidden min-w-0 md:pb-0",
        !isHome && "pb-16" // Hide bottom padding on home page to avoid empty whitespace
      )}
    >
      {children}
    </main>
  );
}
