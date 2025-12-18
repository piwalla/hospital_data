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
import RegionSelector from '@/components/RegionSelector';
import FavoriteButton from '@/components/FavoriteButton';
import type { Hospital } from '@/lib/api/hospitals';
import type { RehabilitationCenter } from '@/lib/api/rehabilitation-centers';
import type { SearchMode, RegionSelection } from '@/lib/types/region';
import { formatDistance } from '@/lib/utils/distance';
import { getZoomLevelByRadius } from '@/lib/utils/map';
import { getRegionCoordinates } from '@/lib/data/region-coordinates';
import RiuIcon from '@/components/icons/riu-icon';
import RiuLoader from '@/components/ui/riu-loader';

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
  const [hospitals, setHospitals] = useState<Hospital[]>(initialHospitals);
  const [rehabilitationCenters, setRehabilitationCenters] = useState<RehabilitationCenter[]>([]); // 재활기관 추가
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const [radiusKm, setRadiusKm] = useState<number>(5); // 반경 선택 (기본값: 5km)
  const [activeFilter, setActiveFilter] = useState<FilterType>('all'); // 필터 상태 추가
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]); // 진료과목 필터 상태
  const [initialInstitutionCount, setInitialInstitutionCount] = useState<number | null>(null); // 초기 검색 결과 개수 저장
  const [initialCounts, setInitialCounts] = useState<{
    hospital: number;
    pharmacy: number;
    rehabilitation: number;
  } | null>(null); // 초기 검색 결과 상세 개수 저장
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
            
            // 초기 검색 결과 개수 저장 (한 번만 저장)
            if (initialInstitutionCount === null) {
              const hospitalCount = nearbyHospitals.filter(h => h.type === 'hospital').length;
              const pharmacyCount = nearbyHospitals.filter(h => h.type === 'pharmacy').length;
              const rehabilitationCount = nearbyRehabilitationCenters.length;
              const totalCount = hospitalCount + pharmacyCount + rehabilitationCount;
              
              setInitialInstitutionCount(totalCount);
              setInitialCounts({
                hospital: hospitalCount,
                pharmacy: pharmacyCount,
                rehabilitation: rehabilitationCount,
              });
              console.log(`[HospitalsPage] 초기 검색 결과 개수 저장: ${totalCount}개 (병원: ${hospitalCount}, 약국: ${pharmacyCount}, 재활기관: ${rehabilitationCount})`);
            }
            
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
      <div className="container mx-auto px-4 pt-4 pb-12">
        {/* 최상단 멘트 */}
        <div className="mb-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-primary text-center leading-tight">
            어디서 치료되나요?
          </h1>
          {userLocation && searchMode === 'location' && initialInstitutionCount !== null && initialCounts && (
            <div className="mt-4 space-y-3">
              <p className="text-lg text-foreground text-center">
                <span className="font-bold text-red-600 text-xl">{radiusKm}km</span> 이내 <span className="font-bold text-red-600 text-xl">{initialInstitutionCount}</span>개의 치료기관이 있습니다.
              </p>
              
              {/* 상세 개수 표시 */}
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                {initialCounts.hospital > 0 && (
                  <button
                    onClick={() => {
                      // 병원 필터 토글: 이미 병원 필터가 활성화되어 있으면 전체로, 아니면 병원으로
                      if (activeFilter === 'hospital') {
                        handleFilterChange('all');
                      } else {
                        handleFilterChange('hospital');
                      }
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeFilter === 'hospital'
                        ? 'bg-primary text-primary-foreground font-semibold'
                        : 'bg-white border border-[var(--border-medium)] text-foreground hover:bg-primary/10 hover:border-primary'
                    }`}
                  >
                    병원 <span className="font-bold">{initialCounts.hospital}</span>개
                  </button>
                )}
                {initialCounts.pharmacy > 0 && (
                  <button
                    onClick={() => {
                      // 약국 필터 토글: 이미 약국 필터가 활성화되어 있으면 전체로, 아니면 약국으로
                      if (activeFilter === 'pharmacy') {
                        handleFilterChange('all');
                      } else {
                        handleFilterChange('pharmacy');
                      }
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeFilter === 'pharmacy'
                        ? 'bg-primary text-primary-foreground font-semibold'
                        : 'bg-white border border-[var(--border-medium)] text-foreground hover:bg-primary/10 hover:border-primary'
                    }`}
                  >
                    약국 <span className="font-bold">{initialCounts.pharmacy}</span>개
                  </button>
                )}
                {initialCounts.rehabilitation > 0 && (
                  <button
                    onClick={() => {
                      // 재활기관 필터 토글: 이미 재활기관 필터가 활성화되어 있으면 전체로, 아니면 job-training으로
                      if (activeFilter === 'job-training' || activeFilter === 'sports-rehab') {
                        handleFilterChange('all');
                      } else {
                        handleFilterChange('job-training');
                      }
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeFilter === 'job-training' || activeFilter === 'sports-rehab'
                        ? 'bg-primary text-primary-foreground font-semibold'
                        : 'bg-white border border-[var(--border-medium)] text-foreground hover:bg-primary/10 hover:border-primary'
                    }`}
                  >
                    재활기관 <span className="font-bold">{initialCounts.rehabilitation}</span>개
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* 더 자세한 조건으로 검색하기 메뉴 */}
        <div className="mb-4">
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="w-full sm:w-auto px-5 py-3 rounded-lg text-base font-semibold transition-all duration-200 border-2 bg-white text-foreground border-[var(--border-medium)] hover:border-primary hover:bg-primary/5 hover:shadow-md flex items-center justify-center gap-2"
          >
            <span>더 자세한 조건으로 검색하기</span>
            <svg 
              className={`w-5 h-5 transition-transform duration-200 ${showAdvancedFilters ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* 고급 필터 영역 (접을 수 있음) */}
        {showAdvancedFilters && (
          <div className="mb-6 p-4 bg-gradient-to-br from-white to-[#F8F9FA] border border-[var(--border-light)] rounded-lg shadow-sm space-y-4">
            {/* 1. 내 위치 주변 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold">1</span>
                <h3 className="text-sm font-bold text-foreground">내 위치 주변</h3>
              </div>
              <div className="flex items-center gap-2 flex-wrap pl-6">
                {[5, 10, 15, 30].map((radius) => (
                  <button
                    key={radius}
                    onClick={() => {
                      handleSearchModeChange('location');
                      handleRadiusChange(radius);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border-2 shadow-sm ${
                      radiusKm === radius && searchMode === 'location'
                        ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105'
                        : 'bg-white text-foreground border-[var(--border-medium)] hover:border-primary hover:bg-primary/5 hover:shadow-md hover:scale-105'
                    }`}
                  >
                    {radius}km
                  </button>
                ))}
              </div>
            </div>

            {/* 구분선 */}
            <div className="border-t border-[var(--border-light)]"></div>

            {/* 2. 지역 선택 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold">2</span>
                <h3 className="text-sm font-bold text-foreground">지역 선택</h3>
              </div>
              <div className="pl-6">
                <button
                  onClick={() => handleSearchModeChange('region')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border-2 shadow-sm ${
                    searchMode === 'region'
                      ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105'
                      : 'bg-white text-foreground border-[var(--border-medium)] hover:border-primary hover:bg-primary/5 hover:shadow-md hover:scale-105'
                  }`}
                >
                  지역 선택하기
                </button>
                {searchMode === 'region' && (
                  <div className="mt-2">
                    <RegionSelector
                      value={selectedRegion}
                      onChange={handleRegionChange}
                      onRegionChange={handleRegionCoordinatesChange}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 구분선 */}
            <div className="border-t border-[var(--border-light)]"></div>

            {/* 3. 종류 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold">3</span>
                <h3 className="text-sm font-bold text-foreground">종류</h3>
              </div>
              <div className="flex items-center gap-2 flex-wrap pl-6">
                <button
                  onClick={() => handleFilterChange('hospital')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border-2 shadow-sm ${
                    activeFilter === 'hospital'
                      ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105'
                      : 'bg-white text-foreground border-[var(--border-medium)] hover:border-primary hover:bg-primary/5 hover:shadow-md hover:scale-105'
                  }`}
                >
                  병원
                </button>
                <button
                  onClick={() => handleFilterChange('pharmacy')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border-2 shadow-sm ${
                    activeFilter === 'pharmacy'
                      ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105'
                      : 'bg-white text-foreground border-[var(--border-medium)] hover:border-primary hover:bg-primary/5 hover:shadow-md hover:scale-105'
                  }`}
                >
                  약국
                </button>
                <button
                  onClick={() => handleFilterChange('sports-rehab')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border-2 shadow-sm ${
                    activeFilter === 'sports-rehab'
                      ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105'
                      : 'bg-white text-foreground border-[var(--border-medium)] hover:border-primary hover:bg-primary/5 hover:shadow-md hover:scale-105'
                  }`}
                >
                  재활스포츠기관
                </button>
                <button
                  onClick={() => handleFilterChange('job-training')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border-2 shadow-sm ${
                    activeFilter === 'job-training'
                      ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105'
                      : 'bg-white text-foreground border-[var(--border-medium)] hover:border-primary hover:bg-primary/5 hover:shadow-md hover:scale-105'
                  }`}
                >
                  직업훈련기관
                </button>
              </div>
            </div>

            {/* 4. 병원 종류 (병원 필터일 때만 표시) */}
            {(activeFilter === 'hospital' || activeFilter === 'all') && (
              <>
                {/* 구분선 */}
                <div className="border-t border-[var(--border-light)]"></div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold">4</span>
                    <h3 className="text-sm font-bold text-foreground">병원 종류</h3>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap pl-6">
                    {DEPARTMENT_OPTIONS.slice(0, 4).map((dept) => (
                      <button
                        key={dept.value}
                        onClick={() => toggleDepartment(dept.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border-2 shadow-sm ${
                          selectedDepartments.includes(dept.value)
                            ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105'
                            : 'bg-white text-foreground border-[var(--border-medium)] hover:border-primary hover:bg-primary/5 hover:shadow-md hover:scale-105'
                        }`}
                      >
                        {dept.label}
                      </button>
                    ))}
                    {/* 더보기 버튼 (나머지 진료과목) */}
                    {DEPARTMENT_OPTIONS.length > 4 && (
                      <div className="relative group">
                        <button
                          className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border-2 shadow-sm bg-white text-foreground border-[var(--border-medium)] hover:border-primary hover:bg-primary/5 hover:shadow-md hover:scale-105"
                          aria-label="더보기 진료과목"
                        >
                          더보기
                        </button>
                        {/* 드롭다운 메뉴 (호버 시 표시) */}
                        <div className="absolute top-full left-0 mt-2 bg-white border-2 border-[var(--border-light)] rounded-lg p-3 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[160px] shadow-lg">
                          {DEPARTMENT_OPTIONS.slice(4).map((dept) => (
                            <button
                              key={dept.value}
                              onClick={() => toggleDepartment(dept.value)}
                              className={`w-full text-left text-sm px-4 py-2.5 rounded-lg hover:bg-[var(--background-alt)] transition-colors font-medium ${
                                selectedDepartments.includes(dept.value) ? 'bg-primary/10 text-primary font-semibold' : 'text-foreground'
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
                    <div className="pl-6 pt-1">
                      <button
                        onClick={() => setSelectedDepartments([])}
                        className="text-sm text-muted-foreground hover:text-primary underline transition-colors"
                        aria-label="진료과목 필터 초기화"
                      >
                        선택 초기화
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
        
        {/* 반응형 레이아웃: 모바일은 세로, 데스크톱은 가로 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 모바일: 지도가 상단, 데스크톱: 지도가 좌측 */}
          <div className="lg:col-span-2 order-1 lg:order-1">
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
            
            {/* 선택된 병원/재활기관 정보 패널 (지도 아래) */}
            {(selectedHospital || selectedRehabilitationCenter) && (
              <div className="mt-4 bg-white rounded-lg border border-[var(--border-light)] p-6 shadow-canopy">
                {selectedHospital && (
                  <>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-2xl font-bold text-[#1C1C1E]">
                            {selectedHospital.name}
                          </h3>
                          <FavoriteButton
                            entityType="hospital"
                            entityId={selectedHospital.id}
                            size="md"
                          />
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {selectedHospital.institution_type && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                              {selectedHospital.institution_type}
                            </span>
                          )}
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            selectedHospital.type === 'hospital' 
                              ? 'bg-primary/10 text-primary' 
                              : 'bg-[#3B82F6]/10 text-[#3B82F6]'
                          }`}>
                            {selectedHospital.type === 'hospital' ? '병원' : '약국'}
                          </span>
                          {selectedHospital.department_extracted && selectedHospital.department_extracted !== '기타' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--color-rehabilitation)]/10 text-[var(--color-rehabilitation)]">
                              {selectedHospital.department_extracted}
                            </span>
                          )}
                        </div>
                        {selectedHospital.department_extracted && selectedHospital.department_extracted !== '기타' && (
                          <p className="text-sm text-muted-foreground mb-2">
                            진료과목: {selectedHospital.department_extracted}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => setSelectedHospital(null)}
                        className="text-[#555555] hover:text-[#1C1C1E] transition-colors"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {/* 주소 정보 */}
                      <div className="flex items-start gap-3 border-b border-[#E8F5E9] pb-4">
                        <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#1C1C1E]">주소</p>
                          <p className="text-sm text-[#555555] mt-1">
                            {selectedHospital.address}
                          </p>
                        </div>
                      </div>

                      {/* 전화번호 정보 */}
                      {selectedHospital.phone && (
                        <div className="flex items-start gap-3 border-b border-[#E8F5E9] pb-4">
                          <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-[#1C1C1E]">전화번호</p>
                            <p className="text-sm text-[#555555] mt-1">
                              {selectedHospital.phone}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 액션 버튼 */}
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      {/* Primary CTA: 전화 걸기 */}
                      {selectedHospital.phone && (
                        <button
                          onClick={() => window.location.href = `tel:${selectedHospital.phone}`}
                          className="w-full h-12 bg-primary text-primary-foreground rounded-lg font-semibold text-base hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          전화 걸기
                        </button>
                      )}

                      {/* Secondary CTA: 길찾기 */}
                      <button
                        onClick={() => {
                          const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                          const address = selectedHospital.address;
                          
                          if (isMobile) {
                            // 모바일: 주소 기반 검색 링크 사용
                            window.open(`https://m.map.naver.com/search/${encodeURIComponent(address)}`, '_blank');
                          } else {
                            // 데스크톱: 주소 기반 검색 링크 사용
                            window.open(`https://map.naver.com/search/${encodeURIComponent(address)}`, '_blank');
                          }
                        }}
                        className="w-full h-12 border-2 border-primary text-primary rounded-lg font-semibold text-base hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        길찾기
                      </button>
                    </div>
                  </>
                )}
                
                {selectedRehabilitationCenter && (
                  <>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-2xl font-bold text-[#1C1C1E]">
                            {selectedRehabilitationCenter.name}
                          </h3>
                          <FavoriteButton
                            entityType="rehabilitation_center"
                            entityId={selectedRehabilitationCenter.id}
                            size="md"
                          />
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {selectedRehabilitationCenter.gigwan_fg_nm && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--color-rehabilitation)]/10 text-[var(--color-rehabilitation)]">
                              {selectedRehabilitationCenter.gigwan_fg_nm}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedRehabilitationCenter(null)}
                        className="text-[#555555] hover:text-[#1C1C1E] transition-colors"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {/* 주소 정보 */}
                      <div className="flex items-start gap-3 border-b border-[#E8F5E9] pb-4">
                        <svg className="w-5 h-5 text-[var(--color-rehabilitation)] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#1C1C1E]">주소</p>
                          <p className="text-sm text-[#555555] mt-1">
                            {selectedRehabilitationCenter.address}
                          </p>
                        </div>
                      </div>

                      {/* 전화번호 정보 */}
                      {selectedRehabilitationCenter.phone && (
                        <div className="flex items-start gap-3 border-b border-[#E8F5E9] pb-4">
                          <svg className="w-5 h-5 text-[var(--color-rehabilitation)] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-[#1C1C1E]">전화번호</p>
                            <p className="text-sm text-[#555555] mt-1">
                              {selectedRehabilitationCenter.phone}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 액션 버튼 */}
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      {/* Primary CTA: 전화 걸기 */}
                      {selectedRehabilitationCenter.phone && (
                        <button
                          onClick={() => window.location.href = `tel:${selectedRehabilitationCenter.phone}`}
                          className="w-full h-12 bg-[var(--color-rehabilitation)] text-white rounded-lg font-semibold text-base hover:bg-[var(--color-rehabilitation)]/90 transition-colors flex items-center justify-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          전화 걸기
                        </button>
                      )}

                      {/* Secondary CTA: 길찾기 */}
                      <button
                        onClick={() => {
                          const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                          const address = selectedRehabilitationCenter.address;
                          
                          if (isMobile) {
                            // 모바일: 주소 기반 검색 링크 사용
                            window.open(`https://m.map.naver.com/search/${encodeURIComponent(address)}`, '_blank');
                          } else {
                            // 데스크톱: 주소 기반 검색 링크 사용
                            window.open(`https://map.naver.com/search/${encodeURIComponent(address)}`, '_blank');
                          }
                        }}
                        className="w-full h-12 border-2 border-[var(--color-rehabilitation)] text-[var(--color-rehabilitation)] rounded-lg font-semibold text-base hover:bg-[var(--color-rehabilitation)]/10 transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        길찾기
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          
          {/* 모바일: 목록이 하단, 데스크톱: 목록이 우측 */}
          <div className="lg:col-span-1 order-2 lg:order-2 flex flex-col" style={{ height: '650px' }}>
            <h2 className="text-[22px] font-semibold mb-4 flex-shrink-0">
              {searchMode === 'location' ? (
                userLocation ? (
                  <>산재로 치료가 가능한 곳들입니다</>
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
            {isFiltering && (
              <div className="mb-4 text-sm text-[#555555] flex-shrink-0">
                🔄 위치 기반 필터링 중...
              </div>
            )}
            <div className="space-y-3 overflow-y-auto flex-1 min-h-0">
                    {filteredHospitals.length === 0 && filteredRehabilitationCenters.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 sm:py-12" role="status" aria-live="polite">
                        <RiuLoader
                          message={
                            userLocation
                              ? `반경 ${radiusKm}km 내에 ${activeFilter === 'all' ? '병원/재활기관' : '해당 기관'}이 없어요. 지도를 이동하거나 반경을 늘려보세요.`
                              : '병원/재활기관 데이터가 없습니다. 동기화를 실행해주세요.'
                          }
                          iconVariants={['question', 'smile', 'cheer']}
                          logId="HospitalsPageClient:empty-state"
                          ariaDescription="검색 결과가 없습니다"
                        />
                      </div>
                ) : (
                  <>
                    {/* 병원 목록 (필터링된) */}
                    {filteredHospitals.slice(0, 20).map((hospital) => (
                      <div
                        key={hospital.id}
                        onClick={() => handleHospitalClick(hospital)}
                        className="bg-white rounded-lg border border-[var(--border-light)] p-4 sm:p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg sm:text-xl font-bold text-[#1C1C1E] flex-1">
                            {hospital.name}
                          </h3>
                          {hospital.distance !== undefined && (
                            <span className="text-xs sm:text-sm font-medium text-primary ml-2 whitespace-nowrap flex-shrink-0">
                              {formatDistance(hospital.distance)}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {hospital.institution_type && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                              {hospital.institution_type}
                            </span>
                          )}
                          {hospital.department_extracted && hospital.department_extracted !== '기타' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--color-rehabilitation)]/10 text-[var(--color-rehabilitation)]">
                              {hospital.department_extracted}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[#555555] mb-1">{hospital.address}</p>
                        {hospital.phone && (
                          <p className="text-sm text-[#555555]">📞 {hospital.phone}</p>
                        )}
                      </div>
                    ))}
                    {/* 재활기관 목록 (필터링된) */}
                    {filteredRehabilitationCenters.slice(0, 20).map((center) => (
                      <div
                        key={center.id}
                        onClick={() => handleRehabilitationCenterClick(center)}
                        className="bg-white rounded-lg border border-[var(--border-light)] p-4 sm:p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg sm:text-xl font-bold text-[#1C1C1E] flex-1">
                            {center.name}
                          </h3>
                          {center.distance !== undefined && (
                            <span className="text-xs sm:text-sm font-medium text-[var(--color-rehabilitation)] ml-2 whitespace-nowrap flex-shrink-0">
                              {formatDistance(center.distance)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[var(--color-rehabilitation)] mb-2">🏥 {center.gigwan_fg_nm || '재활기관'}</p>
                        <p className="text-sm text-[#555555] mb-1">{center.address}</p>
                        {center.phone && (
                          <p className="text-sm text-[#555555]">📞 {center.phone}</p>
                        )}
                      </div>
                    ))}
                  </>
                )}
            </div>
          </div>
        </div>

        {/* 데이터 출처 및 주의사항 */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              데이터 출처 및 안내
            </h3>
            <div className="space-y-2 text-sm text-gray-700 leading-relaxed">
              <p>
                본 서비스에 표시된 병원, 약국, 재활기관, 직업훈련기관 정보는 <strong className="font-semibold">근로복지공단에서 제공하는 공개 API</strong>를 활용하여 제공됩니다.
              </p>
              <p className="text-amber-700 bg-amber-50 border-l-4 border-amber-400 pl-4 py-2 rounded">
                <strong className="font-semibold">⚠️ 주의사항:</strong> 해당 정보는 실시간 정보가 아니며, 산재 지정이 취소되거나 기관이 폐업하는 경우 변동이 생길 수 있습니다. 
                정확한 정보는 <a href="https://www.comwel.or.kr" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline font-semibold">근로복지공단 홈페이지(www.comwel.or.kr)</a>에서 확인하시기 바랍니다.
              </p>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}

