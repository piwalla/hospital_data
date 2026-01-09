"use client";


import Link from "next/link";
import { MessageSquare, ThumbsUp, Eye } from "lucide-react";
import type { CommunityPost } from "@/lib/types/community";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface PostCardProps {
  post: CommunityPost;
}

export default function PostCard({ post }: PostCardProps) {
  const timeAgo = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
    locale: ko,
  });

  return (
    <Link href={`/community/post/${post.id}`} className="block group">
      <div className="p-5 hover:bg-slate-50 transition-colors duration-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Left Side: Title & Mobile Metadata */}
          <div className="min-w-0 flex-1">
            <h3 className="text-base md:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
              {post.title}
            </h3>
            
            {/* Mobile Metadata Row */}
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-2 md:hidden">
              <span className="font-medium text-slate-600">{post.author_name}</span>
              <span className="w-0.5 h-0.5 bg-slate-300 rounded-full" />
              <span>{timeAgo}</span>
              <div className="flex items-center gap-2 ml-auto">
                 <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> {post.view_count}
                 </span>
                 <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" /> {post.comment_count}
                 </span>
              </div>
            </div>
          </div>

          {/* Desktop Right Side: Metadata (One Row) */}
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-500 shrink-0">
             <span className="w-24 truncate text-right text-slate-700 font-medium">{post.author_name}</span>
             <span className="w-20 text-right text-slate-400 text-xs">{timeAgo}</span>
             
             <div className="flex items-center gap-4 pl-4 border-l border-slate-100">
               <span className="flex items-center gap-1.5 w-12 justify-end hover:text-indigo-500 transition-colors">
                  <Eye className="w-4 h-4 ml-auto" />
                  <span className="text-xs">{post.view_count}</span>
               </span>
               <span className="flex items-center gap-1.5 w-12 justify-end hover:text-pink-500 transition-colors">
                  <ThumbsUp className="w-4 h-4 ml-auto" />
                  <span className="text-xs">{post.like_count}</span>
               </span>
               <span className="flex items-center gap-1.5 w-12 justify-end hover:text-blue-500 transition-colors">
                  <MessageSquare className="w-4 h-4 ml-auto" />
                  <span className="text-xs">{post.comment_count}</span>
               </span>
             </div>
          </div>

        </div>
      </div>
    </Link>
  );
}
