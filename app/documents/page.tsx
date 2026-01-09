import DocumentsList from '@/components/documents/DocumentsList';
import DocumentsHero from '@/components/documents/DocumentsHero';

interface DocumentsPageProps {
  searchParams: Promise<{ stage?: string }>;
}

export default async function DocumentsPage({ searchParams }: DocumentsPageProps) {
  const params = await searchParams;
  const stage = params.stage ? parseInt(params.stage, 10) : undefined;

  return (
    <>
      <DocumentsHero />

      <div className="relative w-screen left-[calc(-50vw+50%)] bg-[#eff2f5] min-h-screen -mt-12">
        <div className="container mx-auto px-4 sm:px-6 pb-20 pt-12 max-w-7xl">
          <DocumentsList initialStage={stage} />
        </div>
      </div>
    </>
  );
}
