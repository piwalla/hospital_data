import { Metadata } from "next";
import CommunityMain from "@/components/community/CommunityMain";
import { getUserProfile } from "@/app/actions/user";
import StructuredData from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "산재 정보 공유 커뮤니티 | 리워크케어",
  description: "산재 승인 후기, 치료 경험담, 노무사 상담 사례 등 산재 환자들의 생생한 이야기를 들어보세요.",
  alternates: {
    canonical: 'https://www.reworkcare.com/community',
  },
  openGraph: {
     title: "산재 정보 공유 커뮤니티 - 리워크케어",
     description: "산재 승인부터 재활까지, 서로의 경험을 나누는 따뜻한 공간입니다.",
     url: "https://www.reworkcare.com/community",
  }
};

export default async function CommunityPage() {
  const user = await getUserProfile();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "리워크케어 산재 커뮤니티",
    "description": "산재 관련 질문, 병원 후기, 승인 사례 공유",
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://www.reworkcare.com" },
        { "@type": "ListItem", "position": 2, "name": "커뮤니티", "item": "https://www.reworkcare.com/community" }
      ]
    }
  };

  return (
    <>
      <StructuredData data={jsonLd} />
      <CommunityMain 
        userInjury={user?.injuryPart}
        userRegion={user?.region}
      />
    </>
  );
}
