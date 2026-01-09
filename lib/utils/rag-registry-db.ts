
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Ensure env vars are loaded if running as a script/helper
dotenv.config();

// Initialize Supabase Client
// Note: We use the ANON key because the table has public read access enabled.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.warn("⚠️ Supabase credentials missing during initialization of rag-registry-db");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export interface RagDocumentMetadata {
  display_name: string;
  original_name: string;
  korean_title: string;
  color: string;
  download_url: string;
}

/**
 * Validates if the given title exists in the DB registry.
 * Returns the full metadata if found, or null.
 * 
 * @param displayName The English filename (e.g., "Hospital_Guide_2025.pdf")
 */
export async function getRagMetadataFromDb(displayName: string): Promise<RagDocumentMetadata | null> {
  if (!displayName) return null;

  try {
    const { data, error } = await supabase
      .from('rag_documents')
      .select('*')
      .eq('display_name', displayName)
      .single();

    if (error) {
      if (error.code !== 'PGRST116') { // Ignore "Row not found" errors
          console.error(`[RagRegistryDB] Error fetching metadata for ${displayName}:`, error.message);
      }
      return null;
    }

    return data as RagDocumentMetadata;
  } catch (err) {
    console.error(`[RagRegistryDB] Unexpected error:`, err);
    return null;
  }
}
