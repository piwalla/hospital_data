
import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";

dotenv.config({ path: '.env' });

const apiKey = process.env.GOOGLE_API_KEY2 || process.env.GOOGLE_API_KEY;
if (!apiKey) {
    throw new Error("GOOGLE_API_KEY not found in environment variables");
}

const ai = new GoogleGenAI({ apiKey });

async function cleanupGhosts() {
    console.log("👻 Hunting for ghost files (temp_upload_*) using GoogleGenAI SDK...");

    const allFiles: any[] = [];
    let pageToken;
    const listParams: any = { pageSize: 100 };

    // 1. List ALL files
    try {
        do {
            if (pageToken) listParams.pageToken = pageToken;
            const resp: any = await ai.files.list(listParams);
            if (resp.files) {
                allFiles.push(...resp.files);
            }
            pageToken = resp.nextPageToken;
        } while (pageToken);
    } catch (e) {
        console.error("Error listing files:", e);
        return;
    }

    console.log(`📋 Total files found: ${allFiles.length}`);
    // 2. Log EVERYTHING for debug
    console.log("🔍 Checking file list...");
    allFiles.forEach(f => {
        console.log(`   📂 File: [${f.displayName}] Name=[${f.name}] Created=[${f.createTime}] URI=[${f.uri}]`);
    });

    // 2. Identify Files to Delete
    // Strategy: Delete anything that contains "temp_upload" in displayName OR uri
    // AND duplicates (older versions) of our Clean Files.
    
    // We expect 10 clean files.
    // Anything else is suspect.
    
    const REUPLOAD_MAP_VALUES = [
        "Industrial Accident Insurance Criteria",
        "Cardiovascular and Musculoskeletal Diseases Criteria",
        "Medical Care Benefit Calculation Standards",
        "Enforcement Rule of IACI Act",
        "Enforcement Decree of IACI Act",
        "IACI Act 21065 Current",
        "IACI Act 21136 Future",
        "Nursing Care Benefit Payment Standards",
        "Hospital Guide 2025",
        "Disability Diagnosis Guide"
    ];
    
    const ghosts = allFiles.filter(f => {
        // Explicit temp match
        if (f.displayName && f.displayName.includes("temp_upload")) return true;
        if (f.uri && f.uri.includes("temp_upload")) return true;
        if (f.name && f.name.includes("temp_upload")) return true; // unlikely for resource name

        // Specific user reported file check
        if (f.displayName && f.displayName.includes("n5qx6")) return true;
        
        // Check for duplicates of KNOWN clean files
        // We will handle filtering later, but here we can flag "Odd" files that are NOT in our Safe List?
        // But the list dump showed "lowercase" names. 
        // If "nursing_care_benefit..." (lowercase) is in the list, but our Safe List has "Nursing Care..." (Title Case).
        // Then the lowercase one IS A GHOST if I intended to replace it.
        // BUT `rag-metadata.ts` relies on keys.
        // Wait, did I update `rag-metadata.ts` with lowercase keys?
        // Step 260 edit added `Nursing_Care_Benefit_Payment_Standards.pdf` (Title Case Filename).
        // It also KEPT `nursing_care_benefit_payment_standards` (lowercase display name key).
        
        // If the STORE has lowercase display names, then those are the files serving queries.
        // Retrieval said `[Chunk 5] Title: "Nature_..."`? No, `[Chunk 5] Title: "Nursing_Care_Benefit_Payment_Standards.pdf"`.
        // This suggests there IS a file with Title Case filename.
        // If my list dump didn't show it... I am baffled.
        // Maybe `ai.files.list` via `GoogleGenAI` will show it.
        
        return false;
    });

    console.log(`\n🗑️  Found ${ghosts.length} explicit ghost files to delete.`);
    
    for (const f of ghosts) {
        console.log(`   Deleting: ${f.displayName} (${f.name})`);
        try {
            await ai.files.delete({ name: f.name });
            console.log("     -> Deleted.");
        } catch (e) {
            console.error("     -> Failed to delete:", e);
        }
    }
}

cleanupGhosts();
