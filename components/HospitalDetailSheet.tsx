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
import type { RehabilitationCenter } from "@/lib/api/rehabilitation-centers";

export interface Hospital {
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

interface HospitalDetailSheetProps {
  hospital: Hospital | null;
  rehabilitationCenter?: RehabilitationCenter | null; // 재활기관 추가
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HospitalDetailSheet: React.FC<HospitalDetailSheetProps> = ({
  hospital,
  rehabilitationCenter,
  open,
  onOpenChange,
}) => {
  // 병원 또는 재활기관 중 하나는 반드시 있어야 함
  if (!hospital && !rehabilitationCenter) return null;

  // 재활기관인지 병원인지 확인
  const isRehabilitationCenter = !!rehabilitationCenter;
  const displayData = isRehabilitationCenter ? rehabilitationCenter : hospital;

  if (!displayData) return null;

  // 전화 걸기 핸들러
  const handleCall = () => {
    if (displayData.phone) {
      window.location.href = `tel:${displayData.phone}`;
    }
  };

  // 길찾기 핸들러 (네이버 지도 앱 또는 웹)
  const handleDirections = () => {
    // 주소 기반 검색 링크 사용 (모바일에서 더 안정적)
    const address = displayData.address;
    
    // 모바일에서는 모바일 웹 링크 사용, 데스크톱에서는 웹 링크
    if (typeof window !== 'undefined' && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      // 모바일: 주소 기반 검색 링크 사용
      window.open(`https://m.map.naver.com/search/${encodeURIComponent(address)}`, '_blank');
    } else {
      // 데스크톱: 주소 기반 검색 링크 사용
      window.open(`https://map.naver.com/search/${encodeURIComponent(address)}`, '_blank');
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="sm:max-w-lg mx-auto rounded-t-2xl max-h-[80vh] overflow-y-auto">
        <SheetHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <SheetTitle className="text-2xl font-bold text-foreground mb-2">
                {displayData.name}
              </SheetTitle>
              <div className="flex flex-wrap gap-2 mt-2">
                {isRehabilitationCenter ? (
                  // 재활기관인 경우 기관구분명 표시
                  rehabilitationCenter?.gigwan_fg_nm && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--color-rehabilitation)]/10 text-[var(--color-rehabilitation)]">
                      {rehabilitationCenter.gigwan_fg_nm}
                    </span>
                  )
                ) : (
                  // 병원/약국인 경우 기관 유형 및 타입 표시
                  <>
                    {hospital?.institution_type && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {hospital.institution_type}
                      </span>
                    )}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      hospital?.type === 'hospital' 
                        ? 'bg-[#2F6E4F]/10 text-[#2F6E4F]' 
                        : 'bg-[#61C48C]/10 text-[#61C48C]'
                    }`}>
                      {hospital?.type === 'hospital' ? '병원' : '약국'}
                    </span>
                  </>
                )}
              </div>
              {!isRehabilitationCenter && (hospital?.department_extracted || hospital?.department) && (
                <SheetDescription className="text-base text-muted-foreground mt-2">
                  진료과목: {hospital.department_extracted || hospital.department}
                </SheetDescription>
              )}
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* 주소 정보 */}
          <div className="flex items-start gap-3 border-b border-[#E8F5E9] pb-4">
            <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" strokeWidth={1.75} />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">주소</p>
              <p className="text-sm text-muted-foreground mt-1">
                {displayData.address}
              </p>
            </div>
          </div>

          {/* 전화번호 정보 */}
          {displayData.phone && (
            <div className="flex items-start gap-3 border-b border-[#E8F5E9] pb-4">
              <Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" strokeWidth={1.75} />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">전화번호</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {displayData.phone}
                </p>
              </div>
            </div>
          )}

          {/* 좌표 정보 (개발용, 나중에 제거 가능) */}
          {displayData.latitude !== 0 && displayData.longitude !== 0 && (
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" strokeWidth={1.75} />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">위치</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {displayData.latitude.toFixed(6)}, {displayData.longitude.toFixed(6)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 액션 버튼 */}
        <div className="mt-8 grid grid-cols-2 gap-3">
          {/* Primary CTA: 전화 걸기 */}
          {displayData.phone && (
            <Button
              onClick={handleCall}
              className="w-full h-12 text-base font-semibold"
              size="lg"
            >
              <Phone className="w-5 h-5 mr-2" strokeWidth={1.75} />
              전화 걸기
            </Button>
          )}

          {/* Secondary CTA: 길찾기 */}
          <Button
            onClick={handleDirections}
            variant="outline"
            className="w-full h-12 text-base font-semibold"
            size="lg"
          >
            <MapPin className="w-5 h-5 mr-2" strokeWidth={1.75} />
            길찾기
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default HospitalDetailSheet;

