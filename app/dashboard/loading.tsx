import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    // Replicating the background and margin/padding structure of DashboardClient
    <div className="min-h-screen bg-slate-50 -mt-16 -mx-4 w-[calc(100%+2rem)] pb-20">
      
      {/* 1. Header Section Skeleton */}
      <div className="max-w-7xl mx-auto sm:px-6 sm:py-6 mb-0 mt-0 pt-0">
        <div className="pt-24 pb-8 px-4 sm:px-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
            <div className="space-y-3 w-full max-w-lg">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-32 rounded-lg" /> {/* Greetings Name */}
                <Skeleton className="h-6 w-16 rounded-full" /> {/* Badge */}
              </div>
              <Skeleton className="h-8 w-3/4 rounded-lg" /> {/* Main Title */}
              <div className="flex items-center gap-2 pt-1">
                 <Skeleton className="h-4 w-48 rounded" /> {/* Subtitle */}
              </div>
            </div>
          </div>

          {/* Progress Bar Skeleton */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
             <div className="flex justify-between items-end mb-4">
                <div className="space-y-2">
                   <Skeleton className="h-4 w-24" />
                   <Skeleton className="h-8 w-48" />
                </div>
                <Skeleton className="h-12 w-12 rounded-full" />
             </div>
             <Skeleton className="h-3 w-full rounded-full" />
             <div className="flex justify-between mt-3">
               <Skeleton className="h-4 w-16" />
               <Skeleton className="h-4 w-16" />
               <Skeleton className="h-4 w-16" />
             </div>
          </div>
        </div>
      </div>

      {/* 2. Main Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-6 space-y-5">
        
        {/* Main Insight Card Skeleton */}
        <Skeleton className="w-full h-48 rounded-3xl" />

        {/* Recommended Benefits Skeleton */}
        <Skeleton className="w-full h-40 rounded-2xl" />

        {/* Local Resources & Video Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="w-full h-64 rounded-2xl" />
          <Skeleton className="w-full h-64 rounded-2xl" />
        </div>

        {/* Quick Actions & Checklist Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
           <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
             {[1, 2, 3, 4].map((i) => (
               <Skeleton key={i} className="aspect-square rounded-2xl" />
             ))}
           </div>
           <Skeleton className="hidden lg:block w-full h-64 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
