import { Metadata } from "next";
import BoardList from "@/components/community/BoardList";

export const metadata: Metadata = {
  title: "익명 게시판 | 커뮤니티",
  description: "민감한 고민을 자유롭게 나누는 익명 게시판",
};

export default function AnonymousBoardPage() {
  return (
    <BoardList
      category="anonymous"
      categoryValue={null}
      title="익명 게시판"
      description="민감한 고민을 자유롭게 나눠보세요. 모든 글은 익명으로 표시됩니다."
    />
  );
}
