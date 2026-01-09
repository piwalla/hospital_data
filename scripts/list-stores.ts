
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const apiKey = process.env.GOOGLE_API_KEY2 || process.env.GOOGLE_API_KEY;
const ai = new GoogleGenAI({ apiKey });

async function listStores() {
  try {
    // Try listing using listInternal or similar if exposed?
    // Debug showed 'listInternal'.
    // @ts-ignore
    const list = await ai.fileSearchStores.listInternal();
    console.log("Stores:", JSON.stringify(list, null, 2));
  } catch (e) {
    console.error(e);
  }
}

listStores();
