
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: ".env" });

// Tier 1 Key prioritized
const apiKey = process.env.GOOGLE_API_KEY2 || process.env.GOOGLE_API_KEY;
if (!apiKey) throw new Error("API Key not found");

const ai = new GoogleGenAI({ apiKey });

async function setupV2() {
  try {
    console.log("🚀 Starting Vector Store Creation (V2)...");
    
    // 1. Create Store
    // User says resource name is 'fileSearchStores'. SDK helper 'create' should handle this.
    console.log("1. Creating Store...");
    const store = await ai.fileSearchStores.create({
        config: {
            displayName: "Hospital_Guide_Store_V2"
        }
    });
    console.log(`✅ Store Created: ${store.name}`); // Should start with 'fileSearchStores/'
    
    // 2. Upload and Add File
    const filePath = path.join(process.cwd(), "docs/rag_test_data/2025 산재 보험 보상 및 재활 서비스 가이드(근로복지공단 제공).pdf");
    console.log(`2. Uploading File to Store: ${filePath}`);
    
    // Using the helper recommended by user.
    // Previous error: "Invalid whitespace chunking config" when using PDF.
    // This implies that passing 'undefined' config might fallback to whitespace?
    // Or providing NO config object at all?
    
    // Let's try passing NO chunking config at all to let server decide.
    // @ts-ignore
    const uploadResult = await ai.fileSearchStores.uploadToFileSearchStore({
        file: filePath,
        fileSearchStoreName: store.name,
        config: {
            displayName: "Hospital Guide 2024",
            // EXPLICITLY OMITTING chunkingConfig based on previous failures
        }
    });
    
    console.log(`🎉 File Processed! State: ${uploadResult.file.state}`);
    console.log(`VECTOR_STORE_ID=${store.name.split("/")[1]}`);
    
  } catch (e: any) {
    console.error("❌ Error in V2 Setup:", e);
    if (e.body) console.error("Error Body:", e.body);
  }
}

setupV2();
