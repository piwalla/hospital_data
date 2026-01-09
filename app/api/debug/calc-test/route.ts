import { NextResponse } from 'next/server';
import { parseStringPromise } from 'xml2js';

export const dynamic = 'force-dynamic';

const SERVICE_KEY = 'aba6428813f7272c3d7a7918ec194233d0862839e5d1df1df223f03e1d01592a';
const BASE_URL = 'http://apis.data.go.kr/B490001/SJBoheomYoyang';

// Helper to fetch and parse XML
async function fetchData(endpoint: string, page = 1) {
  const url = `${BASE_URL}/${endpoint}?serviceKey=${SERVICE_KEY}&pageNo=${page}&numOfRows=100&dataType=XML`;
  const res = await fetch(url);
  const text = await res.text();
  const parsed = await parseStringPromise(text);
  
  // Extract items safely
  try {
    return parsed.RESULT.BODY[0].ROW || [];
  } catch (e) {
    console.error('Parse error:', e, JSON.stringify(parsed));
    return [];
  }
}

// Calculate days between two date strings (YYYYMMDD)
function diffDays(startStr: string, endStr: string) {
  if (!startStr || !endStr) return null;
  // Basic validation
  if (startStr.length !== 8 || endStr.length !== 8) return null;
  
  const start = new Date(
    parseInt(startStr.substring(0, 4)),
    parseInt(startStr.substring(4, 6)) - 1,
    parseInt(startStr.substring(6, 8))
  );
  
  const end = new Date(
    parseInt(endStr.substring(0, 4)),
    parseInt(endStr.substring(4, 6)) - 1,
    parseInt(endStr.substring(6, 8))
  );
  
  const diffTime = end.getTime() - start.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export async function GET() {
  try {
    // 1. Fetch Sample Data (100 rows each)
    const applications = await fetchData('OPA020MT_03_INFO'); // For Denominator
    const approvals = await fetchData('OPA020MT_04_INFO');    // For Numerator & Durations

    // 2. Analyze "Approval Rate" (Simulated by matching Injury Name)
    // Group by Injury Name
    const appCounts: Record<string, number> = {};
    applications.forEach((item: any) => {
      const injury = item.injds_type_nm?.[0] || 'Unknown';
      appCounts[injury] = (appCounts[injury] || 0) + 1;
    });

    const apprCounts: Record<string, number> = {};
    approvals.forEach((item: any) => {
      const injury = item.injds_type_nm?.[0] || 'Unknown';
      apprCounts[injury] = (apprCounts[injury] || 0) + 1;
    });

    // Calculate Rate for available injuries
    const approvalRates = Object.keys(appCounts).map(injury => {
      const applied = appCounts[injury] || 0;
      const approved = apprCounts[injury] || 0;
      // Note: In real life, 'approved' might be higher than 'applied' in a small sample window 
      // if approval happens later. We just show the logic here.
      return { 
        injury, 
        applied, 
        approved, 
        rate: applied > 0 ? ((approved / applied) * 100).toFixed(1) + '%' : '0%' 
      };
    }).sort((a, b) => b.applied - a.applied);

    // 3. Analyze "Duration" & "Treatment Days" (From Approvals)
    const durations: number[] = [];
    const treatments: number[] = [];
    
    // Sample detailed logs
    const detailedLogs: any[] = [];

    approvals.forEach((item: any) => {
      // Duration: Approval Date - Accident Date
      // Approval date is split: rcpr_aprv_yr, rcpr_aprv_mm, rcpr_aprv_day
      const y = item.rcpr_aprv_yr?.[0];
      const m = item.rcpr_aprv_mm?.[0];
      const d = item.rcpr_aprv_day?.[0];
      const approvalDate = (y && m && d) ? `${y}${m}${d}` : null;
      const accidentDate = item.dstr_ocrn_ymd?.[0]; // YYYYMMDD

      if (approvalDate && accidentDate) {
        const days = diffDays(accidentDate, approvalDate);
        if (days !== null && days >= 0 && days < 3650) { // Filter outliers
          durations.push(days);
          if (durations.length <= 5) {
             detailedLogs.push({ 
               type: 'Duration',
               injury: item.injds_type_nm?.[0], 
               accident: accidentDate, 
               approval: approvalDate, 
               days 
             });
          }
        }
      }

      // Treatment: Hospital + Exam days
      const hospital = parseInt(item.thsptl_day_cnt?.[0] || '0');
      const exam = parseInt(item.tmdexm_day_cnt?.[0] || '0');
      const totalTreatment = hospital + exam;
      if (totalTreatment > 0) {
        treatments.push(totalTreatment);
      }
    });

    const avgDuration = durations.length > 0 
      ? (durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(1) 
      : '0';
      
    const avgTreatment = treatments.length > 0
      ? (treatments.reduce((a, b) => a + b, 0) / treatments.length).toFixed(1)
      : '0';

    return NextResponse.json({
      summary: {
        total_applications_fetched: applications.length,
        total_approvals_fetched: approvals.length,
        avg_processing_days: `${avgDuration} days (Sample size: ${durations.length})`,
        avg_treatment_days: `${avgTreatment} days (Sample size: ${treatments.length})`
      },
      approval_rates_by_injury: approvalRates.slice(0, 10), // Top 10
      sample_calculations: detailedLogs
    });

  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
