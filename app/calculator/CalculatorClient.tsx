"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle, TrendingUp, Calendar, Scale, Edit2, Save } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">산재 급여 계산기</h1>
          <p className="text-sm md:text-base text-slate-600">간단하게 예상 급여를 확인하세요</p>
        </div>

        {/* Legal Disclaimer */}
        <div className="flex items-start gap-3 p-3 md:p-4 bg-amber-50 border border-amber-200 rounded-lg max-w-3xl mx-auto">
          <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs md:text-sm text-amber-800">
            본 계산기는 <strong>근사치 제공 목적</strong>이며, 실제 지급액은 근로복지공단의 심사에 따라 달라질 수 있습니다.
          </p>
        </div>

        {/* Input Section */}
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-xl md:text-2xl">
              다치기 전 받은 3달치 월급을 입력하세요
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-3 md:gap-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="첫 번째 달"
                  value={month1}
                  onChange={(e) => handleInputChange(e.target.value, setMonth1)}
                  className="text-base md:text-lg text-center pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm md:text-base">원</span>
              </div>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="두 번째 달"
                  value={month2}
                  onChange={(e) => handleInputChange(e.target.value, setMonth2)}
                  className="text-base md:text-lg text-center pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm md:text-base">원</span>
              </div>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="세 번째 달"
                  value={month3}
                  onChange={(e) => handleInputChange(e.target.value, setMonth3)}
                  className="text-base md:text-lg text-center pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm md:text-base">원</span>
              </div>
            </div>
            
            {/* Age Check for Over 61 */}
            <div className="flex flex-col items-center gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={isOver61} 
                        onChange={(e) => setIsOver61(e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-base text-slate-700 font-medium">만 61세 이상이신가요?</span>
                </label>
                
                {isOver61 && (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                        <span className="text-sm text-slate-600">만</span>
                        <Input 
                            type="number" 
                            placeholder="나이 입력" 
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            className="w-24 text-center"
                        />
                        <span className="text-sm text-slate-600">세</span>
                    </div>
                )}
            </div>

            <Button onClick={handleCalculate} className="w-full text-base md:text-lg py-5 md:py-6 mt-4" size="lg">
              계산하기
            </Button>
          </CardContent>
        </Card>

        {/* Results Summary */}
        {averageWage > 0 && (
          <div className="space-y-4 md:space-y-6 max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-900">계산 결과</h2>
            
            <div className="grid md:grid-cols-3 gap-3 md:gap-4">
              {/* Average Wage Card */}
              <Card 
                className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-green-200 bg-green-50"
                onClick={() => setSelectedDetail('average')}
              >
                <CardContent className="pt-4 md:pt-6 space-y-2 md:space-y-3">
                  <div className="flex items-center justify-between">
                    <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
                    <Edit2 className="w-3 h-3 md:w-4 md:h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-green-700 mb-1">당신의 평균임금은</p>
                    <p className="text-2xl md:text-3xl font-bold text-green-900">
                      {formatCurrency(averageWage)}
                    </p>
                    <p className="text-xs text-green-600 mt-1">/일</p>
                  </div>
                  <div className="h-2 bg-green-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-600 w-full"></div>
                  </div>
                </CardContent>
              </Card>

              {/* Sick Leave Card */}
              <Card 
                className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-blue-200 bg-blue-50"
                onClick={() => setSelectedDetail('sickleave')}
              >
                <CardContent className="pt-4 md:pt-6 space-y-2 md:space-y-3">
                  <div className="flex items-center justify-between">
                    <Calendar className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                    <Edit2 className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-blue-700 mb-1">한 달(30일) 휴업급여는</p>
                    <p className="text-2xl md:text-3xl font-bold text-blue-900">
                      {formatCurrency(sickLeaveResult?.totalAmount || 0)}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      1일 {formatCurrency(sickLeaveResult?.dailyAmount || 0)}
                    </p>
                  </div>
                  <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600" 
                      style={{ width: `${Math.min((sickLeaveResult?.appliedRate || 0.7) * 100, 100)}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>

              {/* Disability Card */}
              <Card 
                className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-purple-200 bg-purple-50"
                onClick={() => setSelectedDetail('disability')}
              >
                <CardContent className="pt-4 md:pt-6 space-y-2 md:space-y-3">
                  <div className="flex items-center justify-between">
                    <Scale className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
                    <Edit2 className="w-3 h-3 md:w-4 md:h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-purple-700 mb-1">장해급여는</p>
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs md:text-sm text-purple-600">최소</span>
                        <p className="text-xl md:text-2xl font-bold text-purple-900">
                          {formatCurrency(disabilityMin?.lumpSum || 0)}
                        </p>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs md:text-sm text-purple-600">최대</span>
                        <p className="text-xl md:text-2xl font-bold text-purple-900">
                          {formatCurrency(disabilityMax?.pension || 0)}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-purple-600 mt-2">14급(경증) ~ 1급(최중증)</p>
                  </div>
                  <div className="h-2 bg-purple-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-400 to-purple-600 w-full"></div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <p className="text-center text-xs md:text-sm text-slate-500">
              각 카드를 클릭하면 자세한 내용을 확인할 수 있습니다
            </p>

            {/* Navigation Buttons Container */}
            <div className="flex flex-col md:flex-row justify-center gap-4 pt-4">
                {/* 1. Go to Detailed Report (New) */}
                <Button
                    onClick={handleNavigateToReport}
                    className="bg-green-700 hover:bg-green-800 text-white gap-2 px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all flex-1 md:max-w-xs"
                >
                    <TrendingUp className="w-5 h-5" />
                    <span>내 예상 보상금 보고서 보기</span>
                </Button>

                {/* 2. Save Button */}
                <Button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    variant="outline"
                    className="bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700 gap-2 px-8 py-6 text-lg rounded-xl shadow-sm hover:shadow-md transition-all flex-1 md:max-w-xs"
                >
                    {isSaving ? (
                    "저장 중..." 
                    ) : (
                    <>
                        <Save className="w-5 h-5" />
                        계산 결과 저장하기
                    </>
                    )}
                </Button>
            </div>
          </div>
        )}

        {/* Detail Dialogs */}
        {/* Average Wage Detail */}
        <Dialog open={selectedDetail === 'average'} onOpenChange={() => setSelectedDetail(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">평균임금 상세</DialogTitle>
              <DialogDescription>
                재해 발생일 이전 3개월간의 임금을 기준으로 계산됩니다
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700 mb-2">1일 평균임금</p>
                <p className="text-4xl font-bold text-green-900">{formatCurrency(averageWage)}</p>
              </div>
              <div className="space-y-2">
                <p className="font-medium">계산 방법:</p>
                <p className="text-sm text-slate-600">
                  최근 3개월 임금 총액 {formatCurrency(
                    (parseFloat(month1.replace(/,/g, "")) || 0) +
                    (parseFloat(month2.replace(/,/g, "")) || 0) +
                    (parseFloat(month3.replace(/,/g, "")) || 0)
                  )} ÷ 90일 = {formatCurrency(averageWage)}/일
                </p>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                <p className="text-xs text-amber-800">
                  ※ 실제 평균임금은 근로복지공단의 심사에 따라 달라질 수 있습니다.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Sick Leave Detail */}
        <Dialog open={selectedDetail === 'sickleave'} onOpenChange={() => setSelectedDetail(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">휴업급여 상세</DialogTitle>
              <DialogDescription>
                일하지 못한 기간에 대한 급여를 계산합니다
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700 mb-2">총 휴업급여</p>
                <p className="text-4xl font-bold text-blue-900">
                  {formatCurrency(sickLeaveResult?.totalAmount || 0)}
                </p>
                <p className="text-sm text-blue-600 mt-2">
                  1일 {formatCurrency(sickLeaveResult?.dailyAmount || 0)} × {sickLeaveDays}일
                </p>
              </div>

              {/* Edit Form */}
              <div className="space-y-3 p-4 bg-slate-50 rounded-lg">
                <p className="font-medium">조건 수정</p>
                <div className="grid gap-3">
                  <div>
                    <label className="text-sm text-slate-600">휴업일수</label>
                    <Input
                      type="text"
                      value={sickLeaveDays}
                      onChange={(e) => setSickLeaveDays(e.target.value.replace(/[^0-9]/g, ""))}
                      placeholder="30"
                    />
                  </div>
                  {/* 나이 수정은 메인 화면에서 하도록 유도하거나, 여기서도 싱크 맞춰야 함. 일단 단순화 */}
                </div>
              </div>

              {sickLeaveResult?.isSpecialCase && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <p className="text-sm font-medium text-amber-900">저소득 특례 적용</p>
                  <p className="text-xs text-amber-700 mt-1">
                    평균임금이 낮아 90% 비율이 적용되었습니다
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <p className="font-medium">계산 방법:</p>
                <p className="text-sm text-slate-600 whitespace-pre-line">
                  {sickLeaveResult?.explanation}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Disability Detail */}
        <Dialog open={selectedDetail === 'disability'} onOpenChange={() => setSelectedDetail(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">장해급여 등급별 상세</DialogTitle>
              <DialogDescription>
                1급(최중증)부터 14급(경증)까지 모든 등급의 급여액입니다
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              {Array.from({ length: 14 }, (_, i) => {
                const grade = i + 1;
                const result = calculateDisability(averageWage, grade);
                return (
                  <div key={grade} className="p-3 border rounded-lg hover:bg-purple-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-purple-900 w-12">{grade}급</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          result.paymentType === 'pension' ? 'bg-blue-100 text-blue-800' :
                          result.paymentType === 'lump' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {result.paymentType === 'pension' ? '연금만' :
                           result.paymentType === 'lump' ? '일시금만' : '선택 가능'}
                        </span>
                      </div>
                      <div className="text-right">
                        {result.paymentType === 'choice' ? (
                          <div className="text-sm">
                            <p className="font-bold text-purple-900">
                              일시금 {formatCurrency(result.lumpSum!)}
                            </p>
                            <p className="text-purple-700">
                              연금 {formatCurrency(result.pension!)}
                            </p>
                          </div>
                        ) : (
                          <p className="font-bold text-purple-900">
                            {formatCurrency(result.lumpSum || result.pension!)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>

        {/* Contact Info */}
        <div className="text-center text-sm text-slate-500 max-w-3xl mx-auto">
          <p>정확한 급여액 확인은 근로복지공단 (☎ 1588-0075)으로 문의하세요</p>
        </div>
      </div>
    </div>
  );
}
