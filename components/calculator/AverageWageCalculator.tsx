"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { calculateAverageWage, formatCurrency } from "@/lib/calculator/benefit-calculations";
import { Calculator } from "lucide-react";

interface AverageWageCalculatorProps {
  onCalculate?: (wage: number) => void;
}

export default function AverageWageCalculator({ onCalculate }: AverageWageCalculatorProps) {
  const [month1, setMonth1] = useState("");
  const [month2, setMonth2] = useState("");
  const [month3, setMonth3] = useState("");
  const [result, setResult] = useState<ReturnType<typeof calculateAverageWage> | null>(null);

  const handleCalculate = () => {
    const m1 = parseFloat(month1.replace(/,/g, "")) || 0;
    const m2 = parseFloat(month2.replace(/,/g, "")) || 0;
    const m3 = parseFloat(month3.replace(/,/g, "")) || 0;

    if (m1 === 0 && m2 === 0 && m3 === 0) {
      alert("최소 하나의 월급을 입력해주세요.");
      return;
    }

    const calculated = calculateAverageWage(m1, m2, m3);
    setResult(calculated);
    
    // 부모 컴포넌트에 결과 전달
    if (onCalculate) {
      onCalculate(calculated.dailyWage);
    }
  };

  const handleInputChange = (value: string, setter: (v: string) => void) => {
    // 숫자만 입력 허용
    const numericValue = value.replace(/[^0-9]/g, "");
    // 천 단위 콤마 추가
    const formatted = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    setter(formatted);
  };

  const handleReset = () => {
    setMonth1("");
    setMonth2("");
    setMonth3("");
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-green-600" />
            평균임금 계산기
          </CardTitle>
          <CardDescription>
            재해 발생일 이전 3개월간의 월급을 입력하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="month1">첫 번째 달 월급</Label>
              <Input
                id="month1"
                type="text"
                placeholder="예: 3,000,000"
                value={month1}
                onChange={(e) => handleInputChange(e.target.value, setMonth1)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="month2">두 번째 달 월급</Label>
              <Input
                id="month2"
                type="text"
                placeholder="예: 3,000,000"
                value={month2}
                onChange={(e) => handleInputChange(e.target.value, setMonth2)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="month3">세 번째 달 월급</Label>
              <Input
                id="month3"
                type="text"
                placeholder="예: 3,000,000"
                value={month3}
                onChange={(e) => handleInputChange(e.target.value, setMonth3)}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleCalculate} className="flex-1">
              계산하기
            </Button>
            <Button onClick={handleReset} variant="outline">
              초기화
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-900">계산 결과</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-green-700">1일 평균임금</p>
              <p className="text-4xl font-bold text-green-900">
                {formatCurrency(result.dailyWage)}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-green-700">월 평균임금 (참고용)</p>
              <p className="text-2xl font-semibold text-green-800">
                {formatCurrency(result.monthlyWage)}
              </p>
            </div>

            <Accordion type="single" collapsible className="bg-white rounded-lg">
              <AccordionItem value="explanation">
                <AccordionTrigger className="px-4">
                  어떻게 계산되었나요?
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <p className="text-sm text-slate-600 whitespace-pre-line">
                    {result.explanation}
                  </p>
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                    <p className="text-xs text-amber-800">
                      ※ 이 계산은 근사치이며, 실제 평균임금은 근로복지공단의 심사에 따라 달라질 수 있습니다.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
