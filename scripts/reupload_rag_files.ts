

import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

// Use Tier 1 Key for Store Management
const apiKey = process.env.GOOGLE_API_KEY2 || process.env.GOOGLE_API_KEY;
const STORE_NAME = "fileSearchStores/hospitalguidestorev2fixed-nntiy5lzyybo";
const DATA_DIR = path.join(process.cwd(), "docs/rag_test_data");

if (!apiKey) {
    console.error("❌ API Key not found");
    process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

// Mapping of Local Filename -> New Clean Display Name
const REUPLOAD_MAP: Record<string, string> = {
    "[pdf]산업재해보상보험Ⅰ(업무상 재해).pdf": "Industrial Accident Insurance Criteria",
    "뇌혈관 질병 또는 심장 질병 및 근골격계 질병의 업무상 질병 인정 여부 결정에 필요한 사항(고용노동부고시)(제2022-40호)(20220701).pdf": "Cardiovascular and Musculoskeletal Diseases Criteria",
    "산업재해보상보험 요양급여 산정기준(고용노동부고시)(제2022-87호)(20230101).pdf": "Medical Care Benefit Calculation Standards",
    "산업재해보상보험법 시행규칙(고용노동부령)(제00445호)(20250621).pdf": "Enforcement Rule of IACI Act",
    "산업재해보상보험법 시행령(대통령령)(제35947호)(20260102).pdf": "Enforcement Decree of IACI Act",
    "산업재해보상보험법(법률)(제21065호)(20260102).pdf": "IACI Act 21065 Current",
    "산업재해보상보험법(법률)(제21136호)(20260212).pdf": "IACI Act 21136 Future",
    "산업재해보상보험법에 따른 간병료 지급기준(고용노동부고시)(제2020-151호)(20210101).pdf": "Nursing Care Benefit Payment Standards"
};

// Files to KEEP (The 2 working ones)
const KEEP_DISPLAY_NAMES = [
    "Hospital Guide 2025",
    "Disability Diagnosis Guide"
];

async function reupload() {
    console.log(`🔄 Connecting to Store: ${STORE_NAME}`);

    try {
        // 1. List Existing Files using ai.files.list()
        console.log("📋 Listing current files in store...");
        const currentFiles: any[] = [];
        
        let pageToken;
        const listParams: any = { pageSize: 100 };
        
        do {
            if (pageToken) listParams.pageToken = pageToken;
            const resp: any = await ai.files.list(listParams);
            if (resp.files) {
                currentFiles.push(...resp.files);
            }
            pageToken = resp.nextPageToken;
        } while (pageToken);

        console.log(`   Found ${currentFiles.length} total files.`);

        // 2. Identify Files to Delete
        const filesToDelete = currentFiles.filter((f: any) => {
            const isKeep = KEEP_DISPLAY_NAMES.includes(f.displayName);
            if (isKeep) return false;

            const targetNames = Object.values(REUPLOAD_MAP);
            if (targetNames.includes(f.displayName)) return true; // Overwrite previous attempts (Clean Names)
            
            // Delete temp files from previous attempt
            // Check displayName AND name (sometimes displayName defaults to filename? check both)
            // Wait, I uploaded with explicit displayName in config.
            // But if I uploaded with displayName="Industrial..." but filename="temp_...", 
            // the listFiles will show displayName="Industrial...". We want to delete those too because the filename is wrong.
            // So if displayName IS one of our TARGETS, we delete it to re-upload with correct filename.
            
            // Explicitly delete random temp uploads if the displayName was missed?
            if (f.displayName && f.displayName.startsWith("temp_upload_")) return true;
            
            // AND delete the "Old Bad" names
            // Basic Heuristics for the "Bad" files
            if (f.displayName && f.displayName.includes("standards") && !targetNames.includes(f.displayName)) return true; // Only delete old standard ones
            if (f.displayName && f.displayName.includes("industrial_accident")) return true;
            if (f.displayName === "cardiovascular_musculoskeletal_diseases_criteria") return true;
            if (f.name.startsWith("files/")) return false; // Don't delete random stuff unless we are sure

            return false;
        });

        // Refined filter: Just match vaguely against our target map keys or values or the "bad" pattern
        // The safest way is to delete anything that's clearly one of the RAG docs but NOT in the Keep list.
        // Given the verification script output, we saw the display names directly.
        

        // 2a. Identify Temp Files to Delete (Cleanup from previous failed attempt)
        const tempFilesToDelete = currentFiles.filter((f: any) => f.displayName && f.displayName.startsWith("temp_upload_"));
        if (tempFilesToDelete.length > 0) {
             console.log(`🗑️  Found ${tempFilesToDelete.length} temp files to clean up...`);
             filesToDelete.push(...tempFilesToDelete);
        }

        console.log(`🗑️  Found ${filesToDelete.length} files to delete... (IDs: ${filesToDelete.map((f: any) => f.name).join(', ')})`);

        // 3. Delete Files
        for (const file of filesToDelete) {
            console.log(`   Deleting: ${file.displayName} (${file.name})`);
            try {
                await ai.files.delete({ name: file.name });
            } catch (e) {
                console.error(`   Failed to delete ${file.name}:`, e);
            }
        }

        // 4. Upload Files
        console.log("\n🚀 Uploading renewed files...");
        
        for (const [filename, newDisplayName] of Object.entries(REUPLOAD_MAP)) {
            const originalPath = path.join(DATA_DIR, filename);
            if (!fs.existsSync(originalPath)) {
                console.error(`   ❌ File not found: ${filename}`);
                continue;
            }

            // Create verify meaningful ASCII/English filename
            // We use the newDisplayName but replace spaces with underscores for safety, and add .pdf
            const safename = newDisplayName.replace(/ /g, "_") + ".pdf";
            const tempPath = path.join(DATA_DIR, safename);
            fs.copyFileSync(originalPath, tempPath);

            console.log(`   Uploading: "${newDisplayName}" (File: ${safename})`);
            
            try {
                // Use uploadToFileSearchStore helper
                // Note: Types provided by @google/genai might differ slightly but setup script used this.
                const uploadResult: any = await ai.fileSearchStores.uploadToFileSearchStore({
                    file: tempPath,
                    fileSearchStoreName: STORE_NAME,
                    config: {
                         displayName: newDisplayName
                    }
                });
                
                // Check result structure safely
                // Sometimes it wraps it in 'fileSearchStoreOperation' or similar
                const resultFile = uploadResult.file || uploadResult; 
                console.log(`      -> Uploaded! Name: ${resultFile.name}, State: ${resultFile.state}`);
                
            } catch (e) {
                console.error(`      ❌ Upload Error for ${filename}:`, e);
            } finally {
                if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
            }
        }

    } catch (e) {
        console.error("Critical Error:", e);
    }
}

reupload();
