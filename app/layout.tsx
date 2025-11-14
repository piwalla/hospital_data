import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { koKR } from "@clerk/localizations";

import Navbar from "@/components/Navbar";
import ResponsiveNavigation from "@/components/ResponsiveNavigation";
import { SyncUserProvider } from "@/components/providers/sync-user-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "리워크케어(ReWorkCare) - 산재 환자 지원 플랫폼",
  description: "산재 환자를 위한 통합 지원 플랫폼 - 병원 찾기, 서류 안내",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={koKR}>
      <html lang="ko">
        <head>
          <link
            rel="stylesheet"
            as="style"
            crossOrigin="anonymous"
            href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
          />
        </head>
        <body className="antialiased">
          <SyncUserProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <ResponsiveNavigation />
              <main className="flex-1 pb-20 md:pb-0">{children}</main>
            </div>
          </SyncUserProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
