import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { koKR } from "@clerk/localizations";

import Navbar from "@/components/Navbar";
import ResponsiveNavigation from "@/components/ResponsiveNavigation";


import Footer from "@/components/Footer";
import { SyncUserProvider } from "@/components/providers/sync-user-provider";
import FloatingChatbotButton from "@/components/chatbot/FloatingChatbotButton";
import MainContent from "@/components/MainContent";
import "./globals.css";

const description = "AI기반 산재 도우미 리워크케어에서 도와드립니다.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://hospital-data-one.vercel.app"),
  title: {
    default: "리워크케어(ReWorkCare) - 산재 근로자를 위한 필수 플랫폼",
    template: "%s | 리워크케어",
  },
  description: description,
  keywords: ["산재", "산업재해", "휴업급여", "산재병원", "요양급여", "산재신청", "근로복지공단", "리워크케어"],
  authors: [{ name: "ReWorkCare Team" }],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName: "리워크케어 (ReWorkCare)",
    title: "갑작스러운 산재, 막막하신가요? | 리워크케어",
    description: description,
    images: [
      {
        url: "/og-image.png", // public 폴더에 이미지를 추가해야 함
        width: 1200,
        height: 630,
        alt: "리워크케어 서비스 소개 이미지",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "산재 근로자를 위한 모든 정보, 리워크케어",
    description: description,
    images: ["/og-image.png"], // Twitter용 이미지
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider 
      localization={{
        ...koKR,
        signIn: {
          ...koKR.signIn,
          start: {
            ...koKR.signIn?.start,
            title: "리워크케어 이용하기",
          },
        },
        signUp: {
          ...koKR.signUp,
          start: {
            ...koKR.signUp?.start,
            title: "리워크케어 이용하기",
          },
        },
      }}
      appearance={{
        variables: {
          colorPrimary: '#14532d',
          fontFamily: '"Pretendard", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
          borderRadius: '0.5rem',
        },
        elements: {
          card: "shadow-xl border border-slate-100 rounded-2xl",
          formButtonPrimary: "bg-[#14532d] hover:bg-[#14532d]/90 text-white",
          footerActionLink: "text-[#14532d] hover:text-[#14532d]/80",
          cardLogoImage: "rounded-xl",
        }
      }}
    >
      <html lang="ko" suppressHydrationWarning>
        <head>
          <link
            rel="stylesheet"
            as="style"
            crossOrigin="anonymous"
            href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
          />
        </head>
        <body 
          className="antialiased w-full max-w-full overflow-x-hidden"
          suppressHydrationWarning={true}
        >
          <SyncUserProvider>



            <div className="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
              <Navbar />
              <ResponsiveNavigation />
              <MainContent>{children}</MainContent>
              <Footer />
              <FloatingChatbotButton />
            </div>
          </SyncUserProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
