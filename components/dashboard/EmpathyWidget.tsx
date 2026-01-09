"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Quote, BookOpen } from "lucide-react";

export default function EmpathyWidget() {
  // Mock content - randomize in real app
  const content = {
    quote: "가장 큰 영광은 한 번도 넘어지지 않는 것이 아니라, 넘어질 때마다 다시 일어서는 데 있다.",
    author: "공자",
    storyTitle: "하지 절단 장해를 딛고 탁구 선수로!",
    storyLink: "#"
  };

  return (
    <Card className="bg-white/60 backdrop-blur-md border border-white/40 shadow-sm relative overflow-hidden rounded-[2rem]">
      <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500/80" />
      <CardContent className="p-5 flex flex-col gap-4">
         {/* Quote Section */}
         <div className="flex gap-4 items-start">
             <div className="bg-stone-100 p-2 rounded-full mt-1">
                 <Quote className="w-5 h-5 text-stone-500 fill-stone-200" />
             </div>
             <div>
                 <p className="text-sm font-serif font-medium text-stone-800 leading-relaxed italic">
                    &quot;{content.quote}&quot;
                 </p>
                 <p className="text-xs text-stone-500 mt-2 font-medium">
                    - {content.author}
                 </p>
             </div>
         </div>

         {/* Story Link */}
         <div className="mt-1 pt-3 border-t border-stone-200/60 flex items-center justify-between cursor-pointer group">
             <div className="flex items-center gap-2">
                 <BookOpen className="w-4 h-4 text-stone-600 group-hover:text-indigo-600 transition-colors" />
                 <span className="text-xs font-bold text-stone-700 group-hover:text-indigo-700 transition-colors">
                    회복 환우 수기 읽어보기
                 </span>
             </div>
             <div className="flex items-center">
                 <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full border border-red-100 font-bold">
                    New
                 </span>
             </div>
         </div>
      </CardContent>
    </Card>
  );
}
