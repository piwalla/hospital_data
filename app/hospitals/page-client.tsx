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
import type { RehabilitationCenter } from '@/lib/api/rehabilitation-centers';
import { formatDistance } from '@/lib/utils/distance';

interface HospitalsPageClientProps {
  hospitals: Hospital[];
}

// 필터 타입 정의
type FilterType = 'all' | 'hospital' | 'pharmacy' | 'job-training' | 'sports-rehab';

export default function HospitalsPageClient({ hospitals: initialHospitals }: HospitalsPageClientProps) {
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [hospitals, setHospitals] = useState<Hospital[]>(initialHospitals);
  const [rehabilitationCenters, setRehabilitationCenters] = useState<RehabilitationCenter[]>([]); // 재활기관 추가
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const [radiusKm, setRadiusKm] = useState<number>(5); // 반경 선택 (기본값: 5km)
  const [activeFilter, setActiveFilter] = useState<FilterType>('all'); // 필터 상태 추가

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

  // 반경 내 재활기관 검색 함수 (API Route 호출)
  const fetchNearbyRehabilitationCenters = async (lat: number, lng: number, searchRadiusKm: number = radiusKm) => {
    try {
      const response = await fetch(
        `/api/rehabilitation-centers/nearby?latitude=${lat}&longitude=${lng}&radiusKm=${searchRadiusKm}`
      );
      
      if (!response.ok) {
        throw new Error('재활기관 검색 실패');
      }
      
      const data = await response.json();
      return data.rehabilitationCenters as RehabilitationCenter[];
    } catch (error) {
      console.error('[HospitalsPage] 재활기관 API 호출 실패:', error);
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
          
          // 반경 내 병원 및 재활기관 필터링
          setIsFiltering(true);
          try {
            // 병원과 재활기관을 동시에 검색
            const [nearbyHospitals, nearbyRehabilitationCenters] = await Promise.all([
              fetchNearbyHospitals(location.lat, location.lng, radiusKm),
              fetchNearbyRehabilitationCenters(location.lat, location.lng, radiusKm),
            ]);
            
            setHospitals(nearbyHospitals);
            setRehabilitationCenters(nearbyRehabilitationCenters);
            console.log(`[HospitalsPage] 반경 ${radiusKm}km 내 병원:`, nearbyHospitals.length, '개, 재활기관:', nearbyRehabilitationCenters.length, '개');
            
            // 병원과 재활기관이 모두 없어도 정상 (지도 이동 시 다시 검색됨)
            if (nearbyHospitals.length === 0 && nearbyRehabilitationCenters.length === 0) {
              console.log(`[HospitalsPage] 반경 ${radiusKm}km 내에 병원/재활기관이 없습니다. 지도를 이동하면 해당 위치 기준으로 검색됩니다.`);
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
        // 병원과 재활기관을 동시에 검색
        const [nearbyHospitals, nearbyRehabilitationCenters] = await Promise.all([
          fetchNearbyHospitals(userLocation.lat, userLocation.lng, newRadius),
          fetchNearbyRehabilitationCenters(userLocation.lat, userLocation.lng, newRadius),
        ]);
        
        setHospitals(nearbyHospitals);
        setRehabilitationCenters(nearbyRehabilitationCenters);
        console.log(`[HospitalsPage] 반경 ${newRadius}km로 변경, 병원:`, nearbyHospitals.length, '개, 재활기관:', nearbyRehabilitationCenters.length, '개');
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
    
    // 위치 변경 시 다시 필터링 (병원과 재활기관 동시 검색)
    setIsFiltering(true);
    try {
      const [nearbyHospitals, nearbyRehabilitationCenters] = await Promise.all([
        fetchNearbyHospitals(lat, lng, radiusKm),
        fetchNearbyRehabilitationCenters(lat, lng, radiusKm),
      ]);
      
      setHospitals(nearbyHospitals);
      setRehabilitationCenters(nearbyRehabilitationCenters);
      console.log(`[HospitalsPage] 지도 이동 후 반경 ${radiusKm}km 내 병원:`, nearbyHospitals.length, '개, 재활기관:', nearbyRehabilitationCenters.length, '개');
    } catch (error) {
      console.error('[HospitalsPage] 위치 변경 필터링 실패:', error);
    } finally {
      setIsFiltering(false);
    }
  };

  // 재활기관 클릭 핸들러 (현재는 HospitalDetailSheet를 사용하지 않음, 나중에 별도 Sheet 추가 가능)
  const handleRehabilitationCenterClick = (center: RehabilitationCenter) => {
    // 재활기관은 현재 HospitalDetailSheet와 호환되지 않으므로
    // InfoWindow만 표시하고 Sheet는 열지 않음
    // 나중에 RehabilitationCenterDetailSheet를 만들 수 있음
    console.log('[HospitalsPage] 재활기관 클릭:', center.name);
  };

  // 필터링된 병원 목록 (필터 적용)
  const filteredHospitals = hospitals.filter((hospital) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'hospital') return hospital.type === 'hospital';
    if (activeFilter === 'pharmacy') return hospital.type === 'pharmacy';
    return false; // 재활기관 필터는 아래에서 처리
  });

  // 필터링된 재활기관 목록 (필터 적용)
  const filteredRehabilitationCenters = rehabilitationCenters.filter((center) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'job-training') return center.gigwan_fg_nm === '직업훈련기관';
    if (activeFilter === 'sports-rehab') return center.gigwan_fg_nm === '재활스포츠기관'; // 실제 DB 값: '재활스포츠기관'
    return false; // 병원/약국 필터는 위에서 처리
  });

  // 지도에 표시할 병원 목록 (필터 적용)
  const hospitalsForMap = filteredHospitals;
  
  // 지도에 표시할 재활기관 목록 (필터 적용)
  const rehabilitationCentersForMap = filteredRehabilitationCenters;

  return (
    <>
      <div className="container mx-auto px-4 pt-4 pb-2">
        {/* 필터 영역 - 심플한 텍스트 기반 UI */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          {/* 검색 반경 선택 */}
          <div className="flex items-center gap-4">
            {[5, 10, 15, 30].map((radius) => (
              <button
                key={radius}
                onClick={() => handleRadiusChange(radius)}
                className={`text-sm transition-colors duration-200 ease-in-out ${
                  radiusKm === radius
                    ? 'text-[#2E7D32] font-semibold'
                    : 'text-[#8A8A8E] hover:text-[#1C1C1E]'
                }`}
              >
                {radius}km
              </button>
            ))}
          </div>

          {/* 구분선 */}
          <div className="w-px h-4 bg-[#E5E5EA]"></div>

          {/* 기관 유형 선택 */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveFilter('all')}
              className={`text-sm transition-colors duration-200 ease-in-out ${
                activeFilter === 'all'
                  ? 'text-[#2E7D32] font-semibold'
                  : 'text-[#8A8A8E] hover:text-[#1C1C1E]'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setActiveFilter('hospital')}
              className={`text-sm transition-colors duration-200 ease-in-out ${
                activeFilter === 'hospital'
                  ? 'text-[#2E7D32] font-semibold'
                  : 'text-[#8A8A8E] hover:text-[#1C1C1E]'
              }`}
            >
              병원
            </button>
            <button
              onClick={() => setActiveFilter('pharmacy')}
              className={`text-sm transition-colors duration-200 ease-in-out ${
                activeFilter === 'pharmacy'
                  ? 'text-[#34C759] font-semibold'
                  : 'text-[#8A8A8E] hover:text-[#1C1C1E]'
              }`}
            >
              약국
            </button>
            <button
              onClick={() => setActiveFilter('job-training')}
              className={`text-sm transition-colors duration-200 ease-in-out ${
                activeFilter === 'job-training'
                  ? 'text-[#9333EA] font-semibold'
                  : 'text-[#8A8A8E] hover:text-[#1C1C1E]'
              }`}
            >
              직업훈련기관
            </button>
            <button
              onClick={() => setActiveFilter('sports-rehab')}
              className={`text-sm transition-colors duration-200 ease-in-out ${
                activeFilter === 'sports-rehab'
                  ? 'text-[#9333EA] font-semibold'
                  : 'text-[#8A8A8E] hover:text-[#1C1C1E]'
              }`}
            >
              재활스포츠기관
            </button>
          </div>
        </div>
        
        {/* 반응형 레이아웃: 모바일은 세로, 데스크톱은 가로 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 모바일: 지도가 상단, 데스크톱: 지도가 우측 */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <HospitalMap 
              hospitals={hospitalsForMap} // 필터링된 병원 목록
              rehabilitationCenters={rehabilitationCentersForMap} // 필터링된 재활기관 목록
              onHospitalClick={handleHospitalClick}
              onRehabilitationCenterClick={handleRehabilitationCenterClick} // 재활기관 클릭 핸들러
              center={userLocation ? { lat: userLocation.lat, lng: userLocation.lng } : undefined}
              userLocation={userLocation} // 사용자 위치 전달 (마커 표시용)
              onLocationChange={handleLocationChange}
            />
          </div>
          
          {/* 모바일: 목록이 하단, 데스크톱: 목록이 좌측 */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <h2 className="text-[22px] font-semibold mb-4">
                {userLocation ? (
                  <>반경 {radiusKm}km 이내</>
                ) : (
                  <>내 주변 산재 지정 기관 ({filteredHospitals.length + filteredRehabilitationCenters.length}개)</>
                )}
              </h2>
              {userLocation && activeFilter === 'all' && (
                <div className="text-sm text-[#8A8A8E] mb-3 flex flex-wrap gap-x-3 gap-y-1">
                  {hospitals.filter(h => h.type === 'hospital').length > 0 && (
                    <span>병원 {hospitals.filter(h => h.type === 'hospital').length}개</span>
                  )}
                  {hospitals.filter(h => h.type === 'pharmacy').length > 0 && (
                    <span>약국 {hospitals.filter(h => h.type === 'pharmacy').length}개</span>
                  )}
                  {rehabilitationCenters.filter(c => c.gigwan_fg_nm === '직업훈련기관').length > 0 && (
                    <span>직업훈련 {rehabilitationCenters.filter(c => c.gigwan_fg_nm === '직업훈련기관').length}개</span>
                  )}
                  {rehabilitationCenters.filter(c => c.gigwan_fg_nm === '재활스포츠기관').length > 0 && (
                    <span>재활스포츠 {rehabilitationCenters.filter(c => c.gigwan_fg_nm === '재활스포츠기관').length}개</span>
                  )}
                </div>
              )}
              {isFiltering && (
                <div className="mb-4 text-sm text-[#8A8A8E]">
                  🔄 위치 기반 필터링 중...
                </div>
              )}
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                    {filteredHospitals.length === 0 && filteredRehabilitationCenters.length === 0 ? (
                      <p className="text-[#8A8A8E] text-sm">
                        {userLocation 
                          ? `반경 ${radiusKm}km 내에 ${activeFilter === 'all' ? '병원/재활기관' : '해당 기관'}이 없습니다. 지도를 이동하거나 반경을 늘려보세요.` 
                          : "병원/재활기관 데이터가 없습니다. 동기화를 실행해주세요."}
                      </p>
                ) : (
                  <>
                    {/* 병원 목록 (필터링된) */}
                    {filteredHospitals.slice(0, 20).map((hospital) => (
                      <div
                        key={hospital.id}
                        onClick={() => handleHospitalClick(hospital)}
                        className="p-3 border border-gray-200 rounded-lg hover:border-[#2E7D32] transition-all cursor-pointer shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-semibold text-sm flex-1 text-[#1C1C1E]">{hospital.name}</h3>
                          {hospital.distance !== undefined && (
                            <span className="text-xs font-medium text-primary ml-2 whitespace-nowrap">
                              {formatDistance(hospital.distance)}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#1C1C1E] mb-1">{hospital.address}</p>
                        {hospital.phone && (
                          <p className="text-xs text-[#8A8A8E]">📞 {hospital.phone}</p>
                        )}
                      </div>
                    ))}
                    {/* 재활기관 목록 (필터링된) */}
                    {filteredRehabilitationCenters.slice(0, 20).map((center) => (
                      <div
                        key={center.id}
                        onClick={() => handleRehabilitationCenterClick(center)}
                        className="p-3 border border-gray-200 rounded-lg hover:border-[#9333EA] transition-all cursor-pointer shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-semibold text-sm flex-1 text-[#1C1C1E]">{center.name}</h3>
                          {center.distance !== undefined && (
                            <span className="text-xs font-medium text-[#9333EA] ml-2 whitespace-nowrap">
                              {formatDistance(center.distance)}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#9333EA] mb-1">🏥 {center.gigwan_fg_nm || '재활기관'}</p>
                        <p className="text-xs text-[#1C1C1E] mb-1">{center.address}</p>
                        {center.phone && (
                          <p className="text-xs text-[#8A8A8E]">📞 {center.phone}</p>
                        )}
                      </div>
                    ))}
                  </>
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

