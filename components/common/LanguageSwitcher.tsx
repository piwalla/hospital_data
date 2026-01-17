/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { locales, Locale, languageNames, languageFlags } from '@/lib/i18n/config';

interface LanguageSwitcherProps {
  currentLocale: Locale;
  onLocaleChange: (locale: Locale) => void;
  variant?: 'floating' | 'inline' | 'nav'; // Added 'nav' variant
  className?: string; // Added className prop
}

export default function LanguageSwitcher({ 
  currentLocale, 
  onLocaleChange,
  variant = 'inline',
  className
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const containerClasses = variant === 'floating' 
    ? "fixed bottom-6 right-6 z-50"
    : "relative";

  // Base button classes
  const baseButtonClasses = "flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 group";
  
  // Variant specific styling
  const variantClasses = variant === 'nav' 
    ? className // For nav, we fully rely on passed className or minimal defaults + styling from parent
    : "bg-white/90 backdrop-blur-md border border-gray-100 shadow-sm text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-200 ring-1 ring-black/[0.02]";

  return (
    <div className={containerClasses} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${baseButtonClasses} ${variantClasses}`}
      >
        <div className={`w-5 h-5 rounded-full overflow-hidden border flex-shrink-0 flex items-center justify-center shadow-inner ${variant === 'nav' ? 'border-current/20' : 'border-gray-100 bg-gray-50'}`}>
          <img 
            src={`https://flagcdn.com/w40/${languageFlags[currentLocale].toLowerCase()}.png`}
            alt={languageNames[currentLocale]}
            className="w-full h-full object-cover scale-150"
          />
        </div>
        <span className="text-sm font-medium hidden sm:block truncate">{languageNames[currentLocale]}</span>
        <ChevronDown 
          className={`w-3.5 h-3.5 transition-transform duration-300 opacity-70 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-1.5 z-[60] overflow-hidden ring-1 ring-black/5`}
          >
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
              {locales.map((locale) => (
                <button
                  key={locale}
                  onClick={() => {
                    onLocaleChange(locale);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-sm transition-colors ${
                    currentLocale === locale 
                      ? 'bg-primary/5 text-primary font-semibold' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full overflow-hidden border border-gray-100 shadow-sm flex-shrink-0">
                      <img 
                        src={`https://flagcdn.com/w40/${languageFlags[locale].toLowerCase()}.png`}
                        alt={languageNames[locale]}
                        className="w-full h-full object-cover scale-150"
                      />
                    </div>
                    <span>
                      {languageNames[locale]}
                    </span>
                  </div>
                  {currentLocale === locale && (
                    <Check className="w-3.5 h-3.5 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
