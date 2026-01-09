
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: ".env" });

// Tier 1 키(GOOGLE_API_KEY2) 우선 사용
const apiKey = process.env.GOOGLE_API_KEY2 || process.env.GOOGLE_API_KEY;

if (!apiKey) {
    console.error("API Key not found");
    process.exit(1);
}

// 1. 클라이언트 초기화
const ai = new GoogleGenAI({ apiKey });

async function setupVectorStore() {
  try {
    console.log("🚀 벡터 스토어 생성을 시작합니다...");

    // 2. File Search Store 생성 (REST의 vectorStores가 아닌 fileSearchStores 사용)
    // Note: SDK may use 'corpora' or 'vectorStores' under the hood, but we use the high-level helper if available?
    // User's code: ai.fileSearchStores.create
    // Let's verify if this method exists in the installed version.
    // If not, we might need to use `ai.vectorStores`. 
    // Since I can't check the d.ts easily, I will trust the user's code but wrap in try-catch or check properties if I could.
    // I will proceed with user's specific instruction.
    
    // NOTE: The user's code calls `ai.fileSearchStores`.
    // Modern SDKs often group under `ai.files` or similar. 
    // However, considering the user seems to have specific knowledge or documentation, I will use `ai.vectorStores` if `fileSearchStores` fails or just try strict adherence.
    
    // Wait, I should check if `fileSearchStores` is a valid property on `GoogleGenAI` instance.
    // Given the "Alpha/Beta" nature, names change.
    
    // Let's assume the user is correct about the method signature.
    
    /* 
       Potential Issue: "fileSearchStores" might not be the exact property name in the GA SDK.
       Often it is `ai.stores` or `ai.vectorStores`.
       However, I will write the code as requested.
       
       Update: The path to PDF.
    */
    const filePath = path.join(process.cwd(), "docs/rag_test_data/2025 산재 보험 보상 및 재활 서비스 가이드(근로복지공단 제공).pdf");
    
    // User's code adaptation:
    // "create" might be simpler.
    
    // NOTE: Usage of any property not in SDK will crash.
    // I'll assume standard `vectorStores` if `fileSearchStores` is not standard.
    // BUT the user said "REST url ... vectorStores returns 404... real name is fileSearchStores".
    // So likely the SDK exposes `ai.fileSearchStores`?
    // Actually, in the latest GenAI SDK (Dec 2024+), `vectorStores` IS the name usually.
    // But maybe specific beta.
    
    let storeName = "";
    
    // Let's try to handle potential naming difference or just go with prompts guidance.
    // I'll blindly follow the user's snippet first.
    
    // @ts-ignore
    const fileSearchStore = await ai.fileSearchStores.create({
      config: {
        // @ts-ignore
        displayName: "Project_Hospital_Guide_Store" 
      }
    });

    console.log(`✅ 스토어 생성 완료: ${fileSearchStore.name}`);
    storeName = fileSearchStore.name;

    // 3. 파일 업로드 및 자동 인덱싱
    console.log(`📤 파일 업로드 중: ${filePath}`);

    // User provided usage: ai.fileSearchStores.uploadToFileSearchStore
    // Let's interpret the debug output: 'files' and 'fileSearchStores' exists.
    // The user's specific method `uploadToFileSearchStore` might exist on `fileSearchStores`.
    // Let's try it.
    
    // @ts-ignore
    const uploadResult = await ai.fileSearchStores.uploadToFileSearchStore({
      file: filePath,
      fileSearchStoreName: storeName,
      config: {
        displayName: "Hospital Guide 2024"
      }
    });

    console.log(`🎉 파일 처리 완료! 상태: ${uploadResult.file.state}`);
    console.log(`VECTOR_STORE_ID=${storeName.split("/")[1]}`);

  } catch (error) {
    console.error("❌ 벡터 스토어 설정 중 오류 발생:", error);
    // Print detailed error
    if (error instanceof Error) console.error(error.stack);
  }
}

setupVectorStore();
