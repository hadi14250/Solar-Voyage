"use client";

import UAEFlag from "./UAEFlag";
import ProgressBar from "./ProgressBar";

interface TitleBarProps {
  completedCount: number;
  totalPlanets: number;
  totalStars: number;
  maxStars: number;
}

export default function TitleBar({
  completedCount,
  totalPlanets,
  totalStars,
  maxStars,
}: TitleBarProps) {
  return (
    <header
      className="
        pointer-events-none absolute top-0 inset-x-0 z-20
        flex items-start justify-between gap-3
        px-3 sm:px-6 pt-[max(env(safe-area-inset-top),0.75rem)] pb-3 sm:pb-4
      "
    >
      <div className="pointer-events-auto flex items-center gap-2 sm:gap-3 rounded-full bg-black/40 backdrop-blur-md gold-border px-3 sm:px-4 py-1.5 sm:py-2">
        <UAEFlag size={22} className="rounded-sm shadow-sm flex-shrink-0" />
        <div className="flex items-baseline gap-2 sm:gap-3 leading-tight">
          <h1
            className="text-sm sm:text-lg font-semibold tracking-wide text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Solar Voyage
          </h1>
          <span className="hidden sm:inline text-[#D4AF37]/70">|</span>
          <span
            dir="rtl"
            className="hidden sm:inline text-sm sm:text-base text-[#E8C547]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            رحلة المجموعة الشمسية
          </span>
        </div>
      </div>

      <ProgressBar
        completedCount={completedCount}
        totalPlanets={totalPlanets}
        totalStars={totalStars}
        maxStars={maxStars}
      />
    </header>
  );
}
