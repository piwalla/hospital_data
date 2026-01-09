
import dotenv from "dotenv";
import path from "path";

const envLocalPath = path.resolve(process.cwd(), '.env.local');
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envLocalPath });
dotenv.config({ path: envPath });

const apiKey = process.env.GOOGLE_API_KEY2 || process.env.GOOGLE_API_KEY;
const STORE_FULL = "fileSearchStores/hospitalguidestorefinalv3-bogsmm2rpc2j";
const STORE_ID = "hospitalguidestorefinalv3-bogsmm2rpc2j";
const FILE_RESOURCE = "files/0ufdqbwo3vc5"; 

async function main() {
    console.log(`--- Testing vectorStores Alias for ${STORE_ID} ---`);
    console.log(`Using Key ending in: ...${apiKey.slice(-5)}`);

    // Try 1: vectorStores/ID/files
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/vectorStores/${STORE_ID}/files?key=${apiKey}`;
        console.log(`POST ${url}`);
        const resp = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ resourceName: FILE_RESOURCE })
        });
        console.log(`Status 1: ${resp.status}`);
        if (resp.ok) console.log("SUCCESS!");
        else console.log(`Body: ${await resp.text()}`);
    } catch (e) { console.error(e); }

    // Try 2: vectorStores/fileSearchStores/ID/files (Unlikely but possible)
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/vectorStores/${STORE_FULL}/files?key=${apiKey}`;
        console.log(`POST ${url}`);
        const resp = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ resourceName: FILE_RESOURCE })
        });
        console.log(`Status 2: ${resp.status}`);
    } catch (e) { console.error(e); }
}

main();
