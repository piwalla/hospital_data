
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
const envLocalPath = path.resolve(process.cwd(), '.env.local');
const envPath = path.resolve(process.cwd(), '.env');

dotenv.config({ path: envLocalPath });
if (!process.env.GOOGLE_API_KEY && !process.env.GOOGLE_API_KEY2) {
    dotenv.config({ path: envPath });
}

const apiKey = process.env.GOOGLE_API_KEY2 || process.env.GOOGLE_API_KEY;
if (!apiKey) {
    console.error("API Key not found (checked .env.local and .env)");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const resourceName = "fileSearchStores/hospitalguidestorev2fixed-nntiy5lzyybo";
const modelName = "gemini-1.5-flash-002"; // Standard model

// Note: I'm testing with a known valid model first. 
// If the route uses 2.5, that's likely the bug.

async function main() {
    console.log(`Using Model: ${modelName}`);
    console.log(`Using Store: ${resourceName}`);

    const model = genAI.getGenerativeModel({
        model: modelName,
        tools: [{
            // @ts-ignore
            fileSearch: {
                fileSearchStoreNames: [resourceName]
            }
        }]
    });

    const chat = model.startChat();
    const question = "요양급여 산정 기준이 뭐야?";
    console.log(`Asking: ${question}`);

    try {
        const result = await chat.sendMessage(question);
        const response = await result.response;
        const text = response.text();
        console.log("\n--- Response Text ---");
        console.log(text.substring(0, 100) + "...");

        const candidate = response.candidates?.[0];
        const groundingMetadata = candidate?.groundingMetadata;

        console.log("\n--- Grounding Metadata ---");
        if (groundingMetadata) {
            console.log(JSON.stringify(groundingMetadata, null, 2));
        } else {
            console.log("No grounding metadata found!");
        }

    } catch (e) {
        console.error("Error:", e);
    }
}

main();
