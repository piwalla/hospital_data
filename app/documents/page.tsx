import DocumentsList from '@/components/documents/DocumentsList';

interface DocumentsPageProps {
  searchParams: Promise<{ stage?: string }>;
}

export default async function DocumentsPage({ searchParams }: DocumentsPageProps) {
  const params = await searchParams;
  const stage = params.stage ? parseInt(params.stage, 10) : undefined;

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12 max-w-7xl space-y-8 sm:space-y-10 md:space-y-16">
      {/* 페이지 헤더 */}
      <div className="text-center relative">
        <h1 className="text-senior-title">
          산재 서류, 너무 복잡하죠?
        </h1>
        <p className="mt-4 sm:mt-6 text-senior-body text-muted-foreground">
          모든 산재 서류 양식과 설명이 여기 다 있습니다.
        </p>
      </div>

      {/* UX Writing 안내 문구 */}
      <DocumentsList initialStage={stage} />
    </div>
  );
}


