
import { GoogleAIFileManager, FileState } from "@google/generative-ai/server";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: ".env" });

// Tier 1 키 우선 사용 (V2 챗봇용)
const apiKey = process.env.GOOGLE_API_KEY2 || process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.error("GOOGLE_API_KEY or GOOGLE_API_KEY2 not found in .env.local");
  process.exit(1);
}

const fileManager = new GoogleAIFileManager(apiKey);

async function uploadFile() {
  const filePath = path.join(process.cwd(), "docs/rag_test_data/2025 산재 보험 보상 및 재활 서비스 가이드(근로복지공단 제공).pdf");
  
  console.log(`Uploading file: ${filePath}`);

  try {
    const uploadResult = await fileManager.uploadFile(filePath, {
      mimeType: "application/pdf",
      displayName: "2025 산재 보상 가이드",
    });

    const file = uploadResult.file;
    console.log(`Uploaded file: ${file.displayName}`);
    console.log(`File Name (URI): ${file.name}`);
    console.log(`Processing...`);

    // Wait for the file to be active
    let state = file.state;
    while (state === FileState.PROCESSING) {
      process.stdout.write(".");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const fileStatus = await fileManager.getFile(file.name);
      state = fileStatus.state;
    }

    console.log(`\nFile processing complete. State: ${state}`);

    if (state === FileState.FAILED) {
      console.error("File processing failed.");
      process.exit(1);
    }

    console.log(`\nUse this File URI in your chatbot: ${file.uri}`);
    console.log(`File Name Resource: ${file.name}`);

  } catch (error) {
    console.error("Error uploading file:", error);
    process.exit(1);
  }
}

uploadFile();
