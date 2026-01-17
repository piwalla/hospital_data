"use client";

/**
 * @file page.tsx
 * @description 서비스 소개 페이지 (지역화 적용)
 */

import { useState, useEffect } from 'react';
import Image from "next/image";
import { 
  Bot, 
  MapPin, 
  FileText, 
  Calculator, 
  HeartHandshake, 
  Stethoscope, 
  Brain, 
  Search,
  Sparkles,
  Database,
  Lock,
  Code2,
  Info
} from "lucide-react";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { Locale, locales, aboutTranslations } from "@/lib/i18n/config";

export default function AboutPage() {
  const [locale, setLocale] = useState<Locale>('ko');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLocale = localStorage.getItem('user_locale') as Locale;
    if (savedLocale && locales.includes(savedLocale)) {
      setLocale(savedLocale);
    }

    const handleLocaleChange = () => {
      const updated = localStorage.getItem('user_locale') as Locale;
      if (updated && locales.includes(updated)) {
        setLocale(updated);
      }
    };

    window.addEventListener('localeChange', handleLocaleChange);
    window.addEventListener('storage', handleLocaleChange);
    
    return () => {
      window.removeEventListener('localeChange', handleLocaleChange);
      window.removeEventListener('storage', handleLocaleChange);
    };
  }, []);

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('user_locale', newLocale);
    window.dispatchEvent(new Event('localeChange'));
  };

  if (!mounted) return null;

  const t = aboutTranslations[locale];

  const solutions = [
    {
      title: t.solution1Title,
      description: t.solution1Desc,
      icon: Bot,
      color: "text-blue-600 bg-blue-50",
    },
    {
      title: t.solution2Title,
      description: t.solution2Desc,
      icon: Stethoscope,
      color: "text-green-600 bg-green-50",
    },
    {
      title: t.solution3Title,
      description: t.solution3Desc,
      icon: Calculator,
      color: "text-orange-600 bg-orange-50",
    },
    {
      title: t.solution4Title,
      description: t.solution4Desc,
      icon: MapPin,
      color: "text-purple-600 bg-purple-50",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl space-y-20 relative">
      

      {/* 1. Hero Section: 공감과 문제 제기 */}
      <section className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
          <HeartHandshake className="w-4 h-4" />
          <span>{t.heroBadge}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight word-keep leading-tight whitespace-pre-line">
          {t.heroTitle}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed word-keep whitespace-pre-line">
          {t.heroDescription}
        </p>
      </section>

      {/* 2. Story Section: 기획 의도 (Real Story) */}
      <section className="bg-white border border-slate-100 rounded-3xl p-8 md:p-12 shadow-sm">
        <div className="flex flex-col md:flex-row gap-10 items-center">
          <div className="flex-1 space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {t.storyTitle}
            </h2>
            <div className="space-y-5 text-slate-600 leading-relaxed text-lg">
              <p className="whitespace-pre-line">{t.storyP1}</p>
              <p className="whitespace-pre-line">{t.storyP2}</p>
              <p className="font-bold text-foreground italic underline decoration-primary/30 underline-offset-4">
                &quot;{t.storyP3}&quot;
              </p>
              <p className="whitespace-pre-line">{t.storyP4}</p>
            </div>
          </div>
          <div className="w-full md:w-5/12 aspect-square relative rounded-2xl overflow-hidden shadow-lg border border-slate-200">
             <Image
                src="/Gemini_Generated_Image_wq6kzmwq6kzmwq6k%20(1).png"
                alt="ReWorkCare Story Illustration"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
          </div>
        </div>
      </section>

      {/* 3. Tech & Features Section: 해결책 */}
      <section className="space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl font-bold text-foreground">
            {t.solutionsTitle}
          </h2>
          <p className="text-slate-600 text-lg whitespace-pre-line">
            {t.solutionsDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {solutions.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="group bg-white p-8 rounded-2xl border border-slate-200 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${item.color}`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. AI Technology Highlight */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 md:p-16 text-center space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-300 font-medium text-sm backdrop-blur-sm border border-white/5">
            <Sparkles className="w-4 h-4" />
            <span>{t.aiBadge}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight">
            {t.aiTitle}
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-line">
            {t.aiDescription}
          </p>
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10">
              <Brain className="w-6 h-6 text-blue-400 mb-2" />
              <div className="font-bold mb-1">{t.aiFeat1Title}</div>
              <div className="text-sm text-slate-400">{t.aiFeat1Desc}</div>
            </div>
            <div className="bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10">
              <Search className="w-6 h-6 text-green-400 mb-2" />
              <div className="font-bold mb-1">{t.aiFeat2Title}</div>
              <div className="text-sm text-slate-400">{t.aiFeat2Desc}</div>
            </div>
            <div className="bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10">
              <FileText className="w-6 h-6 text-purple-400 mb-2" />
              <div className="font-bold mb-1">{t.aiFeat3Title}</div>
              <div className="text-sm text-slate-400">{t.aiFeat3Desc}</div>
            </div>
          </div>

          {/* Tech Stack Grid */}
          <div className="pt-12 border-t border-white/10 mt-12">
            <h3 className="text-xl font-bold mb-8 opacity-90">{t.techStackTitle}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-left">
              <div className="bg-white/5 p-5 rounded-xl backdrop-blur-sm border border-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-2 mb-2 text-white">
                  <Code2 className="w-5 h-5 text-white/80" />
                  <span className="font-bold text-lg">Next.js 15</span>
                </div>
                <p className="text-sm text-slate-400">{t.techNextDesc}</p>
              </div>

              <div className="bg-white/5 p-5 rounded-xl backdrop-blur-sm border border-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-2 mb-2 text-green-400">
                  <Database className="w-5 h-5" />
                  <span className="font-bold text-lg text-white">Supabase</span>
                </div>
                <p className="text-sm text-slate-400">{t.techSupaDesc}</p>
              </div>

              <div className="bg-white/5 p-5 rounded-xl backdrop-blur-sm border border-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-2 mb-2 text-blue-400">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-bold text-lg text-white">Google Gemini AI</span>
                </div>
                <p className="text-sm text-slate-400">{t.techGeminiDesc}</p>
              </div>

              <div className="bg-white/5 p-5 rounded-xl backdrop-blur-sm border border-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-2 mb-2 text-purple-400">
                  <Brain className="w-5 h-5" />
                  <span className="font-bold text-lg text-white">RAG</span>
                </div>
                <p className="text-sm text-slate-400">{t.techRagDesc}</p>
              </div>

              <div className="bg-white/5 p-5 rounded-xl backdrop-blur-sm border border-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-2 mb-2 text-green-500">
                  <MapPin className="w-5 h-5" />
                  <span className="font-bold text-lg text-white">Naver Maps API</span>
                </div>
                <p className="text-sm text-slate-400">{t.techMapDesc}</p>
              </div>

              <div className="bg-white/5 p-5 rounded-xl backdrop-blur-sm border border-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-2 mb-2 text-indigo-400">
                  <Lock className="w-5 h-5" />
                  <span className="font-bold text-lg text-white">Clerk</span>
                </div>
                <p className="text-sm text-slate-400">{t.techAuthDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Vision / Closing */}
      <section className="text-center space-y-8 py-8">
        <h2 className="text-2xl font-bold text-foreground whitespace-pre-line">
          {t.closingTitle}
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed whitespace-pre-line">
          {t.closingDescription}
        </p>
      </section>

    </div>
  );
}
