
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

// We use fetch because SDK deleteStore might be tricky with resource names
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

async function main() {
    console.log("--- CLEANUP: Listing Stores ---");
    
    try {
        const response = await fetch(`${BASE_URL}/fileSearchStores?key=${apiKey}`);
        if (!response.ok) {
            console.error("Failed to list stores:", await response.text());
            return;
        }

        const data = await response.json();
        const stores = data.fileSearchStores || [];
        
        console.log(`Found ${stores.length} stores.`);

        // Keep the "Fixed" one if it works, or just delete ALL test ones
        // Strategy: Delete everything except maybe the very first one if user wants, 
        // BUT user asked for "No duplicates", so safest is to WIPE and CREATE ONE FRESH.
        // Let's list them first and ask user or just delete the obviously broken/test ones.
        
        // We will delete stores that are NOT the one currently hardcoded in route.ts just to be safe first?
        // Actually, user wants to cleanup. Let's delete the 'fresh' one that failed (1767...) and kept the 'fixed' one?
        // NO, the user wants a FRESH start. 
        // I will delete ALL stores created by my scripts (starting with "Hospital_Guide_Store_")
        // except keeping ONE if I want, but better to delete all and make v3.

        for (const s of stores) {
            console.log(`\nStore: ${s.name} (${s.displayName}) [${s.activeDocumentsCount} docs]`);
            
            // Safety check: Don't delete random other stores if shared key
            if (s.displayName?.startsWith("Hospital_Guide_Store")) {
                console.log(`  -> DELETING ${s.displayName}...`);
                const delResp = await fetch(`${BASE_URL}/${s.name}?key=${apiKey}`, { method: 'DELETE' });
                if (delResp.ok) {
                    console.log("     [DELETED]");
                } else {
                    console.log(`     [FAILED] ${await delResp.text()}`);
                }
            } else {
                 console.log("  -> SKIPPING (Name mismatch)");
            }
        }

    } catch (e) {
        console.error("Error:", e);
    }
}

main();
