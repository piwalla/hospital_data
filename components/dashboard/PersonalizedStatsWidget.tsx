
"use client";


import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock } from "lucide-react";
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import { cn } from "@/lib/utils";
import { Locale, dashboardTranslations } from "@/lib/i18n/config";

interface PersonalizedStatsWidgetProps {
  userName?: string;
  injury?: string;
  region?: string;
  className?: string;
}

interface StatsData {
  avgProcessing: string;
  avgTreatment: string; // Mixed Average
  avgTreatmentAccident?: string; // Accident specific
  avgTreatmentDisease?: string; // Disease specific
  approvalRate: string;
  sampleSize: number;
  regionName: string;
}

import { LATEST_OFFICIAL_STAT } from '@/lib/data/official-stats-2023';

export default function PersonalizedStatsWidget({ userName, injury, region, className }: PersonalizedStatsWidgetProps) {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [type, setType] = useState<'accident' | 'disease'>('accident'); // 'accident' | 'disease'
  
  const [locale, setLocale] = useState<Locale>('ko');

  useEffect(() => {
    const savedLocale = localStorage.getItem('user_locale') as Locale;
    if (savedLocale && dashboardTranslations[savedLocale]) {
      setLocale(savedLocale);
    }

    const handleLocaleChange = () => {
      const updatedLocale = localStorage.getItem('user_locale') as Locale;
      if (updatedLocale && dashboardTranslations[updatedLocale]) {
        setLocale(updatedLocale);
      }
    };

    window.addEventListener('user_locale', handleLocaleChange);
    window.addEventListener('localeChange', handleLocaleChange);
    window.addEventListener('storage', handleLocaleChange);

    return () => {
      window.removeEventListener('user_locale', handleLocaleChange);
      window.removeEventListener('localeChange', handleLocaleChange);
      window.removeEventListener('storage', handleLocaleChange);
    };
  }, []);

  const t = dashboardTranslations[locale]?.statsWidget || dashboardTranslations['ko'].statsWidget;
  const headerT = dashboardTranslations[locale]?.header || dashboardTranslations['ko'].header;

  useEffect(() => {
    async function fetchStats() {
      if (!injury || !region) return;
      
      try {
        setLoading(true);
        const res = await fetch(`/api/stats/personalized?injury=${injury}&region=${region}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [injury, region]);

  if (!injury || !region) return null;

  if (loading) return <StatsSkeleton />;

  if (error || !data) {
    // ... Error UI
    return (
       <Card className={`bg-slate-50 border-dashed ${className}`}>
         <CardContent className="flex items-center justify-center py-8 text-slate-400 text-sm">
           {t.error}
         </CardContent>
       </Card>
    );
  }

  // --- Derived Data based on Toggle ---
  // Definitions MUST come before Chart Data usage
  const isAccident = type === 'accident';
  
  // 1. Approval Rate (From Official Stats 2023)
  const officialApps = isAccident ? LATEST_OFFICIAL_STAT.apply_accident : LATEST_OFFICIAL_STAT.apply_disease;
  const officialAprvs = isAccident ? LATEST_OFFICIAL_STAT.approve_accident : LATEST_OFFICIAL_STAT.approve_disease;
  const approvalRate = ((officialAprvs / officialApps) * 100).toFixed(1);

  // 2. Processing Time (Official 2023)
  const processingTime = isAccident 
      ? (LATEST_OFFICIAL_STAT.duration_accident || 16.5).toFixed(1)
      : (LATEST_OFFICIAL_STAT.duration_disease || 214.5).toFixed(1);

  // 3. Treatment Duration (Split via API)
  const treatmentDuration = isAccident
      ? (data.avgTreatmentAccident || data.avgTreatment) 
      : (data.avgTreatmentDisease || data.avgTreatment);

  // Fallback if API returns 0 (e.g. no data for that split)
  // User requested NO default values. If data is missing (~0), show empty/dash.
  const displayTreatment = parseInt(treatmentDuration as string) > 0 ? treatmentDuration : "-"; 

  // --- Conversational Helpers (Localized) ---
  const approvalCount = Math.floor(parseFloat(approvalRate) / 10);
  const processingDays = parseFloat(processingTime);
  const processingText = processingDays >= 7 
      ? `${Math.round(processingDays / 7)}${locale === 'ko' ? '주' : ' wks'}` 
      : `${Math.round(processingDays)}${locale === 'ko' ? '일' : ' days'}`;
      
  const treatmentDays = parseInt(displayTreatment as string);
  const treatmentText = treatmentDays > 0 
      ? `${Math.round(treatmentDays / 30)}${locale === 'ko' ? '개월' : ' mos'}` 
      : t.noInfo;


  // Chart Data Preparation (Moved AFTER definitions)
  // 1. Approval Rate Chart
  const chartDataApproval = [{ name: 'Approval', value: parseFloat(approvalRate), fill: isAccident ? '#14532d' : '#ef4444' }]; 

  // 2. Processing Time Chart (Comparative)
  // Compare selected type vs the other type to show context


  const displayName = (userName && userName !== '홍길동') ? 
    userName : 
    (locale === 'ko' ? '회원' : headerT.guestGreeting.replace('Hello, ', '').replace('!', ''));

  return (
    <Card className={cn("border-white/40 bg-white/80 backdrop-blur-md shadow-premium rounded-none border-x-0 sm:border sm:rounded-3xl overflow-hidden transition-all hover:shadow-premium-hover", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-dashed border-slate-100 relative px-6 sm:px-8 pt-7">
        <div className="flex items-center gap-3">
           <span className="w-2 h-7 bg-primary rounded-full inline-block shadow-[0_4px_12px_rgba(20,83,45,0.3)]" />
           <div>
             <CardTitle className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
               {t.title.replace('{name}', displayName)}
             </CardTitle>
           </div>
        </div>
        
         <div className="flex bg-slate-100/50 p-1 rounded-xl backdrop-blur-sm border border-white/50">
          <button
            onClick={() => setType('accident')}
            className={cn(
              "px-4 py-1.5 text-xs font-bold rounded-lg transition-all", 
              isAccident ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'
            )}
          >
            {t.toggle.accident}
          </button>
          <button
            onClick={() => setType('disease')}
            className={cn(
              "px-4 py-1.5 text-sm font-bold rounded-lg transition-all", 
              !isAccident ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            )}
          >
            {t.toggle.disease}
          </button>
        </div>
      </CardHeader>

      <CardContent className="py-8 px-6 sm:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 lg:gap-8 items-center">
          
          {/* 1. Approval Rate */}
          <div className="flex flex-col items-center text-center space-y-4">
             <div className="relative h-28 w-28">
                 <ResponsiveContainer width="100%" height="100%">
                   <RadialBarChart innerRadius="75%" outerRadius="100%" barSize={10} data={chartDataApproval} startAngle={90} endAngle={-270}>
                     <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                     <RadialBar background dataKey="value" cornerRadius={5} />
                   </RadialBarChart>
                 </ResponsiveContainer>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={cn("text-2xl font-black tracking-tighter", isAccident ? 'text-primary' : 'text-rose-600')}>
                      {approvalRate}%
                    </span>
                 </div>
             </div>
              <div>
                <p className="text-lg font-bold text-slate-500 mb-1">{t.labels.avgApproval}</p>
                <p className="text-lg font-black text-slate-800 leading-tight whitespace-pre-wrap">
                  {t.descriptions.approval.replace('{count}', approvalCount.toString())}
                </p>
              </div>
          </div>

          {/* 2. Processing Time */}
          <div className="flex flex-col items-center text-center space-y-4">
             <div className="w-20 h-20 rounded-[2rem] bg-orange-50 flex items-center justify-center mb-2">
                <Clock className="w-10 h-10 text-orange-400" />
             </div>
              <div>
                <p className="text-lg font-bold text-slate-500 mb-1">{t.labels.processingTime}</p>
                <p className="text-lg font-black text-slate-800 leading-tight whitespace-pre-wrap">
                  {t.descriptions.processing.replace('{time}', processingText)}
                </p>
              </div>
          </div>

          {/* 3. Treatment Duration */}
          <div className="flex flex-col items-center text-center space-y-4">
             <div className="w-20 h-20 rounded-[2rem] bg-slate-50 flex items-center justify-center mb-2">
                <Calendar className="w-10 h-10 text-slate-400" />
             </div>
              <div>
                <p className="text-lg font-bold text-slate-500 mb-1">{t.labels.treatmentDuration}</p>
                <p className="text-lg font-black text-slate-800 leading-tight whitespace-pre-wrap">
                   {t.descriptions.treatment.replace('{time}', treatmentText)}
                </p>
              </div>
          </div>

        </div>
        
        {/* Source link remains same or can be localized if needed, but 'Official Stats' is likely fine for now or can also be added */}
        <div className="mt-8 pt-6 border-t border-slate-100/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Source: Official Stats 2023
            </p>
        </div>
      </CardContent>
    </Card>
  );
}

function StatsSkeleton() {
  return (
    <Card className="border-slate-100 shadow-sm bg-white">
        <CardHeader className="border-b border-slate-50 pb-2">
            <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
        </CardHeader>
        <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-20" />
                        <div className="flex justify-between items-end">
                            <Skeleton className="h-8 w-16" />
                            <Skeleton className="h-10 w-10 rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
  );
}
