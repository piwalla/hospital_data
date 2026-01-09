
const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

const envLocalPath = path.resolve(process.cwd(), '.env.local');
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envLocalPath });
dotenv.config({ path: envPath });

const apiKey = process.env.GOOGLE_API_KEY2 || process.env.GOOGLE_API_KEY;

const client = new GoogleGenAI({ apiKey: apiKey }); // Constructor might take string?

async function main() {
    console.log("Client Keys:", Object.keys(client));
    // Check if sub-modules exist
    if (client.fileSearchStores) console.log("Has fileSearchStores!");
    if (client.files) console.log("Has files!");
    if (client.models) console.log("Has models!");
    
    // Try to list stores if module exists
    if (client.fileSearchStores) {
        try {
           const list = await client.fileSearchStores.list();
           console.log("Stores List:", list);
        } catch(e) { console.error("List Error:", e.message); }
    }
}
main();

export {};
