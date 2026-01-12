"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {  ChevronLeft,
  ChevronRight,
  TrendingUp, 
  Calendar, 
  Scale, 
  Edit2, 
  Save, 
  Loader2,
  ShieldAlert,
  AlertTriangle
} from 'lucide-react';
import { calculateAverageWage, calculateSickLeave, calculateDisability, formatCurrency } from "@/lib/calculator/benefit-calculations";
import { useRouter } from "next/navigation";
import { updateUserWageOnly } from "@/app/actions/user";

export default function CalculatorClient() {
  const [month1, setMonth1] = useState("");
  const [month2, setMonth2] = useState("");
  const [month3, setMonth3] = useState("");
  const [averageWage, setAverageWage] = useState<number>(0);
  const [sickLeaveDays, setSickLeaveDays] = useState("30");
  // Checkbox state for age over 61
  const [isOver61, setIsOver61] = useState(false);
  const router = useRouter();
  const [age, setAge] = useState("");
  const [selectedDetail, setSelectedDetail] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (value: string, setter: (val: string) => void) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    if (numericValue) {
      setter(Number(numericValue).toLocaleString());
    } else {
      setter("");
    }
  };

  const handleCalculate = () => {
    const m1 = parseInt(month1.replace(/,/g, "")) || 0;
    const m2 = parseInt(month2.replace(/,/g, "")) || 0;
    const m3 = parseInt(month3.replace(/,/g, "")) || 0;

    if (m1 === 0 && m2 === 0 && m3 === 0) {
      alert("최소 한 달 이상의 급여를 입력해주세요.");
      return;
    }

    const { dailyWage } = calculateAverageWage(m1, m2, m3);
    setAverageWage(dailyWage);

    // Auto-save to DB if user is logged in
    // We execute this optimistically without blocking UI
    if (dailyWage > 0) {
        updateUserWageOnly({ type: 'daily', amount: dailyWage }).catch(err => {
            console.log("Auto-save failed (guest mode or error):", err);
        });
    }
  };

  const handleSave = async () => {
      if (averageWage <= 0) return;
      setIsSaving(true);
      try {
        await updateUserWageOnly({ type: 'daily', amount: averageWage });
        alert("평균임금이 저장되었습니다.");
        // 저장 후 리포트로 이동 제안 or 그냥 알림
      } catch (error) {
        console.error(error);
        alert("저장에 실패했습니다. 로그인을 확인해주세요.");
      } finally {
        setIsSaving(false);
      }
  };

  // Derived calculations for display
  const sickLeaveResult = averageWage > 0 ? calculateSickLeave(averageWage, parseInt(sickLeaveDays) || 30, isOver61 ? parseInt(age) : undefined) : null;
  const disabilityMin = averageWage > 0 ? calculateDisability(averageWage, 14) : null;
  const disabilityMax = averageWage > 0 ? calculateDisability(averageWage, 1) : null;

  // Navigate to Compensation Guide Report
  const handleNavigateToReport = () => {
    if (averageWage <= 0) {
      alert("먼저 평균임금을 계산해주세요.");
      return;
    }
    
    const params = new URLSearchParams();
    params.set("wage", averageWage.toString());
    if (isOver61) {
      params.set("age", age || "65"); // Default to 65 if checked but not entered
    }

    router.push(`/compensation/guide?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Sticky Header - Same style as Report Page */}
      <div className="bg-white/80 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-0.5">
                <Link href="/dashboard" className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest hover:text-emerald-700 transition-colors">
                    Dashboard
                </Link>
                <span className="text-[10px] text-slate-300">/</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Calculator
                </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                산재 급여 계산기
            </h1>
          </div>
          <Link href="/dashboard" className="flex items-center text-slate-500 hover:text-emerald-600 transition-all bg-slate-50 hover:bg-emerald-50 px-4 py-2 rounded-xl group border border-slate-100 font-bold text-sm">
            <ChevronLeft className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform" />
            <span>대시보드로</span>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-20 space-y-8">
        {/* 2. Integrated Disclaimer Card */}
        <Card className="border border-slate-200/50 shadow-[0_20px_50px_rgba(0,0,0,0.06)] bg-white/95 backdrop-blur-md overflow-hidden rounded-[2rem] group transition-all hover:shadow-2xl hover:translate-y-[-4px]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 animate-gradient-x" />
          <CardContent className="flex items-start gap-5 p-8 sm:p-10">
            <div className="w-14 h-14 bg-amber-50 rounded-[1.25rem] flex items-center justify-center flex-shrink-0 mt-0.5 border border-amber-100 shadow-sm">
                <ShieldAlert className="w-8 h-8 text-amber-500" />
            </div>
            <div className="space-y-3">
                <p className="text-xl font-black text-slate-900 tracking-tight">꼭 확인해주세요!</p>
                <p className="text-lg text-slate-600 leading-relaxed font-medium">
                    본 계산기는 근로복지공단 규정에 따른 <span className="text-slate-900 font-bold underline decoration-amber-200 decoration-4 underline-offset-4">근사치 제공 목적</span>입니다. 실제 지급액은 심사 과정 및 각종 수당 적용 여부에 따라 달라질 수 있습니다.
                </p>
            </div>
          </CardContent>
        </Card>

        {/* 3. Input Section Premium Card */}
        <Card className="border border-slate-200/60 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] rounded-[2rem] overflow-hidden bg-white">
          <CardHeader className="pb-3 pt-10 px-10">
            <CardTitle className="text-2xl font-black flex items-center gap-3 text-slate-900">
              <span className="w-1.5 h-7 bg-emerald-500 rounded-full" />
              급여 정보 입력
            </CardTitle>
            <p className="text-slate-500 font-medium ml-4.5 mt-1">다치기 전 3개월 동안 받은 세전 급여를 입력하세요</p>
          </CardHeader>
          <CardContent className="px-8 pb-10 space-y-8">
            <div className="grid md:grid-cols-3 gap-6 pt-4">
              {[
                  { id: 'm1', label: '첫 번째 달', value: month1, setter: setMonth1 },
                  { id: 'm2', label: '두 번째 달', value: month2, setter: setMonth2 },
                  { id: 'm3', label: '세 번째 달', value: month3, setter: setMonth3 }
              ].map((m) => (
                <div key={m.id} className="space-y-3">
                    <label className="text-sm font-black text-slate-700 ml-1">{m.label}</label>
                    <div className="relative group">
                        <Input
                        type="text"
                        placeholder="0"
                        value={m.value}
                        onChange={(e) => handleInputChange(e.target.value, m.setter)}
                        className="h-14 text-xl font-black text-slate-900 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-2xl bg-slate-50/30 pr-12 transition-all shadow-sm"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-slate-400 group-focus-within:text-emerald-600">원</span>
                    </div>
                </div>
              ))}
            </div>
            
            {/* Expanded Age Check Section */}
            <div className="bg-slate-50/50 rounded-[1.5rem] p-8 space-y-5 border border-slate-100">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-base font-black text-slate-800 tracking-tight">만 61세 이상이신가요?</p>
                        <p className="text-sm text-slate-500 font-medium">만 61세가 넘으시면 고령자 감액이 적용되어 급여가 단계적으로 감액됩니다.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={isOver61} 
                            onChange={(e) => setIsOver61(e.target.checked)}
                        />
                        <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                </div>
                
                {isOver61 && (
                    <div className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-emerald-100 animate-in fade-in zoom-in-95 duration-200 shadow-sm">
                        <span className="text-sm font-black text-slate-600">실제 만나이 :</span>
                        <div className="relative">
                            <Input 
                                type="number" 
                                placeholder="나이" 
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                className="w-32 h-12 text-lg font-black text-center pr-8 border-emerald-200 bg-emerald-50/30 rounded-xl"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 font-black text-slate-400">세</span>
                        </div>
                        <p className="text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg">※ 65세 이상 동일 비율 적용</p>
                    </div>
                )}
            </div>

            <Button 
              onClick={handleCalculate} 
              className="w-full h-18 text-xl font-black bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-xl shadow-emerald-900/10 transition-all active:scale-[0.98] py-8"
            >
              산재 보상금 계산하기
            </Button>
          </CardContent>
        </Card>

        {/* 4. Results Section (Better emphasis) */}
        {averageWage > 0 && (
          <div className="space-y-6 pt-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="flex items-center gap-3 mb-2">
                <span className="w-1.5 h-7 bg-teal-500 rounded-full" />
                <h2 className="text-2xl font-black text-slate-900">예상 산재 보상금 리포트</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Average Wage Card */}
              <Card 
                className="group cursor-pointer border border-emerald-100 bg-emerald-50/30 rounded-[2rem] shadow-[0_8px_30px_rgb(16,185,129,0.04)] overflow-hidden relative transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-900/10 hover:border-emerald-500/40 hover:bg-white"
                onClick={() => setSelectedDetail('average')}
              >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-30 group-hover:opacity-100 transition-opacity" />
                <CardContent className="pt-12 pb-10 px-6 space-y-6 text-center">
                    <div>
                        <p className="text-[11px] font-black text-emerald-700/60 tracking-wider uppercase mb-2">나의 1일 평균임금</p>
                        <p className="text-3xl font-black text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors">
                            {formatCurrency(averageWage)}
                        </p>
                    </div>
                    <div className="inline-flex items-center text-xs font-black text-emerald-600 bg-white border border-emerald-100 px-5 py-2.5 rounded-full group-hover:bg-emerald-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-emerald-200 transition-all duration-300">
                        상세 계산법 보기
                    </div>
                </CardContent>
              </Card>

              {/* Sick Leave Card */}
              <Card 
                className="group cursor-pointer border border-blue-100 bg-blue-50/30 rounded-[2rem] shadow-[0_8px_30px_rgb(59,130,246,0.04)] overflow-hidden relative transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-900/10 hover:border-blue-500/40 hover:bg-white"
                onClick={() => setSelectedDetail('sickleave')}
              >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-30 group-hover:opacity-100 transition-opacity" />
                <CardContent className="pt-12 pb-10 px-6 space-y-6 text-center">
                    <div>
                        <p className="text-[11px] font-black text-blue-700/60 tracking-wider uppercase mb-2">한 달 전액 휴업급여</p>
                        <p className="text-3xl font-black text-slate-900 tracking-tight group-hover:text-blue-700 transition-colors">
                            {formatCurrency(sickLeaveResult?.totalAmount || 0)}
                        </p>
                    </div>
                    <div className="inline-flex items-center text-xs font-black text-blue-600 bg-white border border-blue-100 px-5 py-2.5 rounded-full group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-200 transition-all duration-300">
                        계산 조건 수정
                    </div>
                </CardContent>
              </Card>

              {/* Disability Card */}
              <Card 
                className="group cursor-pointer border border-purple-100 bg-purple-50/30 rounded-[2rem] shadow-[0_8px_30px_rgb(168,85,247,0.04)] overflow-hidden relative transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-900/10 hover:border-purple-500/40 hover:bg-white"
                onClick={() => setSelectedDetail('disability')}
              >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-400 to-fuchsia-400 opacity-30 group-hover:opacity-100 transition-opacity" />
                <CardContent className="pt-12 pb-10 px-6 space-y-6 text-center">
                    <div>
                        <p className="text-[11px] font-black text-purple-700/60 tracking-wider uppercase mb-2">장해 시 예상 보상</p>
                        <div className="space-y-0.5">
                            <p className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-purple-700 transition-colors">
                                {formatCurrency(disabilityMin?.lumpSum || 0)} ~
                            </p>
                            <p className="text-[11px] font-bold text-slate-400">
                                14급 ~ 1급(연금 포함)
                            </p>
                        </div>
                    </div>
                    <div className="inline-flex items-center text-xs font-black text-purple-600 bg-white border border-purple-100 px-5 py-2.5 rounded-full group-hover:bg-purple-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-purple-200 transition-all duration-300">
                        등급별 상세 보기
                    </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons with Gradient Theme */}
            <div className="flex flex-col md:flex-row justify-center gap-5 pt-10 pb-10">
                <Button
                    onClick={handleNavigateToReport}
                    className="h-18 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg px-12 rounded-[1.5rem] shadow-xl shadow-emerald-900/10 transition-all flex-1 md:max-w-md group py-8"
                >
                    <TrendingUp className="w-6 h-6 mr-3 transition-transform group-hover:scale-110" />
                    전체 보상 가이드 리포트 확인하기
                </Button>

                <Button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    variant="outline"
                    className="h-18 bg-white border-2 border-slate-200 hover:border-emerald-500 hover:text-emerald-700 font-black text-lg px-10 rounded-[1.5rem] transition-all flex-1 md:max-w-xs group py-8"
                >
                    {isSaving ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                        <>
                            <Save className="w-6 h-6 mr-3 transition-transform group-hover:scale-110 text-slate-400 group-hover:text-emerald-600" />
                            결과 저장하기
                        </>
                    )}
                </Button>
            </div>
          </div>
        )}

        {/* 5. Detail Dialogs with Redesigned Elements */}
        {/* Average Wage Detail */}
        <Dialog open={selectedDetail === 'average'} onOpenChange={() => setSelectedDetail(null)}>
          <DialogContent className="max-w-xl rounded-3xl border-none p-0 overflow-hidden shadow-2xl">
            <div className="h-24 bg-green-600 flex items-center px-8">
                <DialogTitle className="text-2xl font-black text-white">평균임금 계산 상세</DialogTitle>
            </div>
            <div className="p-8 space-y-6">
              <div className="p-6 bg-green-50 rounded-2xl border border-green-100">
                <p className="text-xs font-black text-green-600 uppercase mb-2">계산된 1일 평균임금</p>
                <p className="text-4xl font-black text-green-900 tracking-tight">{formatCurrency(averageWage)}</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-slate-300 rounded-full" />
                    <p className="font-black text-slate-800">계산 근거</p>
                </div>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-slate-600 font-medium leading-relaxed">
                  재해 발생일 이전 3개월 임금 총액 <span className="text-slate-900 font-black">{formatCurrency(
                    (parseFloat(month1.replace(/,/g, "")) || 0) +
                    (parseFloat(month2.replace(/,/g, "")) || 0) +
                    (parseFloat(month3.replace(/,/g, "")) || 0)
                  )}</span>을 90일로 나눈 금액입니다.
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <p className="text-sm text-amber-800 font-medium">
                  ※ 상여금, 연차수당 등 기타 수당 포함 여부에 따라 실제 공단 심사 금액과 다를 수 있습니다.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Sick Leave Detail */}
        <Dialog open={selectedDetail === 'sickleave'} onOpenChange={() => setSelectedDetail(null)}>
          <DialogContent className="max-w-xl rounded-3xl border-none p-0 overflow-hidden shadow-2xl">
            <div className="h-24 bg-blue-600 flex items-center px-8">
                <DialogTitle className="text-2xl font-black text-white">휴업급여 상세 및 조건 수정</DialogTitle>
            </div>
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                <p className="text-xs font-black text-blue-600 uppercase mb-2 tracking-wider">예상되는 총 휴업급여액</p>
                <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-black text-blue-900 tracking-tight">
                        {formatCurrency(sickLeaveResult?.totalAmount || 0)}
                    </p>
                    <span className="text-lg font-bold text-blue-600">/ {sickLeaveDays}일 기준</span>
                </div>
              </div>

              <div className="space-y-3 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                <p className="text-sm font-black text-slate-700">휴업 일수 조정</p>
                <div className="relative group">
                    <Input
                      type="text"
                      value={sickLeaveDays}
                      onChange={(e) => setSickLeaveDays(e.target.value.replace(/[^0-9]/g, ""))}
                      className="h-12 text-lg font-black border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                      placeholder="30"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-slate-400 group-focus-within:text-blue-600">일</span>
                </div>
              </div>

              {sickLeaveResult?.isSpecialCase && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                  <p className="text-base font-black text-amber-900 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5" />
                    저소득 특례 제도 적용됨
                  </p>
                  <p className="text-sm text-amber-700 mt-1 font-medium">
                    평균임금이 낮아 산재법상 최저보장 기준에 따라 소득의 90%가 적용되었습니다.
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-800">
                  <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
                  <p className="font-black">상세 계산식</p>
                </div>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-sm text-slate-600 font-bold whitespace-pre-line leading-relaxed">
                  {sickLeaveResult?.explanation}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Disability Detail - Enhanced Table View */}
        <Dialog open={selectedDetail === 'disability'} onOpenChange={() => setSelectedDetail(null)}>
          <DialogContent className="max-w-4xl rounded-3xl border-none p-0 overflow-hidden shadow-2xl">
            <div className="h-24 bg-purple-600 flex items-center px-8">
                <DialogTitle className="text-2xl font-black text-white">장해급여 등급별 리스트</DialogTitle>
            </div>
            {/*
      ### 3. 접근성 및 안정성 강화
- 상세 보기 다이얼로그에서 발생하던 `DialogTitle` 누락 에러를 해결하여 웹 접근성 표준을 준수하고 런타임 안정성을 확보했습니다.
- 각 다이얼로그의 헤더 텍스트를 `DialogTitle`로 변환하여 스크린 리더 사용성을 개선했습니다.

### 4. 리포트 UI 버그 수정
- 산재 보상금 리포트 화면의 휴업급여 카드에서 호버 시 나타나던 화살표 아이콘이 '상세보기' 배지와 겹치던 문제를 해결했습니다. 
- 불필요한 중복 아이콘을 제거하여 깔끔하고 세련된 카드 레이아웃을 완성했습니다.
            */}
            <div className="p-8 max-h-[70vh] overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 14 }, (_, i) => {
                const grade = i + 1;
                const result = calculateDisability(averageWage, grade);
                return (
                  <div key={grade} className="flex flex-col p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-purple-300 transition-all hover:bg-purple-50/30 group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-purple-600 text-white font-black text-lg group-hover:scale-105 transition-transform">{grade}</span>
                        <div>
                            <p className="text-base font-black text-slate-900 tracking-tight">장해 {grade}급</p>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                                result.paymentType === 'pension' ? 'bg-blue-100 text-blue-700' :
                                result.paymentType === 'lump' ? 'bg-emerald-100 text-emerald-700' :
                                'bg-purple-100 text-purple-700'
                                }`}>
                                {result.paymentType === 'pension' ? '연금 전용' :
                                result.paymentType === 'lump' ? '일시금 전용' : '선택 가능'}
                            </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-auto space-y-2">
                        {result.paymentType === 'choice' ? (
                        <div className="space-y-1">
                            <div className="flex justify-between items-center text-sm font-bold p-2 bg-white rounded-lg border border-slate-100">
                                <span className="text-slate-400">일시금</span>
                                <span className="text-emerald-600 font-black">{formatCurrency(result.lumpSum!)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-bold p-2 bg-white rounded-lg border border-slate-100">
                                <span className="text-slate-400">연금(년)</span>
                                <span className="text-blue-600 font-black">{formatCurrency(result.pension!)}</span>
                            </div>
                        </div>
                        ) : (
                        <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-100 group-hover:border-purple-200">
                            <span className="text-sm font-black text-slate-400">{result.paymentType === 'pension' ? '예상 연금총액' : '예상 일시금'}</span>
                            <span className="text-lg font-black text-purple-700">{formatCurrency(result.lumpSum || result.pension!)}</span>
                        </div>
                        )}
                    </div>
                  </div>
                );
              })}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Footer Info */}
        <div className="py-12 px-6">
            <div className="max-w-2xl mx-auto bg-slate-100 rounded-3xl p-8 text-center space-y-4 border border-slate-200/50">
                <ShieldAlert className="w-10 h-10 text-slate-400 mx-auto" />
                <div className="space-y-1">
                    <p className="text-lg font-black text-slate-700">추가 도움이 필요하신가요?</p>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                        정확한 산재 급여액 산정 및 보상 권리 찾기는 <br className="hidden sm:block" />
                        전문 노무사 또는 근로복지공단(☎ 1588-0075) 전문가의 상담을 권장합니다.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
