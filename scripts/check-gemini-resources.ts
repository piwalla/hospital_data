
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
    console.error("API Key not found");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    // SDK method might not exist in this version, using fetch fallback directly
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        if (data.models) {
                console.log("Models (via fetch):");
                data.models.forEach((m: any) => console.log(`- ${m.name}`));
        } else {
            console.log("No models found via fetch:", data);
        }
    } catch (fetchError) {
            console.error("Fetch error:", fetchError);
    }
}

// Also verify the store exists
async function checkStore() {
    const resourceName = "fileSearchStores/hospitalguidestorev2fixed-nntiy5lzyybo"; // From previous context
    console.log(`\nChecking Store: ${resourceName}`);
    try {
         const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/${resourceName}?key=${apiKey}`);
         if (response.ok) {
             const data = await response.json();
             console.log("Store found:", JSON.stringify(data, null, 2));
         } else {
             console.log("Store NOT found (404/Error):", await response.text());
         }
    } catch (e) {
        console.error("Error checking store:", e);
    }
}

async function main() {
    await listModels();
    await checkStore();
}

main();
