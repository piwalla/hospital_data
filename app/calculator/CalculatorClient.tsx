"use client";

import { Locale, calculatorTranslations } from "@/lib/i18n/config";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {  ChevronLeft,
  TrendingUp, 
  Save, 
  Loader2,
  ShieldAlert,
  AlertTriangle
} from 'lucide-react';
import { calculateAverageWage, calculateSickLeave, calculateDisability, formatCurrency } from "@/lib/calculator/benefit-calculations";
import { useRouter } from "next/navigation";
import { updateUserWageOnly } from "@/app/actions/user";

export default function CalculatorClient() {
  const [locale, setLocale] = useState<Locale>('ko');
  const [month1, setMonth1] = useState("");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('user_locale') as Locale;
      if (savedLocale) setLocale(savedLocale);

      const handleLocaleUpdate = () => {
        const updated = localStorage.getItem('user_locale') as Locale;
        if (updated) setLocale(updated);
      };

      window.addEventListener('storage', handleLocaleUpdate);
      window.addEventListener('localeChange', handleLocaleUpdate);

      return () => {
        window.removeEventListener('storage', handleLocaleUpdate);
        window.removeEventListener('localeChange', handleLocaleUpdate);
      };
    }
  }, []);
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

  const t = calculatorTranslations[locale];

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
      alert(t.alerts.inputRequired);
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
        alert(t.alerts.saveSuccess);
        // 저장 후 리포트로 이동 제안 or 그냥 알림
      } catch (error) {
        console.error(error);
        alert(t.alerts.saveFail);
      } finally {
        setIsSaving(false);
      }
  };

  // Derived calculations for display
  const sickLeaveResult = averageWage > 0 ? calculateSickLeave(averageWage, parseInt(sickLeaveDays) || 30, isOver61 ? parseInt(age) : undefined) : null;
  const disabilityMin = averageWage > 0 ? calculateDisability(averageWage, 14) : null;


  // Navigate to Compensation Guide Report
  const handleNavigateToReport = () => {
    if (averageWage <= 0) {
      alert(t.alerts.calculateFirst);
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
                <Link href="/dashboard" className="text-[10px] font-bold text-[#14532d] uppercase tracking-widest hover:text-[#14532d]/80 transition-colors">
                    Dashboard
                </Link>
                <span className="text-[10px] text-slate-300">/</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Calculator
                </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                {t.title}
            </h1>
          </div>
          <Link href="/dashboard" className="flex items-center text-slate-500 hover:text-[#14532d] transition-all bg-slate-50 hover:bg-[#14532d]/5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl group border border-slate-100 font-bold text-xs sm:text-sm">
            <ChevronLeft className="w-4 h-4 mr-1 sm:mr-1.5 group-hover:-translate-x-1 transition-transform" />
            <span>{t.buttons.backToDashboard}</span>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-20 space-y-6 sm:space-y-8">
        {/* 2. Integrated Disclaimer Card - Mobile Optimized */}
        <Card className="border border-slate-200/50 shadow-[0_20px_50px_rgba(0,0,0,0.06)] bg-white/95 backdrop-blur-md overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] group transition-all hover:shadow-2xl hover:translate-y-[-4px]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 animate-gradient-x" />
          <CardContent className="flex items-start gap-4 sm:gap-5 p-5 sm:p-10">
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-amber-50 rounded-[0.75rem] sm:rounded-[1.25rem] flex items-center justify-center flex-shrink-0 mt-0.5 border border-amber-100 shadow-sm">
                <ShieldAlert className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500" />
            </div>
            <div className="space-y-2 sm:space-y-3">
                <p className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">{t.alerts.disclaimerTitle}</p>
                <p className="text-sm sm:text-lg text-slate-600 leading-relaxed font-medium">
                    {t.alerts.disclaimerContent}
                </p>
            </div>
          </CardContent>
        </Card>

        {/* 3. Input Section Premium Card - Mobile Optimized */}
        <Card className="border border-slate-200/60 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden bg-white">
          <CardHeader className="pb-2 pt-6 px-6 sm:pt-10 sm:px-10">
            <CardTitle className="text-xl sm:text-2xl font-black flex items-center gap-3 text-slate-900">
              <span className="w-1.5 h-6 sm:h-7 bg-[#14532d] rounded-full" />
              {t.sections.wageInput.title}
            </CardTitle>
            <p className="text-sm sm:text-base text-slate-500 font-medium ml-4.5 mt-1">{t.sections.wageInput.desc}</p>
          </CardHeader>
          <CardContent className="px-6 pb-8 sm:px-8 sm:pb-10 space-y-6 sm:space-y-8">
            <div className="grid md:grid-cols-3 gap-4 sm:gap-6 pt-2 sm:pt-4">
              {[
                  { id: 'm1', label: t.sections.wageInput.labels.m1, value: month1, setter: setMonth1 },
                  { id: 'm2', label: t.sections.wageInput.labels.m2, value: month2, setter: setMonth2 },
                  { id: 'm3', label: t.sections.wageInput.labels.m3, value: month3, setter: setMonth3 }
              ].map((m) => (
                <div key={m.id} className="space-y-2 sm:space-y-3">
                    <label className="text-sm font-black text-slate-700 ml-1">{m.label}</label>
                    <div className="relative group">
                        <Input
                        type="text"
                        placeholder="0"
                        value={m.value}
                        onChange={(e) => handleInputChange(e.target.value, m.setter)}
                        className="h-12 sm:h-14 text-lg sm:text-xl font-black text-slate-900 border-slate-200 focus:border-[#14532d] focus:ring-[#14532d]/20 rounded-xl sm:rounded-2xl bg-slate-50/30 pr-12 transition-all shadow-sm"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-slate-400 group-focus-within:text-[#14532d]">{t.units.won}</span>
                    </div>
                </div>
              ))}
            </div>
            
            {/* Expanded Age Check Section - Mobile Optimized */}
            <div className="bg-slate-50/50 rounded-[1.25rem] sm:rounded-[1.5rem] p-5 sm:p-8 space-y-4 sm:space-y-5 border border-slate-100">
                <div className="flex items-center justify-between gap-4">
                    <div className="space-y-0.5 sm:space-y-1">
                        <p className="text-sm sm:text-base font-black text-slate-800 tracking-tight">{t.sections.ageCheck.title}</p>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">{t.sections.ageCheck.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={isOver61} 
                            onChange={(e) => setIsOver61(e.target.checked)}
                        />
                        <div className="w-12 h-6 sm:w-14 sm:h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 w-5 sm:after:h-6 sm:after:w-6 after:transition-all peer-checked:bg-[#14532d]"></div>
                    </label>
                </div>
                
                {isOver61 && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-[#14532d]/20 animate-in fade-in zoom-in-95 duration-200 shadow-sm">
                        <span className="text-sm font-black text-slate-600">{t.sections.ageCheck.realAge} :</span>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Input 
                                    type="number" 
                                    placeholder={t.sections.ageCheck.realAge}
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    className="w-24 sm:w-32 h-10 sm:h-12 text-base sm:text-lg font-black text-center pr-8 border-[#14532d]/30 bg-[#14532d]/5 rounded-lg sm:rounded-xl"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 font-black text-slate-400 text-sm">{t.units.age}</span>
                            </div>
                            <p className="text-[10px] sm:text-xs text-[#14532d] font-bold bg-[#14532d]/5 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg">{t.sections.ageCheck.note}</p>
                        </div>
                    </div>
                )}
            </div>

            <Button 
              onClick={handleCalculate} 
              className="w-full h-14 sm:h-18 text-lg sm:text-xl font-black bg-[#14532d] hover:bg-[#14532d]/90 text-white rounded-xl sm:rounded-2xl shadow-xl shadow-[#14532d]/10 transition-all active:scale-[0.98] py-4 sm:py-8"
            >
              {t.buttons.calculate}
            </Button>
          </CardContent>
        </Card>

        {/* 4. Results Section (Better emphasis) */}
        {averageWage > 0 && (
          <div className="space-y-6 pt-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="flex items-center gap-3 mb-2">
                <span className="w-1.5 h-7 bg-teal-500 rounded-full" />
                <h2 className="text-2xl font-black text-slate-900">{t.sections.result.title}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Average Wage Card */}
              <Card 
                className="group cursor-pointer border border-[#14532d]/10 bg-[#14532d]/5 rounded-[2rem] shadow-[0_8px_30px_rgb(20,83,45,0.04)] overflow-hidden relative transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#14532d]/10 hover:border-[#14532d]/40 hover:bg-white"
                onClick={() => setSelectedDetail('average')}
              >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#14532d] to-[#14532d]/60 opacity-30 group-hover:opacity-100 transition-opacity" />
                <CardContent className="pt-12 pb-10 px-6 space-y-6 text-center">
                    <div>
                        <p className="text-sm font-black text-[#14532d]/60 tracking-wider mb-2">{t.sections.result.averageWage.title}</p>
                        <p className="text-3xl font-black text-slate-900 tracking-tight group-hover:text-[#14532d] transition-colors">
                            {formatCurrency(averageWage)}
                        </p>
                    </div>
                    <div className="inline-flex items-center text-xs font-black text-[#14532d] bg-white border border-[#14532d]/10 px-5 py-2.5 rounded-full group-hover:bg-[#14532d] group-hover:text-white group-hover:shadow-lg group-hover:shadow-[#14532d]/20 transition-all duration-300">
                        {t.sections.result.averageWage.btn}
                    </div>
                </CardContent>
              </Card>

              {/* Sick Leave Card */}
              <Card 
                className="group cursor-pointer border border-[#14532d]/20 bg-[#14532d]/5 rounded-[2rem] shadow-[0_8px_30px_rgb(59,130,246,0.04)] overflow-hidden relative transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#14532d]/10 hover:border-[#14532d]/40 hover:bg-white"
                onClick={() => setSelectedDetail('sickleave')}
              >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#14532d]/50 to-[#14532d]/30 opacity-30 group-hover:opacity-100 transition-opacity" />
                <CardContent className="pt-12 pb-10 px-6 space-y-6 text-center">
                    <div>
                        <p className="text-sm font-black text-[#14532d]/60 tracking-wider mb-2">{t.sections.result.sickLeave.title}</p>
                        <p className="text-3xl font-black text-slate-900 tracking-tight group-hover:text-[#14532d] transition-colors">
                            {formatCurrency(sickLeaveResult?.totalAmount || 0)}
                        </p>
                    </div>
                    <div className="inline-flex items-center text-xs font-black text-[#14532d] bg-white border border-[#14532d]/20 px-5 py-2.5 rounded-full group-hover:bg-[#14532d] group-hover:text-white group-hover:shadow-lg group-hover:shadow-[#14532d]/20 transition-all duration-300">
                        {t.sections.result.sickLeave.btn}
                    </div>
                </CardContent>
              </Card>

              {/* Disability Card */}
              <Card 
                className="group cursor-pointer border border-[#14532d]/20 bg-[#14532d]/5 rounded-[2rem] shadow-[0_8px_30px_rgb(168,85,247,0.04)] overflow-hidden relative transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#14532d]/10 hover:border-[#14532d]/40 hover:bg-white"
                onClick={() => setSelectedDetail('disability')}
              >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#14532d]/50 to-[#14532d]/30 opacity-30 group-hover:opacity-100 transition-opacity" />
                <CardContent className="pt-12 pb-10 px-6 space-y-6 text-center">
                    <div>
                        <p className="text-sm font-black text-[#14532d]/60 tracking-wider mb-2">{t.sections.result.disability.title}</p>
                        <div className="space-y-0.5">
                            <p className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-[#14532d] transition-colors">
                                {formatCurrency(disabilityMin?.lumpSum || 0)} ~
                            </p>
                            <p className="text-[11px] font-bold text-slate-400">
                                {t.sections.result.disability.desc}
                            </p>
                        </div>
                    </div>
                    <div className="inline-flex items-center text-xs font-black text-[#14532d] bg-white border border-[#14532d]/20 px-5 py-2.5 rounded-full group-hover:bg-[#14532d] group-hover:text-white group-hover:shadow-lg group-hover:shadow-[#14532d]/20 transition-all duration-300">
                        {t.sections.result.disability.btn}
                    </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons with Gradient Theme */}
            <div className="flex flex-col md:flex-row justify-center gap-5 pt-10 pb-10">
                <Button
                    onClick={handleNavigateToReport}
                    className="h-18 bg-[#14532d] hover:bg-[#14532d]/90 text-white font-black text-lg px-12 rounded-[1.5rem] shadow-xl shadow-[#14532d]/10 transition-all flex-1 md:max-w-md group py-8"
                >
                    <TrendingUp className="w-6 h-6 mr-3 transition-transform group-hover:scale-110" />
                    {t.buttons.viewReport}
                </Button>

                <Button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    variant="outline"
                    className="h-18 bg-white border-2 border-slate-200 hover:border-[#14532d] hover:text-[#14532d] font-black text-lg px-10 rounded-[1.5rem] transition-all flex-1 md:max-w-xs group py-8"
                >
                    {isSaving ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                        <>
                            <Save className="w-6 h-6 mr-3 transition-transform group-hover:scale-110 text-slate-400 group-hover:text-[#14532d]" />
                            {t.buttons.save}
                        </>
                    )}
                </Button>
            </div>
          </div>
        )}

        {/* 5. Detail Dialogs with Redesigned Elements */}
        {/* Average Wage Detail */}
        <Dialog open={selectedDetail === 'average'} onOpenChange={() => setSelectedDetail(null)}>
          <DialogContent className="max-w-xl rounded-2xl sm:rounded-3xl border-none p-0 overflow-hidden shadow-2xl">
            <div className="h-20 sm:h-24 bg-[#14532d] flex items-center px-6 sm:px-8">
                <DialogTitle className="text-xl sm:text-2xl font-black text-white">{t.dialogs.averageWage.title}</DialogTitle>
            </div>
            <div className="p-6 sm:p-8 space-y-4 sm:space-y-6">
              <div className="p-5 sm:p-6 bg-[#14532d]/5 rounded-xl sm:rounded-2xl border border-[#14532d]/10">
                <p className="text-[10px] sm:text-xs font-black text-[#14532d] uppercase mb-1 sm:mb-2">{t.dialogs.averageWage.calculated}</p>
                <p className="text-3xl sm:text-4xl font-black text-[#14532d] tracking-tight">{formatCurrency(averageWage)}</p>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-5 sm:h-6 bg-slate-300 rounded-full" />
                    <p className="text-sm sm:text-base font-black text-slate-800">{t.dialogs.averageWage.basis}</p>
                </div>
                <div className="bg-slate-50 p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-100 text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                  {t.dialogs.averageWage.basisDesc} <span className="text-slate-900 font-black">{formatCurrency(
                    (parseFloat(month1.replace(/,/g, "")) || 0) +
                    (parseFloat(month2.replace(/,/g, "")) || 0) +
                    (parseFloat(month3.replace(/,/g, "")) || 0)
                  )}</span>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-amber-800 font-medium whitespace-pre-line">
                  {t.dialogs.averageWage.note}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Sick Leave Detail */}
        <Dialog open={selectedDetail === 'sickleave'} onOpenChange={() => setSelectedDetail(null)}>
          <DialogContent className="max-w-xl rounded-3xl border-none p-0 overflow-hidden shadow-2xl">
            <div className="h-24 bg-[#14532d] flex items-center px-8">
                <DialogTitle className="text-2xl font-black text-white">{t.dialogs.sickLeave.title}</DialogTitle>
            </div>
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="p-6 bg-[#14532d]/5 rounded-2xl border border-[#14532d]/20">
                <p className="text-xs font-black text-[#14532d] uppercase mb-2 tracking-wider">{t.dialogs.sickLeave.expected}</p>
                <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-black text-[#14532d] tracking-tight">
                        {formatCurrency(sickLeaveResult?.totalAmount || 0)}
                    </p>
                    <span className="text-lg font-bold text-[#14532d]/80">/ {sickLeaveDays}{t.units.days} {t.dialogs.sickLeave.perDay}</span>
                </div>
              </div>

              <div className="space-y-3 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                <p className="text-sm font-black text-slate-700">{t.dialogs.sickLeave.adjustDays}</p>
                <div className="relative group">
                    <Input
                      type="text"
                      value={sickLeaveDays}
                      onChange={(e) => setSickLeaveDays(e.target.value.replace(/[^0-9]/g, ""))}
                      className="h-12 text-lg font-black border-slate-200 focus:border-[#14532d] focus:ring-[#14532d]/20 rounded-xl"
                      placeholder="30"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-slate-400 group-focus-within:text-[#14532d]">{t.units.days}</span>
                </div>
              </div>

              {sickLeaveResult?.isSpecialCase && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                  <p className="text-base font-black text-amber-900 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5" />
                    {t.dialogs.sickLeave.specialCase}
                  </p>
                  <p className="text-sm text-amber-700 mt-1 font-medium">
                    {t.dialogs.sickLeave.specialCaseDesc}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-800">
                  <span className="w-1.5 h-6 bg-[#14532d] rounded-full" />
                  <p className="font-black">{t.dialogs.sickLeave.calculation}</p>
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
            <div className="h-24 bg-[#14532d] flex items-center px-8">
                <DialogTitle className="text-2xl font-black text-white">{t.dialogs.disability.title}</DialogTitle>
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
                  <div key={grade} className="flex flex-col p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-[#14532d]/40 transition-all hover:bg-[#14532d]/5 group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#14532d] text-white font-black text-lg group-hover:scale-105 transition-transform">{grade}</span>
                        <div>
                            <p className="text-base font-black text-slate-900 tracking-tight">{t.dialogs.disability.grade.replace('{grade}', grade.toString())}</p>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                                result.paymentType === 'pension' ? 'bg-white border border-[#14532d]/20 text-[#14532d]' :
                                result.paymentType === 'lump' ? 'bg-[#14532d]/10 text-[#14532d]' :
                                'bg-[#14532d]/20 text-[#14532d]'
                                }`}>
                                {result.paymentType === 'pension' ? t.dialogs.disability.pensionOnly :
                                result.paymentType === 'lump' ? t.dialogs.disability.lumpOnly : t.dialogs.disability.choice}
                            </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-auto space-y-2">
                        {result.paymentType === 'choice' ? (
                        <div className="space-y-1">
                            <div className="flex justify-between items-center text-sm font-bold p-2 bg-white rounded-lg border border-slate-100">
                                <span className="text-slate-400">{t.dialogs.disability.expectedLump}</span>
                                <span className="text-[#14532d] font-black">{formatCurrency(result.lumpSum!)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-bold p-2 bg-white rounded-lg border border-slate-100">
                                <span className="text-slate-400">{t.dialogs.disability.expectedPension}</span>
                                <span className="text-[#14532d] font-black">{formatCurrency(result.pension!)}</span>
                            </div>
                        </div>
                        ) : (
                        <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-100 group-hover:border-[#14532d]/30">
                            <span className="text-sm font-black text-slate-400">{result.paymentType === 'pension' ? t.dialogs.disability.pension : t.dialogs.disability.lump}</span>
                            <span className="text-lg font-black text-[#14532d]">{formatCurrency(result.lumpSum || result.pension!)}</span>
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
                    <p className="text-lg font-black text-slate-700">{t.sections.footer.title}</p>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                        {t.sections.footer.desc}
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
