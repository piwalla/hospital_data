
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: ".env" });

const apiKey = process.env.GOOGLE_API_KEY2 || process.env.GOOGLE_API_KEY;
if (!apiKey) throw new Error("API Key not found");

const fileManager = new GoogleAIFileManager(apiKey);
const genAI = new GoogleGenerativeAI(apiKey);

async function setup() {
  try {
    const filePath = path.join(process.cwd(), "docs/rag_test_data/2025 산재 보험 보상 및 재활 서비스 가이드(근로복지공단 제공).pdf");
    
    // 1. Upload File (if not exists, or just re-upload to be sure)
    console.log("1. Uploading File...");
    const uploadResult = await fileManager.uploadFile(filePath, {
      mimeType: "application/pdf",
      displayName: "Hospital Guide 2024"
    });
    console.log(`Uploaded: ${uploadResult.file.name} (${uploadResult.file.uri})`);
    
    // Wait for active
    console.log("Waiting for file to be ACTIVE...");
    let file = await fileManager.getFile(uploadResult.file.name);
    while (file.state === "PROCESSING") {
        await new Promise(r => setTimeout(r, 2000));
        file = await fileManager.getFile(uploadResult.file.name);
        process.stdout.write(".");
    }
    console.log(`\nState: ${file.state}`);
    if (file.state === "FAILED") throw new Error("File processing failed");

    // 2. Create Model with Tool (This implies using the Model to MANAGE the Tool/Store?)
    // No, standard SDK mostly manages stores via `GoogleAIFileManager`? 
    // Wait, vanilla @google/generative-ai/server doesn't seem to expose VectorStore management cleanly in all versions.
    // BUT the REST API is 'https://generativelanguage.googleapis.com/v1beta/corpora' OR 'https://generativelanguage.googleapis.com/v1beta/vectorStores'?
    // Let's use the REST API approach for Store Creation since SDKs are flaky.
    
    console.log("2. Creating Vector Store (REST)...");
    const createStoreRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/vectorStores?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
             // No display_name in some versions, but let's try nothing first
        })
    });
    
    if (!createStoreRes.ok) {
        // Fallback to corpora if vectorStores fails? No, File Search uses vectorStores.
        // If 404, maybe strict 'beta' mismatch.
        throw new Error(`Create Store Failed: ${createStoreRes.status} ${await createStoreRes.text()}`);
    }
    
    const store = await createStoreRes.json();
    console.log(`Store Created: ${store.name}`); // vectorStores/IDs
    
    // 3. Add File to Store
    console.log("3. Adding file to store...");
    const addFileRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/${store.name}/files?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            // For addFile, we typically provide 'resource' with 'uri'
            // Structure: { resource: { uri: ... } } ??
            // OR simply { uri: ... } ?
            // Based on docs: { name: "vectorStores/.../files/...", uri: "..." } ??
            // Let's try sending the ID.
            
            // Standard AddFile request usually takes just the ID of the file managed by FileAPI?
            // Actually, `batchCreate` is common.
            // Let's try creating a "VectorStoreFile" resource.
            // Endpoint: POST .../vectorStores/{storeId}/files
            // Body: { uri: file.uri } OR { resource: { uri: file.uri } } ?
            // Let's try typical Google One Platform shape.
            
            uri: file.uri
        })
    });
    
    if (!addFileRes.ok) {
         console.log("Initial add failed, trying formatted body...");
         const retryRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/${store.name}/files?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                resource: { uri: file.uri }
            })
        });
        if (!retryRes.ok) throw new Error(`Add File Failed: ${retryRes.status} ${await retryRes.text()}`);
    }
    
    console.log("File added to store!");
    console.log(`VECTOR_STORE_ID=${store.name.split("/")[1]}`);
    
  } catch (e) {
      console.error(e);
  }
}

setup();
