
"use client";

import { FileText, Download, Trash2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { deleteRagDocument } from "@/app/actions/rag-admin";
import { useState } from "react";
import { Button } from "@/components/ui/button";


interface RagDocument {
  display_name: string;
  original_name: string;
  korean_title: string;
  color: string;
  download_url: string;
  created_at: string;
}

interface RagDocumentListProps {
  documents: RagDocument[];
}

export function RagDocumentList({ documents }: RagDocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500">
        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>등록된 문서가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 text-slate-500 font-medium">
          <tr>
            <th className="px-6 py-4">문서명 (한글)</th>
            <th className="px-6 py-4">파일명 (Google Key)</th>
            <th className="px-6 py-4">등록일</th>
            <th className="px-6 py-4 text-right">관리</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {documents.map((doc) => (
            <tr key={doc.display_name} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-8 rounded-sm bg-${doc.color}-500 shrink-0`} />
                  <div>
                    <div className="font-medium text-slate-900">{doc.korean_title}</div>
                    <div className="text-xs text-slate-500 truncate max-w-[200px]" title={doc.original_name}>
                      {doc.original_name}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <code className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600 font-mono">
                  {doc.display_name}
                </code>
              </td>
              <td className="px-6 py-4 text-slate-500">
                {format(new Date(doc.created_at), "yyyy-MM-dd HH:mm")}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <a
                    href={doc.download_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    PDF
                  </a>
                  <DeleteButton doc={doc} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DeleteButton({ doc }: { doc: RagDocument }) {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    if (!confirm(`'${doc.korean_title}' 문서를 삭제하시겠습니까?\n(Google 검색 엔진에서도 영구 삭제됩니다.)`)) return;
    
    setIsDeleting(true);
    try {
      const res = await deleteRagDocument(doc.display_name, doc.display_name); 
      if (!res.success) {
        alert("삭제 실패: " + res.message);
      }
    } catch {
      alert("삭제 중 오류 발생");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
      onClick={handleDelete}
      disabled={isDeleting}
      title="문서 삭제"
    >
      {isDeleting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
      <span className="sr-only">삭제</span>
    </Button>
  );
}
