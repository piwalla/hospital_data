import { Metadata } from "next";
import BoardList from "@/components/community/BoardList";
import { INJURY_TYPES } from "@/lib/data/community";
import type { InjuryType } from "@/lib/types/community";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    type: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type } = await params;
  const injuryType = type as InjuryType;
  const title = INJURY_TYPES[injuryType];
  
  if (!title) {
    return { title: "게시판을 찾을 수 없습니다" };
  }

  return {
    title: `${title} 게시판 | 커뮤니티`,
    description: `${title} 관련 정보를 공유하는 게시판`,
  };
}

export default async function InjuryBoardPage({ params }: PageProps) {
  const { type } = await params;
  const injuryType = type as InjuryType;
  const title = INJURY_TYPES[injuryType];

  if (!title) {
    notFound();
  }

  return (
    <BoardList
      category="injury"
      categoryValue={injuryType}
      title={`${title} 게시판`}
    />
  );
}
