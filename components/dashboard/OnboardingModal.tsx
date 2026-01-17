"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { UserRole, InjuryPart, Region, AdminUser } from "@/lib/mock-admin-data";
import { MapPin, UserCircle, Edit2, ExternalLink, Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { onboardingTranslations, type Locale, defaultLocale } from "@/lib/i18n/config";

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (data: { role: UserRole; injuryPart: InjuryPart; region: Region; currentStep: number; agreedToTerms?: boolean; agreedToSensitive?: boolean }) => void;
  initialData?: Partial<AdminUser>;
  onClose?: () => void;
  isForced?: boolean;
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

// --- Premium Illustrations ---
const PatientIllustration = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="60" cy="60" r="50" fill="url(#patient-grad)" fillOpacity="0.1" />
    <circle cx="60" cy="60" r="40" stroke="url(#patient-grad)" strokeWidth="2" strokeDasharray="4 4" />
    {/* Body */}
    <path d="M40 85C40 76.7157 46.7157 70 55 70H65C73.2843 70 80 76.7157 80 85V90H40V85Z" fill="url(#patient-grad)" />
    {/* Head */}
    <circle cx="60" cy="50" r="12" fill="url(#patient-grad)" />
    {/* Medical Plus */}
    <rect x="75" y="45" width="20" height="20" rx="4" fill="white" />
    <path d="M85 50V60M80 55H90" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
    <defs>
      <linearGradient id="patient-grad" x1="40" y1="40" x2="80" y2="90" gradientUnits="userSpaceOnUse">
        <stop stopColor="#10b981" />
        <stop offset="1" stopColor="#059669" />
      </linearGradient>
    </defs>
  </svg>
);

const FamilyIllustration = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="60" cy="60" r="50" fill="url(#family-grad)" fillOpacity="0.1" />
    <circle cx="60" cy="60" r="40" stroke="url(#family-grad)" strokeWidth="2" strokeDasharray="4 4" />
    {/* Person 1 (Larger) */}
    <path d="M35 85C35 77.268 41.268 71 49 71H56C63.732 71 70 77.268 70 85V90H35V85Z" fill="url(#family-grad)" fillOpacity="0.6" />
    <circle cx="52.5" cy="55" r="10" fill="url(#family-grad)" fillOpacity="0.6" />
    {/* Person 2 (Smaller/Child) */}
    <path d="M65 85C65 80.5817 68.5817 77 73 77H77C81.4183 77 85 80.5817 85 85V90H65V85Z" fill="url(#family-grad)" />
    <circle cx="75" cy="68" r="7" fill="url(#family-grad)" />
    {/* Heart */}
    <path d="M95 45C95 43.3431 93.6569 42 92 42C90.3431 42 89 43.3431 89 45C89 47.5 92 50 92 50C92 50 95 47.5 95 45Z" fill="#ef4444" />
    <defs>
      <linearGradient id="family-grad" x1="40" y1="40" x2="85" y2="90" gradientUnits="userSpaceOnUse">
        <stop stopColor="#14b8a6" />
        <stop offset="1" stopColor="#0d9488" />
      </linearGradient>
    </defs>
  </svg>
);

export default function OnboardingModal({ isOpen, onComplete, initialData, onClose, isForced = false }: OnboardingModalProps) {
  // If initialData exists, we verify if all required fields are present to decide "Summary Mode" availability
  const hasFullData = initialData?.userRole && initialData?.currentStep && initialData?.injuryPart && initialData?.region;
  
  const [isSummaryMode, setIsSummaryMode] = useState<boolean>(!!hasFullData);
  const [step, setStep] = useState(1);
  
  // Translation State
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const t = onboardingTranslations[locale] || onboardingTranslations[defaultLocale];

  useEffect(() => {
    // Initial load
    const savedLocale = (localStorage.getItem('user_locale') as Locale) || defaultLocale;
    setLocale(savedLocale);

    // Listen for changes
    const handleStorage = () => {
      const newLocale = (localStorage.getItem('user_locale') as Locale) || defaultLocale;
      setLocale(newLocale);
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('localeChange', handleStorage); // Custom event

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('localeChange', handleStorage);
    };
  }, []);

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
  
  // State initialization
  const [role, setRole] = useState<UserRole | undefined>(initialData?.userRole);
  const [statusStep, setStatusStep] = useState<number | undefined>(initialData?.currentStep);
  const [injuryPart, setInjuryPart] = useState<InjuryPart | undefined>(initialData?.injuryPart);
  const [region, setRegion] = useState<Region | undefined>(initialData?.region);

  // Agreement states
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [agreedToSensitive, setAgreedToSensitive] = useState<boolean>(false);

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

  // Helper to get labels (Now using 't')
  const getRoleLabel = (r?: UserRole) => {
    if (r === 'patient') return t.roles.patient.replace('\n', ' ');
    if (r === 'family') return t.roles.family.replace('\n', ' ');
    return r;
  };
  
  const getStatusLabel = (s?: number) => {
    if (s === 1) return t.status.step1.label;
    if (s === 2) return t.status.step2.label;
    if (s === 3) return t.status.step3.label;
    if (s === 4) return t.status.step4.label;
    return s;
  };

  const getInjuryLabel = (i?: string) => {
    if (i === 'hand_arm') return t.injury.hand_arm;
    if (i === 'foot_leg') return t.injury.foot_leg;
    if (i === 'spine') return t.injury.spine;
    if (i === 'brain_neuro') return t.injury.brain_neuro;
    if (i === 'other') return t.injury.other;
    return i;
  };
  
  const getRegionLabel = (r?: any) => {
    if (!r) return undefined;
    // ... (Region logic same as before, essentially returns Korean name which is fine as region names are data)
    // For now we keep region names in Korean as per strategy (Hybrid Localization)
    if (typeof r === 'object' && r !== null && 'provinceName' in r) {
         const parts = [r.provinceName, r.districtName, r.subDistrictName].filter(Boolean);
         return parts.join(' ');
    }
    if (typeof r === 'string') {
        if (r.trim().startsWith('{')) {
          try {
             const parsed = JSON.parse(r);
             if (parsed.provinceName) return [parsed.provinceName, parsed.districtName, parsed.subDistrictName].filter(Boolean).join(' ');
          } catch {}
        }
        const found = REGIONS.find(x => x.value === r);
        return found ? found.label : r;
    }
    return r;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
       if (!open && !isForced && onClose) onClose();
    }}>
      <DialogContent className="sm:max-w-[425px] w-[92%] max-h-[85vh] overflow-y-auto rounded-2xl" showCloseButton={!isForced}>
        {/* Custom Close Button */}
        {!isForced && (
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-[60]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
          </svg>
          <span className="sr-only">Close</span>
        </button>
        )}
        {/* === SUMMARY VIEW === */}
        {isSummaryMode ? (
           <>
             <DialogHeader>
               <DialogTitle className="text-xl font-bold text-center whitespace-pre-wrap">{t.summary.title}</DialogTitle>
               <DialogDescription className="text-center whitespace-pre-wrap">
                 {t.summary.desc}
               </DialogDescription>
             </DialogHeader>
             <div className="py-4 sm:py-6 space-y-4">
               <div className="bg-slate-50 p-4 rounded-lg space-y-3 border border-slate-100">
                 <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="text-sm text-slate-500">{t.summary.labels.role}</span>
                    <span className="font-semibold text-slate-800 text-right whitespace-pre-wrap leading-tight max-w-[60%]">{getRoleLabel(role)}</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="text-sm text-slate-500">{t.summary.labels.status}</span>
                    <span className="font-semibold text-slate-800 text-right whitespace-pre-wrap leading-tight max-w-[60%]">{getStatusLabel(statusStep)}</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="text-sm text-slate-500">{t.summary.labels.injury}</span>
                    <span className="font-semibold text-slate-800 text-right whitespace-pre-wrap leading-tight max-w-[60%]">{getInjuryLabel(injuryPart)}</span>
                 </div>
                 <div className="flex justify-between items-center pt-1">
                    <span className="text-sm text-slate-500">{t.summary.labels.region}</span>
                    <span className="font-semibold text-slate-800 text-right whitespace-pre-wrap leading-tight max-w-[60%]">{getRegionLabel(region)}</span>
                 </div>
               </div>
             </div>
             <div className="flex flex-col gap-2 mt-4">
               <Button onClick={handleModifyStart} className="w-full bg-[#14532d] hover:bg-[#14532d]/90 gap-2 py-6 text-lg">
                 <Edit2 className="w-4 h-4" /> {t.buttons.modify}
               </Button>
               <Button variant="ghost" onClick={onClose} className="w-full text-slate-500 hover:bg-slate-100 py-4">
                 {t.buttons.keep}
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
              <DialogTitle className="text-xl font-bold text-center whitespace-pre-wrap min-h-[3.5rem] flex items-center justify-center">
                {step === 1 ? t.steps.role : 
                 step === 2 ? t.steps.details :
                 step === 3 ? t.steps.injury :
                 t.steps.region}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {step === 1 ? t.steps.role : 
                 step === 2 ? t.steps.details :
                 step === 3 ? t.steps.injury :
                 t.steps.region}
              </DialogDescription>
             {/* Removed Description to save space on mobile, title is enough context */}
            </DialogHeader>
    
            <div className="py-2 sm:py-6">
              {/* Step 1: User Role */}
              {step === 1 && (
                <RadioGroup onValueChange={(v) => setRole(v as UserRole)} value={role || ""} className="grid grid-cols-2 gap-2 sm:gap-4">
                  <div>
                    <RadioGroupItem value="patient" id="patient" className="peer sr-only" />
                    <Label
                      htmlFor="patient"
                      onClick={() => setRole('patient')}
                      className="flex flex-col items-center justify-between rounded-2xl border-2 peer-data-[state=checked]:border-4 border-slate-100 bg-white p-2 sm:p-4 hover:bg-slate-50 peer-data-[state=checked]:border-emerald-600 peer-data-[state=checked]:bg-emerald-100/50 cursor-pointer text-center min-h-[140px] transition-all duration-300 shadow-sm hover:shadow-md h-full relative"
                    >
                      {role === 'patient' && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center text-white">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                      <PatientIllustration className="mb-1 sm:mb-2 h-12 w-12 sm:h-20 sm:w-20 transition-transform duration-300 peer-data-[state=checked]:scale-110 flex-shrink-0" />
                      <span className={`text-xs sm:text-sm font-bold whitespace-pre-wrap leading-tight ${role === 'patient' ? 'text-emerald-800' : 'text-slate-700'}`}>{t.roles.patient}</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="family" id="family" className="peer sr-only" />
                    <Label
                      htmlFor="family"
                      onClick={() => setRole('family')}
                      className="flex flex-col items-center justify-between rounded-2xl border-2 peer-data-[state=checked]:border-4 border-slate-100 bg-white p-2 sm:p-4 hover:bg-slate-50 peer-data-[state=checked]:border-teal-600 peer-data-[state=checked]:bg-teal-100/50 cursor-pointer text-center min-h-[140px] transition-all duration-300 shadow-sm hover:shadow-md h-full relative"
                    >
                      {role === 'family' && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center text-white">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                      <FamilyIllustration className="mb-1 sm:mb-2 h-12 w-12 sm:h-20 sm:w-20 transition-transform duration-300 peer-data-[state=checked]:scale-110 flex-shrink-0" />
                      <span className={`text-xs sm:text-sm font-bold whitespace-pre-wrap leading-tight ${role === 'family' ? 'text-teal-800' : 'text-slate-700'}`}>{t.roles.family}</span>
                    </Label>
                  </div>
                </RadioGroup>
              )}

              {/* Legal Agreement (Step 1 Integration) */}
              {step === 1 && (
                <div className="mt-4 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-100 space-y-2 sm:space-y-4">
                  <div className="flex items-start space-x-3 bg-slate-50 p-2 sm:p-3 rounded-lg border border-slate-100">
                    <Checkbox 
                      id="terms-agree" 
                      checked={agreedToTerms} 
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-0.5 flex-shrink-0"
                    />
                    <div className="grid gap-1.5 leading-tight">
                      <label htmlFor="terms-agree" className="text-xs sm:text-sm font-medium cursor-pointer text-balance">
                        {t.consent.terms}
                      </label>
                      <Link href="/terms" target="_blank" className="text-[10px] sm:text-xs text-blue-600 hover:underline flex items-center gap-0.5">
                        {t.consent.termsLink} <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 bg-rose-50/50 p-2 sm:p-3 rounded-lg border border-rose-100">
                    <Checkbox 
                      id="sensitive-agree" 
                      checked={agreedToSensitive} 
                      onChange={(e) => setAgreedToSensitive(e.target.checked)}
                      className="mt-0.5 flex-shrink-0"
                    />
                    <div className="grid gap-1.5 leading-tight">
                      <label htmlFor="sensitive-agree" className="text-xs sm:text-sm font-medium cursor-pointer text-rose-900 text-balance">
                        {t.consent.sensitive}
                      </label>
                      <Link href="/privacy" target="_blank" className="text-[10px] sm:text-xs text-rose-600 hover:underline flex items-center gap-0.5">
                        {t.consent.sensitiveLink} <ExternalLink className="w-3 h-3" />
                      </Link>
                      <p className="text-[10px] text-rose-400 mt-1 text-balance">
                        {t.consent.sensitiveDesc}
                      </p>
                    </div>
                  </div>
                </div>
              )}
    
              {/* Step 2: Status */}
              {step === 2 && (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((s) => {
                     // Get localized status data dynamically
                     const statusData = s === 1 ? t.status.step1 : 
                                      s === 2 ? t.status.step2 : 
                                      s === 3 ? t.status.step3 : t.status.step4;
                     return (
                        <button
                          key={s}
                          onClick={() => setStatusStep(s)}
                          className={`w-full flex flex-col items-start p-4 rounded-lg border-2 transition-all text-left min-h-[80px] ${
                            statusStep === s
                              ? 'border-primary bg-primary/5 ring-1 ring-primary'
                              : 'border-slate-100 hover:border-slate-300'
                          }`}
                        >
                          <span className="font-bold text-slate-800 text-base sm:text-lg mb-1 leading-tight">{statusData.label}</span>
                          <span className="text-xs sm:text-sm text-slate-500 leading-normal">{statusData.desc}</span>
                        </button>
                    );
                  })}
                </div>
              )}
    
              {/* Step 3: Injury Part */}
              {step === 3 && (
                <div className="space-y-3">
                   {INJURY_PARTS.map((item) => (
                     <button
                        key={item.id}
                        onClick={() => setInjuryPart(item.id as InjuryPart)}
                        className={`w-full flex items-center p-3 rounded-lg border-2 transition-all text-left min-h-[60px] ${
                          injuryPart === item.id 
                            ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                            : 'border-slate-100 hover:border-slate-300'
                        }`}
                     >
                       <span className="text-xl mr-3 flex-shrink-0">{item.icon}</span>
                       <span className="font-semibold text-slate-700 leading-tight">
                         {getInjuryLabel(item.id)}
                       </span>
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
                  <Select onValueChange={(v) => setRegion(v as Region)} value={region || ""}>
                    <SelectTrigger className="w-full h-12 text-lg">
                      <SelectValue placeholder={t.region.placeholder} />
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
               {isSummaryMode ? null : (
                 !isForced && (
                  <Button variant="ghost" onClick={initialData ? () => setIsSummaryMode(true) : onClose}>
                     {t.buttons.cancel}
                  </Button>
                 )
               )}
              <Button 
                onClick={handleNext} 
                disabled={!isStepValid()}
                className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
              >
                {step === 4 ? t.buttons.complete : t.buttons.next}
              </Button>
            </DialogFooter>
           </>
        )}
      </DialogContent>
    </Dialog>
  );
}
