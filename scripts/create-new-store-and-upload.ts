
import { GoogleAIFileManager, FileState } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Load environment variables
const envLocalPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envLocalPath });
if (!process.env.GOOGLE_API_KEY && !process.env.GOOGLE_API_KEY2) {
    const envPath = path.resolve(process.cwd(), '.env');
    dotenv.config({ path: envPath });
}

const apiKey = process.env.GOOGLE_API_KEY2 || process.env.GOOGLE_API_KEY;
if (!apiKey) {
    console.error("API Key not found");
    process.exit(1);
}

const fileManager = new GoogleAIFileManager(apiKey);

// Files to upload
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
    console.log("--- Creating New Vector Store ---");
    // We use fetch for store creation as SDK support might be varying
    // POST https://generativelanguage.googleapis.com/v1beta/fileSearchStores?key=API_KEY
    
    let storeId = "";
    
    try {
        const createStoreUrl = `https://generativelanguage.googleapis.com/v1beta/fileSearchStores?key=${apiKey}`;
        const resp = await fetch(createStoreUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ displayName: "Hospital_Guide_Store_Fresh_" + Date.now() })
        });
        const storeData = await resp.json();
        console.log("Store Created:", storeData.name);
        storeId = storeData.name.split("/")[1]; // fileSearchStores/ID -> ID
    } catch (e) {
        console.error("Failed to create store:", e);
        return;
    }

    console.log(`Using Store ID: ${storeId}`);
    
    const uploadedFiles = [];

    for (const item of filesToUpload) {
        const filePath = path.join(process.cwd(), "docs/rag_test_data", item.filename);
        if (!fs.existsSync(filePath)) {
            console.error(`File not found: ${filePath}`);
            continue;
        }

        console.log(`Uploading ${item.filename}...`);
        try {
            const uploadResult = await fileManager.uploadFile(filePath, {
                mimeType: "application/pdf",
                displayName: item.displayName,
            });
            const file = uploadResult.file;
            console.log(`Uploaded: ${file.name}`);
            
            // Wait for processing
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
                uploadedFiles.push(file);
            }
        } catch (e) {
            console.error("Upload failed:", e);
        }
    }

    if (uploadedFiles.length === 0) {
        console.error("No files uploaded.");
        return;
    }

    // Add to store
    console.log(`Adding ${uploadedFiles.length} files to store...`);
    const storeName = `fileSearchStores/${storeId}`;
    
    for (const file of uploadedFiles) {
        const addUrl = `https://generativelanguage.googleapis.com/v1beta/${storeName}/files?key=${apiKey}`;
        try {
            const resp = await fetch(addUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resourceName: file.name })
            });
            
            // Handle 200 with empty body if that happens, but usually it returns the resource name
            if (resp.ok) {
                 console.log(`[SUCCESS] Added ${file.displayName}`);
            } else {
                 console.log(`[FAILED] Adding ${file.displayName}: ${resp.status}`);
            }
        } catch (e) {
            console.error(`Error adding ${file.displayName}:`, e);
        }
    }

    console.log("\n--- FINAL STORE ID ---");
    console.log(storeName); // Output full resource name
    console.log("----------------------");
}

main();
