import DocumentsList from '@/components/documents/DocumentsList';
import RiuIcon from '@/components/icons/riu-icon';

export default function DocumentsPage() {
  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12 max-w-7xl space-y-6 sm:space-y-8 md:space-y-12">
      <div 
        className="leaf-section rounded-2xl border border-[var(--border-light)] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 sm:p-6"
        role="region"
        aria-label="서류 안내"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <RiuIcon variant="cheer" size={40} className="sm:w-14 sm:h-14" aria-hidden="true" />
          <h1 className="text-xl sm:text-2xl md:text-[30px] font-bold text-foreground">필요한 산재 서류를 확인하세요</h1>
        </div>
      </div>

      <DocumentsList />
    </div>
  );
}


