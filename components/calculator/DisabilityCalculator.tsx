"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { calculateDisability, formatCurrency } from "@/lib/calculator/benefit-calculations";
import { Scale, TrendingUp, TrendingDown } from "lucide-react";

interface DisabilityCalculatorProps {
  averageWage?: number;
}

export default function DisabilityCalculator({ averageWage: propAverageWage = 0 }: DisabilityCalculatorProps) {
  const [results, setResults] = useState<Array<ReturnType<typeof calculateDisability> & { grade: number }>>([]);

  // 부모로부터 평균임금이 전달되면 자동으로 모든 등급 계산
  useEffect(() => {
    if (propAverageWage > 0) {
      const allResults = Array.from({ length: 14 }, (_, i) => {
        const grade = i + 1;
        const result = calculateDisability(propAverageWage, grade);
        return { ...result, grade };
      });
      setResults(allResults);
    }
  }, [propAverageWage]);

  const getPaymentTypeLabel = (type: string) => {
    switch (type) {
      case 'pension': return '연금만';
      case 'lump': return '일시금만';
      case 'choice': return '선택 가능';
      default: return '';
    }
  };

  const getPaymentTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'pension': return 'bg-white border border-[#14532d]/20 text-[#14532d] shadow-sm';
      case 'lump': return 'bg-slate-100 text-slate-700';
      case 'choice': return 'bg-[#14532d]/10 text-[#14532d]';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      {propAverageWage > 0 ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#14532d]" />
                장해급여 등급별 비교
              </CardTitle>
              <CardDescription>
                1급(최중증)부터 14급(경증)까지 예상 급여액을 확인하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                {results.map((result) => (
                  <div
                    key={result.grade}
                    className="p-4 border rounded-lg hover:border-[#14532d]/40 hover:bg-[#14532d]/5 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg font-bold text-[#14532d]">
                            {result.grade}급
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getPaymentTypeBadgeColor(result.paymentType)}`}>
                            {getPaymentTypeLabel(result.paymentType)}
                          </span>
                          <span className="text-xs text-slate-500">
                            {result.days.toLocaleString()}일분
                          </span>
                        </div>

                        {result.paymentType === 'pension' && (
                          <div className="space-y-1">
                            <p className="text-2xl font-bold text-[#14532d]">
                              {formatCurrency(result.pension!)}
                            </p>
                            <p className="text-xs text-slate-600">연금 (매월 분할 지급)</p>
                          </div>
                        )}

                        {result.paymentType === 'lump' && (
                          <div className="space-y-1">
                            <p className="text-2xl font-bold text-[#14532d]">
                              {formatCurrency(result.lumpSum!)}
                            </p>
                            <p className="text-xs text-slate-600">일시금 (한 번에 지급)</p>
                          </div>
                        )}

                        {result.paymentType === 'choice' && (
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <p className="text-xs text-slate-600">일시금</p>
                              <p className="text-lg font-bold text-[#14532d]">
                                {formatCurrency(result.lumpSum!)}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-slate-600">연금</p>
                              <p className="text-lg font-bold text-[#14532d]">
                                {formatCurrency(result.pension!)}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {result.grade === 1 && (
                        <div className="flex items-center gap-1 text-red-600">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-xs font-medium">최중증</span>
                        </div>
                      )}
                      {result.grade === 14 && (
                        <div className="flex items-center gap-1 text-blue-600">
                          <TrendingDown className="w-4 h-4" />
                          <span className="text-xs font-medium">경증</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Accordion type="single" collapsible className="bg-slate-50 rounded-lg">
                <AccordionItem value="explanation">
                  <AccordionTrigger className="px-4">
                    장해급여 지급 방식 안내
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-3 text-sm text-slate-600">
                      <div>
                        <p className="font-medium text-slate-700 mb-1">연금 지급 (1~3급)</p>
                        <p>가장 중증 장해로, 매월 연금 형태로 지급됩니다. 장기적인 생활 보장을 위한 제도입니다.</p>
                      </div>
                      <div>
                        <p className="font-medium text-slate-700 mb-1">선택 가능 (4~7급)</p>
                        <p>일시금으로 한 번에 받거나, 연금으로 매월 받을 수 있습니다. 개인의 상황에 따라 선택하세요.</p>
                      </div>
                      <div>
                        <p className="font-medium text-slate-700 mb-1">일시금 지급 (8~14급)</p>
                        <p>경증 장해로, 일시금으로 한 번에 지급됩니다.</p>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                      <p className="text-xs text-amber-800">
                        ※ 이 계산은 근사치이며, 실제 지급액은 근로복지공단의 심사에 따라 달라질 수 있습니다.
                        장해등급 판정은 의사의 진단이 필요합니다.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#14532d]" />
              장해급여 계산기
            </CardTitle>
            <CardDescription>
              먼저 평균임금 계산기에서 평균임금을 계산해주세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Scale className="w-16 h-16 text-slate-300 mb-4" />
              <p className="text-slate-600 mb-2">
                평균임금이 계산되면 자동으로 모든 등급의 장해급여가 표시됩니다
              </p>
              <p className="text-sm text-slate-500">
                평균임금 탭으로 이동하여 먼저 계산해주세요
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
