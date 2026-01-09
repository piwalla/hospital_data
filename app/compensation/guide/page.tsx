'use client';

import React, { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Stethoscope, 
  Activity, 
  Briefcase, 
  ChevronRight,
  AlertCircle,
  PiggyBank,
  HeartPulse,
  Ambulance,
  UserPlus,
  Accessibility,
  Car, // Taxi/Car
  Train, // Public Transport
  Send, // Submit
  CheckCircle2, // Good Case
  XCircle, // Bad Case
  MessageCircle, // Script
} from 'lucide-react';
import { calculateSickLeave, calculateDisability, formatCurrency } from '@/lib/calculator/benefit-calculations';
import { BenefitDetailModal, ModalSection } from '@/components/compensation/BenefitDetailModal';
import { COMPENSATION_CONSTANTS, DISABILITY_GRADE_DAYS } from '@/lib/compensation_data';

// Force dynamic rendering since we rely on searchParams
export const dynamic = 'force-dynamic';

import { getUserProfile } from '@/app/actions/user';

// ...

function CompensationReportContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // 1. Get Data from URL
  const wageParam = searchParams.get('wage');
  const ageParam = searchParams.get('age');
  
  // State for fetched data (fallback if URL param missing)
  const [fetchedWage, setFetchedWage] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modal States
  const [activeModal, setActiveModal] = useState<'TREATMENT' | 'NURSING_TX' | 'TRANSPORT' | 'SICK_LEAVE' | 'LOAN' | 'DISABILITY' | 'NURSING' | 'REHAB' | 'DEATH' | null>(null);
  const [disabilityTab, setDisabilityTab] = useState<'CRITERIA' | 'PROCEDURE'>('CRITERIA');
  const [transportTab, setTransportTab] = useState<'BASIC' | 'TIPS' | 'SUBMIT'>('BASIC'); // New State for Transport Modal

  // Fetch user profile if wage param is missing
  React.useEffect(() => {
    async function loadUserProfile() {
      if (!wageParam) {
        try {
          const profile = await getUserProfile();
          if (profile?.wageInfo?.amount) {
            setFetchedWage(profile.wageInfo.amount);
          }
        } catch (error) {
          console.error("Failed to fetch user profile", error);
        }
      }
      setIsLoading(false);
    }
    loadUserProfile();
  }, [wageParam]);

  const averageWage = wageParam ? parseFloat(wageParam) : (fetchedWage || 0);
  const age = ageParam ? parseInt(ageParam) : undefined;

  // Effect to handle deep linking to modals via URL
  React.useEffect(() => {
    const modalParam = searchParams.get('modal');
    if (modalParam) {
        const validKeys = ['TREATMENT', 'NURSING_TX', 'TRANSPORT', 'SICK_LEAVE', 'LOAN', 'DISABILITY', 'NURSING', 'REHAB', 'DEATH'];
        if (validKeys.includes(modalParam)) {
            setActiveModal(modalParam as any);
        }
    }
  }, [searchParams]);

  if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700" />
        </div>
      );
  }

  // No data case -> Show Empty State
  if (!averageWage || averageWage <= 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
        <div className="text-center max-w-md space-y-6">
          <AlertCircle className="w-16 h-16 text-slate-300 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-900">데이터가 없습니다</h2>
          <p className="text-slate-600">
            평균임금 계산기에서 먼저 급여를 계산해주세요.
          </p>
          <Button 
            onClick={() => router.push('/calculator')}
            className="w-full py-6 text-lg bg-green-700 hover:bg-green-800"
          >
            산재 급여 계산하러 가기
          </Button>
        </div>
      </div>
    );
  }

  // 2. Calculations
  const sickLeaveData = calculateSickLeave(averageWage, 30, age); 
  const disabilityMax = calculateDisability(averageWage, 1); 
  const disabilityMin = calculateDisability(averageWage, 14); 

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Report Header */}
      {/* Report Header - Emerald Theme Update */}
      <div className="bg-white/80 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-600 tracking-wider uppercase mb-1 block">Compensation Report</span>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              산재 보상금 리포트
            </h1>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-xs text-slate-500 font-medium">기준 일급 (평균임금)</p>
            <p className="text-lg font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg inline-block mt-1">
              {formatCurrency(averageWage)}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
        
        {/* Mobile Wage Summary */}
        <div className="md:hidden bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
             <span className="text-sm text-slate-500 font-medium">내 평균임금 (일급)</span>
             <span className="text-lg font-bold text-slate-900">{formatCurrency(averageWage)}</span>
        </div>

        {/* Section 1: 치료와 생활 (Treatment) - 5 Cards Layout */}
        <section className="space-y-4 animate-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-emerald-100 text-emerald-700 p-2 rounded-xl">
              <Stethoscope className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">1. 치료와 생활 지원</h2>
            <Badge variant="outline" className="ml-auto text-xs text-slate-500 font-normal border-slate-200">치료 기간 중</Badge>
          </div>

          {/* Grid Layout: Row 1 (3 items), Row 2 (2 items) */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
             
             {/* 1-1. 치료비 (Medical + Drug + Assistive) */}
             <Card className="rounded-2xl border-slate-100 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg hover:-translate-y-1 hover:border-emerald-200 transition-all duration-300 cursor-pointer group bg-white"
                   onClick={() => setActiveModal('TREATMENT')}>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-bold text-slate-800 flex justify-between items-center">
                        치료비 및 보조기구
                        <Badge variant="secondary" className="bg-slate-50 text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">전액 지원</Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-slate-500 leading-snug mb-3">
                        진료비, 약제비는 물론 치료에 필요한 <span className="font-bold text-slate-800">재활 보조기구</span>까지 지원됩니다.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
                         <Accessibility className="w-4 h-4" />
                         <span>의족, 휠체어 등 보조기 포함</span>
                    </div>
                </CardContent>
             </Card>

             {/* 1-2. 간병료 */}
             <Card className="rounded-2xl border-slate-100 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg hover:-translate-y-1 hover:border-emerald-200 transition-all duration-300 cursor-pointer group bg-white"
                   onClick={() => setActiveModal('NURSING_TX')}>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-bold text-slate-800 flex justify-between items-center">
                        간병료 (치료 중)
                        <Badge variant="secondary" className="bg-slate-50 text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">실비 지원</Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-slate-500 leading-snug mb-3">
                        수술 직후 등 거동이 불편할 때 <span className="font-bold text-slate-800">간병인 비용</span>을 지원받을 수 있습니다.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                         <UserPlus className="w-4 h-4" />
                         <span>전문 간병인 / 가족 간병 모두 가능</span>
                    </div>
                </CardContent>
             </Card>

             {/* 1-3. 이송비 */}
             <Card className="rounded-2xl border-slate-100 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg hover:-translate-y-1 hover:border-emerald-200 transition-all duration-300 cursor-pointer group bg-emerald-50/30"
                   onClick={() => setActiveModal('TRANSPORT')}>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-bold text-slate-800 flex justify-between items-center">
                        이송비 (교통비)
                        <Badge variant="secondary" className="bg-white text-slate-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors border border-emerald-100">교통비</Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-slate-500 leading-snug mb-3">
                        병원 방문이나 전원을 위해 이동할 때 발생하는 <span className="font-bold text-slate-800">교통비</span>를 지원합니다.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium group-hover:text-emerald-600 transition-colors">
                         <Ambulance className="w-4 h-4" />
                         <span>택시, 구급차, 자가용 지원 기준 보기</span>
                    </div>
                </CardContent>
             </Card>

             {/* 1-4. 휴업급여 */}
             <Card className="rounded-2xl border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-sm relative overflow-hidden group cursor-pointer hover:shadow-lg transition-all lg:col-span-2 hover:-translate-y-1"
                   onClick={() => setActiveModal('SICK_LEAVE')}>
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white text-emerald-600 rounded-full p-2 shadow-sm">
                        <ChevronRight className="w-5 h-5" />
                    </div>
                </div>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-bold text-emerald-900 flex justify-between items-center">
                        휴업급여 (월급 대체)
                        <Badge className="bg-white text-emerald-700 hover:bg-white hover:text-emerald-800">상세 보기</Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                        <div>
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-3xl font-black text-emerald-800 tracking-tight">
                                    {formatCurrency(sickLeaveData.dailyAmount)}
                                </span>
                                <span className="text-xs text-emerald-600 font-bold">/ 1일</span>
                            </div>
                            <p className="text-sm text-emerald-700/80">
                                월 약 <span className="font-bold text-emerald-900">{formatCurrency(sickLeaveData.dailyAmount * 30)}</span> 예상 (평균임금의 70%)
                            </p>
                        </div>
                    </div>
                </CardContent>
             </Card>

             {/* 1-5. 융자 Card */}
             <Card className="border-slate-200 shadow-sm hover:border-amber-300 transition-colors cursor-pointer group"
                   onClick={() => setActiveModal('LOAN')}>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-bold text-slate-800 flex justify-between items-center">
                        생활안정 융자
                        <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-100">1.0% 저리</Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-3">
                        <div className="bg-amber-100 p-2 rounded-full text-amber-600">
                            <PiggyBank className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-800">최대 3,000만원</p>
                            <p className="text-xs text-slate-500">생계비, 혼례비 등</p>
                        </div>
                    </div>
                </CardContent>
             </Card>
          </div>
        </section>

        {/* Section 2: 치료 종결 (End of Treatment) */}
        <section className="space-y-4 animate-in slide-in-from-bottom-4 duration-700 delay-150">
          <div className="flex items-center gap-2 mb-2">
             <span className="bg-purple-100 text-purple-700 p-1.5 rounded-lg">
              <Activity className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">2. 치료 후 후유증 보상</h2>
            <Badge variant="outline" className="ml-auto text-xs text-slate-500 font-normal">치료 종결 후</Badge>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {/* 2-1. 장해급여 */}
            <Card className="md:col-span-2 border-purple-200 bg-white shadow-sm cursor-pointer hover:shadow-md transition-all group"
                    onClick={() => setActiveModal('DISABILITY')}>
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold text-slate-900 flex justify-between items-center">
                        장해급여 예상 범위
                        <Badge className="bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-100">등급표 보기</Badge>
                    </CardTitle>
                    <CardDescription>
                        장해 등급(1급~14급) 판정에 따라 지급액이 결정됩니다.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="text-center sm:text-left">
                            <p className="text-xs text-slate-500 mb-1">최소 (14급)</p>
                            <p className="text-xl font-bold text-slate-700">{formatCurrency(disabilityMin.lumpSum)}</p>
                        </div>
                        <div className="w-full h-px sm:w-px sm:h-12 bg-slate-300 relative mx-4"></div>
                        <div className="text-center sm:text-right">
                            <p className="text-xs text-purple-600 font-bold mb-1">최대 (1급)</p>
                            <p className="text-2xl font-extrabold text-purple-900">{formatCurrency(disabilityMax.pension)}</p>
                            <p className="text-[10px] text-purple-600">매년 (연금)</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 2-2. 간병급여 */}
            <Card className="border-slate-200 hover:border-pink-300 transition-colors cursor-pointer group"
                  onClick={() => setActiveModal('NURSING')}>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-bold text-slate-800 flex justify-between items-center">
                        간병급여
                        <Badge variant="secondary" className="bg-pink-50 text-pink-700 border-pink-100">종결 후</Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                     <div className="flex flex-col h-full justify-between">
                        <p className="text-sm text-slate-600 leading-snug">
                            치료가 끝난 뒤에도 간병이 필요하다면 지원받습니다.
                        </p>
                        <div className="flex items-center gap-2 mt-3 text-pink-600 text-sm font-bold">
                            <HeartPulse className="w-4 h-4" />
                            최대 {formatCurrency(COMPENSATION_CONSTANTS.NURSING_BENEFIT.PROFESSIONAL.CONSTANT)}/일
                        </div>
                    </div>
                </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 3: 재활 및 기타 */}
        <section className="space-y-4 animate-in slide-in-from-bottom-4 duration-700 delay-300">
            <div className="flex items-center gap-2 mb-2">
             <span className="bg-green-100 text-green-700 p-1.5 rounded-lg">
              <Briefcase className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">3. 사회 복귀 및 기타</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
             {/* 3-1. 재활지원 */}
             <Card className="border-slate-200 cursor-pointer hover:border-green-300 transition-colors group"
                   onClick={() => setActiveModal('REHAB')}>
                 <CardHeader className="pb-2">
                    <CardTitle className="text-base font-bold text-slate-800 flex justify-between items-center">
                        재취업 훈련 지원
                        <Badge variant="outline" className="text-slate-500 group-hover:text-green-600 group-hover:border-green-300">상세 조건</Badge>
                    </CardTitle>
                 </CardHeader>
                 <CardContent>
                     <div className="space-y-3">
                         <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                             <span className="text-sm text-slate-600">훈련 비용</span>
                             <span className="font-bold text-slate-900">최대 600만원</span>
                         </div>
                         <div className="flex justify-between items-center">
                             <span className="text-sm text-slate-600">훈련 수당</span>
                             <span className="font-bold text-green-700">월 최대 200만원+</span>
                         </div>
                     </div>
                 </CardContent>
             </Card>

             {/* 3-2. 유족보상 */}
             <Card className="border-slate-200 cursor-pointer hover:border-gray-400 transition-colors group"
                    onClick={() => setActiveModal('DEATH')}>
                 <CardHeader className="pb-2">
                    <CardTitle className="text-base font-bold text-slate-800 flex justify-between items-center">
                        사망 시 유족보상
                         <Badge variant="secondary" className="bg-slate-100 text-slate-600">대비용 정보</Badge>
                    </CardTitle>
                 </CardHeader>
                 <CardContent>
                     <div className="space-y-1">
                         <p className="text-sm text-slate-600">
                            부득이한 사망 시 <span className="font-bold text-slate-900">장의비</span>와 <span className="font-bold text-slate-900">유족급여</span>가 지급됩니다.
                         </p>
                     </div>
                 </CardContent>
             </Card>
          </div>
        </section>

         {/* Footer Action */}
        <div className="pt-8 pb-12 text-center">
            <Button 
                onClick={() => router.push('/dashboard')}
                className="bg-slate-900 text-white px-8 py-6 rounded-full text-lg font-bold hover:bg-slate-800 shadow-lg hover:shadow-xl transition-all"
            >
                내 대시보드로 이동하기
            </Button>
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* A. Treatment Modal (Filtered) */}
      <BenefitDetailModal
        isOpen={activeModal === 'TREATMENT'}
        onClose={() => setActiveModal(null)}
        title="치료비 및 보조기구 상세"
        description="가장 기본적인 치료 비용과 재활에 필요한 기구 구입 비용을 지원합니다."
      >
        <ModalSection title="진료비 및 수술비 (요양급여)">
            <p className="mb-2">공단이 병원에 직접 지급하므로 <strong>본인 부담이 없는 것이 원칙</strong>입니다.</p>
            <div className="bg-slate-50 p-3 rounded border border-slate-100 text-sm">
                <span className="font-bold text-red-600 block mb-1">⚠️ 지원되지 않는 비급여 항목 (본인 부담)</span>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                    <li>상급병실료 (단, 일반실이 없어 부득이한 경우 등 예외 있음)</li>
                    <li>선택진료비 (특진비)</li>
                    <li>업무와 무관한 질병 치료비</li>
                    <li>성형/미용 목적의 시술 등</li>
                </ul>
            </div>
        </ModalSection>

         <ModalSection title="재활 보조기구 (내구연한 및 한도)">
            <p className="mb-2 text-sm text-slate-600">치료 및 재활에 필요한 보조기구를 구입 시 기준 금액 내에서 실비 지원합니다.</p>
            <div className="overflow-hidden border border-slate-200 rounded-lg">
                <table className="w-full text-sm text-center">
                    <thead className="bg-slate-100 text-slate-700 font-medium">
                        <tr>
                            <th className="p-2 border-r border-slate-200">품목</th>
                            <th className="p-2 border-r border-slate-200">내구연한</th>
                            <th className="p-2">비고 (기준)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <tr>
                            <td className="p-2 bg-slate-50 font-medium border-r border-slate-100">휠체어</td>
                            <td className="p-2 border-r border-slate-100">5년</td>
                            <td className="p-2 text-xs">약 48만원 한도</td>
                        </tr>
                         <tr>
                            <td className="p-2 bg-slate-50 font-medium border-r border-slate-100">보청기</td>
                            <td className="p-2 border-r border-slate-100">5년</td>
                            <td className="p-2 text-xs">편측 131만원 (양측 가능)</td>
                        </tr>
                        <tr>
                            <td className="p-2 bg-slate-50 font-medium border-r border-slate-100">의수/의족</td>
                            <td className="p-2 border-r border-slate-100">-</td>
                            <td className="p-2 text-xs">장해 등급별 &apos;일반형&apos; 기준</td>
                        </tr>
                    </tbody>
                </table>
            </div>
             <p className="text-xs text-slate-500 mt-2 text-right">* 구체적인 금액은 공단 고시에 따름</p>
        </ModalSection>

        <ModalSection title="📋 보조기구 청구 방법 (필수 서류)">
            <ul className="list-decimal pl-4 space-y-1 text-sm text-slate-700 bg-slate-50 p-3 rounded border border-slate-200">
                <li><strong>보조기구 처방전</strong> (담당 의사 발급)</li>
                <li><strong>구입 영수증</strong> (세금계산서 등 증빙)</li>
                <li><strong>보조기구 검수 확인서</strong> (구입 후 의사 확인)</li>
            </ul>
        </ModalSection>
      </BenefitDetailModal>

      {/* A-2. Nursing (Treatment) Modal (New) */}
       <BenefitDetailModal
        isOpen={activeModal === 'NURSING_TX'}
        onClose={() => setActiveModal(null)}
        title="간병료 상세 (치료 중)"
        description="요양 기간 중 거동이 불편하여 타인의 도움이 필요한 경우 지원합니다."
      >
        <ModalSection title="지원 기준 (간병 필요 등급)">
             <div className="space-y-3">
                <div className="bg-slate-50 p-3 rounded border border-slate-100">
                    <span className="font-bold text-slate-800 block mb-1">1등급 (상시 간병)</span>
                    <p className="text-xs text-slate-600">두 손/두 눈 상실, 뇌 손상, 35% 이상 화상 등 일상생활 전반을 스스로 할 수 없는 상태</p>
                </div>
                <div className="bg-slate-50 p-3 rounded border border-slate-100">
                    <span className="font-bold text-slate-800 block mb-1">2등급 (수시 간병)</span>
                    <p className="text-xs text-slate-600">신경/정신/흉복부 장해 등으로 일상생활 대부분에 수시로 도움이 필요한 상태</p>
                </div>
                <div className="bg-slate-50 p-3 rounded border border-slate-100">
                    <span className="font-bold text-slate-800 block mb-1">3등급 (부분 간병)</span>
                    <p className="text-xs text-slate-600">골반 골절 등 수술 직후 거동이 제한되어 부분적 도움이 필요한 상태</p>
                </div>
             </div>
        </ModalSection>
        <ModalSection title="지원 금액표 (2024년 1일 기준)">
            <div className="overflow-hidden border border-slate-200 rounded-lg">
                <table className="w-full text-sm text-center">
                    <thead className="bg-slate-100 text-slate-700 font-medium">
                        <tr>
                            <th className="p-2 border-r border-slate-200">등급</th>
                            <th className="p-2 border-r border-slate-200">전문 간병인</th>
                            <th className="p-2">가족/기타</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <tr>
                            <td className="p-2 bg-slate-50 font-medium border-r border-slate-100">1등급</td>
                            <td className="p-2 border-r border-slate-100">{formatCurrency(COMPENSATION_CONSTANTS.NURSING_TREATMENT.PROFESSIONAL.GRADE_1)}</td>
                            <td className="p-2">{formatCurrency(COMPENSATION_CONSTANTS.NURSING_TREATMENT.FAMILY.GRADE_1)}</td>
                        </tr>
                        <tr>
                            <td className="p-2 bg-slate-50 font-medium border-r border-slate-100">2등급</td>
                            <td className="p-2 border-r border-slate-100">{formatCurrency(COMPENSATION_CONSTANTS.NURSING_TREATMENT.PROFESSIONAL.GRADE_2)}</td>
                            <td className="p-2">{formatCurrency(COMPENSATION_CONSTANTS.NURSING_TREATMENT.FAMILY.GRADE_2)}</td>
                        </tr>
                        <tr>
                            <td className="p-2 bg-slate-50 font-medium border-r border-slate-100">3등급</td>
                            <td className="p-2 border-r border-slate-100">{formatCurrency(COMPENSATION_CONSTANTS.NURSING_TREATMENT.PROFESSIONAL.GRADE_3)}</td>
                            <td className="p-2">{formatCurrency(COMPENSATION_CONSTANTS.NURSING_TREATMENT.FAMILY.GRADE_3)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </ModalSection>
         <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded mt-2">
             * 주치의의 소견(간병 필요성 인정)이 필수입니다. <br/>
             * 실제 간병을 받은 날짜만큼 지급됩니다.
         </p>

        <ModalSection title="📋 간병료 청구 방법 (필수 서류)">
            <div className="bg-slate-50 p-3 rounded border border-slate-200 text-sm">
                <p className="font-bold text-slate-800 mb-2">기본 서류</p>
                <ul className="list-disc pl-4 space-y-1 text-slate-700 mb-3">
                    <li><strong>요양비 청구서</strong> (공단 양식)</li>
                    <li><strong>의사 소견서</strong> (간병 필요 등급 및 기간 명시 필수)</li>
                    <li><strong>간병료 영수증</strong> (간병인 서명 또는 계좌이체 내역)</li>
                </ul>

                <p className="font-bold text-slate-800 mb-2 mt-4 pt-3 border-t border-slate-200">추가 서류 (유형별)</p>
                <ul className="list-disc pl-4 space-y-1 text-slate-700">
                    <li><strong>전문 간병인:</strong> 간병인 자격증 또는 전문교육 이수증 사본</li>
                    <li><strong>가족 간병인:</strong> 가족관계증명서 (수급권자와의 관계 증빙)</li>
                </ul>
            </div>
        </ModalSection>
      </BenefitDetailModal>

      {/* A-3. Transport Modal (Enhanced) */}
      <BenefitDetailModal
        isOpen={activeModal === 'TRANSPORT'}
        onClose={() => setActiveModal(null)}
        title="이송비 (교통비) 상세"
        description="병원 이동 시 발생한 교통비를 지원받을 수 있습니다."
      >
        {/* Tab Navigation */}
        <div className="flex w-full bg-slate-100 p-1 rounded-xl mb-6">
             <button 
                onClick={() => setTransportTab('BASIC')}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                    transportTab === 'BASIC' 
                    ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-black/5' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
             >
                기본 안내
             </button>
             <button 
                onClick={() => setTransportTab('TIPS')}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                    transportTab === 'TIPS' 
                    ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-black/5' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
             >
                💡 실전 꿀팁
             </button>
             <button 
                onClick={() => setTransportTab('SUBMIT')}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                    transportTab === 'SUBMIT' 
                    ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-black/5' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
             >
                신청 방법
             </button>
        </div>

        {/* Tab 1: Basic Info */}
        {transportTab === 'BASIC' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <ModalSection title="교통수단별 지원 기준">
                    <div className="grid gap-3">
                        {/* Public Transport */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex gap-4 items-start">
                             <div className="bg-white p-2 rounded-lg border border-slate-100 text-slate-400 mt-1">
                                <Train className="w-5 h-5" />
                             </div>
                             <div>
                                <span className="font-bold text-slate-900 block mb-1">대중교통 (원칙)</span>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    버스, 지하철, 기차 비용 실비 지급 (영수증 제출)
                                </p>
                             </div>
                        </div>

                        {/* Taxi / Car */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex gap-4 items-start">
                             <div className="bg-white p-2 rounded-lg border border-slate-100 text-amber-500 mt-1">
                                <Car className="w-5 h-5" />
                             </div>
                             <div>
                                <span className="font-bold text-slate-900 block mb-1">택시 / 자가용</span>
                                <p className="text-sm text-slate-600 mb-2 leading-relaxed">
                                    대중교통 이용 불가 <strong>의사 소견</strong> 필수
                                    <span className="block text-xs text-slate-500 mt-1 font-normal">
                                        * 자가용은 <strong>기름값 영수증이 아닌</strong>, 이동 거리로 계산하여 지급합니다.
                                    </span>
                                </p>
                                <div className="text-xs bg-white p-2 rounded border border-slate-200 text-slate-500">
                                    <span className="font-bold text-slate-700">자가용 계산식:</span><br/>
                                    거리(km) × 지역별 택시비의 50% + <span className="text-emerald-600 font-bold">통행료</span> (영수증 필수)
                                </div>
                             </div>
                        </div>

                        {/* Ambulance */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex gap-4 items-start">
                             <div className="bg-white p-2 rounded-lg border border-slate-100 text-red-500 mt-1">
                                <Ambulance className="w-5 h-5" />
                             </div>
                             <div>
                                <span className="font-bold text-slate-900 block mb-1">사설 구급차</span>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    응급상황 또는 의사가 필요성을 인정한 경우 지원
                                </p>
                             </div>
                        </div>
                    </div>
                </ModalSection>
             </div>
        )}

        {/* Tab 2: Practical Tips */}
        {transportTab === 'TIPS' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                
                {/* Good vs Bad Case */}
                <ModalSection title="택시비, 받을 수 있을까요?">
                     <div className="grid grid-cols-2 gap-3">
                        <div className="border border-red-100 bg-red-50/50 p-3 rounded-xl">
                            <div className="flex items-center gap-1.5 mb-2 text-red-700 font-bold text-sm">
                                <XCircle className="w-4 h-4" /> 나쁜 예 (감액)
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed">
                                &quot;다리가 너무 아파서 택시 탔어요&quot;하고 영수증만 냄<br/>
                                → <strong>버스비(약 1,500원)만 지급됨</strong> 😭
                            </p>
                        </div>
                         <div className="border border-emerald-100 bg-emerald-50/50 p-3 rounded-xl">
                            <div className="flex items-center gap-1.5 mb-2 text-emerald-700 font-bold text-sm">
                                <CheckCircle2 className="w-4 h-4" /> 좋은 예 (전액)
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed">
                                미리 의사에게 <strong>&apos;승용차 이용 필요&apos; 소견</strong>을 받고 택시 탐<br/>
                                → <strong>택시비 전액 지급됨</strong> 🎉
                            </p>
                        </div>
                     </div>
                </ModalSection>

                {/* Doctor Request Script */}
                <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl shadow-sm relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-blue-100 rounded-full blur-2xl opacity-50"></div>
                     <h4 className="text-blue-900 font-bold flex items-center gap-2 mb-3 relative z-10">
                        <MessageCircle className="w-5 h-5 text-blue-600" />
                        병원 요청 꿀팁 (스크립트)
                     </h4>
                     <p className="text-sm text-slate-600 mb-4 leading-relaxed relative z-10">
                        택시나 자가용을 이용해야 한다면, 진료 볼 때 의사 선생님께 이렇게 말씀드려 보세요. 
                        <strong>이 한 마디가 교통비를 결정합니다!</strong>
                     </p>
                     
                     <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-inner relative z-10">
                        <p className="text-slate-800 font-medium text-sm leading-7">
                            &quot;선생님, 제가 거동이 불편해서 대중교통 이용이 너무 힘듭니다. 
                            나중에 이송비 청구할 때 문제없도록 소견서에 
                            <span className="bg-yellow-200 mx-1 px-1 rounded shadow-sm font-bold text-slate-900">&apos;대중교통 이용 불가&apos;</span>
                            라고 한 줄만 적어주실 수 있을까요?&quot;
                        </p>
                     </div>
                </div>
             </div>
        )}

        {/* Tab 3: Submission Guide (Enhanced) */}
        {transportTab === 'SUBMIT' && (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                 
                 {/* Step-by-Step Guide */}
                 <ModalSection title="📝 신청 전 3단계 체크리스트">
                    <div className="space-y-4">
                        {/* Step 1 */}
                        <div className="flex gap-4 items-start bg-slate-50 p-3 rounded-xl border border-slate-100">
                             <div className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-sm font-black text-slate-800 shadow-sm mt-0.5">1</div>
                             <div>
                                <span className="font-bold text-slate-900 block text-sm mb-1">서류 사진 찍어두기</span>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    영수증(택시/약국)과 의사 소견서를 미리 휴대폰으로 찍어두세요.<br/>
                                    <span className="text-emerald-600 font-medium">* 스캔할 필요 없이 사진이면 충분합니다!</span>
                                </p>
                             </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex gap-4 items-start bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                             <div className="bg-white px-2.5 py-1 rounded-lg border border-emerald-200 text-sm font-black text-emerald-800 shadow-sm mt-0.5">2</div>
                             <div>
                                <span className="font-bold text-emerald-900 block text-sm mb-1">토탈서비스 접속</span>
                                <div className="text-xs text-slate-600 bg-white/60 p-2 rounded border border-emerald-100/50 inline-block mb-2">
                                    로그인 &gt; 민원접수/신고 &gt; 요양신청 &gt; <span className="underline decoration-emerald-300 decoration-2 font-bold text-emerald-800">요양지원비(이송비 등) 청구</span>
                                </div>
                                <Button 
                                    size="sm"
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm"
                                    onClick={() => window.open('https://total.comwel.or.kr', '_blank')}
                                >
                                    바로가기 <Send className="w-3 h-3 ml-2" />
                                </Button>
                             </div>
                        </div>

                         {/* Step 3 */}
                         <div className="flex gap-4 items-start bg-slate-50 p-3 rounded-xl border border-slate-100">
                             <div className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-sm font-black text-slate-800 shadow-sm mt-0.5">3</div>
                             <div>
                                <span className="font-bold text-slate-900 block text-sm mb-1">파일 업로드</span>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    신청 화면에서 &apos;파일 첨부&apos; 버튼을 누르고, 아까 찍어둔 <span className="font-bold">영수증 사진을 선택</span>하면 끝!
                                </p>
                             </div>
                        </div>
                    </div>
                 </ModalSection>

                 {/* Offline / Mobile Info */}
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                    <p className="text-xs text-slate-500 mb-2">PC 사용이 어려우신가요?</p>
                    <div className="flex justify-center gap-4 text-xs font-bold text-slate-700">
                        <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> 모바일 &apos;정부24&apos; 앱</span>
                        <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> 관할 지사 팩스/우편</span>
                    </div>
                 </div>
             </div>
        )}
      </BenefitDetailModal>


      {/* B. Sick Leave Modal */}
      <BenefitDetailModal
        isOpen={activeModal === 'SICK_LEAVE'}
        onClose={() => setActiveModal(null)}
        title="휴업급여 상세 계산 내역"
        description="요양으로 인해 취업하지 못한 기간에 대해 지급합니다."
      >
         <ModalSection title="계산 방식">
            <p>1일 지급액 = <strong>평균임금의 70%</strong> (취업하지 못한 기간)</p>
            <div className="mt-2 text-sm bg-slate-50 p-3 rounded">
                <p>회원님의 평균임금(일급): {formatCurrency(averageWage)}</p>
                <p>x 70% = <strong>{formatCurrency(averageWage * 0.7)}</strong></p>
            </div>
         </ModalSection>
         <ModalSection title="상한액 및 하한액 (2025년 기준)">
             <ul className="list-disc leading-relaxed space-y-1">
                 <li>1일 상한액: <strong>{formatCurrency(COMPENSATION_CONSTANTS.TEMPORARY.MAX_DAILY)}</strong> (초과 시 상한액 지급)</li>
                 <li>1일 하한액: <strong>{formatCurrency(COMPENSATION_CONSTANTS.TEMPORARY.MIN_DAILY)}</strong> (최저임금 미만 시 최저 보장)</li>
             </ul>
         </ModalSection>
         <ModalSection title="고령자 감액 기준 (만 61세 이상)">
            <p className="mb-2">노동 능력 감소를 고려하여 만 61세부터 단계적으로 감액됩니다.</p>
            <div className="bg-slate-50 rounded-lg overflow-hidden border border-slate-200">
                 <table className="w-full text-sm text-left">
                    <thead className="bg-slate-100 text-slate-600">
                        <tr><th className="p-2 border-b">연령</th><th className="p-2 border-b">지급률</th></tr>
                    </thead>
                    <tbody>
                        <tr><td className="p-2 border-b">61세</td><td className="p-2 border-b">94%</td></tr>
                        <tr><td className="p-2 border-b">63세</td><td className="p-2 border-b">82%</td></tr>
                        <tr><td className="p-2">65세~</td><td className="p-2">71%</td></tr>
                    </tbody>
                </table>
            </div>
         </ModalSection>
      </BenefitDetailModal>

      {/* C. Loan Modal */}
       <BenefitDetailModal
        isOpen={activeModal === 'LOAN'}
        onClose={() => setActiveModal(null)}
        title="생활안정자금 융자 상세"
        description="산재 근로자의 생활 안정을 위해 저금리로 자금을 빌려드립니다."
      >
         <ModalSection title="융자 조건">
             <ul className="list-disc space-y-2">
                 <li><strong>한도:</strong> 세대당 최대 3,000만원</li>
                 <li><strong>이율:</strong> 연 1.0% (거치기간 후 상환)</li>
                 <li><strong>대상:</strong> 산재 사망자 유족, 상병보상연금 수급자, 장해 1~9급, 3개월 이상 요양 중인 저소득 산재 근로자</li>
             </ul>
         </ModalSection>
         <ModalSection title="융자 종류">
             <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-amber-50 p-2 rounded">의료비</div>
                <div className="bg-amber-50 p-2 rounded">혼례비</div>
                <div className="bg-amber-50 p-2 rounded">장례비</div>
                <div className="bg-amber-50 p-2 rounded">차량구입비</div>
             </div>
         </ModalSection>
      </BenefitDetailModal>


      {/* D. Disability Modal */}
      <BenefitDetailModal
        isOpen={activeModal === 'DISABILITY'}
        onClose={() => setActiveModal(null)}
        title="장해급여 상세 정보"
        description="치료 종결 후 장해 상태(1급~14급)에 따라 지급되는 보상입니다."
      >
        {/* Tab Navigation */}
        <div className="flex w-full bg-slate-100 p-1 rounded-lg mb-4">
             <button 
                onClick={() => setDisabilityTab('CRITERIA')}
                className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
                    disabilityTab === 'CRITERIA' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
             >
                보상 기준
             </button>
             <button 
                onClick={() => setDisabilityTab('PROCEDURE')}
                className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
                    disabilityTab === 'PROCEDURE' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
             >
                신청 절차
             </button>
        </div>

        {/* Tab Content: Criteria */}
        {disabilityTab === 'CRITERIA' && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-600">
                    <p className="font-bold text-slate-800 mb-1">💡 계산 방법</p>
                    <p>평균임금({formatCurrency(averageWage)}) x <strong>등급별 지급일수</strong></p>
                </div>
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-100 text-slate-700">
                            <tr>
                                <th className="p-3 text-left whitespace-nowrap">등급</th>
                                <th className="p-3 text-right whitespace-nowrap">연금 (1년분)</th>
                                <th className="p-3 text-right whitespace-nowrap">일시금</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {DISABILITY_GRADE_DAYS.map((item) => (
                                <tr key={item.grade} className="hover:bg-slate-50">
                                    <td className="p-3 font-medium text-slate-900">{item.grade}급</td>
                                    <td className="p-3 text-right text-slate-600">{item.pension ? `${item.pension}일분` : '-'}</td>
                                    <td className="p-3 text-right text-slate-600">{formatCurrency(item.lumpSum * averageWage)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* Tab Content: Procedure */}
        {disabilityTab === 'PROCEDURE' && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
                <ModalSection title="📋 장해급여 신청 절차 및 서류">
                    <div className="space-y-4">
                        <div className="bg-slate-50 p-3 rounded border border-slate-200">
                            <p className="font-bold text-slate-900 mb-2">1. 장해 진단 (치료 종결 시)</p>
                            <p className="text-sm text-slate-700">
                                주치의에게 <strong>장해진단서</strong> 발급 요청 (치료 종결 후 장해가 남은 경우)
                            </p>
                        </div>
                        
                        <div className="bg-slate-50 p-3 rounded border border-slate-200">
                            <p className="font-bold text-slate-900 mb-2">2. 청구서 제출</p>
                            <ul className="list-disc pl-4 space-y-1 text-sm text-slate-700">
                                <li><strong>장해급여 청구서</strong> (근로복지공단 양식)</li>
                                <li><strong>장해진단서</strong> (주치의 작성)</li>
                                <li><strong>MRI/CT/X-ray 등 영상 자료</strong> (필요 시)</li>
                            </ul>
                        </div>

                        <div className="bg-slate-50 p-3 rounded border border-slate-200">
                            <p className="font-bold text-slate-900 mb-2">3. 공단 심사 및 등급 결정</p>
                            <p className="text-sm text-slate-700">
                                제출된 서류와 공단 자문의 소견을 종합하여 <strong>장해 등급(1~14급)</strong> 최종 결정 → 급여 지급
                            </p>
                        </div>
                    </div>
                </ModalSection>
             </div>
        )}
      </BenefitDetailModal>

      {/* E. Nursing Modal (Post-Treatment) */}
      <BenefitDetailModal
        isOpen={activeModal === 'NURSING'}
        onClose={() => setActiveModal(null)}
        title="간병급여 상세 (치료 종결 후)"
        description="요양 종결 후에도 의학적으로 상시/수시 간병이 필요한 경우 지급됩니다."
      >
         <ModalSection title="지급 금액 (1일 기준)">
             <div className="grid gap-3">
                 <div className="flex justify-between items-center bg-pink-50 p-3 rounded border border-pink-100">
                     <span className="font-bold text-pink-800">상시 간병</span>
                     <span className="text-pink-700 font-bold">{formatCurrency(COMPENSATION_CONSTANTS.NURSING_BENEFIT.PROFESSIONAL.CONSTANT)}</span>
                 </div>
                 <div className="flex justify-between items-center bg-blue-50 p-3 rounded border border-blue-100">
                     <span className="font-bold text-blue-800">수시 간병</span>
                     <span className="text-blue-700 font-bold">{formatCurrency(COMPENSATION_CONSTANTS.NURSING_BENEFIT.PROFESSIONAL.OCCASIONAL)}</span>
                 </div>
             </div>
         </ModalSection>
         <ModalSection title="지급 대상">
             <ul className="list-disc pl-4 space-y-1 text-sm text-slate-600">
                 <li>두 눈이 실명된 사람 (장해 1급)</li>
                 <li>두 다리를 못 쓰게 된 사람 (장해 1급)</li>
                 <li>신경 계통 기능에 뚜렷한 장해가 남은 사람 (장해 1~2급 등)</li>
             </ul>
         </ModalSection>
      </BenefitDetailModal>

      {/* F. Rehab Modal */}
      <BenefitDetailModal
        isOpen={activeModal === 'REHAB'}
        onClose={() => setActiveModal(null)}
        title="직업재활 및 스포츠 지원 상세"
        description="사회 복귀를 돕기 위한 다양한 훈련 비용과 수당을 지원합니다."
      >
         <ModalSection title="직업훈련비용">
            <p className="mt-1 text-green-700 font-bold">1인당 최대 600만원 한도</p>
         </ModalSection>
         <ModalSection title="직업훈련수당">
             <div className="mt-2 bg-slate-50 p-3 rounded">
                <p>1일 지급액 = <strong>최저임금 x 훈련시간</strong> (1일 8시간 한도)</p>
             </div>
         </ModalSection>
         <ModalSection title="재활스포츠 지원">
             <ul className="list-disc mt-2 pl-4 space-y-1">
                 <li>일반 스포츠: 월 <strong>{formatCurrency(COMPENSATION_CONSTANTS.REHAB_SPORTS.GENERAL_MONTHLY_LIMIT)}</strong> (3개월)</li>
                 <li>특수 스포츠: 월 <strong>{formatCurrency(COMPENSATION_CONSTANTS.REHAB_SPORTS.SPECIAL_MONTHLY_LIMIT)}</strong> (1개월)</li>
             </ul>
         </ModalSection>
      </BenefitDetailModal>

       {/* G. Death Modal */}
       <BenefitDetailModal
        isOpen={activeModal === 'DEATH'}
        onClose={() => setActiveModal(null)}
        title="유족급여 및 장의비"
        description="사망 사고 발생 시 유족의 생활 보장을 위해 지급됩니다."
      >
         <ModalSection title="장의비">
             <div className="bg-slate-50 p-3 rounded mt-2">
                 <p className="font-bold text-slate-900 text-lg">{formatCurrency(averageWage * 120)}</p>
                 <p className="text-sm text-slate-500">계산식: 평균임금의 120일분</p>
             </div>
         </ModalSection>
         <ModalSection title="유족보상연금">
             <p>유족 수에 따라 기본급여액(평균임금의 52~67%) 및 가산금 지급.</p>
         </ModalSection>
      </BenefitDetailModal>

    </div>
  );
}

// Main Page Component
export default function CompensationGuidePage() {
  return (
    <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700" />
        </div>
    }>
      <CompensationReportContent />
    </Suspense>
  );
}
