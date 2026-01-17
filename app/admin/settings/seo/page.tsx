import { getSeoConfig } from '@/app/actions/admin-settings';
import SeoSettingsForm from '@/components/admin/settings/SeoSettingsForm';

export const dynamic = 'force-dynamic';

export default async function SeoSettingsPage() {
  const config = await getSeoConfig();

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">SEO 및 시스템 설정</h1>
        <p className="text-sm text-gray-500 mt-1">
          웹사이트의 검색 엔진 최적화 및 광고 설정을 관리합니다.
        </p>
      </div>
      <SeoSettingsForm initialConfig={config} />
    </div>
  );
}
