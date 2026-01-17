"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

import { Locale } from '@/lib/i18n/config';

interface FeatureCardProps {
  title: React.ReactNode;
  description: React.ReactNode;
  imageSrc: string;
  imageAlt: string;
  linkHref: string;
  linkText: string;
  delay?: number;
  reversed?: boolean; // If true, image is on the left
  locale?: Locale;
}

export default function FeatureCard({
  title,
  description,
  imageSrc,
  imageAlt,
  linkHref,
  linkText,
  delay = 0,
  reversed = false,
  locale = 'ko',
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: delay }}
      className={`flex flex-col ${reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-24 items-center py-12 lg:py-20`}
    >
      {/* Content Side */}
      <div className="flex-1 space-y-6 text-center lg:text-left">
        <h3 className="text-2xl lg:text-4xl font-bold text-gray-900 leading-tight">
          <Link href={linkHref} className="hover:text-primary transition-colors">
            {title}
          </Link>
        </h3>
        <p className="text-gray-600 text-lg lg:text-2xl leading-relaxed">
          {description}
        </p>
      </div>

      {/* Image Side */}
      <div className="flex-1 w-full max-w-lg relative isolate">
        {/* Decorative Blob for Glass Effect Contrast */}
        <div className="absolute -inset-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-[3rem] blur-3xl opacity-80 -z-10" />
        
        <Link href={linkHref} className="block group cursor-pointer">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/60 backdrop-blur-md border border-white/40">
             {/* Placeholder for actual image or a colored block if image missing */}
             <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/20 flex items-center justify-center text-gray-500 font-medium">
                {/* If imageSrc is available, render Image */}
                {imageSrc ? (
                   <Image 
                     src={imageSrc} 
                     alt={imageAlt}
                     fill
                     className="object-cover transition-transform duration-500 group-hover:scale-105"
                     sizes="(max-width: 768px) 100vw, 50vw"
                   />
                ) : (
                  <span>이미지 준비 중</span>
                )}
             </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}
