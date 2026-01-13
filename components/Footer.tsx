/**
 * @file Footer.tsx
 * @description 사이트 하단 Footer 컴포넌트
 * 
 * 데스크톱에서만 표시되며, 서비스 정보, 링크, 연락처, 법적 고지 등을 포함합니다.
 * 모바일에서는 하단 네비게이션이 있으므로 Footer는 숨김 처리됩니다.
 */

import Link from "next/link";
import Image from "next/image";

import CSChatDialog from "@/components/cs/CSChatDialog";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // TODO: 실제 이메일 주소로 교체 필요 (Updated)

  // TODO: 실제 소셜 미디어 링크로 교체 필요 (Updated)
  const socialLinks = [
    {
      name: "YouTube",
      href: "https://www.youtube.com/@reworkcare",
      icon: "▶️",
    },
  ];

  return (
    <footer 
      className="hidden md:block bg-slate-50 border-t border-slate-200"
      role="contentinfo"
      aria-label="사이트 하단 정보"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Upper Section: Brand & Interact */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-10">
          
          {/* Left: Brand Identity & Intro */}
          <div className="space-y-4 max-w-lg">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-xl font-bold text-slate-900 transition-opacity hover:opacity-80"
              style={{ fontFamily: 'Paperozi, sans-serif' }}
            >
              <Image
                src="/landing/brand-logo-removebg-preview.png"
                alt="리워크케어 로고"
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
              />
              리워크케어
            </Link>
            
            <div className="space-y-1">
              <p className="text-base font-medium text-slate-700">
                산재 환자를 위한 통합 지원 플랫폼
              </p>
              <p className="text-sm text-slate-500 leading-relaxed">
                AI 기술을 활용하여 복잡한 산재 정보를 이해하기 쉽게 제공하고,<br/>
                환자와 가족의 일상 회복을 돕습니다.
              </p>
              <Link
                href="/about"
                className="inline-block text-sm font-semibold text-slate-900 hover:text-slate-700 mt-2 transition-colors"
              >
                서비스 소개 보기 →
              </Link>
            </div>
          </div>

          {/* Right: Connect & Actions */}
          <div className="flex flex-col lg:items-end space-y-5">
            <div className="flex items-center gap-4">
              <CSChatDialog />
              <div className="h-4 w-px bg-slate-200" />
              
              {/* Added Notice Link */}
              <Link
                href="/community/notice"
                className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1"
                aria-label="공지사항"
              >
                공지사항
              </Link>

              <div className="h-4 w-px bg-slate-200" />

              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-2xl hover:scale-110 transition-transform duration-200 opacity-80 hover:opacity-100"
                    aria-label={`${social.name}로 이동`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
            
            {/* Customer Support Removed */}
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-slate-200" />

        {/* Bottom Section: Legal & Copyright */ }
        <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-6 text-xs text-slate-500">
          
          {/* Disclaimer & Copyright */}
          <div className="flex flex-col md:items-start items-center gap-2 text-center md:text-left">
             <p className="opacity-80">
               본 사이트의 정보는 참고용이며 법적 효력이 없습니다. 정확한 내용은 근로복지공단 또는 전문가와 상의하세요.
             </p>
             <p className="font-medium">
               © {currentYear} ReWorkCare. All rights reserved.
             </p>
          </div>

          {/* Legal Links */}
          <div className="flex gap-6 font-medium">
            <Link href="/terms" className="hover:text-slate-900 transition-colors">
              이용약관
            </Link>
            <Link href="/privacy" className="hover:text-slate-900 transition-colors">
              개인정보처리방침
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

