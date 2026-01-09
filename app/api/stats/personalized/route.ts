
import { createClerkSupabaseClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const INJURY_MAPPING: Record<string, string[]> = {
  'hand_arm': ['근골격계 및 결합조직 질환', '손상'],
  'foot_leg': ['근골격계 및 결합조직 질환', '손상'],
  'spine': ['근골격계 및 결합조직 질환'],
  'brain_neuro': ['신경계 질환', '정신 행동 장애', '순환기계 질환', '감각기계 질환'],
  'other': ['기타', '암, 신생물', '소화기계 질환', '비뇨생식기계 질환', '호흡기계 질환']
};

const REGION_MAPPING: Record<string, string> = {
  'seoul': '서울',
  'gyeonggi': '경기',
  'incheon': '인천',
  'busan': '부산',
  'daegu': '대구',
  'gwangju': '광주',
  'daejeon': '대전',
  'ulsan': '울산',
  'sejong': '세종',
  'gangwon': '강원',
  'chungbuk': '충북',
  'chungnam': '충남',
  'jeonbuk': '전북',
  'jeonnam': '전남',
  'yeongbuk': '경북',
  'gyeongbuk': '경북',
  'yeongnam': '경남',
  'gyeongnam': '경남',
  'jeju': '제주',
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const injuryCode = searchParams.get('injury');
  const regionCode = searchParams.get('region');

  if (!injuryCode || !regionCode) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  const targetInjuries = INJURY_MAPPING[injuryCode] || [];
  const targetRegionPrefix = REGION_MAPPING[regionCode] || regionCode;

  const supabase = createClerkSupabaseClient();

  // Query DB
  // We need to match any of the injuries AND the region prefix
  const { data, error } = await supabase
    .from('industrial_accident_stats')
    .select('*')
    .in('injury_name', targetInjuries)
    .ilike('region_name', `${targetRegionPrefix}%`);

  if (error) {
    console.error('Stats fetch error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  // Aggregate Results
  let totalApps = 0;
  let totalAprvs = 0;
  
  // Processing Days (We mostly use Official constant now, but keep this for hybrid)
  let totalProcDays = 0; 
  let countProc = 0;

  // Treatment Days (Split)
  let treatAccidentSum = 0;
  let countTreatAccident = 0;
  
  let treatDiseaseSum = 0;
  let countTreatDisease = 0;

  data.forEach(row => {
    totalApps += row.total_applications;
    totalAprvs += row.total_approvals;
    
    // Processing Time (Legacy/Hybrid)
    if (row.avg_processing_days && row.total_approvals > 0) {
      totalProcDays += row.avg_processing_days * row.total_approvals;
      countProc += row.total_approvals;
    }

    // Treatment Time (Split Logic)
    if (row.avg_treatment_days && row.total_approvals > 0) {
      const isAccidentRow = row.injury_name.includes('손상') || row.injury_name.includes('중독');
      
      if (isAccidentRow) {
        treatAccidentSum += row.avg_treatment_days * row.total_approvals;
        countTreatAccident += row.total_approvals;
      } else {
        treatDiseaseSum += row.avg_treatment_days * row.total_approvals;
        countTreatDisease += row.total_approvals;
      }
    }
  });

  const avgProcessing = countProc > 0 ? (totalProcDays / countProc).toFixed(1) : 0;
  const avgTreatmentAccident = countTreatAccident > 0 ? (treatAccidentSum / countTreatAccident).toFixed(0) : 0;
  const avgTreatmentDisease = countTreatDisease > 0 ? (treatDiseaseSum / countTreatDisease).toFixed(0) : 0;
  
  // Fallback mixed average
  const totalTreatSum = treatAccidentSum + treatDiseaseSum;
  const totalTreatCount = countTreatAccident + countTreatDisease;
  const avgTreatmentMixed = totalTreatCount > 0 ? (totalTreatSum / totalTreatCount).toFixed(0) : 0;

  const calculatedRate = totalApps > 0 ? (totalAprvs / totalApps) * 100 : 0;
  const approvalRate = Math.min(calculatedRate, 100).toFixed(1);

  return NextResponse.json({
    avgProcessing,
    avgTreatment: avgTreatmentMixed, 
    avgTreatmentAccident,
    avgTreatmentDisease,
    approvalRate,
    sampleSize: totalApps,
    regionName: targetRegionPrefix
  });
}
