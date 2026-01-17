/**
 * @file LegalNotice.tsx
 * @description 타임라인 페이지 법적 고지 컴포넌트
 */

interface LegalNoticeProps {
  title: string;
  content: string;
}

export default function LegalNotice({ title, content }: LegalNoticeProps) {
  return (
    <div 
      className="rounded-lg border border-[var(--alert)] bg-[var(--alert)]/10 p-4 sm:p-6"
      role="alert"
      aria-label="법적 고지"
    >
      <p className="text-sm sm:text-base text-foreground leading-relaxed">
        <strong className="font-semibold">{title}</strong>
        <br />
        {content}
      </p>
    </div>
  );
}



