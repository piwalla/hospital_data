"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { defaultLocale, documentsTranslations, type Locale } from "@/lib/i18n/config";

export default function DocumentsHero() {
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  useEffect(() => {
    // Initial load
    const savedLocale = localStorage.getItem('user_locale') as Locale;
    if (savedLocale && documentsTranslations[savedLocale]) {
      setLocale(savedLocale);
    }

    // Event listener for dynamic updates
    const handleLocaleChange = () => {
      const updatedLocale = localStorage.getItem('user_locale') as Locale;
      if (updatedLocale && documentsTranslations[updatedLocale]) {
        setLocale(updatedLocale);
      }
    };

    window.addEventListener('user_locale', handleLocaleChange); // Assuming custom event might be dispatching this, but Navbar dispatches 'localeChange'
    window.addEventListener('localeChange', handleLocaleChange);
    window.addEventListener('storage', handleLocaleChange);

    return () => {
      window.removeEventListener('user_locale', handleLocaleChange);
      window.removeEventListener('localeChange', handleLocaleChange);
      window.removeEventListener('storage', handleLocaleChange);
    };
  }, []);

  const t = documentsTranslations[locale] || documentsTranslations['ko'];

  return (
    <section className="relative w-screen left-[calc(-50vw+50%)] h-[20vh] min-h-[200px] md:h-[45vh] md:min-h-[400px] -mt-16 mb-12 flex items-center justify-center overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 -z-10 w-full h-full overflow-hidden">
        <Image
          src="/landing/hero-documents-neat.png"
          alt="Documents Guide Background"
          fill
          className="object-cover opacity-80"
          priority
        />
         <div 
            className="absolute inset-0 opacity-[0.2]"
            style={{ 
              backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', 
              backgroundSize: '48px 48px' 
            }}
         />
         {/* Dark Elegant Overlay - Standarized with landing page */}
         <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      </div>

      <div className="container px-4 mx-auto text-center z-10 pt-12 md:pt-0">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Headlines */}
          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight drop-shadow-lg"
            >
              {/* Mobile View */}
              <span className="md:hidden">
                {(() => {
                  const parts = t.hero.title.split(/,(.+)/);
                  if (parts.length > 1) {
                     return (
                       <>
                         <span className="text-[#4ADE80]">{parts[0]}</span>,
                         {parts[1]}
                       </>
                     );
                  }
                  return t.hero.title;
                })()}
              </span>
              {/* Desktop View */}
              <span className="hidden md:inline">
                 {(() => {
                  const parts = t.hero.title.split(/,(.+)/);
                  if (parts.length > 1) {
                     return (
                       <>
                         <span className="text-[#4ADE80]">{parts[0]}</span>,
                         {parts[1]}
                       </>
                     );
                  }
                  return t.hero.title;
                })()}
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-sm sm:text-lg md:text-xl text-gray-100 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-md hidden md:block"
            >
              {t.hero.description}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
