import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  const [isOpen, setIsOpen] = useState(false);
  
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
    <Card className={cn("border-white/40 bg-white/80 backdrop-blur-md shadow-premium rounded-[2.5rem] overflow-hidden transition-all hover:shadow-premium-hover relative", !wageInfo && "bg-slate-50/50 backdrop-blur-none border-dashed border-slate-200")}>
      <CardHeader className="pb-2 pt-6 px-6 sm:px-8">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold flex items-center gap-3 text-slate-800 tracking-tight">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-indigo-500" />
            </div>
            {currentMonth}월 휴업급여 예상액
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-6 sm:px-8 pb-8">
        {wageInfo ? (
          <div className="mt-4 flex flex-col space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between items-start gap-6 bg-gradient-to-br from-indigo-50/50 to-white/50 p-6 rounded-[2rem] border border-white/60 shadow-sm">
              <div className="space-y-1">
                <p className="text-xs text-indigo-500/80 mb-1 flex items-center gap-1.5 font-bold uppercase tracking-wider">
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
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto gap-2 border-indigo-100 bg-white/80 text-indigo-600 hover:text-indigo-700 hover:bg-white hover:border-indigo-200 transition-all font-bold rounded-2xl px-6 h-12 shadow-sm">
                      <Calculator className="w-4 h-4" /> 분석 리포트
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-[2.5rem] border-white/40 bg-white/95 backdrop-blur-xl p-0 overflow-hidden shadow-2xl">
                    <div className="bg-indigo-600 p-8 text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                      <DialogHeader>
                        <DialogTitle className="text-3xl font-black tracking-tight text-white mb-2">
                          급여 상세 분석
                        </DialogTitle>
                        <div className="text-indigo-100 font-medium">
                          평균임금 <span className="text-white font-bold">{formatCurrency(dailyWage)}/일</span> 기준 소견입니다.
                        </div>
                      </DialogHeader>
                    </div>

                    <div className="p-8 space-y-8">
                      {/* 휴업급여 상세 */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                          <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
                          휴업급여 상세
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                            <p className="text-xs font-bold text-slate-400 uppercase">1일 급여액</p>
                            <p className="text-xl font-black text-indigo-600 font-mono tracking-tight">{formatCurrency(dailyWage * 0.7)}</p>
                          </div>
                          <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100 space-y-1">
                            <p className="text-xs font-bold text-indigo-400 uppercase">30일 기준 월급</p>
                            <p className="text-xl font-black text-indigo-700 font-mono tracking-tight">{formatCurrency(dailyWage * 0.7 * 30)}</p>
                          </div>
                        </div>
                      </div>

                      {/* 장해급여 안내 */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                          <div className="w-1.5 h-6 bg-purple-500 rounded-full"></div>
                          장해급여 예상 (상위 3개 등급 예시)
                        </h3>
                        <div className="space-y-3">
                          {disabilityData.slice(0, 3).map((data) => (
                            <div key={data.grade} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
                              <div className="flex items-center gap-3">
                                <span className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-black text-sm">
                                  {data.grade}급
                                </span>
                                <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-none font-bold">
                                  {data.paymentType === 'pension' ? '연금 전용' : '선택 가능'}
                                </Badge>
                              </div>
                              <div className="text-right">
                                <p className="text-xs font-bold text-slate-400">예상 일시금</p>
                                <p className="text-base font-black text-slate-800">{data.lumpSum ? formatCurrency(data.lumpSum) : '-'}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="text-[11px] text-slate-400 text-center font-medium mt-4">
                          * 장해 등급은 치료 종결 후 공단의 전문 심의를 통해 최종 결정됩니다.
                        </p>
                      </div>

                      <div className="flex justify-center pt-4">
                        <Button 
                          onClick={() => setIsOpen(false)}
                          className="w-full h-12 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold transition-all shadow-lg"
                        >
                          확인 완료
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            <div className="flex items-center justify-between px-2">
               <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                 심사 결과에 따라 달라질 수 있음
               </span>
               <div className="flex items-center gap-1 text-indigo-500">
                  <span className="text-xs font-black">Re:work Care Calculator</span>
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
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-premium hover:shadow-premium-hover transition-all rounded-[1.2rem] px-8 h-12 font-black">
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
