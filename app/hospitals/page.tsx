import { getAllHospitals, type Hospital } from '@/lib/api/hospitals';
import HospitalsPageClient from './page-client';

export default async function HospitalsPage() {
  // 서버 사이드에서 병원 데이터 조회
  let hospitals: Hospital[] = [];
  try {
    hospitals = await getAllHospitals();
    console.log('[HospitalsPage] 병원 데이터 로드:', hospitals.length, '개');
  } catch (error) {
    console.error('[HospitalsPage] 데이터 로드 실패:', error);
  }

  return <HospitalsPageClient hospitals={hospitals} />;
}

