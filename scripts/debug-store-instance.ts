
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const apiKey = process.env.GOOGLE_API_KEY2 || process.env.GOOGLE_API_KEY;
const ai = new GoogleGenAI({ apiKey });

console.log("Keys on ai.fileSearchStores instance:", Object.keys(ai.fileSearchStores));
