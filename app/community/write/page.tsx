import { Metadata } from "next";
import WritePostForm from "@/components/community/WritePostForm";

export const metadata: Metadata = {
  title: "글쓰기 | 커뮤니티",
  description: "커뮤니티에 새 글을 작성합니다",
};

import { Suspense } from "react";

export default function WritePostPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WritePostForm />
    </Suspense>
  );
}
