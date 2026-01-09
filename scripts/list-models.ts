
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.error("GOOGLE_API_KEY not found");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
  try {
    const modelResponse = await genAI.getGenerativeModel({ model: "gemini-1.0-pro" }).apiKey; // Hack to get instance? No, there isn't a direct listModels on client?
    // Actually the SDK doesn't always expose listModels easily on the main class in some versions, 
    // but typically it does via `GoogleGenerativeAI` instance or static?
    // Let's check docs pattern or use the server SDK if installed.
    // I installed @google/generative-ai/server too? No, I installed @google/generative-ai
    
    // Wait, typically it's specific manager.
    // Let's us fetch directly if SDK is obscure.
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    
    console.log("Available Models:");
    (data.models || []).forEach((m: any) => {
      if (m.supportedGenerationMethods?.includes("generateContent")) {
        console.log(`- ${m.name}`);
      }
    });
  } catch (err) {
    console.error(err);
  }
}

listModels();
