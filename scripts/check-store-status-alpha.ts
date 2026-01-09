
const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");
const path = require("path");

const envLocalPath = path.resolve(process.cwd(), '.env.local');
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envLocalPath });
dotenv.config({ path: envPath });

const apiKey = process.env.GOOGLE_API_KEY2 || process.env.GOOGLE_API_KEY;
const client = new GoogleGenAI({ apiKey: apiKey });

const STORE_NAME = "fileSearchStores/hospitalguidestorev2fixed-nntiy5lzyybo";

async function main() {
    try {
        const store = await client.fileSearchStores.get({ name: STORE_NAME });
        console.log("Store Details:", JSON.stringify(store, null, 2));
    } catch (e) {
        console.error("Error:", e.message);
    }
}
main();

export {};
