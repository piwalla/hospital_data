
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Try loading multiple env files
const envLocalPath = path.resolve(process.cwd(), '.env.local');
const envPath = path.resolve(process.cwd(), '.env');

console.log(`Loading env from: ${envLocalPath}`);
dotenv.config({ path: envLocalPath });
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.log(`Loading env from: ${envPath}`);
    dotenv.config({ path: envPath });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; 

console.log(`Supabase URL: ${supabaseUrl ? 'Found' : 'Missing'}`);
console.log(`Supabase Key: ${supabaseKey ? 'Found' : 'Missing'}`);

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase credentials not found. Please check .env.local or .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const FILES_DIR = path.join(process.cwd(), 'docs/rag_test_data');
const BUCKET_NAME = 'uploads';
const FOLDER_NAME = 'documents';

// Mapping from rag_document_registry.md
const fileMapping = [
    { original: "2025 산재 보험 보상 및 재활 서비스 가이드(근로복지공단 제공).pdf", target: "guide2025.pdf" },
    { original: "장해진단서_작성원칙_및_유의사항(근로복지공단).pdf", target: "disability_diagnosis_guide.pdf" },
    { original: "[pdf]산업재해보상보험Ⅰ(업무상 재해).pdf", target: "industrial_accident_insurance_1.pdf" },
    { original: "뇌혈관 질병 또는 심장 질병 및 근골격계 질병의 업무상 질병 인정 여부 결정에 필요한 사항(고용노동부고시)(제2022-40호)(20220701).pdf", target: "cardiovascular_diseases.pdf" },
    { original: "산업재해보상보험 요양급여 산정기준(고용노동부고시)(제2022-87호)(20230101).pdf", target: "benefit_calculation.pdf" },
    { original: "산업재해보상보험법 시행규칙(고용노동부령)(제00445호)(20250621).pdf", target: "enforcement_rule.pdf" },
    { original: "산업재해보상보험법 시행령(대통령령)(제35947호)(20260102).pdf", target: "enforcement_decree.pdf" },
    { original: "산업재해보상보험법(법률)(제21065호)(20260102).pdf", target: "act_21065.pdf" },
    { original: "산업재해보상보험법(법률)(제21136호)(20260212).pdf", target: "act_21136.pdf" },
    { original: "산업재해보상보험법에 따른 간병료 지급기준(고용노동부고시)(제2020-151호)(20210101).pdf", target: "nursing_benefit.pdf" }
];

async function main() {
    console.log("Starting Supabase upload...");
    const urls = {};

    for (const item of fileMapping) {
        const filePath = path.join(FILES_DIR, item.original);
        if (!fs.existsSync(filePath)) {
            console.warn(`[SKIP] File not found: ${item.original}`);
            continue;
        }

        const fileBuffer = fs.readFileSync(filePath);
        const storagePath = `${FOLDER_NAME}/${item.target}`;
        
        console.log(`Uploading ${item.target}...`);
        
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(storagePath, fileBuffer, {
                contentType: 'application/pdf',
                upsert: true
            });

        if (error) {
            console.error(`[ERROR] Failed to upload ${item.target}:`, error.message);
        } else {
            const { data: { publicUrl } } = supabase.storage
                .from(BUCKET_NAME)
                .getPublicUrl(storagePath);
            
            console.log(`[SUCCESS] ${publicUrl}`);
            urls[item.target] = publicUrl;
        }
    }
    
    console.log("\n--- JSON OUTPUT ---");
    console.log(JSON.stringify(urls, null, 2));
}

main();
