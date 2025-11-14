/**
 * @file route.ts
 * @description 재활기관 주소 정리 및 재가공 API
 * 
 * Geocoding이 실패한 재활기관의 주소를 정리합니다:
 * - 괄호 제거
 * - 중복 정보 제거
 * - 주소 형식 정리
 */

import { NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase/service-role';

/**
 * 주소 정리 함수
 * - 괄호와 괄호 내 내용 제거
 * - 중복된 공백 제거
 * - 앞뒤 공백 제거
 */
function cleanAddress(address: string): string {
  if (!address || address.trim().length === 0) {
    return address;
  }

  let cleaned = address.trim();

  // 괄호 제거 (소괄호, 중괄호, 대괄호 모두)
  cleaned = cleaned.replace(/[\(（][^\)）]*[\)）]/g, '');
  cleaned = cleaned.replace(/\[[^\]]*\]/g, '');
  cleaned = cleaned.replace(/\{[^\}]*\}/g, '');

  // 중복된 공백 제거
  cleaned = cleaned.replace(/\s+/g, ' ');

  // 앞뒤 공백 제거
  cleaned = cleaned.trim();

  // "주소 없음" 같은 경우는 그대로 유지
  if (cleaned === '주소 없음' || cleaned.length === 0) {
    return address; // 원본 유지
  }

  return cleaned;
}

export async function POST() {
  try {
    const supabase = getServiceRoleClient();

    // Geocoding 실패한 재활기관 조회
    const { data: centers, error: fetchError } = await supabase
      .from('rehabilitation_centers')
      .select('id, gigwan_nm, address')
      .or('latitude.eq.0,longitude.eq.0')
      .not('address', 'is', null);

    if (fetchError) {
      throw fetchError;
    }

    if (!centers || centers.length === 0) {
      return NextResponse.json({
        success: true,
        message: '정리할 주소가 없습니다.',
        cleanedCount: 0,
        totalCount: 0,
      });
    }

    console.log(`[Address Cleanup] ${centers.length}개 주소 정리 시작...`);

    let cleanedCount = 0;
    const results = [];

    for (const center of centers) {
      const originalAddress = center.address;
      const cleanedAddress = cleanAddress(originalAddress);

      // 주소가 변경된 경우에만 업데이트
      if (cleanedAddress !== originalAddress) {
        const { error: updateError } = await supabase
          .from('rehabilitation_centers')
          .update({
            address: cleanedAddress,
            last_updated: new Date().toISOString(),
          })
          .eq('id', center.id);

        if (updateError) {
          console.error(`[Address Cleanup] 업데이트 실패: ${center.gigwan_nm}`, updateError);
          results.push({
            id: center.id,
            name: center.gigwan_nm,
            original: originalAddress,
            cleaned: cleanedAddress,
            status: 'error',
            error: String(updateError),
          });
        } else {
          cleanedCount++;
          results.push({
            id: center.id,
            name: center.gigwan_nm,
            original: originalAddress,
            cleaned: cleanedAddress,
            status: 'success',
          });
          console.log(`[Address Cleanup] ${center.gigwan_nm}: "${originalAddress}" → "${cleanedAddress}"`);
        }
      } else {
        // 주소가 변경되지 않은 경우 (이미 정리되어 있거나 "주소 없음" 등)
        results.push({
          id: center.id,
          name: center.gigwan_nm,
          original: originalAddress,
          cleaned: cleanedAddress,
          status: 'no_change',
        });
      }
    }

    console.log(`[Address Cleanup] 완료: ${cleanedCount}개 주소 정리됨`);

    return NextResponse.json({
      success: true,
      message: '주소 정리 완료',
      cleanedCount,
      totalCount: centers.length,
      results: results.slice(0, 20), // 처음 20개만 반환
    });
  } catch (error) {
    console.error('[Address Cleanup] 오류:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

