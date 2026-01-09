
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

// Store: hospitalguidestorefinalv3-bogsmm2rpc2j
// File: files/0ufdqbwo3vc5 (from previous log)
const STORE_NAME = "fileSearchStores/hospitalguidestorefinalv3-bogsmm2rpc2j";
const FILE_RESOURCE = "files/0ufdqbwo3vc5";

async function main() {
    console.log("--- Trying v1alpha Endpoint ---");
    // Try both singular and batch on v1alpha
    
    // 1. Singular POST
    try {
        const url = `https://generativelanguage.googleapis.com/v1alpha/${STORE_NAME}/files?key=${apiKey}`;
        console.log(`POST ${url}`);
        const resp = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ resourceName: FILE_RESOURCE })
        });
        console.log(`Singular Status: ${resp.status}`);
        console.log(`Body: ${await resp.text()}`);
    } catch (e) {
        console.error(e);
    }

    // 2. Batch POST
    try {
        const url = `https://generativelanguage.googleapis.com/v1alpha/${STORE_NAME}/files:batchCreate?key=${apiKey}`;
        console.log(`POST ${url}`);
        const resp = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ requests: [{ resourceName: FILE_RESOURCE }] })
        });
        console.log(`Batch Status: ${resp.status}`);
        console.log(`Body: ${await resp.text()}`);
    } catch (e) {
        console.error(e);
    }
}

main();
