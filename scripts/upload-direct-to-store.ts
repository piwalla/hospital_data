
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

const envLocalPath = path.resolve(process.cwd(), '.env.local');
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envLocalPath });
dotenv.config({ path: envPath });

const apiKey = process.env.GOOGLE_API_KEY2 || process.env.GOOGLE_API_KEY;
if (!apiKey) {
    console.error("API Key not found");
    process.exit(1);
}

// Target the V3 store
const STORE_ID = "hospitalguidestorefinalv3-bogsmm2rpc2j"; 
const FILENAME = "[pdf]산업재해보상보험Ⅰ(업무상 재해).pdf";
const DISPLAY_NAME = "industrial_accident_insurance_1";
const FILE_PATH = path.join(process.cwd(), "docs/rag_test_data", FILENAME);

async function main() {
    console.log(`--- Direct Upload to Store: ${STORE_ID} ---`);
    console.log(`File: ${FILENAME}`);
    
    // Construct Multipart Body
    const fileContent = fs.readFileSync(FILE_PATH);
    const boundary = "-------Boundary" + Date.now();
    const delimiter = "\r\n--" + boundary + "\r\n";
    const closeDelimiter = "\r\n--" + boundary + "--";

    const metadata = {
        file: {
            displayName: DISPLAY_NAME
        }
    };

    const multipartRequestBody =
        delimiter +
        "Content-Type: application/json\r\n\r\n" +
        JSON.stringify(metadata) +
        delimiter +
        "Content-Type: application/pdf\r\n\r\n" +
        fileContent.toString("binary") + // binary safe? fetch usually wants Buffer but we construct string?
        // Wait, constructing string from PDF binary is risky with UTF8.
        // Better to use Blob or Buffer concatenation if running in Node with 'node-fetch' (native fetch in Node 18+ supports Blob/FormData).
        // Let's use FormData if available?
        // Node 18+ has native FormData.
        
        ""; // Placeholder
    
    // Better strategy for Node fetch: Use FormData
    const formData = new FormData();
    formData.append("metadata", JSON.stringify({ file: { displayName: DISPLAY_NAME } })); // Key name? 'metadata'? 'file'?
    // Google Upload protocol usually expects specific parts order.
    // Part 1: JSON Metadata
    // Part 2: Media
    
    // Let's try standard 'uploadType=multipart' behavior.
    // Actually, `GoogleAIFileManager` is easier if I can find a way to patch the URL.
    
    // Let's try simple fetch with FormData.
    const blob = new Blob([fileContent], { type: "application/pdf" });
    const metaBlob = new Blob([JSON.stringify({ file: { displayName: DISPLAY_NAME } })], { type: "application/json" });
    
    formData.append("metadata", metaBlob);
    formData.append("file", blob); 

    const url = `https://generativelanguage.googleapis.com/upload/v1beta/fileSearchStores/${STORE_ID}/files?key=${apiKey}&uploadType=multipart`;
    
    try {
        console.log(`POST ${url}`);
        const resp = await fetch(url, {
             method: 'POST',
             body: formData
             // Fetch sets Content-Type to multipart/form-data with boundary automatically
        });
        
        console.log(`Status: ${resp.status}`);
        const text = await resp.text();
        console.log(`Response: ${text}`);
    } catch (e) {
        console.error(e);
    }
}

main();
