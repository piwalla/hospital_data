"use client";

/**
 * @file page-client.tsx
 * @description 병원 찾기 페이지 클라이언트 컴포넌트
 *
 * Bottom Sheet 상태 관리 및 인터랙션 처리
 * 사용자 위치 기반 필터링 및 거리 표시
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { formatStyledMessage } from '@/components/hospitals/formatStyledMessage';
import { useSearchParams } from 'next/navigation';
import { cn } from "@/lib/utils";
import HospitalMap from '@/components/HospitalMap';
import RegionSelector from '@/components/RegionSelector';
import FavoriteButton from '@/components/FavoriteButton';
import type { Hospital } from '@/lib/api/hospitals';
import type { RehabilitationCenter } from '@/lib/api/rehabilitation-centers';
import type { SearchMode, RegionSelection } from '@/lib/types/region';
import { formatDistance } from '@/lib/utils/distance';
import { getZoomLevelByRadius } from '@/lib/utils/map';
import { getRegionCoordinates } from '@/lib/data/region-coordinates';
import { findProvinceByName } from '@/lib/data/korean-regions';
import RiuLoader from '@/components/ui/riu-loader';
import { hospitalTranslations, type Locale, defaultLocale } from '@/lib/i18n/config';

interface HospitalsPageClientProps {
  hospitals: Hospital[];
}

// 필터 타입 정의
type FilterType = 'all' | 'hospital' | 'pharmacy' | 'job-training' | 'sports-rehab' | 'certified-rehab';

// 진료과목 목록 (상위 진료과목) - Translation keys will be used in render
const DEPARTMENT_KEYS = [
  'orthopedics',
  'dentistry',
  'neurosurgery',
  'surgery',
  'rehabMedicine',
  'radiology',
  'ophthalmology',
  'psychiatry',
  'internalMedicine',
  'ent',
  'urology',
] as const;

export default function HospitalsPageClient({ hospitals: initialHospitals }: HospitalsPageClientProps) {
  const searchParams = useSearchParams(); // Moved to top
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [selectedRehabilitationCenter, setSelectedRehabilitationCenter] = useState<RehabilitationCenter | null>(null); // 재활기관 추가
  const [hospitals, setHospitals] = useState<Hospital[]>(initialHospitals);
  const [rehabilitationCenters, setRehabilitationCenters] = useState<RehabilitationCenter[]>([]); // 재활기관 추가
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const [radiusKm, setRadiusKm] = useState<number>(5); // 반경 선택 (기본값: 5km)
  
  // 필터 상태 (URL 파라미터 'filter' 처리)
  const [activeFilter, setActiveFilter] = useState<FilterType>(() => {
    if (typeof window !== 'undefined') {
       const filterParam = searchParams.get('filter') as FilterType;
       const validFilters: FilterType[] = ['all', 'hospital', 'pharmacy', 'job-training', 'sports-rehab', 'certified-rehab'];
       if (filterParam && validFilters.includes(filterParam)) {
         return filterParam;
       }
    }
    return 'all';
  });
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]); // 진료과목 필터 상태
  const [initialInstitutionCount, setInitialInstitutionCount] = useState<number | null>(null); // 초기 검색 결과 개수 저장
  const [initialCounts, setInitialCounts] = useState<{
    hospital: number;
    pharmacy: number;
    rehabilitation: number;
    certified: number; // 인증병원 개수 추가
  } | null>(null); // 초기 검색 결과 상세 개수 저장
  
  // 무한 스크롤을 위한 상태
  const [visibleCount, setVisibleCount] = useState(20);
  const observerTarget = useRef<HTMLDivElement>(null);

  // 고급 필터 표시 여부 (복구)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // 모바일 보기 모드 상태 ('map' | 'list')
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  
  // searchParams declaration moved to top

  const [searchMode, setSearchMode] = useState<SearchMode>(() => {
    if (typeof window !== 'undefined') { // Client-side check
       return searchParams.get('provinceName') ? 'region' : 'location';
    }
    return 'location';
  });

  const [selectedRegion, setSelectedRegion] = useState<RegionSelection>(() => {
    const provinceName = searchParams.get('provinceName');
    if (provinceName) {
      return {
        provinceCode: null,
        provinceName,
        districtCode: null,
        districtName: searchParams.get('districtName') || null,
        subDistrictCode: null,
        subDistrictName: searchParams.get('subDistrictName') || null,
      };
    }
    return {
      provinceCode: null, provinceName: null, districtCode: null, districtName: null, subDistrictCode: null, subDistrictName: null
    };
  });

  // 번역 훅 추가
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const t = hospitalTranslations[locale];

  useEffect(() => {
    const savedLocale = (localStorage.getItem('user_locale') as Locale) || defaultLocale;
    setLocale(savedLocale);

    const handleStorage = () => {
      const newLocale = (localStorage.getItem('user_locale') as Locale) || defaultLocale;
      setLocale(newLocale);
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('localeChange', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('localeChange', handleStorage);
    };
  }, []);

  // URL 파라미터 처리 useEffect 제거 (useState 초기값으로 대체)

  const handleHospitalClick = useCallback((hospital: Hospital) => {
    setSelectedHospital(hospital);
    setSelectedRehabilitationCenter(null); // 재활기관 초기화
  }, []);

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
              const certifiedCount = nearbyHospitals.filter(h => h.is_rehabilitation_certified).length; // 인증병원 개수
              const rehabilitationCount = nearbyRehabilitationCenters.length;
              const totalCount = hospitalCount + pharmacyCount + rehabilitationCount;
              
              setInitialInstitutionCount(totalCount);
              setInitialCounts({
                hospital: hospitalCount,
                pharmacy: pharmacyCount,
                rehabilitation: rehabilitationCount,
                certified: certifiedCount,
              });
              console.log(`[HospitalsPage] 초기 검색 결과 개수 저장: ${totalCount}개 (병원: ${hospitalCount}, 약국: ${pharmacyCount}, 재활기관: ${rehabilitationCount}, 인증: ${certifiedCount})`);
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchMode]);

  // 무한 스크롤 Observer 설정
  useEffect(() => {
    if (!observerTarget.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => prev + 20);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(observerTarget.current);

    return () => {
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observerTarget.current, visibleCount, hospitals.length, rehabilitationCenters.length]);

  // 지역 선택 시 검색
  useEffect(() => {
    if (searchMode === 'region' && selectedRegion.provinceName) {
      setIsFiltering(true);
      (async () => {
        try {
          // 지도 중심 이동 로직 추가
          const province = findProvinceByName(selectedRegion.provinceName!);
          if (province) {
             let districtCode = undefined;
             if (selectedRegion.districtName && province.districts) {
                const dist = province.districts.find(d => d.name === selectedRegion.districtName);
                if (dist) districtCode = dist.code;
             }
             
             // getRegionCoordinates는 provinceCode가 필요함.
             if (province.code) {
                 const coords = getRegionCoordinates(province.code, districtCode);
                 if (coords) {
                     setUserLocation(coords);
                 }
             }
          }

          const [regionHospitals, regionRehabilitationCenters] = await Promise.all([
            fetchHospitalsByRegion(selectedRegion),
            fetchRehabilitationCentersByRegion(selectedRegion),
          ]);
          
          setHospitals(regionHospitals);
          setRehabilitationCenters(regionRehabilitationCenters);
          
          // 검색 결과 개수 저장 및 초기화
          const hospitalCount = regionHospitals.filter(h => h.type === 'hospital').length;
          const pharmacyCount = regionHospitals.filter(h => h.type === 'pharmacy').length;
          const certifiedCount = regionHospitals.filter(h => h.is_rehabilitation_certified).length;
          const rehabilitationCount = regionRehabilitationCenters.length;
          const totalCount = hospitalCount + pharmacyCount + rehabilitationCount;
          
          setInitialInstitutionCount(totalCount);
          setInitialCounts({
            hospital: hospitalCount,
            pharmacy: pharmacyCount,
            rehabilitation: rehabilitationCount,
            certified: certifiedCount,
          });
          
          console.log(`[HospitalsPage] 지역 기반 검색 완료: 병원 ${regionHospitals.length}개, 재활기관 ${regionRehabilitationCenters.length}개 (인증: ${certifiedCount})`);
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
    // 약국, 재활기관, 산재인증 필터 선택 시 진료과목 필터 초기화
    if (filter === 'pharmacy' || filter === 'job-training' || filter === 'sports-rehab' || filter === 'certified-rehab') {
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
  const handleRehabilitationCenterClick = useCallback((center: RehabilitationCenter) => {
    setSelectedRehabilitationCenter(center);
    setSelectedHospital(null); // 병원 초기화
    console.log('[HospitalsPage] 재활기관 클릭:', center.name);
  }, []);

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
    } else if (activeFilter === 'certified-rehab') {
      // 재활인증병원 필터
      return !!hospital.is_rehabilitation_certified;
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
    if (activeFilter === 'sports-rehab') return true; // 재활기관 전체 표시 (LocalResourcesCard와 카운트 일치시키기 위함)
    return false; // 병원/약국 필터는 위에서 처리
  });

  // 지도에 표시할 병원 목록 (필터 적용)
  const hospitalsForMap = filteredHospitals;
  
  // 지도에 표시할 재활기관 목록 (필터 적용)
  const rehabilitationCentersForMap = filteredRehabilitationCenters;

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* 최상단 멘트 */}
        {/* 최상단 멘트 및 필터 버튼 통합 */}
        <div className="mb-8 flex flex-col items-center">
          {initialInstitutionCount !== null && initialCounts && (
            <div className="w-full space-y-4">
              {/* 상태 메시지 (반경/개수 강조) */}
              {searchMode === 'location' && userLocation && (
                <p className="text-lg text-gray-700 font-medium text-center">
                  {formatStyledMessage(t.messages.foundNearby, {
                    radius: radiusKm.toString(),
                    count: initialInstitutionCount.toString()
                  })}
                </p>
              )}
              {searchMode === 'region' && selectedRegion.provinceName && (
                <p className="text-lg text-gray-700 font-medium text-center">
                  {formatStyledMessage(t.messages.foundRegion, {
                    region: `${selectedRegion.provinceName} ${selectedRegion.districtName || ''}`,
                    count: initialInstitutionCount.toString()
                  })}
                </p>
              )}
              
              {/* 상세 개수 표시 및 고급 필터 버튼 통합 */}
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                  {initialCounts.hospital > 0 && (
                    <button
                      onClick={() => handleFilterChange(activeFilter === 'hospital' ? 'all' : 'hospital')}
                      className={cn(
                        "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                        activeFilter === 'hospital'
                          ? 'bg-[#2F6E4F] text-white shadow-md ring-2 ring-[#2F6E4F] ring-offset-2'
                          : 'bg-white text-gray-600 border border-gray-200 hover:border-[#2F6E4F] hover:text-[#2F6E4F] shadow-sm hover:shadow-md'
                      )}
                    >

                      {t.filters.hospital} <span className={cn("ml-1", activeFilter === 'hospital' ? 'text-white/90' : 'text-[#2F6E4F] font-bold')}>{initialCounts.hospital}</span>
                    </button>
                  )}
                  {initialCounts.pharmacy > 0 && (
                    <button
                      onClick={() => handleFilterChange(activeFilter === 'pharmacy' ? 'all' : 'pharmacy')}
                      className={cn(
                        "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                        activeFilter === 'pharmacy'
                          ? 'bg-[#34C759] text-white shadow-md ring-2 ring-[#34C759] ring-offset-2'
                          : 'bg-white text-gray-600 border border-gray-200 hover:border-[#34C759] hover:text-[#34C759] shadow-sm hover:shadow-md'
                      )}
                    >
                      {t.filters.pharmacy} <span className={cn("ml-1", activeFilter === 'pharmacy' ? 'text-white/90' : 'text-[#34C759] font-bold')}>{initialCounts.pharmacy}</span>
                    </button>
                  )}
                  {initialCounts.rehabilitation > 0 && (
                    <button
                      onClick={() => handleFilterChange(activeFilter === 'sports-rehab' ? 'all' : 'sports-rehab')}
                      className={cn(
                        "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                        activeFilter === 'sports-rehab'
                          ? 'bg-[#9333EA] text-white shadow-md ring-2 ring-[#9333EA] ring-offset-2'
                          : 'bg-white text-gray-600 border border-gray-200 hover:border-[#9333EA] hover:text-[#9333EA] shadow-sm hover:shadow-md'
                      )}
                    >
                      {t.filters.sports} <span className={cn("ml-1", activeFilter === 'sports-rehab' ? 'text-white/90' : 'text-[#9333EA] font-bold')}>{initialCounts.rehabilitation}</span>
                    </button>
                  )}
                  {initialCounts.certified > 0 && (
                    <button
                      onClick={() => handleFilterChange(activeFilter === 'certified-rehab' ? 'all' : 'certified-rehab')}
                      className={cn(
                        "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                        activeFilter === 'certified-rehab'
                          ? 'bg-[#E11D48] text-white shadow-md ring-2 ring-[#E11D48] ring-offset-2'
                          : 'bg-white text-gray-600 border border-gray-200 hover:border-[#E11D48] hover:text-[#E11D48] shadow-sm hover:shadow-md'
                      )}
                    >
                      {t.filters.certified} <span className={cn("ml-1", activeFilter === 'certified-rehab' ? 'text-white/90' : 'text-[#E11D48] font-bold')}>{initialCounts.certified}</span>
                    </button>
                  )}
                </div>

                {/* 세로 구분선 (데스크탑 전용) */}
                <div className="hidden sm:block w-px h-6 bg-gray-200 mx-2"></div>

                {/* 고급 필터 버튼 */}
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className={cn(
                    "px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border flex items-center gap-2 group",
                    showAdvancedFilters
                      ? "bg-gray-800 text-white border-gray-800 shadow-md"
                      : "bg-white text-gray-700 border-gray-200 hover:border-primary/30 hover:bg-white hover:shadow-md"
                  )}
                >
                  <span>{t.filters.detailed}</span>
                  <svg 
                    className={cn("w-4 h-4 transition-all duration-300", showAdvancedFilters ? "rotate-180 text-white" : "text-gray-400 group-hover:text-primary")}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 고급 필터 영역 (접을 수 있음) */}
        {showAdvancedFilters && (
          <div className="mb-6 p-6 bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] space-y-6">
            {/* 1. 내 위치 주변 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold ring-1 ring-primary/20">1</span>
                <h3 className="text-sm font-bold text-gray-800">{t.sections.nearMe}</h3>
              </div>
              <div className="flex items-center gap-2 flex-wrap pl-8">
                {[5, 10, 15, 30].map((radius) => (
                  <button
                    key={radius}
                    onClick={() => {
                      handleSearchModeChange('location');
                      handleRadiusChange(radius);
                    }}
                    className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-300 ${
                      radiusKm === radius && searchMode === 'location'
                        ? 'bg-primary text-white shadow-md transform scale-105'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm'
                    }`}
                  >
                    {radius}km
                  </button>
                ))}
              </div>
            </div>

            {/* 구분선 */}
            <div className="border-t border-gray-100"></div>

            {/* 2. 지역 선택 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold ring-1 ring-primary/20">2</span>
                <h3 className="text-sm font-bold text-gray-800">{t.sections.selectRegion}</h3>
              </div>
              <div className="pl-8">
                <button
                  onClick={() => handleSearchModeChange('region')}
                  className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-300 ${
                    searchMode === 'region'
                      ? 'bg-primary text-white shadow-md transform scale-105'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm'
                  }`}
                >
                  {t.sections.selectRegionBtn}
                </button>
                {searchMode === 'region' && (
                  <div className="mt-3">
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
            <div className="border-t border-gray-100"></div>

            {/* 3. 종류 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold ring-1 ring-primary/20">3</span>
                <h3 className="text-sm font-bold text-gray-800">{t.sections.types}</h3>
              </div>
              <div className="flex items-center gap-2 flex-wrap pl-8">
                <button
                  onClick={() => handleFilterChange('hospital')}
                  className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-300 ${
                    activeFilter === 'hospital'
                      ? 'bg-[#2F6E4F] text-white shadow-md transform scale-105'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-[#2F6E4F] hover:bg-[#2F6E4F]/5 hover:shadow-sm'
                  }`}
                >
                  {t.filters.hospital}
                </button>
                <button
                  onClick={() => handleFilterChange('pharmacy')}
                  className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-300 ${
                    activeFilter === 'pharmacy'
                      ? 'bg-[#34C759] text-white shadow-md transform scale-105'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-[#34C759] hover:bg-[#34C759]/5 hover:shadow-sm'
                  }`}
                >
                  {t.filters.pharmacy}
                </button>
                <button
                  onClick={() => handleFilterChange('sports-rehab')}
                  className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-300 ${
                    activeFilter === 'sports-rehab'
                      ? 'bg-[#9333EA] text-white shadow-md transform scale-105'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-[#9333EA] hover:bg-[#9333EA]/5 hover:shadow-sm'
                  }`}
                >
                  {t.filters.sports}
                </button>
                <button
                  onClick={() => handleFilterChange('job-training')}
                  className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-300 ${
                    activeFilter === 'job-training'
                      ? 'bg-[#9333EA] text-white shadow-md transform scale-105'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-[#9333EA] hover:bg-[#9333EA]/5 hover:shadow-sm'
                  }`}
                >
                  {t.filters.job}
                </button>
                <button
                  onClick={() => handleFilterChange('certified-rehab')}
                  className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-300 ${
                    activeFilter === 'certified-rehab'
                      ? 'bg-[#2563EB] text-white shadow-md transform scale-105'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-[#2563EB] hover:text-[#2563EB] hover:shadow-sm'
                  }`}
                >
                  {t.filters.certified}
                </button>
              </div>
            </div>

            {/* 4. 병원 종류 (병원 필터일 때만 표시) */}
            {(activeFilter === 'hospital' || activeFilter === 'all') && (
              <>
                {/* 구분선 */}
                <div className="border-t border-gray-100"></div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold ring-1 ring-primary/20">4</span>
                    <h3 className="text-sm font-bold text-gray-800">{t.sections.hospitalType}</h3>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap pl-8">
                    {DEPARTMENT_KEYS.slice(0, 4).map((dept) => (
                      <button
                        key={dept}
                        onClick={() => toggleDepartment(hospitalTranslations['ko'].departments[dept])}
                        className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-300 ${
                          selectedDepartments.includes(hospitalTranslations['ko'].departments[dept])
                            ? 'bg-primary text-white shadow-md transform scale-105'
                            : 'bg-white text-gray-600 border border-gray-200 hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm'
                        }`}
                      >
                        {t.departments[dept]}
                      </button>
                    ))}
                    {/* 더보기 버튼 (나머지 진료과목) */}
                    {DEPARTMENT_KEYS.length > 4 && (
                      <div className="relative group">
                        <button
                          className="px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-300 border border-gray-200 bg-white text-gray-600 hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm"
                          aria-label={t.sections.more}
                        >
                          {t.sections.more}
                        </button>
                        {/* 드롭다운 메뉴 (호버 시 표시) */}
                        <div className="absolute top-full left-0 mt-2 bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl p-3 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[160px] shadow-xl">
                          {DEPARTMENT_KEYS.slice(4).map((dept) => (
                            <button
                              key={dept}
                              onClick={() => toggleDepartment(hospitalTranslations['ko'].departments[dept])}
                              className={`w-full text-left text-sm px-4 py-2.5 rounded-xl hover:bg-primary/5 transition-colors font-medium ${
                                selectedDepartments.includes(hospitalTranslations['ko'].departments[dept]) ? 'bg-primary/10 text-primary font-bold' : 'text-gray-700'
                              }`}
                          >
                            {t.departments[dept]}
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
                        {locale === 'ko' ? '선택 초기화' : 'Reset Selection'}
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
        
        {/* 모바일 뷰 모드 전환 탭 (Improved Segmented Control) */}
        <div className="lg:hidden mb-8">
          <div className="flex p-1.5 bg-white/95 backdrop-blur-md rounded-full border border-gray-300/40 shadow-[0_8px_32px_rgba(0,0,0,0.12)] max-w-[320px] mx-auto">
            <button
              onClick={() => setViewMode('map')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-full transition-all duration-300",
                viewMode === 'map'
                  ? 'bg-primary text-white shadow-[0_4px_12px_rgba(47,110,79,0.25)]'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              )}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 20l-5.447-2.724A2 2 0 013 15.382V5.618a2 2 0 011.447-1.898L9 1l6 4 5.553-2.776A2 2 0 0121 4.118v9.764a2 2 0 01-1.447 1.898L15 19l-6 1z" />
              </svg>
              <span>{t.sections.mobileView?.map || '지도 보기'}</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-full transition-all duration-300",
                viewMode === 'list'
                  ? 'bg-primary text-white shadow-[0_4px_12px_rgba(47,110,79,0.25)]'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              )}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <span>{t.sections.mobileView?.list || '목록 보기'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          {/* 지도 영역 */}
          <div className={`min-w-0 ${viewMode === 'list' ? 'max-lg:hidden' : ''}`}>
            <HospitalMap 
              hospitals={hospitalsForMap}
              rehabilitationCenters={rehabilitationCentersForMap}
              onHospitalClick={(hospital) => {
                handleHospitalClick(hospital);
              }}
              onRehabilitationCenterClick={(center) => {
                handleRehabilitationCenterClick(center);
              }}
              center={userLocation ? { lat: userLocation.lat, lng: userLocation.lng } : undefined}
              zoom={getZoomLevelByRadius(radiusKm)}
              userLocation={userLocation}
              onLocationChange={handleLocationChange}
              enableLocationChange={searchMode === 'location'}
            />
          </div>
          
          {/* 목록 영역 */}
          <div className={`min-w-0 flex flex-col ${viewMode === 'map' ? 'max-lg:hidden' : ''} h-[450px] lg:h-[650px]`}>
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
                          {selectedHospital.is_rehabilitation_certified && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#2563EB]/10 text-[#2563EB]">
                              산재재활인증
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
            
            {/* 모바일: 목록이 하단, 데스크톱: 목록이 우측 */}
            
              <h2 className="text-lg font-bold mb-4 pl-4 flex-shrink-0 animate-fade-in text-gray-800 flex items-center gap-2">
                <div className="w-1 h-5 bg-primary rounded-full"></div>
                {searchMode === 'location' ? (
                  userLocation ? (
                    <>{t.sections.listHeader}</>
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
                      : selectedRegion.provinceName}에 {
                        activeFilter === 'hospital' ? '산재 병원' : 
                        activeFilter === 'pharmacy' ? '산재 약국' : 
                        activeFilter === 'sports-rehab' ? '산재 재활기관' : 
                        activeFilter === 'job-training' ? '직업훈련기관' :
                        activeFilter === 'certified-rehab' ? '산재 인증병원' : '산재 의료기관'
                      } {filteredHospitals.length + filteredRehabilitationCenters.length}개가 있습니다.
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
            <div className="space-y-4 overflow-y-auto flex-1 min-h-0 pl-4 pr-10 py-1 custom-scrollbar">
                    {filteredHospitals.length === 0 && filteredRehabilitationCenters.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 sm:py-12" role="status" aria-live="polite">
                        <RiuLoader
                          message={
                            searchMode === 'region'
                              ? `${selectedRegion.provinceName || '선택하신'} ${selectedRegion.districtName || ''} 지역에 ${
                                  activeFilter === 'hospital' ? '병원' : 
                                  activeFilter === 'pharmacy' ? '약국' : 
                                  activeFilter === 'sports-rehab' ? '재활기관' : '의료기관'
                                } 정보가 없습니다.`
                              : userLocation
                                ? `반경 ${radiusKm}km 내에 ${
                                    activeFilter === 'hospital' ? '병원' : 
                                    activeFilter === 'pharmacy' ? '약국' : 
                                    activeFilter === 'sports-rehab' ? '재활기관' : '의료기관'
                                  }이 없어요. 지도를 이동하거나 반경을 늘려보세요.`
                                : '데이터를 불러오는 중입니다...'
                          }
                          iconVariants={['question', 'smile', 'cheer']}
                          logId="HospitalsPageClient:empty-state"
                          ariaDescription="검색 결과가 없습니다"
                        />
                      </div>
                ) : (
                  <>
                    {/* 병원 목록 (필터링된) */}
                    {filteredHospitals.slice(0, visibleCount).map((hospital) => (
                      <div
                        key={hospital.id}
                        onClick={() => handleHospitalClick(hospital)}
                        className={cn(
                          "group relative bg-white rounded-2xl border border-gray-300/40 p-4 overflow-hidden",
                          "shadow-[0_8px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_24px_48px_rgba(0,0,0,0.12)]",
                          "hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer",
                          selectedHospital?.id === hospital.id ? "ring-2 ring-primary border-transparent" : "border-gray-300/40"
                        )}
                      >
                        {/* Accent Bar */}
                        <div className={cn(
                          "absolute left-0 top-0 bottom-0 w-1 transition-all duration-300",
                          hospital.type === 'pharmacy' ? "bg-[#3B82F6]/0 group-hover:bg-[#3B82F6]" : "bg-[#2F6E4F]/0 group-hover:bg-[#2F6E4F]"
                        )} />
                        
                        <div className="flex items-start justify-between mb-2 pl-2">
                          <h3 className={cn(
                            "text-lg font-bold text-gray-900 flex-1 transition-colors",
                            hospital.type === 'pharmacy' ? "group-hover:text-[#3B82F6]" : "group-hover:text-[#2F6E4F]"
                          )}>
                            {hospital.name}
                          </h3>
                          {hospital.distance !== undefined && (
                            <span className="text-sm font-semibold text-primary ml-3 whitespace-nowrap flex-shrink-0 bg-primary/5 px-2.5 py-1 rounded-full">
                              {formatDistance(hospital.distance)}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {hospital.institution_type && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-50 text-gray-600 border border-gray-200">
                              {hospital.institution_type}
                            </span>
                          )}
                          {hospital.department_extracted && hospital.department_extracted !== '기타' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#2F6E4F]/10 text-[#2F6E4F]">
                              {hospital.department_extracted}
                            </span>
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="text-[13px] text-gray-600 flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {hospital.address}
                          </p>
                          {hospital.phone && (
                            <p className="text-[13px] text-gray-600 flex items-center gap-2">
                              {/* Phone Icon */}
                              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              {hospital.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                    {/* 재활기관 목록 (필터링된) */}
                    {filteredRehabilitationCenters.slice(0, visibleCount).map((center) => (
                      <div
                        key={center.id}
                        onClick={() => handleRehabilitationCenterClick(center)}
                        className={cn(
                          "group relative bg-white rounded-2xl border border-gray-300/40 p-4 overflow-hidden",
                          "shadow-[0_8px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_24px_48px_rgba(0,0,0,0.12)]",
                          "hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer"
                        )}
                      >
                        {/* Accent Bar */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#9333EA]/0 group-hover:bg-[#9333EA] transition-all duration-300" />

                        <div className="flex items-start justify-between mb-2 pl-2">
                          <h3 className="text-lg font-bold text-gray-900 flex-1 group-hover:text-[#9333EA] transition-colors">
                            {center.name}
                          </h3>
                          {center.distance !== undefined && (
                            <span className="text-sm font-semibold text-[#9333EA] ml-3 whitespace-nowrap flex-shrink-0 bg-[#9333EA]/5 px-2.5 py-1 rounded-full">
                              {formatDistance(center.distance)}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#9333EA]/10 text-[#9333EA]">
                              {center.gigwan_fg_nm || '재활기관'}
                            </span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[13px] text-gray-600 flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {center.address}
                          </p>
                          {center.phone && (
                            <p className="text-[13px] text-gray-600 flex items-center gap-2">
                              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              {center.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                    {/* 무한 스크롤 트리거 */}
                    {(filteredHospitals.length > visibleCount || filteredRehabilitationCenters.length > visibleCount) && (
                      <div ref={observerTarget} className="h-10 w-full flex justify-center items-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      </div>
                    )}
                  </>
                )}
            </div>
          </div>
        </div>

        {/* 주의사항 및 데이터 출처 (번역 적용) */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {t.sections.disclaimer?.title || '주의사항'}
            </h3>
              <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
                <p>
                  <span dangerouslySetInnerHTML={{ __html: t.sections.disclaimer?.source.replace('근로복지공단에서 제공하는 공개 API', '<strong class="font-semibold">근로복지공단에서 제공하는 공개 API</strong>') || '본 서비스에 표시된 병원, 약국, 재활기관, 직업훈련기관 정보는 <strong class="font-semibold">근로복지공단에서 제공하는 공개 API</strong>를 활용하여 제공됩니다.' }} />
                </p>
                <p>
                  <span dangerouslySetInnerHTML={{ 
                    __html: (t.sections.disclaimer?.realtime || '해당 정보는 실시간 정보가 아니며, 산재 지정이 취소되거나 기관이 폐업하는 경우 변동이 생길 수 있습니다. 정확한 정보는 근로복지공단 홈페이지(www.comwel.or.kr)에서 확인하시기 바랍니다.')
                    .replace(/(근로복지공단 홈페이지\(www\.comwel\.or\.kr\)|COMWEL website \(www\.comwel\.or\.kr\)|www\.comwel\.or\.kr)/g, '<a href="https://www.comwel.or.kr" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-semibold">$1</a>')
                  }} />
                </p>
                <p>
                  {t.sections.disclaimer?.certDate || '* 산재재활인증 기관은 2025년 6월 30일 기준입니다.'}
                </p>
              </div>
          </div>
        </div>
      </div>

    </>
  );
}

