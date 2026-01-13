"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DocumentSummary from "./DocumentSummary";
import DocumentAssistant from "./DocumentAssistant";
import { Document } from "@/lib/types/document";
import { FileText, Maximize2, Download, FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocumentTabsProps {
  document: Document;
}

export default function DocumentTabs({ document }: DocumentTabsProps) {
  // 탭 상태 관리 (기본값: 안내)
  const [activeTab, setActiveTab] = useState("guide");

  // 서식 파일이 PDF인지 확인 (미리보기 가능 여부)
  const isFormPdf = document.officialDownloadUrl?.toLowerCase().endsWith('.pdf');
  // 가이드 PDF 존재 여부
  const hasGuidePdf = !!document.guidePdfPath;
  
  // 미리보기 탭에 표시할 파일 결정 (서식 우선, 없으면 가이드)
  // 단, 가이드 PDF가 "PDF 진행과정"으로 언급되었으므로 가이드도 중요함.
  // 여기서는 탭 내부에서 선택 가능하게 하거나 둘 다 보여줄 수 있음.
  // 복잡도를 줄이기 위해: 서식 PDF가 있으면 서식, 없으면 가이드 PDF를 메인으로.
  
  const previewUrl = isFormPdf 
    ? document.officialDownloadUrl 
    : hasGuidePdf 
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/uploads/${encodeURIComponent(document.guidePdfPath!)}` 
      : null;

  const previewTitle = isFormPdf ? "서식 미리보기" : "진행 과정 안내";

  return (
    <Tabs defaultValue="guide" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="sticky top-[89px] z-20 bg-[var(--background)] pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
        <TabsList className="grid w-full grid-cols-3 h-12 p-1 bg-slate-100/80 backdrop-blur">
          <TabsTrigger value="guide" className="text-xs sm:text-sm font-medium">
            서류 안내
          </TabsTrigger>
          <TabsTrigger value="preview" className="text-xs sm:text-sm font-medium" disabled={!previewUrl}>
            서식 미리보기
          </TabsTrigger>
          <TabsTrigger value="ai-chat" className="text-xs sm:text-sm font-medium">
            AI 서류 상담
          </TabsTrigger>
        </TabsList>
      </div>

      <div className="mt-4 min-h-[500px]">
        {/* 1. 서류 안내 탭 */}
        <TabsContent value="guide" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
          <DocumentSummary document={document} />
        </TabsContent>

        {/* 2. 서식 미리보기 탭 */}
        <TabsContent value="preview" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
          {previewUrl ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <FileSearch className="w-5 h-5 text-[var(--primary)]" />
                  {previewTitle}
                </h3>
               
                {/* 다운로드 버튼 */}
                <Button 
                   variant="outline" 
                   size="sm" 
                   className="gap-2 h-9"
                   asChild
                >
                  <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">다운로드</span>
                  </a>
                </Button>
              </div>

              {/* PDF 뷰어 컨테이너 */}
              <div className="relative bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-inner group">
                
                {/* 모바일: 전체화면 버튼 표시 */}
                <div className="block sm:hidden p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm mb-4">
                    <FileText className="w-8 h-8 text-slate-400" />
                  </div>
                  <h4 className="font-semibold text-slate-900">모바일 환경입니다</h4>
                  <p className="text-sm text-slate-500">
                    작은 화면에서는 PDF 확인이 어려울 수 있습니다.<br/>
                    아래 버튼을 눌러 전체화면으로 확인하세요.
                  </p>
                  <Button className="w-full gap-2 mt-4" asChild>
                    <a href={`/view-pdf?file=${encodeURIComponent(previewUrl)}`}>
                      <Maximize2 className="w-4 h-4" />
                      서식 전체화면으로 보기
                    </a>
                  </Button>
                </div>

                {/* 데스크톱: iframe 표시 */}
                <div className="hidden sm:block relative w-full h-[700px]">
                  <iframe
                    src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
                    className="w-full h-full"
                    title={previewTitle}
                  />
                  {/* 오버레이 버튼 (전체화면) */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                     <Button variant="secondary" size="sm" className="gap-2 shadow-lg" asChild>
                        <a href={`/view-pdf?file=${encodeURIComponent(previewUrl)}`} target="_blank">
                          <Maximize2 className="w-4 h-4" />
                          새 창에서 크게 보기
                        </a>
                     </Button>
                  </div>
                </div>

              </div>
              
              <p className="text-xs text-slate-500 text-center">
                * 미리보기가 보이지 않는 경우 다운로드하여 확인해주세요.
              </p>
            </div>
          ) : (
             <div className="py-12 text-center text-muted-foreground bg-slate-50 rounded-xl border border-dashed">
               미리보기를 제공하지 않는 서류입니다.
             </div>
          )}
        </TabsContent>

        {/* 3. AI 전문가 상담 탭 */}
        <TabsContent value="ai-chat" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
          <div className="max-w-3xl mx-auto">
             <DocumentAssistant documentName={document.name} />
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
}
