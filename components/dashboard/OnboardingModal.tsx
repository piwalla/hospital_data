"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { UserRole, InjuryPart, Region, AdminUser } from "@/lib/mock-admin-data";
import { MapPin, UserCircle, Edit2, ExternalLink } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (data: { role: UserRole; injuryPart: InjuryPart; region: Region; currentStep: number; agreedToTerms?: boolean; agreedToSensitive?: boolean }) => void;
  initialData?: Partial<AdminUser>;
  onClose?: () => void;
}

// --- Constants (Extracted for Label Lookup) ---
const STEPS_INFO = [
  { id: 1, title: "누구를 위해 이용하시나요?" },
  { id: 2, title: "현재 산재 진행 상황은 어떠신가요?" },
  { id: 3, title: "치료받고 계신 부위는 어디인가요?" },
  { id: 4, title: "어느 지역에서 요양 중이신가요?" },
];

const ROLES = [
  { value: 'patient', label: '산재 환자 본인' },
  { value: 'family', label: '보호자 (가족)' }
];

const STATUS_STEPS = [
  { step: 1, label: '산재 신청 준비 단계', desc: '아직 산재 승인을 받지 못했어요' },
  { step: 2, label: '산재 치료 받는 중', desc: '승인받고 치료 중이며, 휴업급여를 받고 있어요' },
  { step: 3, label: '산재 치료 종결 단계', desc: '치료가 끝났거나, 장해 등급 심사를 준비해야 해요' },
  { step: 4, label: '종결 후 직업 복귀 단계', desc: '회사 복귀를 준비하거나 직업 훈련이 필요해요' },
];

const INJURY_PARTS = [
  { id: 'hand_arm', label: '팔 / 손 (상지)', icon: '💪' },
  { id: 'foot_leg', label: '다리 / 발 (하지)', icon: '🦶' },
  { id: 'spine', label: '척추 / 허리', icon: '🦴' },
  { id: 'brain_neuro', label: '뇌심혈관 / 신경', icon: '🧠' },
  { id: 'other', label: '기타 / 잘 모르겠음', icon: '❓' },
];

const REGIONS = [
  { value: 'seoul', label: '서울' },
  { value: 'gyeonggi', label: '경기' },
  { value: 'incheon', label: '인천' },
  { value: 'busan', label: '부산' },
  { value: 'daegu', label: '대구' },
  { value: 'gwangju', label: '광주' },
  { value: 'daejeon', label: '대전' },
  { value: 'ulsan', label: '울산' },
  { value: 'sejong', label: '세종' },
  { value: 'gangwon', label: '강원' },
  { value: 'chungbuk', label: '충북' },
  { value: 'chungnam', label: '충남' },
  { value: 'jeonbuk', label: '전북' },
  { value: 'jeonnam', label: '전남' },
  { value: 'yeongbuk', label: '경북' },
  { value: 'yeongnam', label: '경남' },
  { value: 'jeju', label: '제주' },
];

export default function OnboardingModal({ isOpen, onComplete, initialData, onClose }: OnboardingModalProps) {
  // If initialData exists, we verify if all required fields are present to decide "Summary Mode" availability
  const hasFullData = initialData?.userRole && initialData?.currentStep && initialData?.injuryPart && initialData?.region;
  
  const [isSummaryMode, setIsSummaryMode] = useState<boolean>(!!hasFullData);
  const [step, setStep] = useState(1);
  
  // State initialization
  const [role, setRole] = useState<UserRole | undefined>(initialData?.userRole);
  const [statusStep, setStatusStep] = useState<number | undefined>(initialData?.currentStep);
  const [injuryPart, setInjuryPart] = useState<InjuryPart | undefined>(initialData?.injuryPart);
  const [region, setRegion] = useState<Region | undefined>(initialData?.region);

  // Agreement states
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [agreedToSensitive, setAgreedToSensitive] = useState<boolean>(false);

  // Sync state when Modal opens or data changes
  useEffect(() => {
    if (isOpen && initialData) {
       setRole(initialData.userRole);
       setStatusStep(initialData.currentStep);
       setInjuryPart(initialData.injuryPart);
       setRegion(initialData.region);
       
       const fullData = !!(initialData.userRole && initialData.currentStep && initialData.injuryPart && initialData.region);
       setIsSummaryMode(fullData);
       setStep(1); 
    }
  }, [isOpen, initialData]);

  const handleNext = () => {
    if (step < 4) {
      setStep(prev => prev + 1);
    } else {
      if (role && statusStep !== undefined && injuryPart && region) {
        onComplete({ 
          role, 
          injuryPart, 
          region, 
          currentStep: statusStep,
          agreedToTerms,
          agreedToSensitive
        });
        // Reset mode for next open if handled externally, but safer to keep state logic clean
      }
    }
  };

  const handleModifyStart = () => {
    setIsSummaryMode(false);
    setStep(1);
  };

  const isStepValid = () => {
    if (step === 1) return !!role && agreedToTerms && agreedToSensitive;
    if (step === 2) return statusStep !== undefined;
    if (step === 3) return !!injuryPart;
    if (step === 4) return !!region;
    return false;
  };

  // Helper to get labels
  const getRoleLabel = (r?: UserRole) => ROLES.find(x => x.value === r)?.label || r;
  const getStatusLabel = (s?: number) => STATUS_STEPS.find(x => x.step === s)?.label || s;
  const getInjuryLabel = (i?: string) => INJURY_PARTS.find(x => x.id === i)?.label || i;
  
  const getRegionLabel = (r?: any) => {
    if (!r) return undefined;

    // 1. Handle Object (RegionSelection from complex selector)
    if (typeof r === 'object' && r !== null) {
      if ('provinceName' in r) {
         const parts = [r.provinceName, r.districtName, r.subDistrictName].filter(Boolean);
         return parts.join(' ');
      }
    }

    // 2. Handle String
    if (typeof r === 'string') {
        // Try parsing JSON string
        if (r.trim().startsWith('{')) {
          try {
             const parsed = JSON.parse(r);
             if (parsed.provinceName) {
                const parts = [parsed.provinceName, parsed.districtName, parsed.subDistrictName].filter(Boolean);
                return parts.join(' ');
             }
          } catch {
             // Ignore parse error
          }
        }
        
        // Lookup simple code (e.g. 'seoul')
        const found = REGIONS.find(x => x.value === r);
        return found ? found.label : r;
    }

    return r;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
       if (!open && onClose) onClose();
    }}>
      <DialogContent className="sm:max-w-[425px]" showCloseButton={false}>
        {/* Custom Close Button to avoid overlaps */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-[60]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
          </svg>
          <span className="sr-only">Close</span>
        </button>
        {/* === SUMMARY VIEW === */}
        {isSummaryMode ? (
           <>
             <DialogHeader>
               <DialogTitle className="text-xl font-bold text-center">내 정보 확인</DialogTitle>
               <DialogDescription className="text-center">
                 현재 설정된 맞춤 정보입니다.<br/>변경사항이 있으신가요?
               </DialogDescription>
             </DialogHeader>
             <div className="py-6 space-y-4">
               <div className="bg-slate-50 p-4 rounded-lg space-y-3 border border-slate-100">
                 <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="text-sm text-slate-500">이용 유형</span>
                    <span className="font-semibold text-slate-800">{getRoleLabel(role)}</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="text-sm text-slate-500">진행 단계</span>
                    <span className="font-semibold text-slate-800">{getStatusLabel(statusStep)}</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="text-sm text-slate-500">치료 부위</span>
                    <span className="font-semibold text-slate-800">{getInjuryLabel(injuryPart)}</span>
                 </div>
                 <div className="flex justify-between items-center pt-1">
                    <span className="text-sm text-slate-500">거주 지역</span>
                    <span className="font-semibold text-slate-800">{getRegionLabel(region)}</span>
                 </div>
               </div>
             </div>
             <div className="flex flex-col gap-2 mt-4">
               <Button onClick={handleModifyStart} className="w-full bg-[#14532d] hover:bg-[#14532d]/90 gap-2 py-6 text-lg">
                 <Edit2 className="w-4 h-4" /> 정보 수정하기
               </Button>
               <Button variant="ghost" onClick={onClose} className="w-full text-slate-500 hover:bg-slate-100 py-4">
                 그대로 유지하기
               </Button>
             </div>
           </>
        ) : (
        /* === WIZARD VIEW === */
           <>
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2 pr-8">
                {[1, 2, 3, 4].map((s) => (
                  <div 
                    key={s} 
                    className={`h-2 rounded-full flex-1 transition-colors ${s <= step ? 'bg-primary' : 'bg-slate-200'}`} 
                  />
                ))}
              </div>
              <DialogTitle className="text-xl font-bold text-center">
                {STEPS_INFO[step-1].title}
              </DialogTitle>
              <DialogDescription className="text-center">
                정보를 수정하면 대시보드가<br/>즉시 업데이트됩니다.
              </DialogDescription>
            </DialogHeader>
    
            <div className="py-6">
              {/* Step 1: User Role */}
              {step === 1 && (
                <RadioGroup onValueChange={(v) => setRole(v as UserRole)} value={role} className="grid grid-cols-2 gap-4">
                  <div>
                    <RadioGroupItem value="patient" id="patient" className="peer sr-only" />
                    <Label
                      htmlFor="patient"
                      className="flex flex-col items-center justify-between rounded-xl border-2 border-slate-200 bg-transparent p-4 hover:bg-slate-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer text-center h-[120px]"
                    >
                      <UserCircle className="mb-2 h-8 w-8 text-slate-500 peer-data-[state=checked]:text-primary" />
                      <span className="text-sm font-bold">제가<br/>산재 환자예요</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="family" id="family" className="peer sr-only" />
                    <Label
                      htmlFor="family"
                      className="flex flex-col items-center justify-between rounded-xl border-2 border-slate-200 bg-transparent p-4 hover:bg-slate-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer text-center h-[120px]"
                    >
                      <UserCircle className="mb-2 h-8 w-8 text-slate-500 peer-data-[state=checked]:text-primary" />
                      <span className="text-sm font-bold">저는<br/>보호자(가족)예요</span>
                    </Label>
                  </div>
                </RadioGroup>
              )}

              {/* Legal Agreement (Step 1 Integration) */}
              {step === 1 && (
                <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
                  <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <Checkbox 
                      id="terms-agree" 
                      checked={agreedToTerms} 
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label htmlFor="terms-agree" className="text-sm font-medium leading-none cursor-pointer">
                        이용약관 및 개인정보 수집 이용 동의 (필수)
                      </label>
                      <Link href="/terms" target="_blank" className="text-xs text-blue-600 hover:underline flex items-center gap-0.5">
                        약관 보기 <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 bg-rose-50/50 p-3 rounded-lg border border-rose-100">
                    <Checkbox 
                      id="sensitive-agree" 
                      checked={agreedToSensitive} 
                      onChange={(e) => setAgreedToSensitive(e.target.checked)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label htmlFor="sensitive-agree" className="text-sm font-medium leading-none cursor-pointer text-rose-900">
                        [민감정보] 건강 관련 정보 수집 및 이용 동의 (필수)
                      </label>
                      <Link href="/privacy" target="_blank" className="text-xs text-rose-600 hover:underline flex items-center gap-0.5">
                        내용 보기 <ExternalLink className="w-3 h-3" />
                      </Link>
                      <p className="text-[10px] text-rose-400 mt-1">부상 부위 및 진행 단계 정보를 통한 서비스 제공을 위함</p>
                    </div>
                  </div>
                </div>
              )}
    
              {/* Step 2: Status */}
              {step === 2 && (
                <div className="space-y-3">
                  {STATUS_STEPS.map((item) => (
                    <button
                      key={item.step}
                      onClick={() => setStatusStep(item.step)}
                      className={`w-full flex flex-col items-start p-4 rounded-lg border-2 transition-all text-left ${
                        statusStep === item.step
                          ? 'border-primary bg-primary/5 ring-1 ring-primary'
                          : 'border-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <span className="font-bold text-slate-800 text-lg mb-1">{item.label}</span>
                      <span className="text-sm text-slate-500">{item.desc}</span>
                    </button>
                  ))}
                </div>
              )}
    
              {/* Step 3: Injury Part */}
              {step === 3 && (
                <div className="space-y-3">
                   {INJURY_PARTS.map((item) => (
                     <button
                        key={item.id}
                        onClick={() => setInjuryPart(item.id as InjuryPart)}
                        className={`w-full flex items-center p-3 rounded-lg border-2 transition-all text-left ${
                          injuryPart === item.id 
                            ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                            : 'border-slate-100 hover:border-slate-300'
                        }`}
                     >
                       <span className="text-xl mr-3">{item.icon}</span>
                       <span className="font-semibold text-slate-700">{item.label}</span>
                     </button>
                   ))}
                </div>
              )}
    
              {/* Step 4: Region */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                      <MapPin className="w-8 h-8 text-blue-500" />
                    </div>
                  </div>
                  <Select onValueChange={(v) => setRegion(v as Region)} value={region}>
                    <SelectTrigger className="w-full h-12 text-lg">
                      <SelectValue placeholder="지역을 선택해주세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {REGIONS.map((r) => (
                        <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
    
            <DialogFooter className="flex gap-2">
               {/* Back Button logic could go here if requested, currently just Next/Close */}
               {isSummaryMode ? null : (
                  <Button variant="ghost" onClick={initialData ? () => setIsSummaryMode(true) : onClose}>
                     취소
                  </Button>
               )}
              <Button 
                onClick={handleNext} 
                disabled={!isStepValid()}
                className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
              >
                {step === 4 ? "수정 완료" : "다음으로"}
              </Button>
            </DialogFooter>
           </>
        )}
      </DialogContent>
    </Dialog>
  );
}
