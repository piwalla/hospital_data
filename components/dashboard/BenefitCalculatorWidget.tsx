"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, TrendingUp, Calendar, Scale, ExternalLink } from "lucide-react";
import { calculateAverageWage, calculateSickLeave, calculateDisability, formatCurrency } from "@/lib/calculator/benefit-calculations";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updateUserWageOnly } from "@/app/actions/user";

export default function BenefitCalculatorWidget() {
  const [month1, setMonth1] = useState("");
  const [month2, setMonth2] = useState("");
  const [month3, setMonth3] = useState("");
  const [averageWage, setAverageWage] = useState<number>(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const router = useRouter();

  const handleCalculate = async () => {
    const m1 = parseFloat(month1.replace(/,/g, "")) || 0;
    const m2 = parseFloat(month2.replace(/,/g, "")) || 0;
    const m3 = parseFloat(month3.replace(/,/g, "")) || 0;

    if (m1 === 0 && m2 === 0 && m3 === 0) {
      alert("최소 하나의 월급을 입력해주세요.");
      return;
    }

    setIsCalculating(true);
    try {
      const result = calculateAverageWage(m1, m2, m3);
      setAverageWage(result.dailyWage);

      // 자동 저장 (Silent Auto-save)
      await updateUserWageOnly({
        type: 'daily',
        amount: result.dailyWage
      });
      router.refresh(); // 대시보드 데이터 갱신
    } catch (error) {
      console.error("Failed to save wage info:", error);
      // 게스트 모드이거나 에러 발생 시에도 계산 결과는 보여줌
    } finally {
      setIsCalculating(false);
    }
  };

  const handleInputChange = (value: string, setter: (v: string) => void) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    const formatted = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    setter(formatted);
  };

  // 휴업급여 계산 (30일 기준)
  const sickLeaveResult = averageWage > 0 ? calculateSickLeave(averageWage, 30) : null;

  // 장해급여 최소/최대
  const disabilityMin = averageWage > 0 ? calculateDisability(averageWage, 14) : null;
  const disabilityMax = averageWage > 0 ? calculateDisability(averageWage, 1) : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-600" />
            급여 계산기
          </span>
          <Link href="/calculator" className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
            상세보기
            <ExternalLink className="w-4 h-4" />
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {averageWage === 0 ? (
          // Input Form
          <>
            <p className="text-sm text-slate-600">다치기 전 3달치 월급을 입력하세요</p>
            <div className="grid grid-cols-3 gap-2">
              <Input
                type="text"
                placeholder="1달"
                value={month1}
                onChange={(e) => handleInputChange(e.target.value, setMonth1)}
                className="text-sm"
              />
              <Input
                type="text"
                placeholder="2달"
                value={month2}
                onChange={(e) => handleInputChange(e.target.value, setMonth2)}
                className="text-sm"
              />
              <Input
                type="text"
                placeholder="3달"
                value={month3}
                onChange={(e) => handleInputChange(e.target.value, setMonth3)}
                className="text-sm"
              />
            </div>
            <Button onClick={handleCalculate} className="w-full" size="sm" disabled={isCalculating}>
              {isCalculating ? "계산 및 저장 중..." : "계산하기"}
            </Button>
          </>
        ) : (
          // Results Summary
          <div className="space-y-3">
            {/* Average Wage */}
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <p className="text-xs text-emerald-700">평균임금</p>
              </div>
              <p className="text-xl font-bold text-emerald-900">{formatCurrency(averageWage)}/일</p>
            </div>

            {/* Sick Leave */}
            <div className="p-3 bg-teal-50 rounded-lg border border-teal-200">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-teal-600" />
                <p className="text-xs text-teal-700">휴업급여 (30일)</p>
              </div>
              <p className="text-xl font-bold text-teal-900">
                {formatCurrency(sickLeaveResult?.totalAmount || 0)}
              </p>
            </div>

            {/* Disability */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2 mb-1">
                <Scale className="w-4 h-4 text-slate-500" />
                <p className="text-xs text-slate-600">장해급여 범위</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-800">
                  최소 <span className="font-bold">{formatCurrency(disabilityMin?.lumpSum || 0)}</span>
                </p>
                <p className="text-sm text-slate-800">
                  최대 <span className="font-bold">{formatCurrency(disabilityMax?.pension || 0)}</span>
                </p>
              </div>
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => setAverageWage(0)}
            >
              다시 계산하기
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
