import { cn } from "@/lib/utils";

type RiuIconVariant = "smile" | "question" | "cheer" | "success" | "marker";

export interface RiuIconProps extends React.SVGAttributes<SVGSVGElement> {
  variant?: RiuIconVariant;
  size?: number;
  animated?: boolean;
}

const mouthPaths: Record<RiuIconVariant, string> = {
  smile: "M28 32c2 3 6 3 8 0",
  question: "M27 30c1.5-2 5.5-2 7 0 1 1.4.6 3-1 3.6",
  cheer: "M26.5 31c3 3.2 8 3.2 11 0",
  success: "M24 31l4 4 8-6",
  marker: "M28 32c2 3 6 3 8 0",
};

const eyeOffset: Record<RiuIconVariant, number> = {
  smile: 0,
  question: 0,
  cheer: -0.5,
  success: 0,
  marker: 0,
};

const variantLabels: Record<RiuIconVariant, string> = {
  smile: "리우가 웃고 있어요",
  question: "리우가 궁금해하고 있어요",
  cheer: "리우가 응원하고 있어요",
  success: "리우가 축하하고 있어요",
  marker: "지도용 리우 표시",
};

export function RiuIcon({
  variant = "smile",
  size = 48,
  animated,
  className,
  ...props
}: RiuIconProps) {
  const radius = variant === "marker" ? 22 : 20;
  const viewBox = variant === "marker" ? "0 0 64 80" : "0 0 64 64";
  const faceCx = 32;
  const faceCy = variant === "marker" ? 30 : 32;
  const faceStroke = "#2F6E4F";
  const cheeksY = faceCy + 8 + eyeOffset[variant];

  return (
    <svg
      width={size}
      height={variant === "marker" ? size * 1.25 : size}
      viewBox={viewBox}
      fill="none"
      aria-label={variantLabels[variant]}
      role="img"
      className={cn(animated && "animate-riu-bounce", className)}
      {...props}
    >
      {variant === "marker" && (
        <path
          d="M32 4C18.7 4 8 14.7 8 28c0 17.2 20.3 44 23.1 47.3.5.5 1.3.5 1.8 0C36 72 56 45.2 56 28 56 14.7 45.3 4 32 4Z"
          fill="#F5F9F6"
          stroke={faceStroke}
          strokeWidth={2}
        />
      )}
      <circle
        cx={faceCx}
        cy={faceCy}
        r={radius}
        fill="#FFFFFF"
        stroke={faceStroke}
        strokeWidth={2}
      />
      {/* Eyes */}
      <circle
        cx={faceCx - 7}
        cy={faceCy - 4 + eyeOffset[variant]}
        r={2}
        fill="#1C1C1E"
      />
      <circle
        cx={faceCx + 7}
        cy={faceCy - 4 + eyeOffset[variant]}
        r={2}
        fill="#1C1C1E"
      />
      {/* Mouth */}
      <path
        d={mouthPaths[variant]}
        fill="none"
        stroke={variant === "success" ? "#2F6E4F" : "#1C1C1E"}
        strokeWidth={variant === "success" ? 3 : 2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Cheeks */}
      {variant !== "marker" && (
        <>
          <circle
            cx={faceCx - 12}
            cy={cheeksY}
            r={3}
            fill="#FFD54F"
            opacity={0.7}
          />
          <circle
            cx={faceCx + 12}
            cy={cheeksY}
            r={3}
            fill="#FFD54F"
            opacity={0.7}
          />
        </>
      )}
      {/* Leaf */}
      <path
        d="M32 6c-1.5 3-2 5.5-1.2 7.5 4.5.4 7.2-1.1 8-5.5-2.1-1.2-4.2-2-6.8-2Z"
        fill="#A5D6A7"
        stroke={faceStroke}
        strokeWidth={1.5}
        className="animate-leaf-sway origin-[32px_6px]"
      />
      {variant === "question" && (
        <text
          x={faceCx + 14}
          y={faceCy - 8}
          fontSize="12"
          fill="#2F6E4F"
          fontWeight="bold"
        >
          ?
        </text>
      )}
      {variant === "marker" && (
        <circle cx={faceCx} cy={faceCy + 28} r={6} fill="#2F6E4F" opacity={0.25} />
      )}
    </svg>
  );
}

export default RiuIcon;









