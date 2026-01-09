
const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");
const path = require("path");

const envLocalPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envLocalPath });
const apiKey = process.env.GOOGLE_API_KEY2 || process.env.GOOGLE_API_KEY;
const client = new GoogleGenAI({ apiKey: apiKey });

async function main() {
    console.log(client.fileSearchStores.uploadToFileSearchStore.toString());
}
main();
