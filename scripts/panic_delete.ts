
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from "@google/genai";
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY2 || process.env.GOOGLE_API_KEY!
});

async function panicDelete() {
    const BAD_FILENAME_PART = "upload_375b80f8"; // Unique uuid part from log
    const CLEAN_NAME = "Vocational_Training_Application.pdf";

    console.log("🚨 Starting Panic Delete...");

    // 1. Delete from Google File Search
    // First find the file by listing
    let pageToken;
    let foundGoogleFile = null;
    
    console.log("   Searching Google Store...");
    do {
        const resp: any = await ai.files.list({ pageSize: 100, pageToken });
        if (resp.files) {
            const match = resp.files.find((f: any) => f.displayName.includes(BAD_FILENAME_PART));
            if (match) {
                foundGoogleFile = match;
                break;
            }
        }
        pageToken = resp.nextPageToken;
    } while (pageToken);

    if (foundGoogleFile) {
        console.log(`   Found Google File: ${foundGoogleFile.displayName} (${foundGoogleFile.name})`);
        await ai.files.delete({ name: foundGoogleFile.name });
        console.log("   ✅ Deleted from Google.");
    } else {
        console.log("   ⚠️ Google File not found (maybe already gone?)");
    }

    // 2. Delete from Supabase DB
    console.log(`   Deleting '${CLEAN_NAME}' from DB...`);
    const { error } = await supabase
        .from('rag_documents')
        .delete()
        .eq('display_name', CLEAN_NAME);

    if (error) console.error("   ❌ DB Delete Error:", error.message);
    else console.log("   ✅ Deleted from DB.");

    // 3. Delete from Supabase Storage
    console.log(`   Deleting '${CLEAN_NAME}' from Supabase Storage...`);
    const { error: storageError } = await supabase
        .storage
        .from('uploads')
        .remove([`documents/${CLEAN_NAME}`]);
    
    if (storageError) console.error("   ❌ Storage Delete Error:", storageError.message);
    else console.log("   ✅ Deleted from Storage.");
}

panicDelete();
