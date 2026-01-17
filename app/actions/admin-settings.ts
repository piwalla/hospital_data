'use server';


import { unstable_cache } from 'next/cache';
import { revalidateTag } from 'next/cache';
import { auth } from '@clerk/nextjs/server';

export interface SeoConfig {
  google_site_verification: string;
  naver_site_verification: string;
  bing_site_verification: string;
  adsense_client_id: string;
}

const SEO_CONFIG_KEY = 'seo_config';

import { createClient } from '@supabase/supabase-js';

export const getSeoConfig = unstable_cache(
  async (): Promise<SeoConfig | null> => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data } = await supabase
      .from('system_config')
      .select('value')
      .eq('key', SEO_CONFIG_KEY)
      .single();

    if (!data) return null;
    return data.value as SeoConfig;
  },
  ['seo-config'],
  { tags: ['seo-config'], revalidate: 3600 }
);

export async function updateSeoConfig(config: SeoConfig) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Admin 작업을 위해 Service Role Key 사용 (RLS 우회)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  const { error } = await supabase
    .from('system_config')
    .upsert({
      key: SEO_CONFIG_KEY,
      value: config, // Supabase JSONB column handles object automatically
      updated_at: new Date().toISOString(),
      updated_by: userId,
    });
    
  if (error) {
    console.error('Failed to update SEO config:', error);
    throw new Error(`Failed to update configuration: ${error.message}`);
  }

  revalidateTag('seo-config');
  return { success: true };
}
