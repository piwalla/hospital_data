
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

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

const STORE_ID = "hospitalguidestorev2fixed-nntiy5lzyybo";
const MANIFEST_PATH = "upload_manifest.json";

async function main() {
    console.log(`Target Store: fileSearchStores/${STORE_ID}`);
    
    // Read manifest
    if (!fs.existsSync(MANIFEST_PATH)) {
        console.error("Manifest not found!");
        return;
    }
    
    // Read manifest content again to ensure freshness
    const freshContent = fs.readFileSync(MANIFEST_PATH, "utf-8");
    let files;
    try {
        files = JSON.parse(freshContent);
    } catch (e) {
        console.error("Invalid JSON in manifest");
        return;
    }

    console.log(`Found ${files.length} files in manifest.`);

    for (const file of files) {
        if (!file.uri) {
            console.log(`Skipping ${file.ascii}: No URI`);
            continue;
        }

        console.log(`Adding ${file.ascii} (${file.uri})...`);
        
        const url = `https://generativelanguage.googleapis.com/v1beta/fileSearchStores/${STORE_ID}/files?key=${apiKey}`;
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resourceName: file.uri })
            });
            
            console.log(`Response Status: ${response.status} ${response.statusText}`);

            let data = null;
            const text = await response.text();
            if (text) {
                try {
                    data = JSON.parse(text);
                } catch (e) {
                    console.error("Failed to parse JSON response:", text);
                }
            }

            if (response.ok) {
                console.log(`[SUCCESS] Added ${file.ascii}`);
            } else {
                console.log(`[FAILED] ${file.ascii}: ${response.status} - ${text}`);
            }
        } catch (e) {
            console.error(`[ERROR] ${file.ascii}:`, e);
        }
    }
    
    // Verify count at the end
     console.log("\nVerifying Store Count...");
     const checkUrl = `https://generativelanguage.googleapis.com/v1beta/fileSearchStores/${STORE_ID}?key=${apiKey}`;
     const resp = await fetch(checkUrl);
     if (resp.ok) {
         console.log(await resp.json());
     }
}

main();
