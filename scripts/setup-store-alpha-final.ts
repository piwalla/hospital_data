
const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

const envLocalPath = path.resolve(process.cwd(), '.env.local');
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envLocalPath });
dotenv.config({ path: envPath });

const apiKey = process.env.GOOGLE_API_KEY2 || process.env.GOOGLE_API_KEY;
if (!apiKey) { console.error("Missing Key"); process.exit(1); }

const client = new GoogleGenAI({ apiKey: apiKey });

const STORE_ID = "hospitalguidestorefinalv3-bogsmm2rpc2j";
const STORE_NAME = `fileSearchStores/${STORE_ID}`;

const filesToUpload = [
    { filename: "[pdf]산업재해보상보험Ⅰ(업무상 재해).pdf", displayName: "industrial_accident_insurance_1" },
    { filename: "뇌혈관 질병 또는 심장 질병 및 근골격계 질병의 업무상 질병 인정 여부 결정에 필요한 사항(고용노동부고시)(제2022-40호)(20220701).pdf", displayName: "cardiovascular_musculoskeletal_diseases_criteria" },
    { filename: "산업재해보상보험 요양급여 산정기준(고용노동부고시)(제2022-87호)(20230101).pdf", displayName: "medical_care_benefit_calculation_standards" },
    { filename: "산업재해보상보험법 시행규칙(고용노동부령)(제00445호)(20250621).pdf", displayName: "enforcement_rule_of_industrial_accident_compensation_insurance_act" },
    { filename: "산업재해보상보험법 시행령(대통령령)(제35947호)(20260102).pdf", displayName: "enforcement_decree_of_industrial_accident_compensation_insurance_act" },
    { filename: "산업재해보상보험법(법률)(제21065호)(20260102).pdf", displayName: "industrial_accident_compensation_insurance_act_21065" },
    { filename: "산업재해보상보험법(법률)(제21136호)(20260212).pdf", displayName: "industrial_accident_compensation_insurance_act_21136" },
    { filename: "산업재해보상보험법에 따른 간병료 지급기준(고용노동부고시)(제2020-151호)(20210101).pdf", displayName: "nursing_care_benefit_payment_standards" },
    { filename: "2025 산재 보험 보상 및 재활 서비스 가이드(근로복지공단 제공).pdf", displayName: "Hospital Guide 2025" },
    { filename: "장해진단서_작성원칙_및_유의사항(근로복지공단).pdf", displayName: "Disability Diagnosis Guide" }
];

async function main() {
    console.log(`--- Populating Store: ${STORE_NAME} using @google/genai ---`);

    const tempDir = path.join(process.cwd(), "temp_upload");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    for (const item of filesToUpload) {
        const originalPath = path.join(process.cwd(), "docs/rag_test_data", item.filename);
        if (!fs.existsSync(originalPath)) {
            console.warn(`File missing: ${originalPath}`);
            continue;
        }

        // Use simple ASCII name for upload path
        const safeName = item.displayName.replace(/[^a-zA-Z0-9]/g, "_") + ".pdf";
        const tempPath = path.join(tempDir, safeName);
        fs.copyFileSync(originalPath, tempPath);

        console.log(`Processing ${item.displayName} (temp: ${safeName})...`);
        
        try {
            console.log("Attempting upload...");
            const resp = await client.fileSearchStores.uploadToFileSearchStore({
                file: tempPath,
                name: STORE_NAME, 
                // Pass mimeType if supported in params?
                // Inspecting signature showed 'params'. 
                // Likely params.config can allow more? But let's stick to basics.
            });
            
            console.log("Success! Resp:", JSON.stringify(resp, null, 2)); // Log full resp
            
        } catch (e) {
            console.error(`Error uploading ${item.displayName}:`, e.message);
        } finally {
            if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        }
    }
    
    // Check count after
    try {
        const store = await client.fileSearchStores.get({ name: STORE_NAME });
        console.log("Final Store State:", store);
    } catch(e) { console.error("Get Store Error:", e.message); }
}

main();
