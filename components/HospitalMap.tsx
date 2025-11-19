"use client";

/**
 * @file HospitalMap.tsx
 * @description 네이버 Dynamic Map을 사용한 병원 지도 컴포넌트
 *
 * 주요 기능:
 * 1. 사용자 위치 기반 지도 표시
 * 2. 병원 마커 표시
 * 3. 반응형 레이아웃 (모바일: 세로, 데스크톱: 가로)
 * 4. 위치 권한 요청 및 처리
 *
 * @dependencies
 * - 네이버 Maps JavaScript SDK
 * - lib/api/hospitals.ts
 */

import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import type { RehabilitationCenter } from '@/lib/api/rehabilitation-centers';

// 네이버 지도 타입 정의
declare global {
  interface Window {
    naver?: {
      maps: {
        Map: new (element: HTMLElement, options: any) => any;
        LatLng: new (lat: number, lng: number) => any;
        Marker: new (options: any) => any;
        InfoWindow: new (options: any) => any;
        Position: {
          TOP_RIGHT: any;
        };
        Event: {
          addListener: (target: any, event: string, handler: () => void) => void;
        };
      };
    };
  }
}

interface Hospital {
  id: string;
  name: string;
  type: 'hospital' | 'pharmacy';
  address: string;
  latitude: number;
  longitude: number;
  phone: string | null;
  department: string | null;
  institution_type: string | null; // 기관 유형 (대학병원, 종합병원, 병원, 의원, 한의원, 요양병원, 기타)
  department_extracted: string | null; // 추출된 진료과목 (여러 과목은 쉼표로 구분)
}

interface HospitalMapProps {
  hospitals?: Hospital[];
  rehabilitationCenters?: RehabilitationCenter[]; // 재활기관 추가
  center?: { lat: number; lng: number };
  zoom?: number;
  userLocation?: { lat: number; lng: number } | null; // 사용자 실제 위치 (마커 표시용)
  onLocationChange?: (lat: number, lng: number) => void;
  onHospitalClick?: (hospital: Hospital) => void;
  onRehabilitationCenterClick?: (center: RehabilitationCenter) => void; // 재활기관 클릭 핸들러
  enableLocationChange?: boolean; // 지도 이동 시 onLocationChange 호출 여부 (기본값: true)
}

const createNaverPoint = (x: number, y: number) => {
  if (typeof window === 'undefined') return undefined;
  const PointConstructor = (window as any)?.naver?.maps?.Point;
  return PointConstructor ? new PointConstructor(x, y) : undefined;
};

const HospitalMap: React.FC<HospitalMapProps> = ({
  hospitals = [],
  rehabilitationCenters = [], // 재활기관 추가
  center,
  zoom = 10,
  userLocation: userLocationProp,
  onLocationChange,
  onHospitalClick,
  onRehabilitationCenterClick, // 재활기관 클릭 핸들러
  enableLocationChange = true, // 기본값: true (기존 동작 유지)
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null); // 지도 인스턴스 저장
  const markersRef = useRef<any[]>([]); // 마커 배열 저장 (병원 + 재활기관)
  const userMarkerRef = useRef<any>(null); // 사용자 위치 마커 저장
  const currentInfoWindowRef = useRef<any>(null); // 현재 열려있는 InfoWindow 저장
  const enableLocationChangeRef = useRef<boolean>(enableLocationChange); // enableLocationChange를 ref로 저장
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // enableLocationChange prop 변경 시 ref 업데이트
  useEffect(() => {
    enableLocationChangeRef.current = enableLocationChange;
  }, [enableLocationChange]);

  // 사용자 위치 가져오기 (prop이 없을 때만)
  useEffect(() => {
    // prop으로 사용자 위치가 전달되면 그것을 사용
    if (userLocationProp) {
      setUserLocation(userLocationProp);
      setIsLoading(false);
      return;
    }

    // prop이 없으면 브라우저에서 위치 가져오기
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          // onLocationChange는 한 번만 호출 (초기 위치 설정 시)
          if (onLocationChange) {
            onLocationChange(location.lat, location.lng);
          }
          setIsLoading(false);
        },
        (error) => {
          console.warn('[HospitalMap] 위치 권한 거부 또는 오류:', error);
          // 기본 위치 (서울시청)
          const defaultLocation = { lat: 37.5666, lng: 126.9784 };
          setUserLocation(defaultLocation);
          // 기본 위치에서도 onLocationChange 호출하지 않음 (사용자가 지도를 이동할 때만)
          setIsLoading(false);
        }
      );
    } else {
      console.warn('[HospitalMap] Geolocation을 지원하지 않습니다.');
      const defaultLocation = { lat: 37.5666, lng: 126.9784 };
      setUserLocation(defaultLocation);
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocationProp]); // userLocationProp 변경 시 업데이트

  // 네이버 지도 초기화 (한 번만 수행)
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;

    // 지도가 이미 생성되어 있으면 초기화하지 않음
    if (mapInstanceRef.current) {
      console.log('[HospitalMap] 지도가 이미 생성되어 있습니다. 재초기화하지 않습니다.');
      return;
    }

    // SDK 로드 확인 (SDK 로드 대기)
    if (!window.naver || !window.naver.maps) {
      // SDK가 아직 로드 중이면 잠시 대기
      const checkSDK = setInterval(() => {
        if (window.naver && window.naver.maps) {
          clearInterval(checkSDK);
          // SDK가 로드되면 지도 초기화 재시도
          setIsLoading(true);
        }
      }, 100);
      
      // 5초 후에도 SDK가 로드되지 않으면 에러
      setTimeout(() => {
        clearInterval(checkSDK);
        if (!window.naver || !window.naver.maps) {
          console.error('[HospitalMap] 네이버 지도 SDK가 로드되지 않았습니다.');
          setError('지도를 불러올 수 없습니다. 페이지를 새로고침해주세요.');
          setIsLoading(false);
        }
      }, 5000);
      
      return;
    }

    try {
      // 지도 중심 설정 (사용자 위치 또는 props로 전달된 center)
      const mapCenter = center || userLocation;

      // 지도 생성 (한 번만)
      const map = new window.naver.maps.Map(mapRef.current, {
        center: new window.naver.maps.LatLng(mapCenter.lat, mapCenter.lng),
        zoom: zoom,
        mapTypeControl: true,
        zoomControl: true,
        zoomControlOptions: {
          position: window.naver.maps.Position.TOP_RIGHT,
        },
      });

      console.log('[HospitalMap] 지도 생성 성공');

      // 지도 인스턴스 저장
      mapInstanceRef.current = map;

      // 지도 클릭 시 InfoWindow 닫기
      window.naver.maps.Event.addListener(map, 'click', () => {
        if (currentInfoWindowRef.current && currentInfoWindowRef.current.getMap()) {
          currentInfoWindowRef.current.close();
          currentInfoWindowRef.current = null;
        }
      });

      // 지도 이동 이벤트 리스너 (지도 중심이 변경될 때만 병원 재검색)
      // enableLocationChange가 false이면 지도 이동 시 onLocationChange를 호출하지 않음 (지역 선택 모드)
      // ref를 사용하여 최신 값을 참조하도록 함
      window.naver.maps.Event.addListener(map, 'dragend', () => {
        if (enableLocationChangeRef.current && onLocationChange) {
          const center = map.getCenter();
          onLocationChange(center.lat(), center.lng());
        }
      });

      // 줌 변경 이벤트는 병원 재검색을 트리거하지 않음 (확대/축소만 가능하도록)
      // zoom_changed 이벤트 리스너 제거

      // 사용자 위치 마커 추가 (항상 표시)
      if (userLocation) {
        // 기존 마커가 있으면 제거
        if (userMarkerRef.current) {
          userMarkerRef.current.setMap(null);
        }
        
        const userMarker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(userLocation.lat, userLocation.lng),
          map: map,
          title: '내 위치',
          icon: {
            content: '<div style="width:20px;height:20px;background:#EF4444;border-radius:50%;border:3px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3);"></div>',
            anchor: createNaverPoint(10, 10),
          },
          zIndex: 1000, // 다른 마커보다 위에 표시
        });
        userMarkerRef.current = userMarker;
        console.log('[HospitalMap] 사용자 위치 마커 추가:', userLocation);
      }

      // 병원 및 재활기관 마커 추가 함수
      const addMarkers = (mapInstance: any, hospitalList: Hospital[], rehabCenterList: RehabilitationCenter[]) => {
        // 기존 마커 제거
        markersRef.current.forEach((marker) => {
          marker.setMap(null);
        });
        markersRef.current = [];

        // 병원 마커 추가
        hospitalList.forEach((hospital) => {
          // 좌표가 유효한 경우에만 마커 추가
          if (hospital.latitude !== 0 && hospital.longitude !== 0) {
            const marker = new window.naver.maps.Marker({
              position: new window.naver.maps.LatLng(
                hospital.latitude,
                hospital.longitude
              ),
              map: mapInstance,
              title: hospital.name,
              icon: {
                content: `<div style="width:24px;height:24px;background:${
                  hospital.type === 'hospital' ? '#2F6E4F' : '#61C48C'
                };border-radius:50%;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3);"></div>`,
                anchor: createNaverPoint(12, 12),
              },
            });

            // 정보창 생성 (닫기 버튼 포함)
            const infoWindowId = `infoWindow_${hospital.id}`;
            // 기관 유형 및 진료과목 정보 표시
            const institutionTypeBadge = hospital.institution_type 
              ? `<span style="display:inline-block;padding:2px 8px;background:#2F6E4F;color:white;border-radius:4px;font-size:10px;margin-right:4px;margin-bottom:4px;">${hospital.institution_type}</span>`
              : '';
            const departmentBadge = hospital.department_extracted && hospital.department_extracted !== '기타'
              ? `<span style="display:inline-block;padding:2px 8px;background:#9333EA;color:white;border-radius:4px;font-size:10px;margin-right:4px;margin-bottom:4px;">${hospital.department_extracted}</span>`
              : '';
            
            const infoWindow = new window.naver.maps.InfoWindow({
              content: `
                <div style="padding:12px;min-width:200px;max-width:300px;position:relative;">
                  <button onclick="window.closeInfoWindow('${infoWindowId}')" style="position:absolute;top:8px;right:8px;width:24px;height:24px;background:#f0f0f0;border:none;border-radius:50%;cursor:pointer;font-size:16px;line-height:1;display:flex;align-items:center;justify-content:center;color:#666;padding:0;" onmouseover="this.style.background='#e0e0e0'" onmouseout="this.style.background='#f0f0f0'">×</button>
                  <h4 style="margin:0 0 8px 0;font-size:16px;font-weight:bold;padding-right:24px;">${hospital.name}</h4>
                  ${institutionTypeBadge || departmentBadge ? `<div style="margin:0 0 8px 0;padding-right:24px;">${institutionTypeBadge}${departmentBadge}</div>` : ''}
                  <p style="margin:0 0 8px 0;font-size:12px;color:#666;">${hospital.address}</p>
                  ${hospital.phone ? `<p style="margin:0 0 8px 0;font-size:12px;">📞 ${hospital.phone}</p>` : ''}
                  <div style="display:flex;gap:8px;margin-top:8px;">
                    ${hospital.phone ? `<button onclick="window.open('tel:${hospital.phone}')" style="padding:6px 12px;background:#2F6E4F;color:white;border:none;border-radius:4px;cursor:pointer;font-size:12px;">전화</button>` : ''}
                    <button onclick="window.open('https://map.naver.com/search/${encodeURIComponent(hospital.address)}')" style="padding:6px 12px;background:#61C48C;color:white;border:none;border-radius:4px;cursor:pointer;font-size:12px;">길찾기</button>
                  </div>
                </div>
              `,
            });

            // 전역 함수로 InfoWindow 닫기 함수 등록 (각 InfoWindow마다 고유 ID 사용)
            (window as any).closeInfoWindow = (id: string) => {
              if (currentInfoWindowRef.current && currentInfoWindowRef.current.getMap()) {
                currentInfoWindowRef.current.close();
                currentInfoWindowRef.current = null;
              }
            };

            // 마커 클릭 이벤트
            window.naver.maps.Event.addListener(marker, 'click', () => {
              // 이전 InfoWindow 닫기
              if (currentInfoWindowRef.current && currentInfoWindowRef.current.getMap()) {
                currentInfoWindowRef.current.close();
              }

              // Bottom Sheet 열기 (onHospitalClick이 있는 경우)
              if (onHospitalClick) {
                onHospitalClick(hospital);
              }

              // 같은 마커를 다시 클릭한 경우 닫기만 하고, 아니면 열기
              if (currentInfoWindowRef.current === infoWindow && infoWindow.getMap()) {
                infoWindow.close();
                currentInfoWindowRef.current = null;
              } else {
                infoWindow.open(mapInstance, marker);
                currentInfoWindowRef.current = infoWindow;
              }
            });

            markersRef.current.push(marker);
          }
        });

        // 재활기관 마커 추가 (보라색 #9333EA)
        rehabCenterList.forEach((center) => {
          // 좌표가 유효한 경우에만 마커 추가
          if (center.latitude !== 0 && center.longitude !== 0) {
            const marker = new window.naver.maps.Marker({
              position: new window.naver.maps.LatLng(
                center.latitude,
                center.longitude
              ),
              map: mapInstance,
              title: center.name,
              icon: {
                content: `<div style="width:24px;height:24px;background:#9333EA;border-radius:50%;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3);"></div>`,
                anchor: createNaverPoint(12, 12),
              },
            });

            // 재활기관 정보창 생성 (기관구분명 표시)
            const infoWindowId = `infoWindow_rehab_${center.id}`;
            const infoWindow = new window.naver.maps.InfoWindow({
              content: `
                <div style="padding:12px;min-width:200px;max-width:300px;position:relative;">
                  <button onclick="window.closeInfoWindow('${infoWindowId}')" style="position:absolute;top:8px;right:8px;width:24px;height:24px;background:#f0f0f0;border:none;border-radius:50%;cursor:pointer;font-size:16px;line-height:1;display:flex;align-items:center;justify-content:center;color:#666;padding:0;" onmouseover="this.style.background='#e0e0e0'" onmouseout="this.style.background='#f0f0f0'">×</button>
                  <h4 style="margin:0 0 8px 0;font-size:16px;font-weight:bold;padding-right:24px;">${center.name}</h4>
                  <p style="margin:0 0 4px 0;font-size:11px;color:#9333EA;font-weight:500;">🏥 ${center.gigwan_fg_nm || '재활기관'}</p>
                  <p style="margin:0 0 8px 0;font-size:12px;color:#666;">${center.address}</p>
                  ${center.phone ? `<p style="margin:0 0 8px 0;font-size:12px;">📞 ${center.phone}</p>` : ''}
                  <div style="display:flex;gap:8px;margin-top:8px;">
                    ${center.phone ? `<button onclick="window.open('tel:${center.phone}')" style="padding:6px 12px;background:#9333EA;color:white;border:none;border-radius:4px;cursor:pointer;font-size:12px;">전화</button>` : ''}
                    <button onclick="window.open('https://map.naver.com/search/${encodeURIComponent(center.address)}')" style="padding:6px 12px;background:#61C48C;color:white;border:none;border-radius:4px;cursor:pointer;font-size:12px;">길찾기</button>
                  </div>
                </div>
              `,
            });

            // 전역 함수로 InfoWindow 닫기 함수 등록
            (window as any).closeInfoWindow = (id: string) => {
              if (currentInfoWindowRef.current && currentInfoWindowRef.current.getMap()) {
                currentInfoWindowRef.current.close();
                currentInfoWindowRef.current = null;
              }
            };

            // 재활기관 마커 클릭 이벤트
            window.naver.maps.Event.addListener(marker, 'click', () => {
              // 이전 InfoWindow 닫기
              if (currentInfoWindowRef.current && currentInfoWindowRef.current.getMap()) {
                currentInfoWindowRef.current.close();
              }

              // Bottom Sheet 열기 (onRehabilitationCenterClick이 있는 경우)
              if (onRehabilitationCenterClick) {
                onRehabilitationCenterClick(center);
              }

              // 같은 마커를 다시 클릭한 경우 닫기만 하고, 아니면 열기
              if (currentInfoWindowRef.current === infoWindow && infoWindow.getMap()) {
                infoWindow.close();
                currentInfoWindowRef.current = null;
              } else {
                infoWindow.open(mapInstance, marker);
                currentInfoWindowRef.current = infoWindow;
              }
            });

            markersRef.current.push(marker);
          }
        });

        console.log('[HospitalMap] 마커 추가 완료:', `병원 ${hospitalList.length}개, 재활기관 ${rehabCenterList.length}개`);
      };

      // 초기 마커 추가
      addMarkers(map, hospitals, rehabilitationCenters);
      setIsLoading(false);
    } catch (error) {
      console.error('[HospitalMap] 지도 초기화 실패:', error);
      setError('지도를 불러오는 중 오류가 발생했습니다.');
      setIsLoading(false);
    }
  }, [mapRef, userLocation]); // center, zoom 제거 - 지도는 한 번만 초기화

  // center prop 변경 시 지도 중심만 업데이트 (지도 리셋하지 않음)
  useEffect(() => {
    if (!mapInstanceRef.current || !center) return;

    const map = mapInstanceRef.current;
    const currentCenter = map.getCenter();
    
    // 중심이 크게 변경된 경우에만 업데이트 (0.01도 = 약 1km)
    if (Math.abs(currentCenter.lat() - center.lat) > 0.01 || 
        Math.abs(currentCenter.lng() - center.lng) > 0.01) {
      console.log('[HospitalMap] 지도 중심 업데이트:', center);
      map.setCenter(new window.naver.maps.LatLng(center.lat, center.lng));
    }
  }, [center]);

  // zoom prop 변경 시 지도 zoom만 업데이트 (지도 리셋하지 않음)
  useEffect(() => {
    if (!mapInstanceRef.current || !window.naver || !window.naver.maps) return;

    const map = mapInstanceRef.current;
    const currentZoom = map.getZoom();
    
    // zoom이 변경된 경우에만 업데이트
    if (currentZoom !== zoom) {
      console.log('[HospitalMap] 지도 zoom 업데이트:', currentZoom, '→', zoom);
      map.setZoom(zoom);
    }
  }, [zoom]);

  // hospitals 변경 시 마커만 업데이트 (지도는 리셋하지 않음)
  useEffect(() => {
    if (!mapInstanceRef.current || !window.naver || !window.naver.maps) {
      return;
    }

    // 기존 마커 제거
    markersRef.current.forEach((marker) => {
      marker.setMap(null);
    });
    markersRef.current = [];

    // 사용자 위치 마커 업데이트 (hospitals 변경 시에도 유지)
    if (userLocation && mapInstanceRef.current) {
      if (!userMarkerRef.current) {
        const userMarker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(userLocation.lat, userLocation.lng),
          map: mapInstanceRef.current,
          title: '내 위치',
          icon: {
            content: '<div style="width:20px;height:20px;background:#EF4444;border-radius:50%;border:3px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3);"></div>',
            anchor: createNaverPoint(10, 10),
          },
          zIndex: 1000,
        });
        userMarkerRef.current = userMarker;
      }
    }

    // 병원 마커 추가
    hospitals.forEach((hospital) => {
      if (hospital.latitude !== 0 && hospital.longitude !== 0) {
        const marker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(
            hospital.latitude,
            hospital.longitude
          ),
          map: mapInstanceRef.current,
          title: hospital.name,
            icon: {
              content: `<div style="width:24px;height:24px;background:${
                hospital.type === 'hospital' ? '#2E7D32' : '#34C759'
              };border-radius:50%;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3);"></div>`,
              anchor: createNaverPoint(12, 12),
            },
        });

        // 정보창 생성 (닫기 버튼 포함)
        const infoWindowId = `infoWindow_${hospital.id}`;
        // 기관 유형 및 진료과목 정보 표시
        const institutionTypeBadge = hospital.institution_type 
          ? `<span style="display:inline-block;padding:2px 8px;background:#2F6E4F;color:white;border-radius:4px;font-size:10px;margin-right:4px;margin-bottom:4px;">${hospital.institution_type}</span>`
          : '';
        const departmentBadge = hospital.department_extracted && hospital.department_extracted !== '기타'
          ? `<span style="display:inline-block;padding:2px 8px;background:#9333EA;color:white;border-radius:4px;font-size:10px;margin-right:4px;margin-bottom:4px;">${hospital.department_extracted}</span>`
          : '';
        
        const infoWindow = new window.naver.maps.InfoWindow({
          content: `
            <div style="padding:12px;min-width:200px;max-width:300px;position:relative;">
              <button onclick="window.closeInfoWindow('${infoWindowId}')" style="position:absolute;top:8px;right:8px;width:24px;height:24px;background:#f0f0f0;border:none;border-radius:50%;cursor:pointer;font-size:16px;line-height:1;display:flex;align-items:center;justify-content:center;color:#666;padding:0;" onmouseover="this.style.background='#e0e0e0'" onmouseout="this.style.background='#f0f0f0'">×</button>
              <h4 style="margin:0 0 8px 0;font-size:16px;font-weight:bold;padding-right:24px;">${hospital.name}</h4>
              ${institutionTypeBadge || departmentBadge ? `<div style="margin:0 0 8px 0;padding-right:24px;">${institutionTypeBadge}${departmentBadge}</div>` : ''}
              <p style="margin:0 0 8px 0;font-size:12px;color:#666;">${hospital.address}</p>
              ${hospital.phone ? `<p style="margin:0 0 8px 0;font-size:12px;">📞 ${hospital.phone}</p>` : ''}
              <div style="display:flex;gap:8px;margin-top:8px;">
                ${hospital.phone ? `<button onclick="window.open('tel:${hospital.phone}')" style="padding:6px 12px;background:#2F6E4F;color:white;border:none;border-radius:4px;cursor:pointer;font-size:12px;">전화</button>` : ''}
                <button onclick="window.open('https://map.naver.com/search/${encodeURIComponent(hospital.address)}')" style="padding:6px 12px;background:#61C48C;color:white;border:none;border-radius:4px;cursor:pointer;font-size:12px;">길찾기</button>
              </div>
            </div>
          `,
        });

        // 전역 함수로 InfoWindow 닫기 함수 등록
        (window as any).closeInfoWindow = (id: string) => {
          if (currentInfoWindowRef.current && currentInfoWindowRef.current.getMap()) {
            currentInfoWindowRef.current.close();
            currentInfoWindowRef.current = null;
          }
        };

        window.naver.maps.Event.addListener(marker, 'click', () => {
          // 이전 InfoWindow 닫기
          if (currentInfoWindowRef.current && currentInfoWindowRef.current.getMap()) {
            currentInfoWindowRef.current.close();
          }

          // Bottom Sheet 열기
          if (onHospitalClick) {
            onHospitalClick(hospital);
          }

          // 같은 마커를 다시 클릭한 경우 닫기만 하고, 아니면 열기
          if (currentInfoWindowRef.current === infoWindow && infoWindow.getMap()) {
            infoWindow.close();
            currentInfoWindowRef.current = null;
          } else {
            infoWindow.open(mapInstanceRef.current, marker);
            currentInfoWindowRef.current = infoWindow;
          }
        });

        markersRef.current.push(marker);
      }
    });

    // 재활기관 마커 추가 (보라색 #9333EA)
    rehabilitationCenters.forEach((center) => {
      if (center.latitude !== 0 && center.longitude !== 0) {
            const marker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(
            center.latitude,
            center.longitude
          ),
          map: mapInstanceRef.current,
          title: center.name,
              icon: {
                content: `<div style="width:24px;height:24px;background:#9333EA;border-radius:50%;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3);"></div>`,
                anchor: createNaverPoint(12, 12),
              },
        });

        // 재활기관 정보창 생성 (기관구분명 표시)
        const infoWindowId = `infoWindow_rehab_${center.id}`;
        const infoWindow = new window.naver.maps.InfoWindow({
          content: `
            <div style="padding:12px;min-width:200px;max-width:300px;position:relative;">
              <button onclick="window.closeInfoWindow('${infoWindowId}')" style="position:absolute;top:8px;right:8px;width:24px;height:24px;background:#f0f0f0;border:none;border-radius:50%;cursor:pointer;font-size:16px;line-height:1;display:flex;align-items:center;justify-content:center;color:#666;padding:0;" onmouseover="this.style.background='#e0e0e0'" onmouseout="this.style.background='#f0f0f0'">×</button>
              <h4 style="margin:0 0 8px 0;font-size:16px;font-weight:bold;padding-right:24px;">${center.name}</h4>
              <p style="margin:0 0 4px 0;font-size:11px;color:#9333EA;font-weight:500;">🏥 ${center.gigwan_fg_nm || '재활기관'}</p>
              <p style="margin:0 0 8px 0;font-size:12px;color:#666;">${center.address}</p>
              ${center.phone ? `<p style="margin:0 0 8px 0;font-size:12px;">📞 ${center.phone}</p>` : ''}
              <div style="display:flex;gap:8px;margin-top:8px;">
                ${center.phone ? `<button onclick="window.open('tel:${center.phone}')" style="padding:6px 12px;background:#9333EA;color:white;border:none;border-radius:4px;cursor:pointer;font-size:12px;">전화</button>` : ''}
                <button onclick="window.open('https://map.naver.com/search/${encodeURIComponent(center.address)}')" style="padding:6px 12px;background:#61C48C;color:white;border:none;border-radius:4px;cursor:pointer;font-size:12px;">길찾기</button>
              </div>
            </div>
          `,
        });

        // 전역 함수로 InfoWindow 닫기 함수 등록
        (window as any).closeInfoWindow = (id: string) => {
          if (currentInfoWindowRef.current && currentInfoWindowRef.current.getMap()) {
            currentInfoWindowRef.current.close();
            currentInfoWindowRef.current = null;
          }
        };

        // 재활기관 마커 클릭 이벤트
        window.naver.maps.Event.addListener(marker, 'click', () => {
          // 이전 InfoWindow 닫기
          if (currentInfoWindowRef.current && currentInfoWindowRef.current.getMap()) {
            currentInfoWindowRef.current.close();
          }

          // Bottom Sheet 열기 (onRehabilitationCenterClick이 있는 경우)
          if (onRehabilitationCenterClick) {
            onRehabilitationCenterClick(center);
          }

          // 같은 마커를 다시 클릭한 경우 닫기만 하고, 아니면 열기
          if (currentInfoWindowRef.current === infoWindow && infoWindow.getMap()) {
            infoWindow.close();
            currentInfoWindowRef.current = null;
          } else {
            infoWindow.open(mapInstanceRef.current, marker);
            currentInfoWindowRef.current = infoWindow;
          }
        });

        markersRef.current.push(marker);
      }
    });

    console.log('[HospitalMap] 마커 업데이트 완료:', `병원 ${hospitals.length}개, 재활기관 ${rehabilitationCenters.length}개`);
  }, [hospitals, rehabilitationCenters, onHospitalClick, onRehabilitationCenterClick]);

  // 네이버 지도 SDK 로드 (신규 NCP Maps API v3)
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;
    if (!clientId) {
      setError('네이버 지도 API 키가 설정되지 않았습니다.');
      setIsLoading(false);
      return;
    }

    // SDK가 이미 로드되어 있는지 확인
    if (window.naver && window.naver.maps) {
      return;
    }

    // 신규 NCP Maps API v3 SDK 스크립트 로드
    // ncpClientId → ncpKeyId로 변경됨
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`;
    script.async = true;
    script.onload = () => {
      console.log('[HospitalMap] 신규 NCP Maps API v3 SDK 로드 완료');
    };
    script.onerror = () => {
      console.error('[HospitalMap] SDK 로드 실패');
      setError('지도 SDK를 불러올 수 없습니다. 신규 클라이언트 ID를 확인해주세요.');
      setIsLoading(false);
    };

    document.head.appendChild(script);

    return () => {
      // 컴포넌트 언마운트 시 스크립트 제거 (선택사항)
    };
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] bg-gray-100 rounded-lg">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F6E4F] mx-auto mb-4"></div>
          <p className="text-gray-600">지도를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      className="w-full h-full min-h-[400px] rounded-lg border border-gray-200"
      style={{ height: '500px' }}
    />
  );
};

export default HospitalMap;

