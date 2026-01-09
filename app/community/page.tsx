import { Metadata } from "next";
import CommunityMain from "@/components/community/CommunityMain";
import { getUserProfile } from "@/app/actions/user";

export const metadata: Metadata = {
  title: "커뮤니티 | 산재 도우미",
  description: "산재 환자들의 정보 공유 커뮤니티",
};

export default async function CommunityPage() {
  const user = await getUserProfile();

  return (
    <CommunityMain 
      userInjury={user?.injuryPart}
      userRegion={user?.region}
    />
  );
}
