import { NextRequest, NextResponse } from 'next/server';
import { getRegionCounts } from '@/lib/api/counts';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const provinceName = searchParams.get('provinceName');
    const districtName = searchParams.get('districtName') || undefined;
    const subDistrictName = searchParams.get('subDistrictName') || undefined;

    if (!provinceName) {
      return NextResponse.json(
        { error: 'provinceName is required' },
        { status: 400 }
      );
    }

    const counts = await getRegionCounts(
      provinceName,
      districtName,
      subDistrictName
    );

    return NextResponse.json(counts);
  } catch (error) {
    console.error('[API] 통계 조회 실패:', error);
    return NextResponse.json(
      { error: 'Failed to fetch region counts' },
      { status: 500 }
    );
  }
}
