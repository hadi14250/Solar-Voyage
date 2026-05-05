"use client";

import { motion } from "framer-motion";
import { Rocket, Sparkles, Star } from "lucide-react";
import UAEFlag from "./UAEFlag";

interface LoadingScreenProps {
  /** Called when the user dismisses the loader. Optional — without it, the
   *  screen still acts as a Suspense fallback that auto-disappears. */
  onStart?: () => void;
  /** Whether to show the "Yalla, explore!" CTA. */
  showCTA?: boolean;
  /** Whether the user already has progress (changes copy + CTA). */
  hasProgress?: boolean;
}

const briefingPoints: { en: string; ar: string; icon: React.ReactNode }[] = [
  {
    en: "Visit 8 planet stops in order",
    ar: "زر ٨ محطات كوكبية بالترتيب",
    icon: <Rocket size={14} />,
  },
  {
    en: "Answer a 3-question quiz at each stop",
    ar: "أجب عن ٣ أسئلة في كل محطة",
    icon: <Sparkles size={14} />,
  },
  {
    en: "Earn up to 24 stars on your journey",
    ar: "اكسب حتى ٢٤ نجمة في رحلتك",
    icon: <Star size={14} fill="#E8C547" color="#E8C547" strokeWidth={1.5} />,
  },
];

export default function LoadingScreen({
  onStart,
  showCTA = false,
  hasProgress = false,
}: LoadingScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center text-center px-6 pb-[max(env(safe-area-inset-bottom),1rem)] bg-gradient-to-b from-[#1A1A2E] via-[#0F0F23] to-[#05050F]"
      role="status"
      aria-live="polite"
    >
      {/* Spinning planet icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 220, damping: 18 }}
        className="relative mb-6"
      >
        <div
          className="size-20 rounded-full animate-spin-slow shadow-[0_0_60px_rgba(212,175,55,0.4)]"
          style={{
            background:
              "conic-gradient(from 0deg, #D4AF37, #1f6feb, #c1440e, #D4AF37)",
          }}
        />
        <div className="absolute inset-2 rounded-full bg-[#0F0F23] flex items-center justify-center">
          <UAEFlag size={32} className="rounded-sm" />
        </div>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="text-2xl sm:text-3xl font-semibold text-white tracking-wide"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Solar Voyage
      </motion.h2>
      <motion.p
        dir="rtl"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="mt-1 text-base text-[#E8C547]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        رحلة المجموعة الشمسية
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="mt-4 max-w-sm text-sm text-white/70 leading-relaxed"
      >
        Follow the path of the UAE&apos;s Hope Probe across the solar system. A
        bilingual mission for young explorers.
      </motion.p>

      {/* Mission briefing card */}
      <motion.ul
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.08, delayChildren: 0.4 } },
        }}
        className="mt-6 space-y-2 text-left max-w-sm w-full"
      >
        {briefingPoints.map((p, i) => (
          <motion.li
            key={i}
            variants={{
              hidden: { opacity: 0, x: -12 },
              show: { opacity: 1, x: 0 },
            }}
            className="flex items-center gap-3 rounded-xl border border-[#D4AF37]/25 bg-white/[0.03] px-3 py-2"
          >
            <span
              className="size-7 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#FFE9A0] flex-shrink-0"
              aria-hidden
            >
              {p.icon}
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-[13px] text-white/90 leading-tight">
                {p.en}
              </span>
              <span
                dir="rtl"
                className="block text-[12px] text-white/60 leading-tight mt-0.5"
              >
                {p.ar}
              </span>
            </span>
          </motion.li>
        ))}
      </motion.ul>

      {showCTA && onStart && (
        <motion.button
          type="button"
          onClick={onStart}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.4 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="
            mt-7 rounded-full px-7 py-3 text-sm font-semibold
            bg-[#D4AF37] text-[#1A1A2E] hover:bg-[#E8C547]
            shadow-[0_0_30px_rgba(212,175,55,0.6)]
            transition flex items-center gap-2
          "
          style={{ fontFamily: "var(--font-display)" }}
        >
          <Rocket size={15} />
          <span>{hasProgress ? "Continue mission" : "Yalla, explore!"}</span>
          <span dir="rtl" className="opacity-80">
            {hasProgress ? "تابع المهمة" : "يلا، نستكشف!"}
          </span>
        </motion.button>
      )}
    </motion.div>
  );
}
