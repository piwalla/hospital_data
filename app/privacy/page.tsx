"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  const lastUpdated = "2026. 01. 09";

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-900 px-8 py-10 text-white">
          <Link href="/" className="inline-flex items-center text-emerald-400 hover:text-white transition-colors mb-6 group">
            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            홈으로 돌아가기
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold">개인정보 처리방침</h1>
          </div>
          <p className="text-emerald-400">
            리워크케어(ReWorkCare)는 이용자의 소중한 개인정보를 안전하게 보호하며,<br />
            개인정보 보호법 등 관련 법령을 엄격히 준수합니다.
          </p>
          <div className="mt-6 inline-block px-3 py-1 bg-emerald-800 rounded-full text-xs text-emerald-500">
            최종 개정일: {lastUpdated}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 sm:p-12 space-y-10 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-emerald-600 rounded-full"></span>
              제1조 (개인정보의 처리 목적)
            </h2>
            <p className="pl-3">
              회사는 다음의 목적을 위해 개인정보를 처리합니다. 처리한 개인정보는 목적 이외의 용도로는 사용되지 않으며, 이용 목적이 변경될 시에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
            </p>
            <ul className="list-disc pl-8 mt-2 space-y-1">
              <li>회원 가입 및 관리 (인증 및 중복 가입 방지)</li>
              <li>산재 맞춤형 정보 제공 (부상 부위 및 단계별 가이드)</li>
              <li>예상 산재 보상금 모의 계산 서비스 제공</li>
              <li>서비스 개선 및 이용 통계 분석</li>
            </ul>
          </section>

          <section className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
            <h2 className="text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-emerald-600 rounded-full"></span>
              제2조 (처리하는 개인정보의 항목)
            </h2>
            <div className="pl-3 space-y-4 text-slate-800">
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-emerald-100/50">
                      <th className="border border-emerald-200 p-2 text-left">수집 분류</th>
                      <th className="border border-emerald-200 p-2 text-left">수집 항목</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-emerald-200 p-2 font-semibold">필수 일반정보</td>
                      <td className="border border-emerald-200 p-2 text-slate-600">이메일, 닉네임, 프로필 사진, 지역, 이용자 역할(환자/가족)</td>
                    </tr>
                    <tr className="bg-emerald-50/50">
                      <td className="border border-emerald-200 p-2 font-semibold text-rose-600">필수 민감정보</td>
                      <td className="border border-emerald-200 p-2 text-slate-600"><span className="font-bold">부상 부위, 산재 진행 단계</span> (건강 및 의료 처우 정보)</td>
                    </tr>
                    <tr>
                      <td className="border border-emerald-200 p-2 font-semibold">선택 경제정보</td>
                      <td className="border border-emerald-200 p-2 text-slate-600">월 평균 급여 또는 평균 임금액 (보상 계산 목적)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-rose-600 font-medium">
                ※ 민감정보(건강정보)는 별도의 명시적 동의를 얻은 후 수집하며, 이용자의 권리 보장을 위해 철저히 보호됩니다.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-emerald-600 rounded-full"></span>
              제3조 (개인정보의 보유 및 이용기간)
            </h2>
            <p className="pl-3">
              회사는 이용자로부터 개인정보를 수집할 때 동의받은 보유·이용기간 또는 법령에 따른 기간 내에서 개인정보를 처리·보유합니다.
            </p>
            <p className="pl-3 font-semibold mt-2">
              - 보유 기간: 원칙적으로 회원 탈퇴 시까지
            </p>
            <p className="pl-3 text-sm text-slate-500 mt-1">
              단, 관계 법령에 의해 보존할 필요가 있는 경우 해당 법령에서 정한 기간 동안 보관합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-emerald-600 rounded-full"></span>
              제4조 (정보주체의 권리·의무 및 그 행사 방법)
            </h2>
            <p className="pl-3">
              이용자는 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할 수 있으며, 가입 해지(동의 철회)를 요청할 수 있습니다. 회사는 지체 없이 필요한 조치를 취하겠습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-emerald-600 rounded-full"></span>
              제5조 (개인정보의 파기)
            </h2>
            <p className="pl-3">
              회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다. 전자적 파일 형태인 경우 복원이 불가능한 방법으로 영구 삭제합니다.
            </p>
          </section>

          <div className="pt-10 border-t border-slate-100 flex justify-center">
            <Button asChild variant="outline" className="px-10 h-12 rounded-full border-slate-200 hover:bg-slate-50 transition-all font-semibold border-emerald-200 text-emerald-700">
              <Link href="/">메인으로 돌아가기</Link>
            </Button>
          </div>
        </div>
      </div>
      <p className="text-center mt-8 text-slate-400 text-sm">
        © 2026 리워크케어(ReWorkCare). All rights reserved.
      </p>
    </div>
  );
}
