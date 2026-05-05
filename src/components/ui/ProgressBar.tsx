"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface ProgressBarProps {
  completedCount: number;
  totalPlanets: number;
  totalStars: number;
  maxStars: number;
}

export default function ProgressBar({
  completedCount,
  totalPlanets,
  totalStars,
  maxStars,
}: ProgressBarProps) {
  const pct = Math.round((completedCount / totalPlanets) * 100);
  const justCompleted = completedCount > 0 && completedCount === totalPlanets;

  return (
    <div
      className="pointer-events-auto flex items-center gap-2.5 sm:gap-3 rounded-full bg-black/40 backdrop-blur-md gold-border px-3 sm:px-4 py-1.5 sm:py-2"
      role="status"
      aria-label={`${completedCount} of ${totalPlanets} planets explored, ${totalStars} of ${maxStars} stars earned`}
    >
      <div className="flex items-center gap-1.5">
        <motion.span
          key={totalStars}
          initial={{ scale: 1.4, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 14 }}
        >
          <Star size={14} fill="#E8C547" color="#E8C547" strokeWidth={1.5} />
        </motion.span>
        <span
          className="text-[12px] sm:text-sm font-semibold text-[#FFE9A0] tabular-nums"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {totalStars}
          <span className="opacity-50">/{maxStars}</span>
        </span>
      </div>

      <span className="h-4 w-px bg-white/15" aria-hidden />

      <div className="flex items-center gap-2">
        <div
          className="relative h-1.5 w-20 sm:w-28 rounded-full bg-white/10 overflow-hidden"
          aria-hidden
        >
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 22 }}
            style={{
              background: justCompleted
                ? "linear-gradient(90deg, #009639, #E8C547, #CE1126)"
                : "linear-gradient(90deg, #D4AF37, #E8C547)",
              boxShadow: justCompleted
                ? "0 0 18px rgba(232,197,71,0.7)"
                : "0 0 12px rgba(212,175,55,0.45)",
            }}
          />
        </div>
        <span
          className="text-[11px] sm:text-xs text-white/75 tabular-nums whitespace-nowrap"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {completedCount}
          <span className="opacity-50">/{totalPlanets}</span>
        </span>
      </div>
    </div>
  );
}
