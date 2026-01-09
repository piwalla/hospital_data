
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const apiKey = process.env.GOOGLE_API_KEY2 || process.env.GOOGLE_API_KEY;
const ai = new GoogleGenAI({ apiKey });

console.log("Methods on ai.fileSearchStores:");
console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(ai.fileSearchStores)));

console.log("Methods on ai.files:");
console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(ai.files)));
