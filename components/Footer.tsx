/**
 * @file Footer.tsx
 * @description 사이트 하단 Footer 컴포넌트
 * 
 * 데스크톱에서만 표시되며, 서비스 정보, 링크, 연락처, 법적 고지 등을 포함합니다.
 * 모바일에서는 하단 네비게이션이 있으므로 Footer는 숨김 처리됩니다.
 */

import Link from "next/link";
import Image from "next/image";
import { getDisclaimer } from "@/lib/utils/disclaimer";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // TODO: 실제 이메일 주소로 교체 필요
  const contactEmail = "contact@reworkcare.com";

  // TODO: 실제 소셜 미디어 링크로 교체 필요
  const socialLinks = [
    {
      name: "Facebook",
      href: "#",
      icon: "📘",
    },
    {
      name: "Instagram",
      href: "#",
      icon: "📷",
    },
    {
      name: "YouTube",
      href: "#",
      icon: "▶️",
    },
  ];

  return (
    <footer 
      className="hidden md:block bg-gray-50 border-t border-gray-200"
      role="contentinfo"
      aria-label="사이트 하단 정보"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* 서비스 정보 섹션 */}
          <div className="space-y-4">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-lg font-bold text-foreground transition-opacity duration-200 hover:opacity-90"
              style={{ fontFamily: 'Paperozi, sans-serif', fontWeight: 700 }}
            >
              <Image
                src="/icons/파이왈라_마크-removebg-preview.png"
                alt="리워크케어 로고"
                width={28}
                height={28}
                className="w-7 h-7 object-contain"
              />
              리워크케어
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              산재 환자를 위한 통합 지원 플랫폼
            </p>
            <Link
              href="/about"
              className="text-sm text-primary hover:text-primary/80 transition-colors duration-200 underline inline-block"
            >
              더 알아보기 →
            </Link>
          </div>

          {/* 서비스 소개 섹션 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">서비스 소개</h3>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                AI기술을 활용해 산재 환자와 가족을 위한 정보를 제공합니다.
              </p>
            </div>
          </div>

          {/* 연락처 섹션 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">연락처</h3>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                이메일:{" "}
                <a
                  href={`mailto:${contactEmail}`}
                  className="hover:text-foreground transition-colors duration-200 underline"
                >
                  {contactEmail}
                </a>
              </p>
            </div>
          </div>

          {/* 소셜 미디어 섹션 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">소셜 미디어</h3>
            <nav aria-label="소셜 미디어 링크">
              <ul className="flex gap-4">
                {socialLinks.map((social) => (
                  <li key={social.name}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-2xl hover:opacity-70 transition-opacity duration-200"
                      aria-label={`${social.name}로 이동`}
                    >
                      {social.icon}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* 구분선 */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          {/* 법적 고지 */}
          <div className="mb-6 text-center">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="font-semibold">법적 고지</strong>
              <br />
              {getDisclaimer()}
              <br />
              본 정보는 법적 효력을 갖지 않으며, 참고용입니다.
            </p>
          </div>

          {/* 저작권 정보 */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              © {currentYear} 리워크케어(ReWorkCare). All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

