import { NextResponse } from 'next/server';
import { createClerkSupabaseClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = await createClerkSupabaseClient();
  const addressPattern = '%서울%';

  // Count Hospitals
  const { count: hospitalCount, error: hError } = await supabase
    .from('hospitals_pharmacies')
    .select('*', { count: 'exact', head: true })
    .ilike('address', addressPattern);

  // Count Pharmacies
  const { count: pharmacyCount, error: pError } = await supabase
    .from('hospitals_pharmacies')
    .select('*', { count: 'exact', head: true })
    .ilike('address', addressPattern)
    .eq('type', 'pharmacy');

  return NextResponse.json({
    region: 'Seoul',
    total_match_seoul: hospitalCount,
    pharmacy_match_seoul: pharmacyCount,
    hError,
    pError
  });
}
