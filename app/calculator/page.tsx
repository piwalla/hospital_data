import { Metadata } from "next";
import CalculatorClient from "./CalculatorClient";
import StructuredData from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "산재 모의 계산기 (휴업급여/장해급여) | 리워크케어",
  description: "나의 예상 휴업급여와 장해급여를 1분 만에 계산해보세요. 평균 임금과 재해 일수만 입력하면 됩니다.",
  alternates: {
    canonical: 'https://www.reworkcare.com/calculator',
  },
  openGraph: {
     title: "1분 산재 보상금 모의 계산기",
     description: "평균임금만 알면 내 휴업급여가 얼마인지 바로 알 수 있습니다.",
     url: "https://www.reworkcare.com/calculator",
  }
};

export default function CalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "리워크케어 산재 계산기",
    "applicationCategory": "FinanceApplication",
    "description": "산업재해 예상 보험급여(휴업급여, 장해급여) 자동 계산 도구",
    "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "KRW"
    }
  };

  return (
    <>
      <StructuredData data={jsonLd} />
      <CalculatorClient />
    </>
  );
}
