"use client";

import { cn } from "@/lib/utils";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Building2, Stethoscope, Pill, Activity, Settings2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import RegionSelector from "@/components/RegionSelector";
import { RegionSelection } from "@/lib/types/region";
import { findProvinceByCode, findProvinceByName } from "@/lib/data/korean-regions";
import { updateUserRegion } from "@/app/actions/user";
import { SignInButton } from "@clerk/nextjs";


import HospitalMap from "@/components/HospitalMap";
import type { Hospital } from "@/lib/api/hospitals";
import type { RehabilitationCenter } from "@/lib/api/rehabilitation-centers";

interface LocalResourcesCardProps {
  user: {
    region?: string;
    name?: string;
  };
  isGuest?: boolean;
}

export default function LocalResourcesCard({ user, isGuest = false }: LocalResourcesCardProps) {
// ...
// (I need to be careful with replace_file_content not to delete the whole file content if I select a large range.
// The interface is at lines 23-28. The title is at line 281.)
// I will do 2 separate edits using multi_replace_file_content for safety and correctness.

  const router = useRouter();
  const [regionSelection, setRegionSelection] = useState<RegionSelection>({
    provinceCode: null,
    provinceName: null,
    districtCode: null,
    districtName: null,
    subDistrictCode: null,
    subDistrictName: null,
  });
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Removed static counts state
  // const [counts, setCounts] = useState({ ... });

  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [rehabs, setRehabs] = useState<RehabilitationCenter[]>([]);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | undefined>(undefined);
  // showSearchButton state removed
  const [currentBounds, setCurrentBounds] = useState<{ ne: { lat: number; lng: number }; sw: { lat: number; lng: number } } | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'hospital' | 'pharmacy' | 'rehabilitation' | 'certified'>('all');
  
  // AbortController ref for canceling pending requests
  const fetchAbortController = useRef<AbortController | null>(null);

  // Derived counts from current map data for Smart Tracking
  const hospitalCount = hospitals.filter(h => h.type === 'hospital').length;
  const pharmacyCount = hospitals.filter(h => h.type === 'pharmacy').length;
  const rehabilitationCount = rehabs.length;
  const certifiedCount = hospitals.filter(h => h.is_rehabilitation_certified).length;

  const handleFilterClick = (filter: 'hospital' | 'pharmacy' | 'rehabilitation' | 'certified') => {
    setSelectedFilter(prev => prev === filter ? 'all' : filter);
  };

  const filteredHospitals = hospitals.filter(h => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'hospital') return h.type === 'hospital';
    if (selectedFilter === 'pharmacy') return h.type === 'pharmacy';
    if (selectedFilter === 'certified') return h.is_rehabilitation_certified;
    if (selectedFilter === 'rehabilitation') return false; 
    return true;
  });

  const filteredRehabs = rehabs.filter(() => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'rehabilitation') return true;
    return false;
  });

  // Parse user region on mount
  useEffect(() => {
    if (user.region) {
      if (typeof user.region !== 'string') return;

      let parsed: RegionSelection | null = null;
      
      try {
        // Try parsing JSON first
        parsed = JSON.parse(user.region);
      } catch {
        // Not JSON, try to handle legacy string formats
        const rawRegion = user.region.trim().replace(/^"|"$/g, ''); // quotes 제거
        
        // 1. 영어 코드 매핑 (일부 호환)
        const englishMap: Record<string, string> = {
          'seoul': '11', 'busan': '26', 'daegu': '27', 'incheon': '28', 
          'gwangju': '29', 'daejeon': '30', 'ulsan': '31', 'sejong': '36',
          'gyeonggi': '41', 'gangwon': '42', 'chungbuk': '43', 'chungnam': '44',
          'jeonbuk': '45', 'jeonnam': '46', 'gyeongbuk': '47', 'gyeongnam': '48', 'jeju': '50'
        };

        const mappedCode = englishMap[rawRegion.toLowerCase()];
        if (mappedCode) {
           const prov = findProvinceByCode(mappedCode);
           if (prov) {
             parsed = {
               provinceCode: prov.code,
               provinceName: prov.name,
               districtCode: null, districtName: null, subDistrictCode: null, subDistrictName: null
             };
           }
        } 
        
        // 2. 한글 이름 매핑
        if (!parsed) {
             const prov = findProvinceByName(rawRegion);
             if (prov) {
                parsed = {
                   provinceCode: prov.code,
                   provinceName: prov.name,
                   districtCode: null, districtName: null, subDistrictCode: null, subDistrictName: null
                }
             }
        }
      }

      if (parsed && parsed.provinceName) {
        setRegionSelection(parsed);
      } else {
        console.warn("LocalResourcesCard: Failed to parse region string:", user.region);
      }
    }
  }, [user.region]);

  // Removed fetchCounts useEffect

  // Calculate center based on region or loaded resources
  useEffect(() => {
    // 1. Try to use predefined center from Region data (City Hall/Provincial Office)
    if (regionSelection.provinceCode) {
      const province = findProvinceByCode(regionSelection.provinceCode);
      if (province && province.latitude && province.longitude) {
        setMapCenter({
          lat: province.latitude,
          lng: province.longitude
        });
        return;
      }
    }

    // 2. Fallback: Calculate average center from loaded resources
    const allResources = [...hospitals, ...rehabs];
    
    if (allResources.length > 0) {
      // Simple average of coordinates
      const total = allResources.reduce((acc, curr) => ({
        lat: acc.lat + curr.latitude,
        lng: acc.lng + curr.longitude
      }), { lat: 0, lng: 0 });

      setMapCenter({
        lat: total.lat / allResources.length,
        lng: total.lng / allResources.length
      });
    } else if (!mapCenter) {
      // 3. Final Fallback: Default to Seoul City Hall to prevent infinite loading
      // Only set if mapCenter isn't already set to avoid override
      setMapCenter({ lat: 37.5665, lng: 126.9780 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regionSelection.provinceCode]);

  const handleSaveRegion = async () => {
    if (!regionSelection.provinceName) {
      alert("지역을 선택해주세요.");
      return;
    }

    try {
      await updateUserRegion(JSON.stringify(regionSelection));
      setIsDialogOpen(false);
      router.refresh();
    } catch {
      alert("지역 저장에 실패했습니다.");
    }
  };

  const handleMapChange = (bounds: { ne: { lat: number; lng: number }; sw: { lat: number; lng: number } }) => {
    setCurrentBounds(bounds);
    // showSearchButton logic removed - auto fetch will handle it
  };

  // Debounced auto-fetch on map move
  useEffect(() => {
    if (!currentBounds) return;

    const timer = setTimeout(() => {
      console.log('Auto-fetching resources for bounds:', currentBounds);
      handleSearchHere();
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentBounds]);

  const handleSearchHere = async () => {
    if (!currentBounds) return;

    // Cancel previous pending request
    if (fetchAbortController.current) {
      fetchAbortController.current.abort();
    }

    // Create new controller
    const controller = new AbortController();
    fetchAbortController.current = controller;



    try {
      const params = new URLSearchParams({
        neLat: currentBounds.ne.lat.toString(),
        neLng: currentBounds.ne.lng.toString(),
        swLat: currentBounds.sw.lat.toString(),
        swLng: currentBounds.sw.lng.toString(),
        type: 'all' // Fetch both
      });

      const res = await fetch(`/api/hospitals/in-bounds?${params.toString()}`, {
        signal: controller.signal
      });
      
      if (res.ok) {
        const data = await res.json();
        setHospitals(data.hospitals || []);
        setRehabs(data.rehabilitationCenters || []);
      }
    } catch (e: any) {
      if (e.name === 'AbortError') {
        console.log('Map fetch aborted');
        return; // Don't turn off loading if aborted (new request controls state)
      }
      console.error("Failed to search map resources:", e);
    } finally {
      // Only turn off loading if this request wasn't aborted
      if (fetchAbortController.current === controller) {

        fetchAbortController.current = null;
      }
    }
  };

  const getLinkUrl = (filterType?: string) => {
    const params = new URLSearchParams();
    if (regionSelection.provinceName) params.append('provinceName', regionSelection.provinceName);
    if (regionSelection.districtName) params.append('districtName', regionSelection.districtName);
    if (regionSelection.subDistrictName) params.append('subDistrictName', regionSelection.subDistrictName);
    if (filterType) params.append('filter', filterType);
    return `/hospitals?${params.toString()}`;
  };

  const displayRegionName = () => {
    const parts = [regionSelection.provinceName, regionSelection.districtName, regionSelection.subDistrictName].filter(Boolean);
    return parts.join(" ");
  };

  const hasRegion = !!regionSelection.provinceName;

  return (
    <Card className={cn(
      "border-white/40 bg-white/80 backdrop-blur-md shadow-premium rounded-[2.5rem] overflow-hidden transition-all hover:shadow-premium-hover h-full flex flex-col p-1",
      !hasRegion && "bg-slate-50/50 backdrop-blur-none border-dashed border-slate-200"
    )}>
      <CardHeader className="pb-4 pt-6 px-6 sm:px-8">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold flex items-center gap-3 text-slate-800 tracking-tight">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-emerald-500" />
            </div>
            {user.name || '회원'}님 지역 산재 치료기관
          </CardTitle>
          {hasRegion && (
             <Button variant="ghost" size="sm" onClick={() => setIsDialogOpen(true)} className="text-slate-400 hover:text-emerald-600 transition-colors bg-white/50 hover:bg-white h-10 px-4 rounded-2xl flex gap-2 font-bold shadow-sm border border-white/60">
               <span className="text-xs">지역 변경</span>
               <Settings2 className="w-4 h-4" />
             </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col px-6 sm:px-8 pb-8">
        {!hasRegion ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white/40 rounded-[2.5rem] border-2 border-dashed border-slate-200/60 backdrop-blur-sm text-center">
            <div className="w-16 h-16 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-4 border border-slate-50">
              <MapPin className="w-8 h-8 text-slate-300" />
            </div>
            {isGuest ? (
              <div className="space-y-6">
                <div>
                   <p className="font-extrabold text-slate-800 text-lg mb-2">
                     로그인하고 병원 찾기
                   </p>
                   <p className="text-sm text-slate-500 font-medium leading-relaxed">
                     로그인하면 우리 동네 산재 의료기관 <br/>지도를 바로 확인하실 수 있습니다.
                   </p>
                </div>
                <SignInButton mode="modal">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-premium rounded-[1.2rem] px-8 h-12 font-black">
                    3초 만에 로그인하기
                  </Button>
                </SignInButton>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                   <p className="font-extrabold text-slate-800 text-lg mb-2">
                     우리 동네 설정하기
                   </p>
                   <p className="text-sm text-slate-500 font-medium leading-relaxed">
                     현재 계신 곳 근처의 산재 지정 <br/>의료기관 정보를 실시간으로 알려드립니다.
                   </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-premium rounded-[1.2rem] px-8 h-12 font-black">
                      지역 설정하기
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-[2.5rem] border-white/40 bg-white/95 backdrop-blur-xl p-0 overflow-hidden shadow-2xl max-w-lg">
                    <div className="bg-slate-900 p-8 text-white">
                      <DialogTitle className="text-2xl font-black">지역 설정</DialogTitle>
                    </div>
                    <div className="p-8">
                      <RegionSelector 
                        value={regionSelection} 
                        onChange={setRegionSelection} 
                      />
                      <div className="mt-8">
                        <Button 
                          onClick={handleSaveRegion}
                          className="w-full h-12 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold shadow-lg"
                        >
                          저장하고 확인하기
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-end justify-between">
              <div className="space-y-1">

                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-slate-900 tracking-tight">{displayRegionName()}</span>
                </div>
              </div>
              <Link href={getLinkUrl()}>
                <Button variant="outline" className="h-10 px-4 rounded-2xl bg-white border-slate-100 text-slate-600 hover:text-emerald-600 hover:border-emerald-200 font-bold text-sm shadow-sm transition-all group">
                  전체 화면 보기 <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            <div className="rounded-[2rem] overflow-hidden shadow-inner border border-white/80 relative group">
                <HospitalMap 
                    hospitals={filteredHospitals} 
                    rehabilitationCenters={filteredRehabs} 
                    center={mapCenter}
                    zoom={13}
                    className="h-[380px]"
                    enableLocationChange={true}
                    onMapChange={handleMapChange}
                />
                <div className="absolute top-4 left-4 z-10">
                   <div className="bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-bold tracking-widest uppercase border border-white/20">
                      Smart Map Tracking
                   </div>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { id: 'hospital', label: '산재 병원', count: hospitalCount, icon: <Building2 className="w-4 h-4 text-blue-500" />, color: 'blue' },
                { id: 'pharmacy', label: '산재 약국', count: pharmacyCount, icon: <Pill className="w-4 h-4 text-emerald-500" />, color: 'emerald' },
                { id: 'rehabilitation', label: '재활기관', count: rehabilitationCount, icon: <Activity className="w-4 h-4 text-purple-500" />, color: 'purple' },
                { id: 'certified', label: '재활인증', count: certifiedCount, icon: <Stethoscope className="w-4 h-4 text-rose-500" />, color: 'rose' }
              ].map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => handleFilterClick(item.id as any)} 
                  className={cn(
                    "cursor-pointer group p-4 rounded-[1.8rem] border transition-all duration-300",
                    selectedFilter === item.id 
                      ? `bg-white border-${item.color}-500 shadow-lg ring-2 ring-${item.color}-500/10` 
                      : "bg-white/60 border-slate-100 hover:border-slate-300 hover:bg-white hover:shadow-md"
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={cn(
                      "w-8 h-8 rounded-xl flex items-center justify-center transition-colors shadow-sm",
                      selectedFilter === item.id ? `bg-${item.color}-50 text-${item.color}-600` : "bg-slate-50 text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600"
                    )}>
                        {item.icon}
                    </div>
                    {selectedFilter === item.id && (
                       <div className={`w-1.5 h-1.5 rounded-full bg-${item.color}-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]`} />
                    )}
                  </div>
                  <p className={cn(
                    "text-sm font-black uppercase tracking-widest mb-0.5",
                    selectedFilter === item.id ? `text-${item.color}-700` : `text-${item.color}-600/80`
                  )}>{item.label}</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className={cn(
                      "text-3xl font-black tracking-tight transition-colors",
                      selectedFilter === item.id ? `text-${item.color}-600` : "text-slate-800 group-hover:text-slate-900"
                    )}>
                      {item.count}
                    </span>
                    <span className="text-sm font-bold text-slate-400">건</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-[2.5rem] border-white/40 bg-white/95 backdrop-blur-xl p-0 overflow-hidden shadow-2xl max-w-lg">
          <div className="bg-slate-900 p-8 text-white">
            <DialogTitle className="text-2xl font-black text-white">지역 설정 변경</DialogTitle>
          </div>
          <div className="p-8">
            <RegionSelector 
              value={regionSelection} 
              onChange={setRegionSelection} 
            />
            <div className="mt-8">
              <Button 
                onClick={handleSaveRegion}
                className="w-full h-12 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold shadow-lg"
              >
                변경사항 저장
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
