
import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GOOGLE_API_KEY2 || process.env.GOOGLE_API_KEY;
if (!apiKey) {
  throw new Error("GOOGLE_API_KEY setting is missing.");
}

const client = new GoogleGenAI({ apiKey });

// Target Store ID (V3 Clean Store)
const STORE_NAME = "fileSearchStores/hospitalguidestorev3clean-5khogee4qpu6"; 

async function uploadFileToStore(filePath: string) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    process.exit(1);
  }

  const filename = path.basename(filePath);
  console.log(`📤 Uploading ${filename} to Google Store (${STORE_NAME})...`);

  try {
    console.log(`📤 Uploading '${filename}' to Google Store (${STORE_NAME})...`);

    // Use the method signature from reupload_rag_files.ts
    // @ts-ignore - Types might be loose in the alpha SDK
    const uploadResult = await client.fileSearchStores.uploadToFileSearchStore({
      file: filePath,
      fileSearchStoreName: STORE_NAME,
      config: {
        displayName: filename
      }
    });

    console.log(`✅ Upload initiated.`);
    console.log("✅ Upload to store completed.");
    
  } catch (error) {
    console.error("❌ Error uploading file:", error);
  }
}

const targetFile = process.argv[2];
if (!targetFile) {
  console.error("Usage: npx tsx scripts/add_rag_document_google.ts <file_path>");
  process.exit(1);
}

uploadFileToStore(targetFile);
