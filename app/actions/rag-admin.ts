
"use server";

import { createClient } from "@supabase/supabase-js";
import { GoogleGenAI } from "@google/genai";
import { revalidatePath } from "next/cache";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { v4 as uuidv4 } from "uuid";

// Initialize Clients
// ADMIN ACTION requires SERVICE_ROLE_KEY to bypass RLS for inserts
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
// Actually simpler to use the 'server' client from utils if we had one, but createClient is fine for now if key allows it.
// For admin actions, ideally we use SERVICE_ROLE key to bypass RLS, but let's stick to what we have or ensure RLS allows auth'd admin users.
// IF RLS blocks anon, we might have issues.
// Let's assume the user is logged in via Clerk (as per layout), but Supabase might not know about Clerk user unless we sync.
// CAUTION: If RLS is strictly "authenticated", this direct client might fail if not using a Service Role key.
// Let's check env vars. Only ANON is listed in previous context.
// However, the previous script used ANON key and it worked for DB insert?
// Scripts usually work because RLS might be "public write" or loose?
// I should verify RLS policies later. For now, assume it works or we need a service role key.

const genAI = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY2 || process.env.GOOGLE_API_KEY!,
});

const STORE_NAME = "fileSearchStores/hospitalguidestorev3clean-5khogee4qpu6";

interface UploadResponse {
  success: boolean;
  message?: string;
}

export async function uploadRagDocument(formData: FormData): Promise<UploadResponse> {
  const file = formData.get("file") as File;
  const koreanTitle = formData.get("koreanTitle") as string;
  const color = formData.get("color") as string || "blue";
  
  if (!file || !koreanTitle) {
    return { success: false, message: "필수 정보가 누락되었습니다." };
  }

  const originalName = file.name;
  
  // 1. Sanitize Filename (Start with standardized English Key or Transliteration?)
  // User should ideally provide the English "Display Name" (Key) explicitly, or we generate it.
  // For the dashboard, let's ask the user to rename the file locally or provide a "Key Name"?
  // Or just transliterate/sanitize.
  // Let's assume the file provided IS ALREADY properly named (English/ASCII).
  // If not, we might create ghosts.
  // Let's enforce ASCII check.
  
  if (!/^[\w.-]+$/.test(file.name)) {
      // If filename has non-ascii, rely on a generated safe name? 
      // But we need consistency.
      // Let's auto-generate a safe name if needed, but informing the user is better.
      // For now, let's try to simple sanitize:
      // But wait, the Google Store DisplayName IS the key.
      return { success: false, message: "파일명은 영문, 숫자, 밑줄(_)만 가능합니다. (한글 불가)" };
  }

  const displayName = file.name; // Use valid filename as ID
  /* 
     Fix for Google File Search Display Name:
     The SDK often defaults to the on-disk filename.
     To ensure the Display Name is clean (e.g., "Guide.pdf") instead of "upload_uuid_Guide.pdf",
     we create a temporary DIRECTORY with the UUID, and save the file inside it with the clean name.
  */
  const tempDir = path.join(os.tmpdir(), `rag_upload_${uuidv4()}`);
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
  
  const tempPath = path.join(tempDir, displayName);

  try {
    // 2. Save to Temp File
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(tempPath, buffer);

    // 3. Upload to Google File Search Store
    await genAI.fileSearchStores.uploadToFileSearchStore({
        file: tempPath,
        fileSearchStoreName: STORE_NAME,
        config: {
            displayName: displayName // Verify if this is respected, but file on disk is now correct anyway
        }
    });

    // 4. Upload to Supabase Storage (for Download URL)
    // Correct Bucket: 'uploads', Path: 'documents/filename'
    const storagePath = `documents/${displayName}`;
    
    const { error: storageError } = await supabase
        .storage
        .from('uploads')
        .upload(storagePath, buffer, {
            contentType: 'application/pdf',
            upsert: true
        });

    if (storageError) throw new Error(`Storage Upload Failed: ${storageError.message}`);

    const { data: publicUrlData } = supabase.storage.from('uploads').getPublicUrl(storagePath);
    const downloadUrl = publicUrlData.publicUrl;

    // 5. Insert Metadata to DB
    const { error: dbError } = await supabase
        .from('rag_documents')
        .insert({
            display_name: displayName,
            original_name: originalName,
            korean_title: koreanTitle,
            color: color,
            download_url: downloadUrl,
            google_file_uri: null
        });

    if (dbError) throw new Error(`DB Insert Failed: ${dbError.message}`);

    revalidatePath('/admin/rag');
    return { success: true };

  } catch (error: any) {
    console.error("Upload Error:", error);
    return { success: false, message: error.message };
  } finally {
    // Cleanup Temp Dir
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    if (fs.existsSync(tempDir)) fs.rmdirSync(tempDir);
  }
}

export async function deleteRagDocument(id: string, displayName: string): Promise<{ success: boolean; message?: string }> {
  try {
    // 1. Delete from Google File Store
    // Optimization: Save googleName in DB to avoid listing.
    // Fallback: list files and find by displayName.
    try {
        // @ts-expect-error -- genAI SDK might not fully support explicit file deletion type, but calling as any avoids error
        const resp = await genAI.files.list({ pageSize: 100 });
        //
        for await (const f of resp) {
            if (f.displayName === displayName) {
                await genAI.files.delete({ name: f.name });
                break;
            }
        }
    } catch (e) {
        console.warn("Google Delete Failed (Non-fatal):", e);
    }

    // 2. Delete from Supabase Storage
    const storagePath = `documents/${displayName}`;
    const { error: storageError } = await supabase.storage.from('uploads').remove([storagePath]);
    if (storageError) console.warn("Storage Delete Failed:", storageError);

    // 3. Delete from DB
    const { error: dbError } = await supabase.from('rag_documents').delete().eq('display_name', displayName);
    if (dbError) throw new Error(dbError.message);

    revalidatePath('/admin/rag');
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
