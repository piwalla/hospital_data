
import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: '.env' });

const apiKey = process.env.GOOGLE_API_KEY2 || process.env.GOOGLE_API_KEY;
if (!apiKey) {
    throw new Error("GOOGLE_API_KEY not found");
}

const ai = new GoogleGenAI({ apiKey });

const OLD_STORE_NAME = "fileSearchStores/hospitalguidestorev2fixed-nntiy5lzyybo";
const NEW_STORE_DISPLAY_NAME = "Hospital_Guide_Store_V3_Clean";
const DATA_DIR = path.join(process.cwd(), "docs/rag_test_data");

const CLEAN_FILES_MAP: Record<string, string> = {
    // Original Filename -> New Clean Title (Display Name & Filename Base)
    "2025 산재 보험 보상 및 재활 서비스 가이드(근로복지공단 제공).pdf": "Hospital Guide 2025",
    "장해진단서_작성원칙_및_유의사항(근로복지공단).pdf": "Disability Diagnosis Guide",
    "[pdf]산업재해보상보험Ⅰ(업무상 재해).pdf": "Industrial Accident Insurance Criteria",
    "뇌혈관 질병 또는 심장 질병 및 근골격계 질병의 업무상 질병 인정 여부 결정에 필요한 사항(고용노동부고시)(제2022-40호)(20220701).pdf": "Cardiovascular and Musculoskeletal Diseases Criteria",
    "산업재해보상보험 요양급여 산정기준(고용노동부고시)(제2022-87호)(20230101).pdf": "Medical Care Benefit Calculation Standards",
    "산업재해보상보험법 시행규칙(고용노동부령)(제00445호)(20250621).pdf": "Enforcement Rule of IACI Act",
    "산업재해보상보험법 시행령(대통령령)(제35947호)(20260102).pdf": "Enforcement Decree of IACI Act",
    "산업재해보상보험법(법률)(제21065호)(20260102).pdf": "IACI Act 21065 Current",
    "산업재해보상보험법(법률)(제21136호)(20260212).pdf": "IACI Act 21136 Future",
    "산업재해보상보험법에 따른 간병료 지급기준(고용노동부고시)(제2020-151호)(20210101).pdf": "Nursing Care Benefit Payment Standards"
};

async function nuclearReset() {
    console.log("☢️  Initiating NUCLEAR RESET of Doc Store...");

    // 1. Create New Store
    console.log("creating new store...");
    const createStoreOp = await ai.fileSearchStores.create({
        config: {
            displayName: NEW_STORE_DISPLAY_NAME
        }
    }); 
    
    // Wait for operation if needed? SDK usually returns result or operation.
    // In GenAI SDK, create returns correct object usually.
    // If it returns a promise of operation, we might need to await it. 
    // Checking reupload script: ai.files.create is not used there.
    // `setup-gemini-store-v2-fix.ts` using `ai.fileSearchStores.create` returned `store`.
    
    const newStore = createStoreOp; // Assume it's the store object
    console.log(`✅ Created Store: ${newStore.name} (${newStore.displayName})`);

    // 2. Upload Files to New Store
    console.log("🚀 Uploading files to NEW store...");
    for (const [originalName, cleanTitle] of Object.entries(CLEAN_FILES_MAP)) {
        const originalPath = path.join(DATA_DIR, originalName);
        if (!fs.existsSync(originalPath)) {
            console.error(`❌ File missing: ${originalName}`);
            continue;
        }

        // Create Clean Filename
        const cleanFilename = cleanTitle.replace(/ /g, "_") + ".pdf";
        const tempPath = path.join(DATA_DIR, cleanFilename);
        fs.copyFileSync(originalPath, tempPath);

        console.log(`   Uploading: ${cleanTitle} (as ${cleanFilename})...`);

        try {
            const uploadOp = await ai.fileSearchStores.uploadToFileSearchStore({
                file: tempPath,
                fileSearchStoreName: newStore.name,
                config: {
                    displayName: cleanTitle
                }
            });
            console.log(`     -> Uploaded. State: ${uploadOp.file ? uploadOp.file.state : 'Unknown'}`);
        } catch (e) {
            console.error(`     -> Failed:`, e);
        } finally {
            if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        }
    }

    console.log("\n🎉 RESET COMPLETE.");
    console.log("PLEASE UPDATE `app/api/chatbot-v2/route.ts` WITH THIS NEW STORE ID:");
    console.log(`\n    const fileSearchStoreNames = ["${newStore.name}"];\n`);
    
    // 3. Mark Old Store for Deletion (Optional, print ID)
    console.log(`(Old Store ID was: ${OLD_STORE_NAME} - you may delete it manually later)`);
}

nuclearReset();
