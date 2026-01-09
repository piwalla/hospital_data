
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const apiKey = process.env.GOOGLE_API_KEY2 || process.env.GOOGLE_API_KEY;
const ai = new GoogleGenAI({ apiKey });

console.log("Keys on 'ai' instance:", Object.keys(ai));
// Also check prototype
console.log("Keys on prototype:", Object.getOwnPropertyNames(Object.getPrototypeOf(ai)));
