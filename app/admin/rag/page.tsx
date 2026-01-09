
import { RagDocumentList } from "@/components/admin/rag/RagDocumentList";
import { RagUploadForm } from "@/components/admin/rag/RagUploadForm";

// Assuming we don't have a specific server client utility yet, let's check.
// If not, I'll use common pattern.

// Actually, I'll use the 'rag-registry-db.ts' logic but adapted for list fetching?
// Or just direct supabase call here.

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export const dynamic = 'force-dynamic';

export default async function RagAdminPage() {
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: documents, error } = await supabase
    .from("rag_documents")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching documents:", error);
    return <div>Error loading documents</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">RAG 문서 관리</h1>
          <p className="text-sm text-slate-500 mt-1">
            챗봇이 사용하는 지식 문서(PDF)를 관리합니다. 여기에 등록된 문서는 자동으로 Google File Search에 업로드됩니다.
          </p>
        </div>
        <RagUploadForm />
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <RagDocumentList documents={documents || []} />
      </div>
    </div>
  );
}
