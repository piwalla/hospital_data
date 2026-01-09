"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { calculateSickLeave, formatCurrency } from "@/lib/calculator/benefit-calculations";
import { 
  HeartPulse, 
  Edit2
} from "lucide-react";

interface SickLeaveCalculatorProps {
  averageWage?: number;
}

export default function SickLeaveCalculator({ averageWage: propAverageWage = 0 }: SickLeaveCalculatorProps) {
  const [days, setDays] = useState("30"); // 기본값 30일
  const [age, setAge] = useState("");
  const [result, setResult] = useState<ReturnType<typeof calculateSickLeave> | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // 부모로부터 평균임금이 전달되면 자동으로 설정하고 계산
  useEffect(() => {
    if (propAverageWage > 0) {
      // 자동 계산
      const daysNum = parseInt(days) || 30;
      const ageNum = age ? parseInt(age) : undefined;
      const calculated = calculateSickLeave(propAverageWage, daysNum, ageNum);
      setResult(calculated);
      setIsEditing(false); // 새로 계산되면 편집 모드 해제
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propAverageWage]);

  // 일수나 나이가 변경되면 재계산
  useEffect(() => {
    if (propAverageWage > 0) {
      const daysNum = parseInt(days) || 30;
      const ageNum = age ? parseInt(age) : undefined;
      const calculated = calculateSickLeave(propAverageWage, daysNum, ageNum);
      setResult(calculated);
    }
  }, [days, age, propAverageWage]);

  const handleInputChange = (value: string, setter: (v: string) => void) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    setter(numericValue);
  };

  const getAgeText = () => {
    if (!age) return "61세 이하";
    const ageNum = parseInt(age);
    if (ageNum < 61) return "61세 이하";
    return `${ageNum}세`;
  };

  return (
    <div className="space-y-6">
      {!isEditing && result ? (
        // 간단한 결과 표시
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <HeartPulse className="w-5 h-5" />
                휴업급여 계산
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="bg-white"
              >
                <Edit2 className="w-4 h-4 mr-1" />
                수정하기
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-4xl font-bold text-blue-900">
                {formatCurrency(result.dailyAmount)}
                <span className="text-lg font-normal text-blue-700 ml-2">/일</span>
              </p>
              <p className="text-2xl font-semibold text-blue-800">
                총 {formatCurrency(result.totalAmount)}
                <span className="text-sm font-normal text-blue-600 ml-2">
                  ({days}일 기준)
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-blue-700">
              <span className="px-3 py-1 bg-blue-100 rounded-full">
                {getAgeText()}, {days}일 기준 결과입니다
              </span>
              {result.isSpecialCase && (
                <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full">
                  저소득 특례 적용
                </span>
              )}
              {result.isAgeReduction && (
                <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full">
                  고령자 감액 적용
                </span>
              )}
            </div>

            <p className="text-sm text-blue-600">
              수정이 필요하면 <strong>수정하기</strong> 버튼을 눌러주세요
            </p>
          </CardContent>
        </Card>
      ) : (
        // 상세 입력 폼
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-blue-600" />
              휴업급여 계산기
            </CardTitle>
            <CardDescription>
              치료로 인해 일하지 못한 기간의 급여를 계산합니다
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="days">휴업일수</Label>
                <Input
                  id="days"
                  type="text"
                  placeholder="예: 30"
                  value={days}
                  onChange={(e) => handleInputChange(e.target.value, setDays)}
                />
                <p className="text-xs text-slate-500">
                  일하지 못한 일수 (주말/공휴일 포함)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">나이 (선택)</Label>
                <Input
                  id="age"
                  type="text"
                  placeholder="예: 45"
                  value={age}
                  onChange={(e) => handleInputChange(e.target.value, setAge)}
                />
                <p className="text-xs text-slate-500">
                  61세 이상인 경우 고령자 감액이 적용됩니다
                </p>
              </div>
            </div>

            <Button onClick={() => setIsEditing(false)} className="w-full">
              계산 완료
            </Button>
          </CardContent>
        </Card>
      )}

      {/* 계산 근거 아코디언 - 항상 표시 */}
      {result && (
        <Accordion type="single" collapsible className="bg-white rounded-lg border">
          <AccordionItem value="explanation">
            <AccordionTrigger className="px-4">
              어떻게 계산되었나요?
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <p className="text-sm text-slate-600 whitespace-pre-line">
                {result.explanation}
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-xs font-medium text-slate-700">계산 규칙:</p>
                <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                  <li>기본: 평균임금의 70%</li>
                  <li>저소득 특례: 평균임금의 90% (최저보상기준 80% 이하 시)</li>
                  <li>최저임금 보장: 최소 80,240원/일</li>
                  <li>고령자 감액: 61세 이상 연령별 차등 적용</li>
                </ul>
              </div>
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <p className="text-xs text-amber-800">
                  ※ 이 계산은 근사치이며, 실제 지급액은 근로복지공단의 심사에 따라 달라질 수 있습니다.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
}
