
import { GoogleAIFileManager } from "@google/generative-ai/server";
import dotenv from "dotenv";
import path from "path";

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

const fileManager = new GoogleAIFileManager(apiKey);

async function main() {
    console.log("--- DEBUG: Listing Resources ---");
    
    // 1. List Files
    try {
        console.log("Fetching Files...");
        const listFilesResponse = await fileManager.listFiles({ pageSize: 10 });
        console.log("Files found:");
        // @ts-ignore
        for (const f of listFilesResponse.files) {
             console.log(`- ${f.name} (${f.displayName}) [${f.state}]`);
        }
    } catch (e) {
        console.error("Failed to list files:", e);
    }

    // 2. List Stores via fetch (since SDK support varies)
    try {
        console.log("\nFetching Stores...");
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/fileSearchStores?key=${apiKey}`);
        if (response.ok) {
            const data = await response.json();
             // @ts-ignore
            if (data.fileSearchStores) {
                 // @ts-ignore
                for (const s of data.fileSearchStores) {
                     console.log(`- ${s.name} (${s.displayName}) [${s.activeDocumentsCount} docs]`);
                }
            } else {
                console.log("No stores found.");
            }
        } else {
             console.error("Failed to list stores:", response.status, await response.text());
        }
    } catch (e) {
        console.error("Fetch error:", e);
    }
}

main();
