
import dotenv from 'dotenv';
import { parseStringPromise } from 'xml2js';

dotenv.config({ path: '.env.local' });

const API_KEY = process.env.NEXT_PUBLIC_DATA_KR_API_KEY;
const BASE_URL = 'http://apis.data.go.kr/B490001/SJBoheomYoyang/OPA020MT_04_INFO';

async function fetchSampleCases() {
  console.log("Fetching sample raw cases for 2023...");
  
  // Fetching a batch
  const url = `${BASE_URL}?serviceKey=${API_KEY}&pageNo=1&numOfRows=20&rcpr_aprv_yr=2023`;
  
  let text: string | undefined;

  try {
    const res = await fetch(url);
    text = await res.text();
    
    // Parse using xml2js
    const result = await parseStringPromise(text, { explicitArray: false });
    
    const itemsRaw = result.response?.body?.items?.item;
    const items = Array.isArray(itemsRaw) ? itemsRaw : (itemsRaw ? [itemsRaw] : []);
    
    console.log("\n=== 2023년 산재 승인 데이터 사례 (Raw Data Sample) ===");
    console.log("순번 | 상병명 (진단명) | 요양기간(일) | 병원명");
    console.log("-".repeat(80));
    
    items.forEach((item: any, idx: number) => {
        // Correct fields for OPA020MT_04_INFO based on standard usage
        // Note: Check if fields exist. If not, print keys to debug.
        const injuryName = item.injds_nm || "미상";
        const days = item.rcpr_term_dd_cnt || "0"; 
        const hospital = item.mdcl_inst_nm || "미상";
        
        console.log(`${idx + 1}. [${injuryName}] -> ${days}일 (병원: ${hospital})`);
    });
    
    console.log("-".repeat(80));
    console.log("총 조회 건수: " + items.length);
    console.log("===============================================");
    
  } catch (e) {
    console.error("Error fetching samples:", e);
    const fs = require('fs');
    if (typeof text !== 'undefined') {
        fs.writeFileSync('debug_response.txt', text);
        console.log("Saved raw response to debug_response.txt");
    }
  }
}

fetchSampleCases();
