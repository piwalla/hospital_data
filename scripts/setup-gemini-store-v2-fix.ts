
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config({ path: ".env" });

const apiKey = process.env.GOOGLE_API_KEY2 || process.env.GOOGLE_API_KEY;
if (!apiKey) throw new Error("API Key not found");

const ai = new GoogleGenAI({ apiKey });

async function setupV2Fix() {
  try {
    console.log("🚀 Starting Vector Store Creation (V2 Fix)...");
    
    // 1. Create Store
    console.log("1. Creating Store...");
    const store = await ai.fileSearchStores.create({
        config: {
            displayName: "Hospital_Guide_Store_V2_Fixed"
        }
    });
    console.log(`✅ Store Created: ${store.name}`);

    // 2. Prepare ASCII File for Upload
    const originalPath = path.join(process.cwd(), "docs/rag_test_data/2025 산재 보험 보상 및 재활 서비스 가이드(근로복지공단 제공).pdf");
    // Create a temporary copy with ASCII name to avoid header encoding issues
    const tempPath = path.join(process.cwd(), "docs/rag_test_data/guide2025.pdf");
    fs.copyFileSync(originalPath, tempPath);
    console.log(`2. Uploading File (Renamed to ASCII): ${tempPath}`);
    
    try {
        const uploadResult = await ai.fileSearchStores.uploadToFileSearchStore({
            file: tempPath, // ASCII path
            fileSearchStoreName: store.name,
            config: {
                // Keep display name simple to avoid metadata header issues too, just in case
                displayName: "Hospital Guide 2025", 
            }
        });
        
        console.log(`🎉 File Processed! State: ${uploadResult.file.state}`);
        console.log(`VECTOR_STORE_ID=${store.name.split("/")[1]}`);
        
    } finally {
        // Cleanup temp file
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    }
    
  } catch (e: any) {
    console.error("❌ Error in V2 Setup:", e);
  }
}

setupV2Fix();
