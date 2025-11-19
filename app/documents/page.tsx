import DocumentsList from '@/components/documents/DocumentsList';
import DocumentAssistant from '@/components/documents/DocumentAssistant';

export default function DocumentsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-3">
          <img 
            src="/Generated_Image_November_19__2025_-_4_31PM__2_-removebg-preview.png" 
            alt="Re 캐릭터" 
            className="w-12 h-12 object-contain flex-shrink-0"
          />
          <h1 className="text-[30px] font-bold text-[#1C1C1E]">서류 안내</h1>
        </div>
        <p className="text-[16px] text-[#555555]">
          산재 관련 서류 작성 가이드를 확인하세요. AI가 서류 작성 방법을 쉽고 간단하게 설명해드립니다.
        </p>
      </div>

      <div className="space-y-12">
        <DocumentAssistant />
        <DocumentsList />
      </div>
    </div>
  );
}


