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





import { useEffect, useState } from "react";
import { Locale, dashboardTranslations } from "@/lib/i18n/config";

interface CuratedContentProps {
  documents: TimelineDocument[];
  warnings: TimelineWarning[];
  stepNumber: number;
  userName?: string;
}

// ... (existing code for CONTENT_TAGS and scoreContent) ...

export default function CuratedContent({ documents, stepNumber, userName }: CuratedContentProps) {
  const [locale, setLocale] = useState<Locale>('ko');

  useEffect(() => {
    const savedLocale = localStorage.getItem('user_locale') as Locale;
    if (savedLocale && dashboardTranslations[savedLocale]) {
      setLocale(savedLocale);
    }

    const handleLocaleChange = () => {
      const updatedLocale = localStorage.getItem('user_locale') as Locale;
      if (updatedLocale && dashboardTranslations[updatedLocale]) {
        setLocale(updatedLocale);
      }
    };

    window.addEventListener('user_locale', handleLocaleChange);
    window.addEventListener('localeChange', handleLocaleChange);
    window.addEventListener('storage', handleLocaleChange);

    return () => {
      window.removeEventListener('user_locale', handleLocaleChange);
      window.removeEventListener('localeChange', handleLocaleChange);
      window.removeEventListener('storage', handleLocaleChange);
    };
  }, []);

  const t = dashboardTranslations[locale]?.curatedContent || dashboardTranslations['ko'].curatedContent;
  const docsT = dashboardTranslations[locale]?.documents || dashboardTranslations['en']?.documents || {};
  const headerT = dashboardTranslations[locale]?.header || dashboardTranslations['ko'].header;
  
  const displayName = (userName && userName !== '홍길동') ? 
    userName : 
    (locale === 'ko' ? '회원' : headerT.guestGreeting.replace('Hello, ', '').replace('!', ''));

  const formatDocTitle = (title: string) => {
    // Remove content in parentheses and trim
    return title.replace(/\s*\(.*?\)/g, '').trim();
  };

  // Helper to render warning icon
  const renderWarningIcon = (type: WarningType) => {
    // ...
    switch (type) {
      case 'alert': return <AlertCircle className="w-5 h-5 text-slate-900" />;
      case 'camera': return <Camera className="w-5 h-5 text-slate-900" />;
      case 'check': return <CheckCircle2 className="w-5 h-5 text-slate-900" />;
      case 'money': return <Coins className="w-5 h-5 text-slate-900" />;
      case 'ban': return <Ban className="w-5 h-5 text-slate-900" />;
      case 'hospital': return <Building className="w-5 h-5 text-slate-900" />;
      case 'file': return <FileText className="w-5 h-5 text-slate-900" />;
      case 'clock': return <Clock className="w-5 h-5 text-slate-900" />;
      case 'job': return <Briefcase className="w-5 h-5 text-slate-900" />;
      case 'refresh': return <RotateCcw className="w-5 h-5 text-slate-900" />;
      case 'scale': return <Scale className="w-5 h-5 text-slate-900" />;
      default: return <AlertTriangle className="w-5 h-5 text-slate-900" />;
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
      <div className="bg-white rounded-none border-x-0 border-y sm:border sm:rounded-3xl border-slate-100 shadow-sm p-6 sm:p-7 flex flex-col">
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
          <span className="w-2 h-7 bg-primary rounded-full inline-block shadow-[0_4px_12px_rgba(20,83,45,0.3)]" />
          {t.title.replace('{name}', displayName)}
        </h3>

        <div className="flex-1">
          {sortedDocuments.length === 0 ? (
            <div className="h-full flex items-center justify-center p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
               <p className="text-sm text-slate-400">{t.noRequiredDocuments}</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {sortedDocuments.map((doc) => (
                <li key={doc.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                      doc.is_required ? "bg-slate-100 text-slate-900" : "bg-slate-50 text-slate-900"
                    )}>
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-lg font-black text-slate-800 truncate pr-2 group-hover:text-primary transition-colors">
                        {docsT[doc.id] || formatDocTitle(doc.title)}
                      </p>
                    </div>
                  </div>
                  
                  {(doc.pdf_url || doc.guide_url) && (
                    <a 
                      href={doc.pdf_url || doc.guide_url || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all ml-2"
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
      <div className="bg-white rounded-none border-x-0 border-y sm:border sm:rounded-3xl border-slate-100 shadow-sm p-6 sm:p-7 flex flex-col">
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
          <span className="w-2 h-7 bg-primary rounded-full inline-block shadow-[0_4px_12px_rgba(20,83,45,0.3)]" />
          {t.noticesTitle}
        </h3>
        
        <div className="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-100">
          {(() => {
            const stageWarnings = getStageWarnings(stepNumber);
            
            return stageWarnings.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-slate-500">{t.noNotices || '특별한 주의사항이 없습니다.'}</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {stageWarnings.map((warning, index) => (
                  <li key={index} className="flex gap-3 items-start">
                    <div className="mt-0.5 flex-shrink-0 bg-white p-1 rounded-full shadow-sm">
                      {renderWarningIcon(warning.type)}
                    </div>
                    <div>
                      <p className="text-lg font-black text-slate-900">{warning.title}</p>
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
