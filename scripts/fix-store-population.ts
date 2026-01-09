
import { GoogleAIFileManager, FileState } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
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
// We use the store ID we already created: hospitalguidestorefinalv3-bogsmm2rpc2j
const STORE_ID = "hospitalguidestorefinalv3-bogsmm2rpc2j";

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
    console.log(`--- SDK FIX: Adding files to ${STORE_ID} ---`);

    // 1. Upload files fresh using SDK (this handles upload + check)
    // Actually, "uploadFile" just uploads to the corpus (independent of store). 
    // We then need to ADD them to the store.
    
    // Check if we can reuse the ones from final_manifest.json? 
    // Better to re-upload to be 100% sure we have valid file objects if previous runs were messy.
    // Or we can list files and match? Let's just re-upload for "atomic" safety as user requested robustness.

    const newFileResources = [];

    for (const item of filesToUpload) {
        const filePath = path.join(process.cwd(), "docs/rag_test_data", item.filename);
        if (!fs.existsSync(filePath)) {
            console.error(`Skipping missing file: ${filePath}`);
            continue;
        }

        try {
            console.log(`Uploading ${item.displayName}...`);
            const uploadResult = await fileManager.uploadFile(filePath, {
                mimeType: "application/pdf",
                displayName: item.displayName,
            });
            const file = uploadResult.file;
            console.log(`Uploaded! URI: ${file.uri}, Name: ${file.name}`);
            
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
               newFileResources.push(file.name); // Store just the name "files/abc"
            }

        } catch (e) {
            console.error(`Upload failed for ${item.displayName}:`, e);
        }
    }

    if (newFileResources.length === 0) {
        console.error("No files uploaded successfully.");
        return;
    }

    // 2. Add to Store using raw fetch but with correct logic validated by docs
    // Docs say: POST https://generativelanguage.googleapis.com/v1beta/{name=fileSearchStores/*}/files:batchCreate
    // Body: { "requests": [ { "resourceName": "files/..." } ] }
    
    // My previous attempt used file.uri (https://...). 
    // THIS TIME I use file.name (files/...) which I saved in newFileResources.
    
    console.log(`\nAdding ${newFileResources.length} files to store...`);
    
    const url = `https://generativelanguage.googleapis.com/v1beta/fileSearchStores/${STORE_ID}/files:batchCreate?key=${apiKey}`;
    
    try {
        const body = {
            requests: newFileResources.map(name => ({ resourceName: name }))
        };
        
        console.log("Request Body Preview:", JSON.stringify(body).substring(0, 200) + "...");

        const resp = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (resp.ok) {
            console.log("SUCCESS! Files added to store.");
            const data = await resp.json();
            console.log("Response:", JSON.stringify(data, null, 2));
        } else {
            console.error("FAILED to add files:", resp.status);
            console.error(await resp.text());
        }

    } catch (e) {
        console.error("Add to store error:", e);
    }
}

main();
