"use client";

import { 
  FileText, 
  AlertTriangle, 
  Download, 
  AlertCircle, 
  Camera, 
  CheckCircle2, 
  Coins, 
  Ban, 
  Building, 
  Clock, 
  Briefcase, 
  RotateCcw, 
  Scale 
} from "lucide-react";
import { TimelineDocument, TimelineWarning } from "@/lib/types/timeline";
import { cn } from "@/lib/utils";
import { getStageWarnings, WarningType } from "@/lib/data/warnings";




interface CuratedContentProps {
  documents: TimelineDocument[];
  warnings: TimelineWarning[];
  stepNumber: number;
}

// ... (existing code for CONTENT_TAGS and scoreContent) ...

export default function CuratedContent({ documents, stepNumber }: CuratedContentProps) {
  
  const formatDocTitle = (title: string) => {
    // Remove content in parentheses and trim
    return title.replace(/\s*\(.*?\)/g, '').trim();
  };

  // Helper to render warning icon
  const renderWarningIcon = (type: WarningType) => {
    switch (type) {
      case 'alert': return <AlertCircle className="w-5 h-5 text-rose-500" />;
      case 'camera': return <Camera className="w-5 h-5 text-slate-500" />;
      case 'check': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'money': return <Coins className="w-5 h-5 text-emerald-600" />;
      case 'ban': return <Ban className="w-5 h-5 text-rose-500" />;
      case 'hospital': return <Building className="w-5 h-5 text-blue-500" />; // Keep Blue for Hospital for consistency
      case 'file': return <FileText className="w-5 h-5 text-emerald-500" />;
      case 'clock': return <Clock className="w-5 h-5 text-slate-500" />;
      case 'job': return <Briefcase className="w-5 h-5 text-teal-600" />;
      case 'refresh': return <RotateCcw className="w-5 h-5 text-emerald-600" />;
      case 'scale': return <Scale className="w-5 h-5 text-slate-600" />;
      default: return <AlertTriangle className="w-5 h-5 text-teal-500" />;
    }
  };

  // Sort documents: Required first
  const sortedDocuments = [...documents].sort((a, b) => {
    if (a.is_required && !b.is_required) return -1;
    if (!a.is_required && b.is_required) return 1;
    return a.order_index - b.order_index;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 1. Essential Documents */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-none sm:shadow-sm p-5 flex flex-col">
        <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-600" />
          이 단계에서 확인할 문서
        </h3>

        <div className="flex-1">
          {sortedDocuments.length === 0 ? (
            <div className="h-full flex items-center justify-center p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
               <p className="text-sm text-slate-400">필요한 문서가 없습니다.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {sortedDocuments.map((doc) => (
                <li key={doc.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                      doc.is_required ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"
                    )}>
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-700 truncate pr-2 group-hover:text-emerald-700 transition-colors">
                        {formatDocTitle(doc.title)}
                      </p>
                      {doc.is_required && (
                        <p className="text-[10px] font-bold text-emerald-500 mt-0.5">필수 제출</p>
                      )}
                    </div>
                  </div>
                  
                  {(doc.pdf_url || doc.guide_url) && (
                    <a 
                      href={doc.pdf_url || doc.guide_url || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white transition-all ml-2"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* 2. Warnings / Tips */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-none sm:shadow-sm p-5 flex flex-col">
        <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-teal-500" />
          잠깐! 놓치지 마세요
        </h3>
        
        <div className="flex-1 bg-teal-50/50 rounded-xl p-4 border border-teal-100">
          {(() => {
            const stageWarnings = getStageWarnings(stepNumber);
            
            return stageWarnings.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-teal-800/60">특별한 주의사항이 없습니다.</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {stageWarnings.map((warning, index) => (
                  <li key={index} className="flex gap-3 items-start">
                    <div className="mt-0.5 flex-shrink-0 bg-white p-1 rounded-full shadow-sm">
                      {renderWarningIcon(warning.type)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-teal-900 mb-1">{warning.title}</p>
                      <p className="text-xs text-teal-800 leading-relaxed">
                        {warning.description.split('**').map((part, i) => 
                          i % 2 === 1 ? <strong key={i} className="font-bold text-teal-900 bg-teal-100/80 px-1 rounded">{part}</strong> : part
                        )}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
