
import { GoogleAIFileManager, FileState } from "@google/generative-ai/server";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Load environment variables
const envLocalPath = path.resolve(process.cwd(), '.env.local');
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envLocalPath });
if (!process.env.GOOGLE_API_KEY && !process.env.GOOGLE_API_KEY2) {
    dotenv.config({ path: envPath });
}
const apiKey = process.env.GOOGLE_API_KEY2 || process.env.GOOGLE_API_KEY;
if (!apiKey) {
    console.error("API Key not found");
    process.exit(1);
}

const fileManager = new GoogleAIFileManager(apiKey);

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
    console.log("--- ROBUST V3: Upload & Batch Create ---");
    
    // 1. Upload Files
    const uploadedFiles = [];
    console.log("Phase 1: Uploading Files to File Manager...");
    
    for (const item of filesToUpload) {
        const filePath = path.join(process.cwd(), "docs/rag_test_data", item.filename);
        if (!fs.existsSync(filePath)) {
            console.error(`Skipping missing file: ${filePath}`);
            continue;
        }

        try {
            console.log(`Uploading ${item.filename}...`);
            const uploadResult = await fileManager.uploadFile(filePath, {
                mimeType: "application/pdf",
                displayName: item.displayName,
            });
            
            const file = uploadResult.file;
            console.log(`Uploaded ${item.displayName} (URI: ${file.uri})`);
            
            // Wait for ACTIVE
            let state = file.state;
            process.stdout.write("Processing.");
            while (state === FileState.PROCESSING) {
                process.stdout.write(".");
                await new Promise((resolve) => setTimeout(resolve, 2000));
                const fileStatus = await fileManager.getFile(file.name);
                state = fileStatus.state;
            }
            console.log(` ${state}`);

            if (state === FileState.ACTIVE) {
                uploadedFiles.push({ resourceName: file.uri }); // Correct structure for batchCreate!
            } else {
                console.error(`File failed processing: ${state}`);
            }
        } catch (e) {
            console.error(`Upload error for ${item.filename}:`, e);
        }
    }

    if (uploadedFiles.length === 0) {
        console.error("No files ready for store creation.");
        return;
    }

    // 2. Create Store
    console.log("\nPhase 2: Creating Store...");
    let storeId = "";
    try {
        const createStoreUrl = `https://generativelanguage.googleapis.com/v1beta/fileSearchStores?key=${apiKey}`;
        const resp = await fetch(createStoreUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ displayName: "Hospital_Guide_Store_Final_v3" })
        });
        const storeData = await resp.json();
        console.log(`Store Created: ${storeData.name}`);
        storeId = storeData.name;
    } catch (e) {
        console.error("Failed to create store:", e);
        return;
    }

    // 3. Batch Add Files
    console.log(`\nPhase 3: Batch Adding ${uploadedFiles.length} files...`);
    // POST https://generativelanguage.googleapis.com/v1beta/{name=fileSearchStores/*}/files:batchCreate
    const batchUrl = `https://generativelanguage.googleapis.com/v1beta/${storeId}/files:batchCreate?key=${apiKey}`;
    
    try {
        const batchBody = {
            requests: uploadedFiles.map(f => ({ resourceName: f.resourceName }))
        };

        const batchResp = await fetch(batchUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(batchBody)
        });

        if (batchResp.ok) {
            console.log("Batch Add SUCCESS!");
            const batchData = await batchResp.json();
            console.log(`Added ${batchData.files?.length || 0} files.`);
        } else {
            console.error("Batch Add FAILED:", batchResp.status, await batchResp.text());
        }

    } catch (e) {
        console.error("Batch Add Error:", e);
    }
    
    console.log("\n--- FINAL STORE ID ---");
    console.log(storeId);
    console.log("----------------------");
    
    // Save to manifest for easy parsing
    const newManifest = uploadedFiles.map(f => ({ uri: f.resourceName, storeId: storeId }));
    fs.writeFileSync('final_manifest.json', JSON.stringify(newManifest, null, 2));
}

main();
