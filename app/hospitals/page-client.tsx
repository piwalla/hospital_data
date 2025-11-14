"use client";

/**
 * @file page-client.tsx
 * @description 병원 찾기 페이지 클라이언트 컴포넌트
 *
 * Bottom Sheet 상태 관리 및 인터랙션 처리
 * 사용자 위치 기반 필터링 및 거리 표시
 */

import { useState, useEffect } from 'react';
import HospitalMap from '@/components/HospitalMap';
import HospitalDetailSheet from '@/components/HospitalDetailSheet';
import type { Hospital } from '@/lib/api/hospitals';
import { formatDistance } from '@/lib/utils/distance';

interface HospitalsPageClientProps {
  hospitals: Hospital[];
}

export default function HospitalsPageClient({ hospitals: initialHospitals }: HospitalsPageClientProps) {
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [hospitals, setHospitals] = useState<Hospital[]>(initialHospitals);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const [radiusKm, setRadiusKm] = useState<number>(5); // 반경 선택 (기본값: 5km)

  const handleHospitalClick = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setIsSheetOpen(true);
  };

  const handleSheetClose = (open: boolean) => {
    setIsSheetOpen(open);
    if (!open) {
      // Sheet가 닫힐 때 선택된 병원 초기화 (선택사항)
      setTimeout(() => setSelectedHospital(null), 300);
    }
  };

  // 반경 내 병원 검색 함수 (API Route 호출)
  const fetchNearbyHospitals = async (lat: number, lng: number, searchRadiusKm: number = radiusKm) => {
    try {
      const response = await fetch(
        `/api/hospitals/nearby?latitude=${lat}&longitude=${lng}&radiusKm=${searchRadiusKm}`
      );
      
      if (!response.ok) {
        throw new Error('병원 검색 실패');
      }
      
      const data = await response.json();
      return data.hospitals as Hospital[];
    } catch (error) {
      console.error('[HospitalsPage] API 호출 실패:', error);
      throw error;
    }
  };

  // 사용자 위치 가져오기 및 필터링
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          
          // 반경 내 병원 필터링
          setIsFiltering(true);
          try {
            const nearbyHospitals = await fetchNearbyHospitals(
              location.lat,
              location.lng,
              radiusKm // 선택된 반경
            );
            setHospitals(nearbyHospitals);
            console.log(`[HospitalsPage] 반경 ${radiusKm}km 내 병원:`, nearbyHospitals.length, '개');
            
            // 병원이 없어도 정상 (지도 이동 시 다시 검색됨)
            if (nearbyHospitals.length === 0) {
              console.log(`[HospitalsPage] 반경 ${radiusKm}km 내에 병원이 없습니다. 지도를 이동하면 해당 위치 기준으로 검색됩니다.`);
            }
          } catch (error) {
            console.error('[HospitalsPage] 위치 기반 필터링 실패:', error);
            // 실패 시 전체 목록 유지
          } finally {
            setIsFiltering(false);
          }
        },
        (error) => {
          console.warn('[HospitalsPage] 위치 권한 거부 또는 오류:', error);
          // 위치 권한이 없으면 전체 목록 사용
        }
      );
    }
  }, []);

  // 반경 변경 핸들러
  const handleRadiusChange = async (newRadius: number) => {
    setRadiusKm(newRadius);
    
    // 사용자 위치가 있으면 새로운 반경으로 다시 검색
    if (userLocation) {
      setIsFiltering(true);
      try {
        const nearbyHospitals = await fetchNearbyHospitals(
          userLocation.lat,
          userLocation.lng,
          newRadius
        );
        setHospitals(nearbyHospitals);
        console.log(`[HospitalsPage] 반경 ${newRadius}km로 변경, 병원:`, nearbyHospitals.length, '개');
      } catch (error) {
        console.error('[HospitalsPage] 반경 변경 필터링 실패:', error);
      } finally {
        setIsFiltering(false);
      }
    }
  };

  // 지도 위치 변경 핸들러 (debounce 적용)
  const handleLocationChange = async (lat: number, lng: number) => {
    // 이미 같은 위치면 필터링하지 않음 (0.01도 차이 = 약 1km)
    if (userLocation && 
        Math.abs(userLocation.lat - lat) < 0.01 && 
        Math.abs(userLocation.lng - lng) < 0.01) {
      return;
    }
    
    // 사용자 위치 업데이트 (지도 중심 위치)
    const newLocation = { lat, lng };
    setUserLocation(newLocation);
    
    // 위치 변경 시 다시 필터링
    setIsFiltering(true);
    try {
      const nearbyHospitals = await fetchNearbyHospitals(lat, lng, radiusKm);
      setHospitals(nearbyHospitals);
      console.log(`[HospitalsPage] 지도 이동 후 반경 ${radiusKm}km 내 병원:`, nearbyHospitals.length, '개');
    } catch (error) {
      console.error('[HospitalsPage] 위치 변경 필터링 실패:', error);
    } finally {
      setIsFiltering(false);
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6">병원 찾기</h1>
        <div className="mb-6">
          <p className="text-gray-600">
            주변 산재 지정 의료기관을 찾아보세요.
          </p>
          
          {/* 반경 선택 UI */}
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              검색 반경 선택
            </label>
            <div className="flex flex-wrap gap-2">
              {[5, 10, 15, 30].map((radius) => (
                <button
                  key={radius}
                  onClick={() => handleRadiusChange(radius)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    radiusKm === radius
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {radius}km
                </button>
              ))}
            </div>
          </div>
          
          {userLocation && (
            <p className="text-sm text-gray-500 mt-3">
              📍 지도 중심 기준 반경 {radiusKm}km 내 병원만 표시됩니다. 지도를 이동하면 해당 위치 기준으로 검색됩니다.
            </p>
          )}
        </div>
        
        {/* 반응형 레이아웃: 모바일은 세로, 데스크톱은 가로 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 모바일: 지도가 상단, 데스크톱: 지도가 우측 */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <HospitalMap 
              hospitals={hospitals} 
              onHospitalClick={handleHospitalClick}
              center={userLocation ? { lat: userLocation.lat, lng: userLocation.lng } : undefined}
              userLocation={userLocation} // 사용자 위치 전달 (마커 표시용)
              onLocationChange={handleLocationChange}
            />
          </div>
          
          {/* 모바일: 목록이 하단, 데스크톱: 목록이 좌측 */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-lg font-semibold mb-4">
                {userLocation ? (
                  <>반경 {radiusKm}km 내 병원 ({hospitals.length}개)</>
                ) : (
                  <>내 주변 산재 지정 병원 ({hospitals.length}개)</>
                )}
              </h2>
              {isFiltering && (
                <div className="mb-4 text-sm text-gray-500">
                  🔄 위치 기반 필터링 중...
                </div>
              )}
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                    {hospitals.length === 0 ? (
                      <p className="text-gray-500 text-sm">
                        {userLocation 
                          ? `반경 ${radiusKm}km 내에 병원이 없습니다. 지도를 이동하거나 반경을 늘려보세요.` 
                          : "병원 데이터가 없습니다. 동기화를 실행해주세요."}
                      </p>
                ) : (
                  hospitals.slice(0, 20).map((hospital) => (
                    <div
                      key={hospital.id}
                      onClick={() => handleHospitalClick(hospital)}
                      className="p-3 border border-gray-200 rounded-lg hover:border-[#3478F6] transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-semibold text-sm flex-1">{hospital.name}</h3>
                        {hospital.distance !== undefined && (
                          <span className="text-xs font-medium text-primary ml-2 whitespace-nowrap">
                            {formatDistance(hospital.distance)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{hospital.address}</p>
                      {hospital.phone && (
                        <p className="text-xs text-gray-500">📞 {hospital.phone}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sheet */}
      <HospitalDetailSheet
        hospital={selectedHospital}
        open={isSheetOpen}
        onOpenChange={handleSheetClose}
      />
    </>
  );
}

