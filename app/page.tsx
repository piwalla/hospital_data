import LandingClient from "@/components/landing/LandingClient";
import StructuredData from "@/components/seo/StructuredData";
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "리워크케어 - 산재 근로자를 위한 필수 플랫폼 (병원 찾기, 산재 계산기)",
  description: "산재 지정 병원 찾기, 휴업급여 계산, 산재 상담 채팅봇까지. 산재 근로자에게 꼭 필요한 모든 정보를 리워크케어에서 확인하세요.",
  alternates: {
    canonical: 'https://www.reworkcare.com',
  },
  openGraph: {
    title: "리워크케어 - 산재의 모든 것",
    description: "갑작스러운 산재, 혼자 고민하지 마세요. 리워크케어가 함께합니다.",
    url: "https://www.reworkcare.com",
    siteName: "리워크케어",
    locale: "ko_KR",
    type: "website",
  }
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "리워크케어",
    "alternateName": ["ReWorkCare", "산재도우미"],
    "url": "https://www.reworkcare.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.reworkcare.com/hospitals?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <StructuredData data={jsonLd} />
      <LandingClient />
    </>
  );
}
