import { Metadata } from "next";
import BoardList from "@/components/community/BoardList";
import { REGIONS } from "@/lib/data/community";
import type { RegionType } from "@/lib/types/community";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    type: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type: paramType } = await params;
  const type = paramType as RegionType;
  const title = REGIONS[type];
  
  if (!title) {
    return { title: "게시판을 찾을 수 없습니다" };
  }

  return {
    title: `${title} 게시판 | 커뮤니티`,
    description: `${title} 지역 정보를 공유하는 게시판`,
  };
}

export default async function RegionBoardPage({ params }: PageProps) {
  const { type: paramType } = await params;
  const type = paramType as RegionType;
  const title = REGIONS[type];

  if (!title) {
    notFound();
  }

  return (
    <BoardList
      category="region"
      categoryValue={type}
      title={`${title} 게시판`}
    />
  );
}
