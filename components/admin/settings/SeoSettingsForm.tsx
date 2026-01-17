'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { SeoConfig, updateSeoConfig } from '@/app/actions/admin-settings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function SeoSettingsForm({ initialConfig }: { initialConfig: SeoConfig | null }) {
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit } = useForm<SeoConfig>({
    defaultValues: initialConfig || {
      google_site_verification: '',
      naver_site_verification: '',
      bing_site_verification: '',
      adsense_client_id: '',
    },
  });

  const onSubmit = async (data: SeoConfig) => {
    setIsLoading(true);
    try {
      await updateSeoConfig(data);
      alert('SEO 설정이 성공적으로 저장되었습니다.');
    } catch (error) {
      console.error(error);
      alert('저장 실패: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>SEO 및 광고 설정</CardTitle>
        <CardDescription>
          검색 엔진 소유권 확인 코드와 구글 애드센스 클라이언트 ID를 관리합니다.
          입력된 값은 웹사이트 전체에 자동으로 적용됩니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="google_site_verification">Google Site Verification</Label>
            <Input 
              id="google_site_verification" 
              placeholder="예: google-site-verification 코드를 입력하세요" 
              {...register('google_site_verification')} 
            />
            <p className="text-xs text-gray-500">구글 서치 콘솔 메타 태그의 content 값</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="naver_site_verification">Naver Site Verification</Label>
            <Input 
              id="naver_site_verification" 
              placeholder="예: naver-site-verification 코드를 입력하세요"
              {...register('naver_site_verification')} 
            />
            <p className="text-xs text-gray-500">네이버 서치어드바이저 메타 태그의 content 값</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bing_site_verification">Bing Webmaster Verification</Label>
            <Input 
              id="bing_site_verification" 
              placeholder="예: msvalidate.01 코드를 입력하세요"
              {...register('bing_site_verification')} 
            />
            <p className="text-xs text-gray-500">Bing 웹마스터 도구 메타 태그의 content 값</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="adsense_client_id">Google AdSense Client ID</Label>
            <Input 
              id="adsense_client_id" 
              placeholder="예: ca-pub-0000000000000000"
              {...register('adsense_client_id')} 
            />
            <p className="text-xs text-gray-500">&apos;ca-pub-&apos;으로 시작하는 게시자 ID</p>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full bg-[#14532d] hover:bg-[#14532d]/90">
            {isLoading ? '저장 중...' : '설정 저장하기'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
