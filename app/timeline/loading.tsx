import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen w-full relative">
       {/* Background Skeleton Layer: Replicate Page Background */}
        <div className="fixed inset-0 -z-10 overflow-hidden bg-[#FBFBFB]"></div>

        <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 sm:py-12 md:py-16 relative">
            
            {/* Header Skeleton */}
            <div className="text-center mb-16 space-y-4">
               <div className="flex justify-center mb-4">
                  <Skeleton className="h-8 w-32 rounded-full" />
               </div>
               <div className="flex justify-center">
                  <Skeleton className="h-10 w-64 rounded-lg" />
               </div>
               <div className="flex justify-center">
                   <Skeleton className="h-6 w-96 rounded" />
               </div>
            </div>

            {/* Timeline Steps Skeleton */}
            <div className="relative grid grid-cols-1 gap-0">
               {[1, 2, 3, 4].map((i) => (
                   <div key={i} className="relative">
                       {/* Mimics TimelineStepCard Structure */}
                       <div className="flex-1 min-w-0 mb-8 relative rounded-[24px] overflow-hidden bg-white border-2 border-gray-100 p-5 sm:p-7">
                           
                           {/* Card Header: Badge + Title */}
                           <div className="flex justify-between items-center mb-4">
                               <div className="flex items-center gap-4">
                                   {/* Step Number Badge Skeleton */}
                                   <Skeleton className="flex-shrink-0 rounded-full h-14 w-14" />
                                   
                                   {/* Title Skeleton */}
                                   <Skeleton className="h-8 w-48 rounded" />
                               </div>
                               <Skeleton className="w-6 h-6 rounded" />
                           </div>

                           {/* Description Skeleton */}
                           <div className="space-y-2 mb-6">
                               <Skeleton className="h-5 w-full rounded" />
                               <Skeleton className="h-5 w-3/4 rounded" />
                           </div>

                           {/* Footer: Tags + Button Skeleton */}
                           <div className="flex flex-wrap items-center justify-between gap-4 mt-auto">
                               <div className="flex gap-2">
                                  <Skeleton className="h-6 w-16 rounded-full" />
                                  <Skeleton className="h-6 w-16 rounded-full" />
                               </div>
                               <Skeleton className="h-9 w-24 rounded-lg" />
                           </div>
                       </div>

                       {/* Chevron Skeleton (Except last item) */}
                       {i < 4 && (
                           <div className="flex justify-center my-2">
                               <Skeleton className="w-8 h-4 rounded" />
                           </div>
                       )}
                   </div>
               ))}
            </div>
        </div>
    </div>
  );
}
