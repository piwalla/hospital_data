"use client";

/**
 * @file HospitalDetailSheet.tsx
 * @description 병원 상세 정보를 표시하는 Bottom Sheet 컴포넌트
 *
 * 주요 기능:
 * 1. 병원 상세 정보 표시 (이름, 주소, 전화번호, 진료과목)
 * 2. 전화 걸기 버튼 (Primary CTA)
 * 3. 길찾기 버튼 (Secondary CTA)
 * 4. 모바일: 드래그로 열기/닫기
 * 5. 데스크톱: 클릭으로 열기/닫기
 *
 * @dependencies
 * - components/ui/sheet.tsx (shadcn/ui)
 * - lucide-react (아이콘)
 */

import { X, Phone, MapPin, Building2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export interface Hospital {
  id: string;
  name: string;
  type: 'hospital' | 'pharmacy';
  address: string;
  latitude: number;
  longitude: number;
  phone: string | null;
  department: string | null;
}

interface HospitalDetailSheetProps {
  hospital: Hospital | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HospitalDetailSheet: React.FC<HospitalDetailSheetProps> = ({
  hospital,
  open,
  onOpenChange,
}) => {
  if (!hospital) return null;

  // 전화 걸기 핸들러
  const handleCall = () => {
    if (hospital.phone) {
      window.location.href = `tel:${hospital.phone}`;
    }
  };

  // 길찾기 핸들러 (네이버 지도 앱 또는 웹)
  const handleDirections = () => {
    // 네이버 지도 웹 링크
    const naverMapUrl = `https://map.naver.com/search/${encodeURIComponent(hospital.address)}`;
    
    // 모바일에서는 앱 링크 시도, 데스크톱에서는 웹 링크
    if (typeof window !== 'undefined' && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      // 모바일: 네이버 지도 앱 링크 시도
      const naverMapAppUrl = `nmap://search?query=${encodeURIComponent(hospital.address)}`;
      window.location.href = naverMapAppUrl;
      
      // 앱이 없으면 웹으로 폴백
      setTimeout(() => {
        window.open(naverMapUrl, '_blank');
      }, 500);
    } else {
      // 데스크톱: 웹 링크
      window.open(naverMapUrl, '_blank');
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="sm:max-w-lg mx-auto rounded-t-2xl max-h-[80vh] overflow-y-auto">
        <SheetHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <SheetTitle className="text-2xl font-bold text-foreground mb-2">
                {hospital.name}
              </SheetTitle>
              {hospital.department && (
                <SheetDescription className="text-base text-muted-foreground">
                  {hospital.department}
                </SheetDescription>
              )}
              <div className="mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  hospital.type === 'hospital' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {hospital.type === 'hospital' ? '병원' : '약국'}
                </span>
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* 주소 정보 */}
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">주소</p>
              <p className="text-sm text-muted-foreground mt-1">
                {hospital.address}
              </p>
            </div>
          </div>

          {/* 전화번호 정보 */}
          {hospital.phone && (
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">전화번호</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {hospital.phone}
                </p>
              </div>
            </div>
          )}

          {/* 좌표 정보 (개발용, 나중에 제거 가능) */}
          {hospital.latitude !== 0 && hospital.longitude !== 0 && (
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">위치</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {hospital.latitude.toFixed(6)}, {hospital.longitude.toFixed(6)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 액션 버튼 */}
        <div className="mt-8 space-y-3">
          {/* Primary CTA: 전화 걸기 */}
          {hospital.phone && (
            <Button
              onClick={handleCall}
              className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90"
              size="lg"
            >
              <Phone className="w-5 h-5 mr-2" />
              전화 걸기
            </Button>
          )}

          {/* Secondary CTA: 길찾기 */}
          <Button
            onClick={handleDirections}
            variant="outline"
            className="w-full h-12 text-base font-semibold border-2"
            size="lg"
          >
            <MapPin className="w-5 h-5 mr-2" />
            길찾기
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default HospitalDetailSheet;

