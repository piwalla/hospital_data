
import { createClient } from '@supabase/supabase-js';
import { parseStringPromise } from 'xml2js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; 
const DATA_GO_KR_API_KEY = process.env.NEXT_PUBLIC_DATA_KR_API_KEY;
// Hardcoded key as fallback if env missing, though env should be present
const API_KEY_VAL = DATA_GO_KR_API_KEY || 'aba6428813f7272c3d7a7918ec194233d0862839e5d1df1df223f03e1d01592a';

const supabase = createClient(supabaseUrl, supabaseKey);

const BASE_URL = 'http://apis.data.go.kr/B490001/SJBoheomYoyang';

// --- Interfaces ---

interface ApplicationItem {
  injds_type_nm: string;  // e.g. "근골격계..."
  mctpv_sgg_nm: string;   // e.g. "서울 종로구"
  rcpr_aply_yr: string;
  rcpr_aply_mm: string;
  rcpr_aply_day: string;
  dstr_ocrn_ymd: string;  // Accident Date: YYYYMMDD
}

interface ApprovalItem {
  injds_type_nm: string;
  mctpv_sgg_nm: string;
  dstr_ocrn_ymd: string;  // Accident Date
  rcpr_aprv_yr: string;
  rcpr_aprv_mm: string;
  rcpr_aprv_day: string;
  tmdexm_day_cnt: string; // Treatment days (outpatient)
  tghsp_day_cnt: string;  // Treatment days (hospitalization)
}

interface StatAccumulator {
  total_applications: number;
  total_approvals: number;
  
  // For Processing Duration (Accident -> Approval - Accident -> Application)
  // We track sum of lags separately
  sum_app_lag: number;    // Accident to Application lag
  count_app_lag: number;
  
  sum_total_lag: number;  // Accident to Approval lag
  count_total_lag: number;

  // treatment
  sum_treatment: number;
  count_treatment: number;
}

// --- Helpers ---

function parseYMD(ymd: string): Date | null {
  if (!ymd || ymd.length !== 8) return null;
  const y = parseInt(ymd.substring(0, 4));
  const m = parseInt(ymd.substring(4, 6));
  const d = parseInt(ymd.substring(6, 8));
  return new Date(y, m - 1, d);
}

function parseDateParts(yStr: string, mStr: string, dStr: string): Date | null {
  if (!yStr || !mStr || !dStr) return null;
   const y = parseInt(yStr);
   const m = parseInt(mStr);
   const d = parseInt(dStr);
   return new Date(y, m - 1, d);
}

function diffDays(d1: Date, d2: Date): number {
  return Math.floor((d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24));
}

async function fetch2023Data(endpoint: string, yearParam: string, maxRows = 3000): Promise<any[]> {
  // We request a larger chunk because filtering by year parameter might be supported OR we filter manually?
  // Previous curl test suggested the API accepts the param and returns data.
  // We'll trust the param works.
  const url = `${BASE_URL}/${endpoint}?serviceKey=${API_KEY_VAL}&pageNo=1&numOfRows=${maxRows}&dataType=XML&${yearParam}=2023`;
  console.log(`Fetching ${endpoint} (2023)...`);
  
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const text = await res.text();
    const result = await parseStringPromise(text, { explicitArray: false });
    
    const items = result.RESULT?.BODY?.ROW;
    if (!items) return [];
    return Array.isArray(items) ? items : [items];
  } catch (e) {
    console.error(`Fetch failed for ${endpoint}:`, e);
    return [];
  }
}

// --- Main ---

// ... (interfaces remain)
interface StatRow {
  injds_type_nm: string;
  ia_rcpr_aply_nocs?: string;
  ia_rcpr_aprv_nocs?: string;
}

// ...

async function main() {
  console.log('Starting Data Collection for 2023...');

  // 1. Fetch National Stats (Counts) for Approval Rate Reliability
  // Note: These APIs (11 & 21) provide pre-aggregated daily stats. We fetch a large chunk.
  const appStatsRaw = await fetch2023Data('OPA020MT_11_INFO', 'info_reg_yr', 5000);
  const aprvStatsRaw = await fetch2023Data('OPA020MT_21_INFO', 'info_reg_yr', 5000);
  
  // Aggregate National Counts by Injury
  const nationalCounts = new Map<string, { apps: number, aprvs: number }>();
  
  appStatsRaw.forEach((row: any) => {
      const injury = row.injds_type_nm;
      if (!injury) return;
      const cnt = parseInt(row.ia_rcpr_aply_nocs || '0');
      if (!nationalCounts.has(injury)) nationalCounts.set(injury, { apps: 0, aprvs: 0 });
      nationalCounts.get(injury)!.apps += cnt;
  });

  aprvStatsRaw.forEach((row: any) => {
      const injury = row.injds_type_nm;
      if (!injury) return;
      const cnt = parseInt(row.ia_rcpr_aprv_nocs || '0');
      if (!nationalCounts.has(injury)) nationalCounts.set(injury, { apps: 0, aprvs: 0 });
      nationalCounts.get(injury)!.aprvs += cnt;
  });

  console.log('Aggregated National Stats by Injury:', Array.from(nationalCounts.entries()));


  // 2. Fetch Sample Individual Data for Processing Duration (Region Specific)
  // We keep this to calculate "Time" which is not in Stats API.
  const sampleApps = await fetch2023Data('OPA020MT_03_INFO', 'rcpr_aply_yr', 3000);
  const sampleAprvs = await fetch2023Data('OPA020MT_04_INFO', 'rcpr_aprv_yr', 3000);
  
  const regionalStats = new Map<string, StatAccumulator>();

  const getStat = (k: string) => {
    if (!regionalStats.has(k)) {
      regionalStats.set(k, {
        total_applications: 0, total_approvals: 0, // Will replace with National
        sum_app_lag: 0, count_app_lag: 0,
        sum_total_lag: 0, count_total_lag: 0,
        sum_treatment: 0, count_treatment: 0
      });
    }
    return regionalStats.get(k)!;
  };

  const getKey = (injury: any, region: any) => `${injury || ''}||${region || ''}`;

  // Process Apps for Lag
  (sampleApps as ApplicationItem[]).forEach(item => {
      if (!item.injds_type_nm || !item.mctpv_sgg_nm) return;
      const stat = getStat(getKey(item.injds_type_nm, item.mctpv_sgg_nm));
      
      const accDate = parseYMD(item.dstr_ocrn_ymd);
      const appDate = parseDateParts(item.rcpr_aply_yr, item.rcpr_aply_mm, item.rcpr_aply_day);
      if (accDate && appDate) {
          const lag = diffDays(appDate, accDate);
          if (lag >= 0 && lag < 3650) {
              stat.sum_app_lag += lag;
              stat.count_app_lag++;
          }
      }
  });

  // Process Approvals for Lag & Treatment
  (sampleAprvs as ApprovalItem[]).forEach(item => {
       if (!item.injds_type_nm || !item.mctpv_sgg_nm) return;
       const stat = getStat(getKey(item.injds_type_nm, item.mctpv_sgg_nm));
       
       const accDate = parseYMD(item.dstr_ocrn_ymd);
       const aprvDate = parseDateParts(item.rcpr_aprv_yr, item.rcpr_aprv_mm, item.rcpr_aprv_day);
       if (accDate && aprvDate) {
           const lag = diffDays(aprvDate, accDate);
           if (lag >= 0 && lag < 3650) {
               stat.sum_total_lag += lag;
               stat.count_total_lag++;
           }
       }
       
       const t = parseInt(item.tghsp_day_cnt || '0') + parseInt(item.tmdexm_day_cnt || '0');
       if (t > 0) {
           stat.sum_treatment += t;
           stat.count_treatment++;
       }
  });


  // 3. Merge: Use National Counts for Rate, Regional Stats for Time
  const dbRows = [];
  
  // We iterate Regional Keys because we need Region Names for the DB
  for (const [key, rStat] of regionalStats.entries()) {
      const [injury, region] = key.split('||');
      if (!injury || !region) continue;

      // Get National Counts for this injury
      const natStat = nationalCounts.get(injury) || { apps: 0, aprvs: 0 };
      
      // Calculate Time (Region Specific)
      let estimatedProcessing = 0;
      const avgTotalLag = rStat.count_total_lag > 0 ? rStat.sum_total_lag / rStat.count_total_lag : 0;
      const avgAppLag = rStat.count_app_lag > 0 ? rStat.sum_app_lag / rStat.count_app_lag : 0;
      
      if (rStat.count_total_lag > 0 && rStat.count_app_lag > 0) {
          estimatedProcessing = avgTotalLag - avgAppLag;
      } else if (rStat.count_total_lag > 0) {
           // Fallback
           estimatedProcessing = avgTotalLag * 0.2;
      }
      
      const avgTreatment = rStat.count_treatment > 0 ? rStat.sum_treatment / rStat.count_treatment : 0;

      // Push Row
      // Note: We are saving National A/B counts into this Region's row.
      // This means the "Rate" calculated by the frontend/API will be (NatAprv / NatApp) * 100.
      // Matches "National Approval Rate, Regional Duration" strategy.
      dbRows.push({
          injury_name: injury,
          region_name: region,
          total_applications: natStat.apps, // National
          total_approvals: natStat.aprvs,   // National
          avg_processing_days: parseFloat(Math.max(0, estimatedProcessing).toFixed(1)),
          avg_treatment_days: parseFloat(avgTreatment.toFixed(1))
      });
  }

  console.log(`Upserting ${dbRows.length} rows...`);

  const { error } = await supabase
      .from('industrial_accident_stats')
      .upsert(dbRows, { onConflict: 'injury_name,region_name' });

  if (error) {
    console.error('Error:', error);
    process.exit(1);
  } else {
    console.log('Done! (National Rates + Regional Times)');
  }
}

main();
