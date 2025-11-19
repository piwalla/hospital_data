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
import RegionSelector from '@/components/RegionSelector';
import type { Hospital } from '@/lib/api/hospitals';
import type { RehabilitationCenter } from '@/lib/api/rehabilitation-centers';
import type { SearchMode, RegionSelection } from '@/lib/types/region';
import { formatDistance } from '@/lib/utils/distance';
import { getZoomLevelByRadius } from '@/lib/utils/map';
import { getRegionCoordinates } from '@/lib/data/region-coordinates';

interface HospitalsPageClientProps {
  hospitals: Hospital[];
}

// 필터 타입 정의
type FilterType = 'all' | 'hospital' | 'pharmacy' | 'job-training' | 'sports-rehab';

// 진료과목 목록 (상위 진료과목)
const DEPARTMENT_OPTIONS = [
  { value: '정형외과', label: '정형외과' },
  { value: '치과', label: '치과' },
  { value: '신경외과', label: '신경외과' },
  { value: '외과', label: '외과' },
  { value: '재활의학과', label: '재활의학과' },
  { value: '영상의학과', label: '영상의학과' },
  { value: '안과', label: '안과' },
  { value: '정신건강의학과', label: '정신건강의학과' },
  { value: '내과', label: '내과' },
  { value: '정신과', label: '정신과' },
  { value: '이비인후과', label: '이비인후과' },
  { value: '비뇨의학과', label: '비뇨의학과' },
];

export default function HospitalsPageClient({ hospitals: initialHospitals }: HospitalsPageClientProps) {
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [selectedRehabilitationCenter, setSelectedRehabilitationCenter] = useState<RehabilitationCenter | null>(null); // 재활기관 추가
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [hospitals, setHospitals] = useState<Hospital[]>(initialHospitals);
  const [rehabilitationCenters, setRehabilitationCenters] = useState<RehabilitationCenter[]>([]); // 재활기관 추가
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const [radiusKm, setRadiusKm] = useState<number>(5); // 반경 선택 (기본값: 5km)
  const [activeFilter, setActiveFilter] = useState<FilterType>('all'); // 필터 상태 추가
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]); // 진료과목 필터 상태
  const [searchMode, setSearchMode] = useState<SearchMode>('location'); // 검색 모드: 'location' | 'region'
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false); // 고급 필터 표시 여부
  const [selectedRegion, setSelectedRegion] = useState<RegionSelection>({
    provinceCode: null,
    provinceName: null,
    districtCode: null,
    districtName: null,
    subDistrictCode: null,
    subDistrictName: null,
  }); // 지역 선택 상태

  const handleHospitalClick = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setSelectedRehabilitationCenter(null); // 재활기관 초기화
    setIsSheetOpen(true);
  };

  const handleSheetClose = (open: boolean) => {
    setIsSheetOpen(open);
    if (!open) {
      // Sheet가 닫힐 때 선택된 병원 및 재활기관 초기화 (선택사항)
      setTimeout(() => {
        setSelectedHospital(null);
        setSelectedRehabilitationCenter(null);
      }, 300);
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

  // 지역 기반 병원 검색 함수 (API Route 호출)
  const fetchHospitalsByRegion = async (region: RegionSelection) => {
    try {
      if (!region.provinceName) {
        return [];
      }

      const params = new URLSearchParams({
        provinceName: region.provinceName,
      });
      
      if (region.districtName) {
        params.append('districtName', region.districtName);
      }
      
      if (region.subDistrictName) {
        params.append('subDistrictName', region.subDistrictName);
      }

      const response = await fetch(`/api/hospitals/by-region?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('병원 검색 실패');
      }
      
      const data = await response.json();
      return data.hospitals as Hospital[];
    } catch (error) {
      console.error('[HospitalsPage] 지역 기반 병원 API 호출 실패:', error);
      throw error;
    }
  };

  // 지역 기반 재활기관 검색 함수 (API Route 호출)
  const fetchRehabilitationCentersByRegion = async (region: RegionSelection) => {
    try {
      if (!region.provinceName) {
        return [];
      }

      const params = new URLSearchParams({
        provinceName: region.provinceName,
      });
      
      if (region.districtName) {
        params.append('districtName', region.districtName);
      }
      
      if (region.subDistrictName) {
        params.append('subDistrictName', region.subDistrictName);
      }

      const response = await fetch(`/api/rehabilitation-centers/by-region?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('재활기관 검색 실패');
      }
      
      const data = await response.json();
      return data.rehabilitationCenters as RehabilitationCenter[];
    } catch (error) {
      console.error('[HospitalsPage] 지역 기반 재활기관 API 호출 실패:', error);
      throw error;
    }
  };

  // 사용자 위치 가져오기 (검색 모드가 'location'일 때만)
  useEffect(() => {
    if (searchMode === 'location' && navigator.geolocation) {
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
  }, [searchMode]);

  // 지역 선택 시 검색
  useEffect(() => {
    if (searchMode === 'region' && selectedRegion.provinceName) {
      setIsFiltering(true);
      (async () => {
        try {
          const [regionHospitals, regionRehabilitationCenters] = await Promise.all([
            fetchHospitalsByRegion(selectedRegion),
            fetchRehabilitationCentersByRegion(selectedRegion),
          ]);
          
          setHospitals(regionHospitals);
          setRehabilitationCenters(regionRehabilitationCenters);
          console.log(`[HospitalsPage] 지역 기반 검색 완료: 병원 ${regionHospitals.length}개, 재활기관 ${regionRehabilitationCenters.length}개`);
        } catch (error) {
          console.error('[HospitalsPage] 지역 기반 필터링 실패:', error);
        } finally {
          setIsFiltering(false);
        }
      })();
    }
  }, [searchMode, selectedRegion]);

  // 반경 변경 핸들러
  const handleRadiusChange = async (newRadius: number) => {
    setRadiusKm(newRadius);
    
    // 검색 모드가 'location'이고 사용자 위치가 있으면 새로운 반경으로 다시 검색
    if (searchMode === 'location' && userLocation) {
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

  // 검색 모드 변경 핸들러
  const handleSearchModeChange = (mode: SearchMode) => {
    setSearchMode(mode);
    
    // 모드 변경 시 지역 선택 초기화
    if (mode === 'location') {
      setSelectedRegion({
        provinceCode: null,
        provinceName: null,
        districtCode: null,
        districtName: null,
        subDistrictCode: null,
        subDistrictName: null,
      });
    }
  };

  // 지역 선택 변경 핸들러
  const handleRegionChange = (selection: RegionSelection) => {
    setSelectedRegion(selection);
  };

  // 지역 선택 시 지도 중심 이동 핸들러
  const handleRegionCoordinatesChange = (coordinates: { lat: number; lng: number } | null) => {
    if (coordinates) {
      setUserLocation(coordinates);
    }
  };

  // 기관 유형 필터 변경 핸들러 (진료과목 필터 초기화)
  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    // 약국이나 재활기관 필터 선택 시 진료과목 필터 초기화
    if (filter === 'pharmacy' || filter === 'job-training' || filter === 'sports-rehab') {
      setSelectedDepartments([]);
    }
  };

  // 지도 위치 변경 핸들러 (debounce 적용, 검색 모드가 'location'일 때만)
  const handleLocationChange = async (lat: number, lng: number) => {
    // 검색 모드가 'region'이면 지도 이동 시 필터링하지 않음
    if (searchMode === 'region') {
      return;
    }

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

  // 재활기관 클릭 핸들러
  const handleRehabilitationCenterClick = (center: RehabilitationCenter) => {
    setSelectedRehabilitationCenter(center);
    setSelectedHospital(null); // 병원 초기화
    setIsSheetOpen(true);
    console.log('[HospitalsPage] 재활기관 클릭:', center.name);
  };

  // 진료과목 필터 토글 함수
  const toggleDepartment = (department: string) => {
    setSelectedDepartments((prev) => {
      if (prev.includes(department)) {
        return prev.filter((d) => d !== department);
      } else {
        return [...prev, department];
      }
    });
  };

  // 필터링된 병원 목록 (필터 적용)
  const filteredHospitals = hospitals.filter((hospital) => {
    // 기관 유형 필터
    if (activeFilter === 'all') {
      // 전체 선택 시 모든 기관 포함 (약국 포함)
      // 진료과목 필터는 병원에만 적용
    } else if (activeFilter === 'hospital') {
      if (hospital.type !== 'hospital') return false;
    } else if (activeFilter === 'pharmacy') {
      if (hospital.type !== 'pharmacy') return false;
      // 약국은 진료과목 필터 적용 안 함
      return true;
    } else {
      return false; // 재활기관 필터는 아래에서 처리
    }

    // 진료과목 필터 (병원인 경우만)
    if (hospital.type === 'hospital' && selectedDepartments.length > 0) {
      if (!hospital.department_extracted) return false;
      
      // 선택된 진료과목 중 하나라도 포함되어 있으면 통과
      const hasSelectedDepartment = selectedDepartments.some((dept) =>
        hospital.department_extracted?.includes(dept)
      );
      
      if (!hasSelectedDepartment) return false;
    }

    return true;
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
        {/* 간소화된 필터 영역 */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          {/* 기본 필터: 기관 유형만 간단하게 표시 */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleFilterChange('all')}
              className={`text-sm font-medium px-3 py-1.5 transition-colors ${
                activeFilter === 'all'
                  ? 'text-[#2F6E4F] font-semibold'
                  : 'text-[#555555] hover:text-[#1C1C1E]'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => handleFilterChange('hospital')}
              className={`text-sm font-medium px-3 py-1.5 transition-colors ${
                activeFilter === 'hospital'
                  ? 'text-[#2F6E4F] font-semibold'
                  : 'text-[#555555] hover:text-[#1C1C1E]'
              }`}
            >
              병원
            </button>
            <button
              onClick={() => handleFilterChange('pharmacy')}
              className={`text-sm font-medium px-3 py-1.5 transition-colors ${
                activeFilter === 'pharmacy'
                  ? 'text-[#2F6E4F] font-semibold'
                  : 'text-[#555555] hover:text-[#1C1C1E]'
              }`}
            >
              약국
            </button>
          </div>

          {/* 고급 필터 토글 버튼 */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="text-sm text-[#555555] hover:text-[#1C1C1E] px-3 py-1.5 transition-colors flex items-center gap-1"
          >
            <span>필터</span>
            <svg 
              className={`w-4 h-4 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              strokeWidth={1.75}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* 고급 필터 영역 (접을 수 있음) */}
        {showAdvancedFilters && (
          <div className="mb-4 pb-4 border-b border-[#E4E7E7] space-y-4">
            {/* 검색 모드 선택 */}
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => handleSearchModeChange('location')}
                className={`text-sm px-3 py-1.5 transition-colors ${
                  searchMode === 'location'
                    ? 'text-[#2F6E4F] font-semibold'
                    : 'text-[#555555] font-medium hover:text-[#1C1C1E]'
                }`}
              >
                내 위치 주변
              </button>
              <button
                onClick={() => handleSearchModeChange('region')}
                className={`text-sm px-3 py-1.5 transition-colors ${
                  searchMode === 'region'
                    ? 'text-[#2F6E4F] font-semibold'
                    : 'text-[#555555] font-medium hover:text-[#1C1C1E]'
                }`}
              >
                지역 선택
              </button>
            </div>

            {/* 검색 모드에 따른 UI */}
            {searchMode === 'location' ? (
              <div className="flex items-center gap-3 flex-wrap">
                {[5, 10, 15, 30].map((radius) => (
                  <button
                    key={radius}
                    onClick={() => handleRadiusChange(radius)}
                    className={`text-sm px-3 py-1.5 transition-colors ${
                      radiusKm === radius
                        ? 'text-[#2F6E4F] font-semibold'
                        : 'text-[#555555] font-medium hover:text-[#1C1C1E]'
                    }`}
                  >
                    {radius}km
                  </button>
                ))}
              </div>
            ) : (
              <div>
                <RegionSelector
                  value={selectedRegion}
                  onChange={handleRegionChange}
                  onRegionChange={handleRegionCoordinatesChange}
                />
              </div>
            )}

            {/* 재활기관 필터 */}
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => handleFilterChange('job-training')}
                className={`text-sm px-3 py-1.5 transition-colors ${
                  activeFilter === 'job-training'
                    ? 'text-[#2F6E4F] font-semibold'
                    : 'text-[#555555] font-medium hover:text-[#1C1C1E]'
                }`}
              >
                직업훈련기관
              </button>
              <button
                onClick={() => handleFilterChange('sports-rehab')}
                className={`text-sm px-3 py-1.5 transition-colors ${
                  activeFilter === 'sports-rehab'
                    ? 'text-[#2F6E4F] font-semibold'
                    : 'text-[#555555] font-medium hover:text-[#1C1C1E]'
                }`}
              >
                재활스포츠기관
              </button>
            </div>

            {/* 진료과목 필터 (병원 필터일 때만 표시) */}
            {(activeFilter === 'hospital' || activeFilter === 'all') && (
              <div className="space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  {DEPARTMENT_OPTIONS.slice(0, 4).map((dept) => (
                    <button
                      key={dept.value}
                      onClick={() => toggleDepartment(dept.value)}
                      className={`text-sm px-3 py-1.5 transition-colors ${
                        selectedDepartments.includes(dept.value)
                          ? 'text-[#2F6E4F] font-semibold'
                          : 'text-[#555555] font-medium hover:text-[#1C1C1E]'
                      }`}
                    >
                      {dept.label}
                    </button>
                  ))}
                  {/* 더보기 버튼 (나머지 진료과목) */}
                  {DEPARTMENT_OPTIONS.length > 4 && (
                    <div className="relative group">
                      <button
                        className="text-sm px-3 py-1.5 text-[#555555] font-medium hover:text-[#1C1C1E] transition-colors"
                        aria-label="더보기 진료과목"
                      >
                        더보기
                      </button>
                      {/* 드롭다운 메뉴 (호버 시 표시) */}
                      <div className="absolute top-full left-0 mt-1 bg-white border border-[#E4E7E7] rounded-lg p-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[140px]">
                        {DEPARTMENT_OPTIONS.slice(4).map((dept) => (
                          <button
                            key={dept.value}
                            onClick={() => toggleDepartment(dept.value)}
                            className={`w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-[#F7F9F8] transition-colors ${
                              selectedDepartments.includes(dept.value) ? 'bg-[#2F6E4F]/10 text-[#2F6E4F] font-semibold' : 'text-[#1C1C1E]'
                            }`}
                          >
                            {dept.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {/* 선택된 진료과목 초기화 버튼 */}
                {selectedDepartments.length > 0 && (
                  <button
                    onClick={() => setSelectedDepartments([])}
                    className="text-sm text-[#555555] hover:text-[#2F6E4F] underline transition-colors"
                    aria-label="진료과목 필터 초기화"
                  >
                    선택 초기화
                  </button>
                )}
              </div>
            )}
          </div>
        )}
        
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
              zoom={getZoomLevelByRadius(radiusKm)} // 반경에 따른 zoom 레벨
              userLocation={userLocation} // 사용자 위치 전달 (마커 표시용)
              onLocationChange={handleLocationChange}
              enableLocationChange={searchMode === 'location'} // 지역 선택 모드에서는 지도 이동 시 재검색 비활성화
            />
          </div>
          
          {/* 모바일: 목록이 하단, 데스크톱: 목록이 좌측 */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white rounded-xl border border-[#E4E7E7] p-6">
              <h2 className="text-[22px] font-semibold mb-4">
                {searchMode === 'location' ? (
                  userLocation ? (
                    <>반경 {radiusKm}km 이내</>
                  ) : (
                    <>내 주변 산재 지정 기관 ({filteredHospitals.length + filteredRehabilitationCenters.length}개)</>
                  )
                ) : (
                  selectedRegion.provinceName ? (
                    <>
                      {selectedRegion.subDistrictName 
                        ? `${selectedRegion.provinceName} ${selectedRegion.districtName} ${selectedRegion.subDistrictName}`
                        : selectedRegion.districtName
                        ? `${selectedRegion.provinceName} ${selectedRegion.districtName}`
                        : selectedRegion.provinceName}
                    </>
                  ) : (
                    <>지역을 선택해주세요</>
                  )
                )}
              </h2>
              {userLocation && activeFilter === 'all' && (
                <div className="text-sm text-[#555555] mb-3 flex flex-wrap gap-x-3 gap-y-1">
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
                <div className="mb-4 text-sm text-[#555555]">
                  🔄 위치 기반 필터링 중...
                </div>
              )}
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {filteredHospitals.length === 0 && filteredRehabilitationCenters.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8">
                        <img 
                          src="/Generated_Image_November_19__2025_-_4_31PM__2_-removebg-preview.png" 
                          alt="Re 캐릭터" 
                          className="w-16 h-16 object-contain mb-3"
                        />
                        <p className="text-[#555555] text-sm text-center">
                          {userLocation 
                            ? `반경 ${radiusKm}km 내에 ${activeFilter === 'all' ? '병원/재활기관' : '해당 기관'}이 없습니다. 지도를 이동하거나 반경을 늘려보세요.` 
                            : "병원/재활기관 데이터가 없습니다. 동기화를 실행해주세요."}
                        </p>
                      </div>
                ) : (
                  <>
                    {/* 병원 목록 (필터링된) */}
                    {filteredHospitals.slice(0, 20).map((hospital) => (
                      <div
                        key={hospital.id}
                        onClick={() => handleHospitalClick(hospital)}
                        className="p-3 border border-[#E4E7E7] rounded-xl hover:border-[#2F6E4F] transition-all cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-semibold text-sm flex-1 text-[#1C1C1E]">{hospital.name}</h3>
                          {hospital.distance !== undefined && (
                            <span className="text-xs font-medium text-primary ml-2 whitespace-nowrap">
                              {formatDistance(hospital.distance)}
                            </span>
                          )}
                        </div>
                        {/* 기관 유형 및 진료과목 표시 */}
                        <div className="flex flex-wrap gap-1.5 mb-1">
                          {hospital.institution_type && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#2F6E4F]/10 text-[#2F6E4F]">
                              {hospital.institution_type}
                            </span>
                          )}
                          {hospital.department_extracted && hospital.department_extracted !== '기타' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#9333EA]/10 text-[#9333EA]">
                              {hospital.department_extracted}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#1C1C1E] mb-1">{hospital.address}</p>
                        {hospital.phone && (
                          <p className="text-xs text-[#555555]">📞 {hospital.phone}</p>
                        )}
                      </div>
                    ))}
                    {/* 재활기관 목록 (필터링된) */}
                    {filteredRehabilitationCenters.slice(0, 20).map((center) => (
                      <div
                        key={center.id}
                        onClick={() => handleRehabilitationCenterClick(center)}
                        className="p-3 border border-[#E4E7E7] rounded-xl hover:border-[#9333EA] transition-all cursor-pointer"
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
        rehabilitationCenter={selectedRehabilitationCenter}
        open={isSheetOpen}
        onOpenChange={handleSheetClose}
      />
    </>
  );
}

