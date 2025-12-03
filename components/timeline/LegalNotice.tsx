/**
 * @file LegalNotice.tsx
 * @description 타임라인 페이지 법적 고지 컴포넌트
 */

export default function LegalNotice() {
  return (
    <div 
      className="rounded-2xl border border-[var(--alert)] bg-[var(--alert)]/10 p-4 sm:p-6"
      role="alert"
      aria-label="법적 고지"
    >
      <p className="text-sm sm:text-base text-foreground leading-relaxed">
        <strong className="font-semibold">※ 법적 고지</strong>
        <br />
        본 페이지는 일반적인 산재 절차 안내를 목적으로 하며, 실제 적용 여부는 근로복지공단의 판단과 개별 사안에 따라 달라질 수 있습니다. 본 정보는 법적 효력을 갖지 않습니다.
      </p>
    </div>
  );
}


