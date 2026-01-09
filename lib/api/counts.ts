import { createClerkSupabaseClient } from '@/lib/supabase/server';

export interface RegionCounts {
  hospital: number;
  pharmacy: number;
  rehabilitation: number;
  certified: number;
}

export async function getRegionCounts(
  provinceName: string,
  districtName?: string,
  subDistrictName?: string
): Promise<RegionCounts> {
  const supabase = await createClerkSupabaseClient();
  
  // 1. Base Query Builder
  const buildQuery = (table: 'hospitals_pharmacies' | 'rehabilitation_centers') => {
    let query = supabase.from(table).select('*', { count: 'exact', head: true });
    
    // Address Pattern Matching
    const patterns = [provinceName];
    // Simple short name handling (Seoul Teukbyeolsi -> Seoul)
    // Common cases: '경기도' -> '경기', '인천광역시' -> '인천', '전라북도' -> '전북' (special handling needed?)
    // For now, standard removal of suffixes.
    const shortName = provinceName
      .replace(/특별시|광역시|특별자치도|특별자치시/g, '')
      .replace(/도$/, '');
      
    if (shortName !== provinceName) patterns.push(shortName);

    // Build OR clause for province patterns
    // Syntax: .or('address.ilike.%Val1%,address.ilike.%Val2%')
    const orClause = patterns
      .map(p => `address.ilike.%${p}%`)
      .join(',');

    query = query.or(orClause);

    // Filter construction for districts
    // Supabase chains are AND by default, so .or(...).ilike(...) means (A or B) AND C
    if (districtName) {
       query = query.ilike('address', `%${districtName}%`);
       if (subDistrictName) {
         query = query.ilike('address', `%${subDistrictName}%`);
       }
    }
    
    return query;
  };

  // Run counts in parallel
  const [hospitals, pharmacies, certified, rehab] = await Promise.all([
    // 1. Hospitals
    buildQuery('hospitals_pharmacies').eq('type', 'hospital'),
    
    // 2. Pharmacies
    buildQuery('hospitals_pharmacies').eq('type', 'pharmacy'),
    
    // 3. Certified Hospitals (Hospitals also checked for certified flag)
    buildQuery('hospitals_pharmacies').eq('type', 'hospital').eq('is_rehabilitation_certified', true),
    
    // 4. Rehab Centers
    buildQuery('rehabilitation_centers')
  ]);

  return {
    hospital: hospitals.count || 0,
    pharmacy: pharmacies.count || 0,
    certified: certified.count || 0,
    rehabilitation: rehab.count || 0
  };
}
