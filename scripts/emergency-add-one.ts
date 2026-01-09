
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
// The store we just created
const STORE_NAME = "fileSearchStores/hospitalguidestorefinalv3-bogsmm2rpc2j";
// One of the files we just uploaded (from logs)
// Uploaded industrial_accident_compensation_insurance_act_21136 (URI: https://generativelanguage.googleapis.com/v1beta/files/4v3oe7jjba3j)
// The URI resource name is "files/4v3oe7jjba3j"
const FILE_RESOURCE = "files/4v3oe7jjba3j";

async function main() {
    console.log(`Target: ${STORE_NAME}`);
    console.log(`Adding File: ${FILE_RESOURCE}`);

    const url = `https://generativelanguage.googleapis.com/v1beta/${STORE_NAME}/files?key=${apiKey}`;
    console.log(`POST URL: ${url}`);

    try {
        const body = { resourceName: FILE_RESOURCE };
        console.log("Body:", JSON.stringify(body));

        const resp = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const text = await resp.text();
        console.log(`Status: ${resp.status} ${resp.statusText}`);
        console.log(`Response Body: ${text}`);

    } catch (e) {
        console.error("Error:", e);
    }
}

main();
