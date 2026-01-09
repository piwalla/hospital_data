
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // or SERVICE_ROLE_KEY if needed for bucket policy

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function uploadFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    process.exit(1);
  }

  const fileName = path.basename(filePath);
  const fileContent = fs.readFileSync(filePath);

  // Upload to 'uploads' bucket, folder 'documents'
  const targetPath = `documents/${fileName}`;

  console.log(`Uploading ${fileName} to Supabase Storage (${targetPath})...`);

  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(targetPath, fileContent, {
      contentType: 'application/pdf',
      upsert: true
    });

  if (error) {
    console.error("❌ Upload failed:", error.message);
    process.exit(1);
  }

  // Get Public URL
  const { data: { publicUrl } } = supabase.storage
    .from('uploads')
    .getPublicUrl(targetPath);

  console.log(`✅ Upload successful!`);
  console.log(`Public URL: ${publicUrl}`);
}

const targetFile = process.argv[2];
if (!targetFile) {
  console.error("Usage: npx tsx scripts/upload_to_supabase_storage.ts <file_path>");
  process.exit(1);
}

uploadFile(targetFile);
