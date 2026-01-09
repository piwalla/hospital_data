
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: ".env" });

const apiKey = process.env.GOOGLE_API_KEY2 || process.env.GOOGLE_API_KEY;
if (!apiKey) {
    console.error("API Key not found");
    process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function setupManual() {
  try {
    const filePath = path.join(process.cwd(), "docs/rag_test_data/2025 산재 보험 보상 및 재활 서비스 가이드(근로복지공단 제공).pdf");
    
    // Skip Upload - use existing
    const fileUri = "https://generativelanguage.googleapis.com/v1beta/files/aohkiqikx9va";
    console.log(`Using Existing File: ${fileUri}`);
    
    /*
    console.log("1. Uploading File...");
    const uploadRes = await ai.files.upload({
        file: filePath,
        config: { displayName: "Hospital Guide 2024" }
    });
    console.log(`Frequency: ${uploadRes.uri}`);
    
    // Wait for processing
    console.log("Waiting for file processing...");
    let fileState = uploadRes.state;
    while (fileState === "PROCESSING") {
        await new Promise(r => setTimeout(r, 2000));
        const check = await ai.files.get({ name: uploadRes.name });
        fileState = check.state;
        process.stdout.write(".");
    }
    console.log(`\nFile State: ${fileState}`);
    if (fileState === "FAILED") throw new Error("File upload failed");
    */

    console.log("2. Creating Vector Store...");
    const store = await ai.fileSearchStores.create({
        config: { displayName: "Hospital_Guide_Store_Manual" }
    });
    console.log(`Store Name: ${store.name}`);
    
    console.log("3. Adding File to Store...");
    // Try to add file
    // We expect 'files' or 'documents' collection on the store.
    // Based on debug: ai.fileSearchStores.documents exists.
    // We assume it maps to `POST .../v1beta/{parent}/files` (or documents?)
    
    // In Alpha API `vectorStores`, the collection is `files`.
    // In Semantic Retriever, it's `documents`.
    // If SDK property is `documents`, likely it maps to correct backend.
    
    // Payload guess: { parent: store.name, document: { name: ..., ? } }
    // Or { parent: store.name, resource: { uri: ... } } (Standard Google API pattern)
    
    /* 
       Let's try: `ai.fileSearchStores.documents.create({ parent: store.name, resource: { uri: uploadRes.uri } })`
    */
    // Use importFile (SDK Method discovered in debug)
    console.log(`Adding file via importFile to ${store.name}...`);
    
    // Guessing signature: (name, request)
    // Request likely contains 'resource' or 'files'.
    // Or maybe just (name, fileUri)?
    // Let's try object payload first.
    
    // @ts-ignore
    await ai.fileSearchStores.importFile(store.name, {
        resource: { uri: fileUri }
    });
    
    console.log("File added via importFile!");
    console.log(`VECTOR_STORE_ID=${store.name.split("/")[1]}`);
    
  } catch (e: any) {
    console.error("Error:", e);
    if (e.body) console.error("Body:", e.body);
  }
}

setupManual();
