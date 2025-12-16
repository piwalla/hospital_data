import DocumentsList from '@/components/documents/DocumentsList';

export default function DocumentsPage() {
  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12 max-w-7xl space-y-8 sm:space-y-10 md:space-y-16">
      {/* 페이지 헤더 */}
      <div className="text-center relative">
        <h1 className="text-senior-title">
          어떤 서류가 필요한가요?
        </h1>
        <p className="mt-4 sm:mt-6 text-senior-body text-muted-foreground">
          필요한 모든 서류 양식이 여기 있습니다.
        </p>
      </div>

      <DocumentsList />
    </div>
  );
}


