import { GoogleAIFileManager, FileState } from "@google/generative-ai/server";
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

// Tier 1 키 우선 사용 (V2 챗봇용)
const apiKey = process.env.GOOGLE_API_KEY2 || process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.error("GOOGLE_API_KEY or GOOGLE_API_KEY2 not found in .env.local");
  process.exit(1);
}

const fileManager = new GoogleAIFileManager(apiKey);
const STORE_ID = "hospitalguidestorev2fixed-nntiy5lzyybo"; // From rag_document_registry.md

const filesToUpload = [
    {
        filename: "[pdf]산업재해보상보험Ⅰ(업무상 재해).pdf",
        displayName: "industrial_accident_insurance_1",
    },
    {
        filename: "뇌혈관 질병 또는 심장 질병 및 근골격계 질병의 업무상 질병 인정 여부 결정에 필요한 사항(고용노동부고시)(제2022-40호)(20220701).pdf",
        displayName: "cardiovascular_musculoskeletal_diseases_criteria",
    },
    {
        filename: "산업재해보상보험 요양급여 산정기준(고용노동부고시)(제2022-87호)(20230101).pdf",
        displayName: "medical_care_benefit_calculation_standards",
    },
    {
        filename: "산업재해보상보험법 시행규칙(고용노동부령)(제00445호)(20250621).pdf",
        displayName: "enforcement_rule_of_industrial_accident_compensation_insurance_act",
    },
    {
        filename: "산업재해보상보험법 시행령(대통령령)(제35947호)(20260102).pdf",
        displayName: "enforcement_decree_of_industrial_accident_compensation_insurance_act",
    },
    {
        filename: "산업재해보상보험법(법률)(제21065호)(20260102).pdf",
        displayName: "industrial_accident_compensation_insurance_act_21065",
    },
    {
        filename: "산업재해보상보험법(법률)(제21136호)(20260212).pdf",
        displayName: "industrial_accident_compensation_insurance_act_21136",
    },
    {
        filename: "산업재해보상보험법에 따른 간병료 지급기준(고용노동부고시)(제2020-151호)(20210101).pdf",
        displayName: "nursing_care_benefit_payment_standards",
    },
];

async function uploadFile(filename: string, displayName: string) {
  const filePath = path.join(process.cwd(), "docs/rag_test_data", filename);
  console.log(`Starting upload for: ${filename} -> ${displayName}`);

  try {
    const uploadResult = await fileManager.uploadFile(filePath, {
      mimeType: "application/pdf",
      displayName: displayName,
    });

    const file = uploadResult.file;
    console.log(`Uploaded ${displayName}: ${file.name}`);

    // Wait for processing
    let state = file.state;
    console.log(`Waiting for processing...`);
    while (state === FileState.PROCESSING) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const fileStatus = await fileManager.getFile(file.name);
      state = fileStatus.state;
    }
    console.log(`Processed ${displayName}: ${state}`);

    if (state === FileState.FAILED) {
        throw new Error(`File processing failed for ${displayName}`);
    }

    return file;

  } catch (error) {
    console.error(`Error uploading ${filename}:`, error);
    throw error;
  }
}

async function main() {
    console.log(`Starting batch upload to store: ${STORE_ID}`);
    const uploadedFiles = [];
    const results = [];

    // 1. Upload all files
    for (const item of filesToUpload) {
        try {
            const file = await uploadFile(item.filename, item.displayName);
            uploadedFiles.push(file);
            results.push({
                original: item.filename,
                ascii: item.displayName,
                uri: file.name,
                status: 'Uploaded'
            });
        } catch (e) {
            console.error(`Failed to process ${item.filename}, skipping...`);
             results.push({
                original: item.filename,
                ascii: item.displayName,
                uri: null,
                status: 'Failed'
            });
        }
    }

    if (uploadedFiles.length === 0) {
        console.error("No files uploaded successfully.");
        fs.writeFileSync('upload_manifest.json', JSON.stringify([], null, 2));
        return;
    }

    console.log("\n--- Adding files to Vector Store ---");
    for (const file of uploadedFiles) {
        const storeName = `fileSearchStores/${STORE_ID}`;
        const url = `https://generativelanguage.googleapis.com/v1beta/${storeName}/files?key=${apiKey}`;
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    resourceName: file.name
                })
            });
            
            const data = await response.json();
            if (response.ok) {
                 console.log(`Added ${file.displayName} (${file.name}) to store.`);
            } else {
                 console.error(`Failed to add ${file.displayName} to store:`, data);
            }
        } catch(e) {
             console.error(`Error adding ${file.displayName} to store:`, e);
        }
    }
    
    console.log("\n--- WRITING MANIFEST ---");
    fs.writeFileSync('upload_manifest.json', JSON.stringify(results, null, 2));
    console.log("Written to upload_manifest.json");
}

main();
