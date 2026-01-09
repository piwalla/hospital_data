
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config({ path: ".env" });

const apiKey = process.env.GOOGLE_API_KEY2 || process.env.GOOGLE_API_KEY;
if (!apiKey) throw new Error("API Key not found");

const ai = new GoogleGenAI({ apiKey });

// The store ID found in app/api/chatbot-v2/route.ts
const STORE_NAME = "fileSearchStores/hospitalguidestorev2fixed-nntiy5lzyybo";

const TARGET_FILES = [
  "2025 산재 보험 보상 및 재활 서비스 가이드(근로복지공단 제공).pdf",
  "[pdf]산업재해보상보험Ⅰ(업무상 재해).pdf",
  "뇌혈관 질병 또는 심장 질병 및 근골격계 질병의 업무상 질병 인정 여부 결정에 필요한 사항(고용노동부고시)(제2022-40호)(20220701).pdf",
  "산업재해보상보험 요양급여 산정기준(고용노동부고시)(제2022-87호)(20230101).pdf",
  "산업재해보상보험법 시행규칙(고용노동부령)(제00445호)(20250621).pdf",
  "산업재해보상보험법 시행령(대통령령)(제35947호)(20260102).pdf",
  "산업재해보상보험법(법률)(제21065호)(20260102).pdf",
  "산업재해보상보험법(법률)(제21136호)(20260212).pdf",
  "산업재해보상보험법에 따른 간병료 지급기준(고용노동부고시)(제2020-151호)(20210101).pdf",
  "장해진단서_작성원칙_및_유의사항(근로복지공단).pdf"
];

// Map English Display Names to Korean Filenames
const NAME_MAP: Record<string, string> = {
    "Hospital Guide 2025": "2025 산재 보험 보상 및 재활 서비스 가이드(근로복지공단 제공).pdf",
    "Disability Diagnosis Guide": "장해진단서_작성원칙_및_유의사항(근로복지공단).pdf",
    "industrial_accident_insurance_1": "[pdf]산업재해보상보험Ⅰ(업무상 재해).pdf",
    "cardiovascular_musculoskeletal_diseases_criteria": "뇌혈관 질병 또는 심장 질병 및 근골격계 질병의 업무상 질병 인정 여부 결정에 필요한 사항(고용노동부고시)(제2022-40호)(20220701).pdf",
    "medical_care_benefit_calculation_standards": "산업재해보상보험 요양급여 산정기준(고용노동부고시)(제2022-87호)(20230101).pdf",
    "enforcement_rule_of_industrial_accident_compensation_insurance_act": "산업재해보상보험법 시행규칙(고용노동부령)(제00445호)(20250621).pdf",
    "enforcement_decree_of_industrial_accident_compensation_insurance_act": "산업재해보상보험법 시행령(대통령령)(제35947호)(20260102).pdf",
    "industrial_accident_compensation_insurance_act_21065": "산업재해보상보험법(법률)(제21065호)(20260102).pdf",
    "industrial_accident_compensation_insurance_act_21136": "산업재해보상보험법(법률)(제21136호)(20260212).pdf",
    "nursing_care_benefit_payment_standards": "산업재해보상보험법에 따른 간병료 지급기준(고용노동부고시)(제2020-151호)(20210101).pdf"
};

async function verifyFiles() {
  try {
    console.log(`🔍 Checking File Search Store: ${STORE_NAME}`);
    
    // Attempt 1: List all files directly (Project level)
    try {
        console.log("Attempting ai.files.list()...");
        // @ts-ignore
        const fileResponse = await ai.files.list({ pageSize: 100 });
        const allFiles: any[] = [];
        for await (const file of fileResponse) {
            allFiles.push(file);
        }
        console.log(`📂 Found ${allFiles.length} files in the PROJECT.`);
        
        // Log all found files for debug
        console.log("\n📦 All Retrieval Files:");
        allFiles.forEach(f => console.log(`   - ${f.displayName} (${f.state})`));

        // Map for easy lookup
        const remoteFiles = allFiles.map(f => ({
            name: f.name,
            displayName: f.displayName,
            state: f.state,
            uri: f.uri
        }));

        console.log("\n📊 Verification Results (Mapped):");
        console.log("=========================================");
        
        let matchCount = 0;

        for (const target of TARGET_FILES) {
            // Find remote file where NAME_MAP[displayName] == target
            // OR if no map, try fuzzy match
            const match = remoteFiles.find(rf => {
                if (!rf.displayName) return false;
                const mappedName = NAME_MAP[rf.displayName];
                if (mappedName === target) return true;
                return rf.displayName === target; // fallback
            });

            if (match) {
                matchCount++;
                const statusIcon = match.state === "ACTIVE" ? "✅" : (match.state === "FAILED" ? "❌" : "⏳");
                console.log(`${statusIcon} [${match.state}] ${target}`);
                console.log(`   └─ Remote Name: ${match.displayName}`);
            } else {
                console.log(`❌ [MISSING] ${target}`);
            }
        }
        
        console.log("=========================================");
        console.log(`Total Uploaded/Found: ${matchCount} / ${TARGET_FILES.length}`);
        
    } catch (e) {
        console.error("Error listing files via ai.files.list:", e);
    }

  } catch (e: any) {
    console.error("Critical Error:", e);
  }
}

verifyFiles();
