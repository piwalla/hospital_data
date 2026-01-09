"use client";

import { useState, useEffect } from 'react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from "@/components/ui/slider";
import { Badge } from '@/components/ui/badge';
import { Calculator, AlertTriangle, Coins, RefreshCcw } from 'lucide-react';
import { AdminUser } from '@/lib/mock-admin-data';

// 2025 Compensation Table (Days per Grade)
const COMPENSATION_TABLE: Record<number, { pension: number; lumpSum: number }> = {
  1: { pension: 329, lumpSum: 1474 },
  2: { pension: 291, lumpSum: 1309 },
  3: { pension: 257, lumpSum: 1155 },
  4: { pension: 224, lumpSum: 1012 },
  5: { pension: 193, lumpSum: 869 },
  6: { pension: 164, lumpSum: 737 },
  7: { pension: 138, lumpSum: 616 },
  8: { pension: 0, lumpSum: 495 },
  9: { pension: 0, lumpSum: 385 },
  10: { pension: 0, lumpSum: 297 },
  11: { pension: 0, lumpSum: 220 },
  12: { pension: 0, lumpSum: 154 },
  13: { pension: 0, lumpSum: 99 },
  14: { pension: 0, lumpSum: 55 },
};

interface CompensationEstimatorProps {
  wageInfo?: AdminUser['wageInfo'];
  estimatedGrade?: number | null;
}

export default function CompensationEstimator({ wageInfo, estimatedGrade }: CompensationEstimatorProps) {
  const [grade, setGrade] = useState<number>(14);

  // Sync with prop if provided
  useEffect(() => {
    if (estimatedGrade) {
      setGrade(estimatedGrade);
    }
  }, [estimatedGrade]);

  const dailyWage = wageInfo?.type === 'monthly' ? (wageInfo.amount / 30) : (wageInfo?.amount || 100000); // Default 100k roughly
  const benefit = COMPENSATION_TABLE[grade];

  const pensionAmount = benefit.pension > 0 ? Math.floor(dailyWage * benefit.pension / 12) : 0; // Monthly pension
  const lumpSumAmount = Math.floor(dailyWage * benefit.lumpSum);

  const formatCurrency = (val: number) => new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(val);

  return (
    <Card className="border-slate-200 shadow-sm relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-50 rounded-bl-full -mr-8 -mt-8 pointer-events-none" />

      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <Calculator className="w-5 h-5 text-yellow-600" />
          장해 보상금 모의 계산
        </CardTitle>
        <CardDescription>
          평균임금과 장해 등급에 따른 예상 수령액입니다.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Grade Selector */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-700">장해 등급: <span className="text-lg font-bold text-blue-600">{grade}급</span></span>
            {estimatedGrade && estimatedGrade === grade && (
              <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                시뮬레이션 추천
              </Badge>
            )}
          </div>
          <Slider
            value={[grade]}
            max={14}
            min={1}
            step={1}
            // Invert slider visually? No, standard is min on left. But grades go 1 (high) to 14 (low).
            // Usually sliders go left(low val) -> right(high val).
            // Let's implement logic: Slider val 14 (right) is lowest grade. 
            // Wait, standard UI: 1 is usually left. 
            // Let's stick to number value. Left(1) -> Right(14).
            // Benefit: 14급(Low) -> 1급(High).
            // User might expect "More Severe" to be "Higher Benefit".
            // Let's keep it simple: numeric 1-14.
            onValueChange={(vals) => setGrade(vals[0])}
            className="py-4"
          />
          <div className="flex justify-between text-xs text-slate-400 px-1">
            <span>1급 (중증)</span>
            <span>14급 (경증)</span>
          </div>
        </div>

        {/* Result Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Lump Sum Card */}
          <div className={`p-4 rounded-xl border ${benefit.pension === 0 ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-100' : 'bg-slate-50 border-slate-200 opacity-80'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Coins className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-semibold text-slate-600">일시금 수령 시</span>
            </div>
            <div className="text-xl md:text-2xl font-bold text-slate-900">
              {formatCurrency(lumpSumAmount)}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              (평균임금 × {benefit.lumpSum}일분)
            </div>
            {benefit.pension > 0 && (
              <Badge variant="secondary" className="mt-2 text-[10px] bg-white text-slate-500 border-slate-200">
                선택 가능 (4급~7급)
              </Badge>
            )}
            {grade <= 3 && (
               <Badge variant="destructive" className="mt-2 text-[10px]">
                선택 불가 (연금 원칙)
              </Badge>
            )}
          </div>

          {/* Pension Card */}
          <div className={`p-4 rounded-xl border ${benefit.pension > 0 ? 'bg-green-50 border-green-200 ring-2 ring-green-100' : 'bg-slate-100 border-slate-200 opacity-50'}`}>
            <div className="flex items-center gap-2 mb-2">
              <RefreshCcw className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-semibold text-slate-600">연금 수령 시 (매월)</span>
            </div>
            {benefit.pension > 0 ? (
              <>
                <div className="text-xl md:text-2xl font-bold text-green-700">
                   {formatCurrency(pensionAmount)}
                   <span className="text-sm font-normal text-slate-500"> /월</span>
                </div>
                 <div className="text-xs text-slate-500 mt-1">
                  (연간 {benefit.pension}일분 ÷ 12)
                </div>
              </>
            ) : (
               <div className="text-sm text-slate-400 mt-2">
                 이 등급은 연금 대상이 아닙니다.
               </div>
            )}
          </div>
        </div>
        
        <div className="text-[11px] text-slate-400 flex items-start gap-1 bg-slate-50 p-2 rounded">
          <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
          <span>
            개인의 구체적인 평균임금 산정 방식에 따라 실제 수령액은 차이가 있을 수 있습니다. (2025년 기준)
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
