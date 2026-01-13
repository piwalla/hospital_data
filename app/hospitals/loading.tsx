"use client";

import { MapPin, Search } from "lucide-react";

export default function Loading() {
  return (
    <>
      {/* Hero Skeleton */}
      <section className="relative w-screen left-[calc(-50vw+50%)] min-h-[400px] flex items-center justify-center overflow-hidden bg-slate-900 -mt-20 pt-20">
        <div className="absolute inset-0 bg-slate-900/90 z-10" />
        <div className="container relative z-20 px-4 text-center space-y-6">
          <div className="h-12 w-64 bg-slate-700 rounded-lg mx-auto animate-pulse" />
          <div className="h-6 w-96 bg-slate-700/50 rounded-lg mx-auto animate-pulse" />
        </div>
      </section>

      {/* Content Skeleton */}
      <div className="relative w-screen left-[calc(-50vw+50%)] bg-[#eff2f5] py-12 -mt-12">
        <div className="container mx-auto px-4 max-w-7xl animate-pulse">
          {/* Map Skeleton */}
          <div className="h-[400px] w-full bg-gray-200 rounded-2xl mb-8" />
          
          {/* List Skeleton */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex gap-4">
                 <div className="w-24 h-24 bg-gray-100 rounded-lg" />
                 <div className="flex-1 space-y-3">
                    <div className="h-6 w-1/3 bg-gray-100 rounded" />
                    <div className="h-4 w-1/2 bg-gray-100 rounded" />
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
