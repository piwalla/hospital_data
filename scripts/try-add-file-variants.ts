
import { GoogleAIFileManager } from "@google/generative-ai/server";
import dotenv from "dotenv";
import path from "path";

const envLocalPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envLocalPath });
if (!process.env.GOOGLE_API_KEY && !process.env.GOOGLE_API_KEY2) {
    const envPath = path.resolve(process.cwd(), '.env');
    dotenv.config({ path: envPath });
}

const apiKey = process.env.GOOGLE_API_KEY2 || process.env.GOOGLE_API_KEY;
const STORE_ID = "hospitalguidestorefresh1767-367qb528uekt"; // Use the fresh one
const FILE_URI = "files/9g6979x8awzi"; // industrial_accident_insurance_1

async function main() {
    console.log(`Target: ${STORE_ID}, File: ${FILE_URI}`);
    const url = `https://generativelanguage.googleapis.com/v1beta/fileSearchStores/${STORE_ID}/files?key=${apiKey}`;

    const variants = [
        { resourceName: FILE_URI },
        { name: FILE_URI },
        { uri: FILE_URI },
        { file: FILE_URI },
        // Also try absolute resource name?
        // No, list returned 'files/...'
    ];

    for (const body of variants) {
        console.log(`\nTrying body: ${JSON.stringify(body)}`);
        try {
            const resp = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const text = await resp.text();
            console.log(`Status: ${resp.status}`);
            console.log(`Response: ${text.substring(0, 200)}`);
            if (resp.ok) {
                console.log("SUCCESS!");
                break;
            }
        } catch (e) {
            console.error(e);
        }
    }
}

main();
