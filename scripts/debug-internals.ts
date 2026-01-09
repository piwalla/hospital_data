
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const { GoogleGenAI } = require("@google/genai"); // Alpha SDK
const dotenv = require("dotenv");

dotenv.config({ path: ".env" });
const apiKey = process.env.GOOGLE_API_KEY2 || process.env.GOOGLE_API_KEY;

async function debug() {
    console.log("--- Standard SDK (GoogleAIFileManager) ---");
    const fileManager = new GoogleAIFileManager(apiKey);
    console.log("Keys on GoogleAIFileManager instance:", Object.keys(fileManager));
    console.log("Proto on GoogleAIFileManager:", Object.getOwnPropertyNames(Object.getPrototypeOf(fileManager)));

    console.log("\n--- Alpha SDK (GoogleGenAI.fileSearchStores.documents) ---");
    const ai = new GoogleGenAI({ apiKey });
    // @ts-ignore
    const docs = ai.fileSearchStores.documents;
    console.log("Type of documents:", typeof docs);
    if (docs) {
        console.log("Keys on documents:", Object.keys(docs));
        if (typeof docs === 'object') {
             console.log("Proto on documents:", Object.getOwnPropertyNames(Object.getPrototypeOf(docs)));
        }
    }
}

debug();
