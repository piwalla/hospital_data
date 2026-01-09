
import dotenv from "dotenv";
import path from "path";

const envLocalPath = path.resolve(process.cwd(), '.env.local');
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envLocalPath });
dotenv.config({ path: envPath }); // Load .env as fallback/complement

const key1 = process.env.GOOGLE_API_KEY;
const key2 = process.env.GOOGLE_API_KEY2;

console.log("Loaded Keys:");
console.log("Key1:", key1 ? key1.substring(0, 5) + "..." : "Missing");
console.log("Key2:", key2 ? key2.substring(0, 5) + "..." : "Missing");

import fs from "fs";

// Store: hospitalguidestorefinalv3-bogsmm2rpc2j
const STORE_NAME = "fileSearchStores/hospitalguidestorefinalv3-bogsmm2rpc2j";
const FILE_RESOURCE = "files/0ufdqbwo3vc5"; // Use a valid one from logs

async function testKey(name, key) {
    console.log(`\n--- Testing ${name} ---`);
    if (!key) {
        console.log("Skipping (Not found)");
        return;
    }

    // 1. List Stores
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/fileSearchStores?key=${key}`;
        const resp = await fetch(url);
        console.log(`List Stores: ${resp.status}`);
        if (resp.ok) {
            const data = await resp.json();
            const found = data.fileSearchStores?.find(s => s.name === STORE_NAME);
            console.log(`Store Visible: ${!!found}`);
        }
    } catch (e) { console.error("List Error:", e.message); }

    // 2. Add File
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/${STORE_NAME}/files?key=${key}`;
        const resp = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ resourceName: FILE_RESOURCE })
        });
        console.log(`Add File Status: ${resp.status}`);
        if (!resp.ok) console.log(`Body: ${await resp.text()}`);
    } catch (e) { console.error("Add Error:", e.message); }
}

async function main() {
    await testKey("GOOGLE_API_KEY", key1);
    await testKey("GOOGLE_API_KEY2", key2);
}

main();
