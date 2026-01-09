
import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY2 || process.env.GOOGLE_API_KEY });

async function listAll() {
    console.log("Listing files...");
    try {
        const resp: any = await genAI.files.list({ pageSize: 100 });
        console.log("Response:", resp); // Dump full response object keys
        if (resp.files) {
             console.log(`Found ${resp.files.length} files.`);
             for(const f of resp.files) {
                 console.log(` - ${f.displayName} (${f.name})`);
                 if (f.displayName.includes('upload_')) {
                     console.log(`   🚨 GHOST DETECTED! Deleting...`);
                     await genAI.files.delete({ name: f.name });
                     console.log(`   ✅ Deleted.`);
                 }
             }
        } else {
             // Maybe it returns an iterable?
             console.log("No 'files' array in response. Iterating...");
             for await (const f of resp) {
                 console.log(` - ${f.displayName} (${f.name})`);
                 if (f.displayName.includes('upload_')) {
                     console.log(`   🚨 GHOST DETECTED! Deleting...`);
                     await genAI.files.delete({ name: f.name });
                     console.log(`   ✅ Deleted.`);
                 }
             }
        }
    } catch(e) {
        console.error(e);
    }
}
listAll();
