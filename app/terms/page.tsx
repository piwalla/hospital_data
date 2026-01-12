"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Scale } from "lucide-react";

export default function TermsOfServicePage() {
  const lastUpdated = "2026. 01. 09";

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 px-8 py-10 text-white">
          <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white transition-colors mb-6 group">
            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            홈으로 돌아가기
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Scale className="w-6 h-6 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold">서비스 이용약관</h1>
          </div>
          <p className="text-slate-400">
            리워크케어(ReWorkCare) 서비스를 이용해주셔서 감사합니다.<br />
            본 약관은 서비스 이용에 관한 권리와 의무를 규정합니다.
          </p>
          <div className="mt-6 inline-block px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-500">
            최종 개정일: {lastUpdated}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 sm:p-12 space-y-10 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
              제1조 (목적)
            </h2>
            <p className="pl-3">
              본 약관은 &apos;리워크케어&apos;(이하 &quot;회사&quot;)가 운영하는 웹사이트 및 관련 서비스를 이용함에 있어, 
              회사와 이용자 사이의 권리, 의무 및 책임 사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
              제2조 (용어의 정의)
            </h2>
            <p className="pl-3">
              1. &quot;서비스&quot;라 함은 회사가 제공하는 산재 지원 정보, 보상금 모의 계산, 서류 안내 등의 일체 기능을 의미합니다.<br />
              2. &quot;이용자&quot;라 함은 본 약관에 동의하고 회사가 제공하는 서비스를 이용하는 회원 및 비회원을 의미합니다.
            </p>
          </section>

          <section className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
            <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
              제3조 (중요 고지 및 책임 제한)
            </h2>
            <div className="pl-3 space-y-3 font-medium text-slate-800">
              <p className="text-blue-700 bg-blue-100/50 px-2 py-1 rounded inline-block">
                ※ 본 서비스 이용 전 반드시 확인하시기 바랍니다.
              </p>
              <p>
                1. 회사가 제공하는 모든 정보(산재 보상금 계산 결과 포함)는 공공데이터 및 일반적인 법령을 기반으로 한 **참고용**입니다.
              </p>
              <p>
                2. 본 서비스는 어떠한 경우에도 법률적 자문이나 의학적 전문 진단을 대신할 수 없습니다. 이용자는 개별적인 권리 구제 또는 치료를 위해 반드시 공인노무사, 변호사, 의사 등 관련 전문가와 상담해야 합니다.
              </p>
              <p>
                3. 회사는 이용자가 서비스를 통해 얻은 정보로 인해 발생한 직/간접적 손해에 대하여 법적 책임을 지지 않습니다.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
              제4조 (회원의 가입 및 탈퇴)
            </h2>
            <p className="pl-3">
              1. 이용자는 회사가 제시한 양식에 자기 정보를 기입함으로써 회원가입을 신청합니다.<br />
              2. 회원은 언제든지 서비스 내 설정 또는 고객문의를 통해 탈퇴를 요청할 수 있으며, 회사는 지체 없이 이를 처리합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
              제5조 (게시물의 관리)
            </h2>
            <p className="pl-3">
              이용자가 게시한 게시물이 법령에 위반되거나 타인의 권리를 침해하는 경우, 회사는 이를 예고 없이 삭제하거나 접근을 제한할 수 있습니다.
            </p>
          </section>

          <div className="pt-10 border-t border-slate-100 flex justify-center">
            <Button asChild variant="outline" className="px-10 h-12 rounded-full border-slate-200 hover:bg-slate-50 transition-all font-semibold">
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
