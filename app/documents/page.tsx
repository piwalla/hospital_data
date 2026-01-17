import DocumentsList from '@/components/documents/DocumentsList';
import DocumentsHero from '@/components/documents/DocumentsHero';
import StructuredData from '@/components/seo/StructuredData';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "산재 필수 서식 자료실 (다운로드) | 리워크케어",
  description: "요양급여 신청서, 휴업급여 청구서 등 근로복지공단 산재 신청에 필요한 필수 서식을 무료로 다운로드하세요.",
  alternates: {
    canonical: 'https://www.reworkcare.com/documents',
  },
  openGraph: {
     title: "산재 신청 필수 서식 모음",
     description: "복잡한 서류 찾기, 이제 리워크케어에서 한 번에 해결하세요.",
     url: "https://www.reworkcare.com/documents",
  }
};

interface DocumentsPageProps {
  searchParams: Promise<{ stage?: string }>;
}

export default async function DocumentsPage({ searchParams }: DocumentsPageProps) {
  const params = await searchParams;
  const stage = params.stage ? parseInt(params.stage, 10) : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "산재 필수 서식 자료실",
    "description": "산재 신청 및 보상 청구에 필요한 근로복지공단 공식 서식 모음",
    "url": "https://www.reworkcare.com/documents",
    "hasPart": [
        { "@type": "CreativeWork", "name": "요양급여신청서" },
        { "@type": "CreativeWork", "name": "휴업급여청구서" },
        { "@type": "CreativeWork", "name": "장해급여청구서" }
    ]
  };

  return (
    <>
      <StructuredData data={jsonLd} />
      <DocumentsHero />

      <div className="relative w-screen left-[calc(-50vw+50%)] bg-[#eff2f5] min-h-screen -mt-12">
        <div className="container mx-auto px-4 sm:px-6 pb-20 pt-12 max-w-7xl">
          <DocumentsList initialStage={stage} />
        </div>
      </div>
    </>
  );
}
