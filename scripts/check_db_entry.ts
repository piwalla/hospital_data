
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function checkDb() {
  console.log("🔍 Checking DB for 'Vocational_Training_Application.pdf'...");
  const { data, error } = await supabase
    .from('rag_documents')
    .select('*')
    // Check both display_name (PK) and original_name
    .or(`display_name.ilike.%Vocational_Training%,original_name.ilike.%Vocational_Training%`);

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Results:", data);
}

checkDb();
