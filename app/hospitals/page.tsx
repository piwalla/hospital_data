import { getAllHospitals, type Hospital } from '@/lib/api/hospitals';
import HospitalsPageClient from './page-client';
import HospitalsHero from '@/components/hospitals/HospitalsHero';

// 이 페이지는 Clerk 인증을 사용하므로 동적 렌더링 필요
export const dynamic = 'force-dynamic';

export default async function HospitalsPage() {
  // 서버 사이드에서 병원 데이터 조회
  let hospitals: Hospital[] = [];
  try {
    hospitals = await getAllHospitals();
    console.log('[HospitalsPage] 병원 데이터 로드:', hospitals.length, '개');
  } catch (error) {
    console.error('[HospitalsPage] 데이터 로드 실패:', error);
  }

  return (
    <>
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
