
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY2 || process.env.GOOGLE_API_KEY;
const STORE_NAME = "fileSearchStores/hospitalguidestorev3clean-5khogee4qpu6";

// @ts-ignore
import { getRagMetadataFromDb } from "../lib/utils/rag-registry-db";

async function debugRetrieval() {
  if (!GOOGLE_API_KEY) {
    console.error("❌ GOOGLE_API_KEY not found in environment variables.");
    return;
  }

  const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    tools: [
      {
        // @ts-ignore
        fileSearch: {
            fileSearchStoreNames: [STORE_NAME],
        },
      },
    ],
  });

  // Query specifically targeting 'nursing_care_benefit_payment_standards'
  // and 'industrial_accident_insurance_1'
  const query = process.argv[2] || "간병료 지급 규정을 최대한 자세하게 설명해 주세요";

  console.log(`🔍 Querying Gemini 2.5 Flash with File Search Store: ${STORE_NAME}`);
  console.log(`❓ Question: "${query}"\n`);

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: query }] }],
    });

    const response = result.response;
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;

    console.log("📝 Generated Text (Snippet):");
    console.log(response.text().substring(0, 200) + "...\n");

    console.log("🧩 Grounding Metadata (Sources):");

    if (groundingMetadata && groundingMetadata.groundingChunks) {
      // Use for...of loop to handle async await
      for (const [index, chunk] of groundingMetadata.groundingChunks.entries()) {
        const title = chunk.retrievedContext?.title;
        const uri = chunk.retrievedContext?.uri;
        let dbInfo = "Not Found in DB";
        let downloadUrl = "";
        let koreanTitle = "";

        if (title) {
            const metadata = await getRagMetadataFromDb(title);
            if (metadata) {
                dbInfo = "✅ Verified in DB";
                koreanTitle = metadata.korean_title;
                downloadUrl = metadata.download_url;
            }
        }
        
        console.log(`   [Chunk ${index + 1}] Title: "${title}" | URI: ${uri}`);
        console.log(`         -> DB Status: ${dbInfo}`);
        console.log(`         -> Korean Title: ${koreanTitle}`);
        console.log(`         -> Download URL: ${downloadUrl}`);
      }
      console.log(`\n✅ Found ${groundingMetadata.groundingChunks.length} chunks.`);
    } else {
      console.log("❌ No grounding chunks found. The model did not retrieve any documents.");
    }

  } catch (error) {
    console.error("❌ Error generating content:", error);
  }
}

debugRetrieval();
