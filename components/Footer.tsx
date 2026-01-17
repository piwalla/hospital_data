"use client";

/**
 * @file Footer.tsx
 * @description 사이트 하단 Footer 컴포넌트
 */

import Link from "next/link";
import Image from "next/image";
import React from "react";
import CSChatDialog from "@/components/cs/CSChatDialog";
import { Locale, locales, footerTranslations } from "@/lib/i18n/config";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  /* Locale & Translation Logic */
  const [locale, setLocale] = React.useState<Locale>('ko');

  React.useEffect(() => {
    const stored = localStorage.getItem('user_locale');
    if (stored && locales.includes(stored as Locale)) {
      setLocale(stored as Locale);
    }

    const handleLocaleChange = () => {
      const updated = localStorage.getItem('user_locale');
      if (updated && locales.includes(updated as Locale)) {
        setLocale(updated as Locale);
      }
    };

    window.addEventListener('storage', handleLocaleChange);
    window.addEventListener('localeChange', handleLocaleChange);
    
    return () => {
      window.removeEventListener('storage', handleLocaleChange);
      window.removeEventListener('localeChange', handleLocaleChange);
    };
  }, []);

  const displayLocale = locale === 'ko' ? 'ko' : 'en';
  const t = footerTranslations[displayLocale];

  const socialLinks = [
    {
      name: "YouTube",
      href: "https://www.youtube.com/@reworkcare",
      icon: "▶️",
    },
  ];

  return (
    <footer 
      className="hidden md:block bg-slate-50 border-t border-slate-200"
      role="contentinfo"
      aria-label={locale === 'ko' ? "사이트 하단 정보" : "Site Footer Information"}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Upper Section: Brand & Interact */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-10">
          
          {/* Left: Brand Identity & Intro */}
          <div className="space-y-4 max-w-lg">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-xl font-bold text-slate-900 transition-opacity hover:opacity-80"
              style={{ fontFamily: 'Paperozi, sans-serif' }}
            >
              <Image
                src="/landing/brand-logo-removebg-preview.png"
                alt={t.brand}
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
              />
              {t.brand}
            </Link>
            
            <div className="space-y-1">
              <p className="text-base font-medium text-slate-700">
                {t.slogan}
              </p>
              <p className="text-sm text-slate-500 leading-relaxed">
                {t.description}
              </p>
              <Link
                href="/about"
                className="inline-block text-sm font-semibold text-slate-900 hover:text-slate-700 mt-2 transition-colors"
              >
                {t.aboutLink}
              </Link>
            </div>
          </div>

          {/* Right: Connect & Actions */}
          <div className="flex flex-col lg:items-end space-y-5">
            <div className="flex items-center gap-4">
              <CSChatDialog t={t} />
              <div className="h-4 w-px bg-slate-200" />
              
              {/* Added Notice Link */}
              <Link
                href="/community/notice"
                className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1"
                aria-label={t.notice}
              >
                {t.notice}
              </Link>

              <div className="h-4 w-px bg-slate-200" />

              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-2xl hover:scale-110 transition-transform duration-200 opacity-80 hover:opacity-100"
                    aria-label={`${social.name} logo`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-slate-200" />

        {/* Bottom Section: Legal & Copyright */ }
        <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-6 text-xs text-slate-500">
          
          {/* Disclaimer & Copyright */}
          <div className="flex flex-col md:items-start items-center gap-2 text-center md:text-left">
             <p className="opacity-80">
               {t.legalDisclaimer}
             </p>
             <p className="font-medium">
               {t.copyright.replace('{year}', currentYear.toString())}
             </p>
          </div>

          {/* Legal Links */}
          <div className="flex gap-6 font-medium">
            <Link href="/terms" className="hover:text-slate-900 transition-colors">
              {t.terms}
            </Link>
            <Link href="/privacy" className="hover:text-slate-900 transition-colors">
              {t.privacy}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

