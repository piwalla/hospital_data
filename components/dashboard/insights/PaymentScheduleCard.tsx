import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Calculator, ArrowRight } from "lucide-react";
import Link from "next/link";
import { AdminUser } from "@/lib/mock-admin-data";

import { calculateDisability, formatCurrency } from "@/lib/calculator/benefit-calculations";
import { cn } from "@/lib/utils";

interface PaymentScheduleCardProps {
  user: AdminUser;
}

export default function PaymentScheduleCard({ user }: PaymentScheduleCardProps) {
  const wageInfo = user.wageInfo;
  
  // 현재 날짜 기준 이번 달 정보
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  
  let estimatedAmount = 0;
  let dailyWage = 0;
  
  if (wageInfo) {
    if (wageInfo.type === 'daily') {
      dailyWage = wageInfo.amount;
    } else {
      dailyWage = wageInfo.amount / 30;
    }
    
    // 휴업급여 = 평균임금의 70%
    const dailyBenefit = dailyWage * 0.7;
    estimatedAmount = Math.floor(dailyBenefit * lastDayOfMonth);
  }

  // 장해급여 데이터 생성 (1~14급)
  const disabilityData = dailyWage > 0 
    ? Array.from({ length: 14 }, (_, i) => {
        const grade = i + 1;
        return { grade, ...calculateDisability(dailyWage, grade) };
      })
    : [];

  return (
    <Card className={cn("border-white/40 bg-white/80 backdrop-blur-md shadow-premium rounded-none border-x-0 sm:border sm:rounded-3xl overflow-hidden transition-all hover:shadow-premium-hover relative", !wageInfo && "bg-slate-50/50 backdrop-blur-none border-dashed border-slate-200")}>
      <CardHeader className="pb-2 pt-6 px-6 sm:px-8">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold flex items-center gap-3 text-slate-800 tracking-tight">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100/50">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            {currentMonth}월 휴업급여 예상액
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-6 sm:px-8 pb-8">
        {wageInfo ? (
          <div className="mt-4 flex flex-col space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between items-start gap-6 bg-gradient-to-br from-emerald-50/50 to-white/50 p-6 rounded-[2rem] border border-emerald-100/60 shadow-sm">
              <div className="space-y-1">
                <p className="text-xs text-emerald-600/90 mb-1 flex items-center gap-1.5 font-bold uppercase tracking-wider">
                  기준기간: {currentMonth}.1 ~ {currentMonth}.{lastDayOfMonth}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-slate-900 tracking-tighter">
                    {estimatedAmount.toLocaleString()}
                  </span>
                  <span className="text-xl font-bold text-slate-400">원</span>
                </div>
              </div>
              
              <div className="w-full sm:w-auto">
                <Link href="/compensation/guide">
                  <Button variant="outline" className="w-full sm:w-auto gap-2 border-emerald-100 bg-white/80 text-primary hover:text-emerald-800 hover:bg-emerald-50 hover:border-emerald-200 transition-all font-bold rounded-2xl px-6 h-12 shadow-sm">
                    <Calculator className="w-4 h-4" /> 상세 가이드 보기
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="flex items-center justify-between px-2">
               <span className="text-sm text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-slate-200" />
                 심사 결과에 따라 달라질 수 있음
               </span>
               <div className="flex items-center gap-1 text-emerald-600/80">
                  <span className="text-sm font-black">Re:work Care Calculator</span>
               </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 text-center py-10 bg-white/40 rounded-[2rem] border-2 border-dashed border-slate-200/60 backdrop-blur-sm px-6">
            <div className="w-16 h-16 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-4 border border-slate-50">
              <Calculator className="w-8 h-8 text-slate-300" />
            </div>
            <p className="font-extrabold text-slate-800 text-lg mb-2">
              급여 계산이 필요하신가요?
            </p>
            <p className="text-sm text-slate-500 mb-8 font-medium leading-relaxed">
              정보를 입력하면 이번 달 받을 <br/>휴업급여를 바로 분석해 드립니다.
            </p>
            <Link href="/calculator">
              <Button className="bg-primary hover:bg-emerald-900 text-white gap-2 shadow-premium hover:shadow-premium-hover transition-all rounded-[1.2rem] px-8 h-12 font-black">
                나의 예상 급여 계산하기
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
