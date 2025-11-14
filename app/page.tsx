import { redirect } from "next/navigation";

export default function Home() {
  // 루트 페이지는 병원 찾기로 리다이렉트
  redirect("/hospitals");
}
