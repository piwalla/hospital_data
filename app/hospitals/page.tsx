import { getAllHospitals, type Hospital } from '@/lib/api/hospitals';
import HospitalsPageClient from './page-client';
import HospitalsHero from '@/components/hospitals/HospitalsHero';
import StructuredData from '@/components/seo/StructuredData';
import { Metadata } from 'next';

// 이 페이지는 Clerk 인증을 사용하므로 동적 렌더링 필요
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "전국 산재지정 의료기관 찾기 (지도/리스트) | 리워크케어",
  description: "내 주변 산재 지정 병원, 화상 인증 병원, 재활 인증 병원을 지도에서 바로 찾아보세요. 진료 과목별 필터링 제공.",
  alternates: {
    canonical: 'https://www.reworkcare.com/hospitals',
  },
  openGraph: {
    title: "내 주변 산재 지정 병원 찾기",
    description: "지도에서 바로 확인하는 전국 산재 의료기관. 화상, 재활 인증 병원 정보까지.",
    url: "https://www.reworkcare.com/hospitals",
  }
};

export default async function HospitalsPage() {
  // 서버 사이드에서 병원 데이터 조회
  let hospitals: Hospital[] = [];
  try {
    hospitals = await getAllHospitals();
    console.log('[HospitalsPage] 병원 데이터 로드:', hospitals.length, '개');
  } catch (error) {
    console.error('[HospitalsPage] 데이터 로드 실패:', error);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "전국 산재지정 의료기관 목록",
    "description": "전국 근로복지공단 지정 산재 병원, 재활 인증, 화상 인증 병원 목록입니다.",
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://www.reworkcare.com" },
        { "@type": "ListItem", "position": 2, "name": "병원 찾기", "item": "https://www.reworkcare.com/hospitals" }
      ]
    }
  };

  return (
    <>
      <StructuredData data={jsonLd} />
      <HospitalsHero />
      
      {/* 
        [Content Section with Full-Width Background]
        - High contrast background for card visibility
        - Full-width bleed to match Hero
      */}
      <div className="relative w-screen left-[calc(-50vw+50%)] bg-[#eff2f5] py-12 -mt-12 sm:-mt-12">
        <HospitalsPageClient hospitals={hospitals} />
      </div>
    </>
  );
}
