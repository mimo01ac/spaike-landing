type LogoSize = "sm" | "md" | "lg";

interface LogoProps {
  size?: LogoSize;
}

const sizeMap: Record<LogoSize, { wordmark: string; icon: string; gap: string }> = {
  sm: { wordmark: "text-xl", icon: "w-5 h-5", gap: "gap-1.5" },
  md: { wordmark: "text-2xl md:text-3xl", icon: "w-6 h-6 md:w-7 md:h-7", gap: "gap-2" },
  lg: { wordmark: "text-6xl md:text-8xl", icon: "w-12 h-12 md:w-16 md:h-16", gap: "gap-3 md:gap-4" },
};

export default function Logo({ size = "md" }: LogoProps) {
  const s = sizeMap[size];

  return (
    <div className={`flex items-center ${s.gap}`}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${s.icon} text-spaike-blue shrink-0`}
        aria-hidden="true"
      >
        <path
          d="M13 2L3 14h7l-2 8L18 10h-7l2-8z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeLinejoin="round"
        />
      </svg>
      <span className={`${s.wordmark} font-bold tracking-tight leading-none`}>
        Sp<span className="text-spaike-blue">AI</span>ke
      </span>
    </div>
  );
}
