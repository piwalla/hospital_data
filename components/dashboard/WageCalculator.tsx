'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Slider } from "@/components/ui/slider";
import { Calculator, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface WageInfo {
  type: 'daily' | 'monthly';
  amount: number;
}

interface WageCalculatorProps {
  initialWage?: WageInfo;
}

export default function WageCalculator({ initialWage }: WageCalculatorProps) {
  const [wageType, setWageType] = useState<'daily' | 'monthly'>(initialWage?.type || 'monthly');
  const [amount, setAmount] = useState<number>(initialWage?.amount || 0);
  const [days, setDays] = useState<number>(30); // Default to full month
  const [result, setResult] = useState<number>(0);

  const calculate = () => {
    let dailyAvg = 0;
    if (wageType === 'monthly') {
      dailyAvg = amount / 30; // Simply dividing by 30 for approximation
    } else {
      dailyAvg = amount;
    }
    
    // Industrial Accident Compensation Insurance Act: 70% of average wage
    const calculated = dailyAvg * 0.7 * days;
    setResult(Math.floor(calculated));
  };

  useEffect(() => {
    calculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, wageType, days]);

  return (
    <Card className="w-full bg-white shadow-sm border border-[var(--border-medium)]">
      <CardHeader className="pb-3 border-b border-[var(--border-light)] bg-slate-50/50">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-full">
                    <Calculator className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                    <CardTitle className="text-base font-bold text-slate-800">휴업급여 모의 계산기</CardTitle>
                    <CardDescription className="text-xs text-slate-500">내 월급의 70%를 미리 확인해보세요</CardDescription>
                </div>
            </div>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <Info className="w-4 h-4 text-slate-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="text-xs">평균임금의 70%를 요양기간 동안 지급합니다.</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        
        {/* Toggle Wage Type */}
        <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setWageType('monthly')}
            className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-all ${
              wageType === 'monthly' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            월급 기준
          </button>
          <button
            onClick={() => setWageType('daily')}
            className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-all ${
              wageType === 'daily' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            일당 기준
          </button>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="wage-amount" className="text-xs font-semibold text-slate-600">
            {wageType === 'monthly' ? '평균 세전 월급' : '평균 일당'} (원)
          </Label>
          <Input
            id="wage-amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="text-right text-sm font-medium"
            placeholder="0"
          />
        </div>

        {/* Days Slider */}
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <Label className="text-xs font-semibold text-slate-600">인정 요양 일수</Label>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{days}일</span>
            </div>
            <Slider
                value={[days]}
                min={1}
                max={31}
                step={1}
                onValueChange={(val) => setDays(val[0])}
                className="py-2"
            />
        </div>

        {/* Result Area */}
        <div className="mt-4 pt-4 border-t border-dashed border-slate-200">
            <p className="text-xs text-slate-500 text-center mb-1">이번 달 예상 수령액</p>
            <div className="flex items-center justify-center gap-1 text-slate-900">
                <span className="text-2xl font-black font-brand text-blue-600">
                    {result.toLocaleString()}
                </span>
                <span className="text-sm font-medium text-slate-600">원</span>
            </div>
             <p className="text-[10px] text-slate-400 text-center mt-2">
                ※ 실제 지급액은 근로복지공단 심사 결과에 따라 달라질 수 있습니다.
            </p>
        </div>

      </CardContent>
    </Card>
  );
}
