
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config({ path: ".env" });

const apiKey = process.env.GOOGLE_API_KEY2 || process.env.GOOGLE_API_KEY;
if (!apiKey) throw new Error("API Key not found");

const ai = new GoogleGenAI({ apiKey });

const TARGET_STORE_NAME = "Hospital_Guide_Store_V2_Fixed";
const PDF_FILE_PATH = "docs/rag_test_data/장해진단서_작성원칙_및_유의사항(근로복지공단).pdf";
const TEMP_FILE_NAME = "disability_diagnosis_guide.pdf"; // ASCII name

async function addDocument() {
  try {
    console.log("🚀 Starting Document Upload Process...");

    // 1. Find Existing Store
    console.log(`1. Searching for Vector Store: "${TARGET_STORE_NAME}"...`);
    const storesPager = await ai.fileSearchStores.list();
    let targetStore;
    
    console.log("Available Stores:");
    for await (const s of storesPager) {
        const store = s as any; // Cast to any to handle potential type mismatches
        console.log(`   - Name: ${store.name}, Display: ${store.displayName || store.config?.displayName}`);
        
        // Check both direct displayName and config.displayName
        if (store.displayName === TARGET_STORE_NAME || store.config?.displayName === TARGET_STORE_NAME) {
            targetStore = store;
        }
    }

    if (!targetStore) {
      throw new Error(`❌ Store "${TARGET_STORE_NAME}" not found. Please run setup-gemini-store-v2-fix.ts first.`);
    }

    console.log(`✅ Found Store: ${targetStore.name}`);

    // 2. Prepare File (ASCII Rename)
    console.log("2. Preparing file for upload...");
    const originalPath = path.join(process.cwd(), PDF_FILE_PATH);
    if (!fs.existsSync(originalPath)) {
      throw new Error(`❌ File not found: ${originalPath}`);
    }

    const tempPath = path.join(process.cwd(), "docs/rag_test_data", TEMP_FILE_NAME);
    fs.copyFileSync(originalPath, tempPath);
    console.log(`   - Temporary ASCII file created: ${tempPath}`);

    // 3. Upload File
    console.log("3. Uploading file to Google File Search Store...");
    try {
      const uploadResult = await ai.fileSearchStores.uploadToFileSearchStore({
        file: tempPath,
        fileSearchStoreName: targetStore.name,
        config: {
            displayName: "Disability Diagnosis Guide",
        }
      }) as any; // Cast to any to avoid type errors with Alpha SDK

      console.log(`🎉 File Uploaded Successfully!`);
      if (uploadResult.file) {
          console.log(`   - File Name: ${uploadResult.file.name}`);
          console.log(`   - State: ${uploadResult.file.state}`);
          console.log(`   - URI: ${uploadResult.file.uri}`);
      } else {
          console.log("   - Upload completed, but file details are missing in response.");
      }

    } finally {
      // 4. Cleanup
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
        console.log("4. Temporary file cleaned up.");
      }
    }

  } catch (e: any) {
    console.error("❌ Error adding document:", e);
  }
}

addDocument();
