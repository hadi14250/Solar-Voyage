"use client";

import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Star, RotateCcw, X } from "lucide-react";
import UAEFlag from "./UAEFlag";

interface MissionCompleteProps {
  totalStars: number;
  maxStars: number;
  onClose: () => void;
  onReset: () => void;
}

interface ConfettiPiece {
  id: number;
  x: number;
  delay: number;
  duration: number;
  rotate: number;
  color: string;
  shape: "rect" | "circle";
}

const FLAG_COLORS = ["#CE1126", "#009639", "#FFFFFF", "#000000", "#E8C547", "#D4AF37"];

function makeConfetti(count: number): ConfettiPiece[] {
  // Deterministic seed so SSR/CSR markup matches.
  let seed = 9;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: rnd() * 100,
    delay: rnd() * 1.4,
    duration: 2.6 + rnd() * 2.6,
    rotate: rnd() * 720 - 360,
    color: FLAG_COLORS[Math.floor(rnd() * FLAG_COLORS.length)],
    shape: rnd() > 0.55 ? "rect" : "circle",
  }));
}

export default function MissionComplete({
  totalStars,
  maxStars,
  onClose,
  onReset,
}: MissionCompleteProps) {
  const confetti = useMemo(() => makeConfetti(60), []);
  const pct = Math.round((totalStars / maxStars) * 100);

  // Lock body scroll while open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-label="Mission complete"
      aria-modal="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="absolute inset-0 z-50 flex items-center justify-center p-4 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(15,15,35,0.94) 0%, rgba(5,5,15,0.97) 70%)",
      }}
    >
      {/* Confetti layer */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {confetti.map((c) => (
          <motion.span
            key={c.id}
            className="absolute top-[-8%]"
            style={{
              left: `${c.x}%`,
              width: c.shape === "rect" ? 8 : 7,
              height: c.shape === "rect" ? 14 : 7,
              borderRadius: c.shape === "circle" ? "50%" : 1,
              background: c.color,
              boxShadow: `0 0 6px ${c.color}80`,
            }}
            initial={{ y: 0, rotate: 0, opacity: 0 }}
            animate={{
              y: "120vh",
              rotate: c.rotate,
              opacity: [0, 1, 1, 0.9],
            }}
            transition={{
              delay: c.delay,
              duration: c.duration,
              ease: "easeIn",
              repeat: Infinity,
              repeatDelay: 1.5,
            }}
          />
        ))}
      </div>

      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 z-10 rounded-full p-2 text-white/70 hover:text-white hover:bg-white/10 transition"
      >
        <X size={22} />
      </button>

      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 22 }}
        className="relative z-[1] max-w-md w-full text-center"
      >
        {/* Halo + flag medallion */}
        <div className="relative mx-auto mb-6 size-28">
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, #009639, #FFFFFF, #CE1126, #000000, #009639)",
              boxShadow: "0 0 60px rgba(212,175,55,0.55)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-2 rounded-full bg-[#0F0F23] flex items-center justify-center">
            <UAEFlag size={56} className="rounded-md shadow-md" />
          </div>
          {/* Sparkle ring */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.span
              key={i}
              className="absolute size-1.5 rounded-full bg-[#E8C547]"
              style={{
                top: "50%",
                left: "50%",
                marginTop: -3,
                marginLeft: -3,
                transformOrigin: "0 0",
              }}
              animate={{
                rotate: [i * 60, i * 60 + 360],
              }}
              transition={{
                duration: 6 + i,
                repeat: Infinity,
                ease: "linear",
              }}
              initial={{ x: 56, y: 0 }}
            />
          ))}
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-3xl sm:text-4xl font-bold text-white tracking-wide"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Mission Complete
        </motion.h2>
        <motion.p
          dir="rtl"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-1 text-xl text-[#E8C547]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          اكتملت المهمة!
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          className="mt-4 text-sm sm:text-base text-white/85 max-w-sm mx-auto leading-relaxed"
        >
          You guided the Hope Probe across all 8 worlds — carrying a small piece
          of the UAE&apos;s spirit of exploration with you.
        </motion.p>
        <motion.p
          dir="rtl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.4 }}
          className="mt-2 text-sm text-white/70 max-w-sm mx-auto leading-relaxed"
        >
          قُدتَ مسبار الأمل عبر العوالم الثمانية كلها — حاملاً معك قبسًا من روح
          الاستكشاف الإماراتية.
        </motion.p>

        {/* Stars summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-[#D4AF37]/40 bg-white/5 px-5 py-3"
        >
          <Star size={22} fill="#E8C547" color="#E8C547" strokeWidth={1.5} />
          <span className="flex flex-col items-start leading-tight">
            <span
              className="text-2xl font-bold text-[#FFE9A0] tabular-nums"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {totalStars}
              <span className="text-base text-white/50"> / {maxStars}</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-white/55">
              Stars · {pct}%
            </span>
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.4 }}
          className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5"
        >
          <button
            type="button"
            onClick={onClose}
            className="
              w-full sm:w-auto rounded-full px-6 py-3 text-sm font-semibold
              bg-[#D4AF37] text-[#1A1A2E] hover:bg-[#E8C547]
              shadow-[0_0_30px_rgba(212,175,55,0.5)]
              transition flex items-center justify-center gap-2
            "
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span>Keep exploring</span>
            <span dir="rtl" className="opacity-80">
              تابع الاستكشاف
            </span>
          </button>
          <button
            type="button"
            onClick={onReset}
            className="
              w-full sm:w-auto rounded-full px-5 py-3 text-sm font-medium
              border border-white/15 text-white/80 hover:border-[#D4AF37]/50 hover:text-[#FFE9A0]
              transition flex items-center justify-center gap-2
            "
          >
            <RotateCcw size={14} />
            <span>Start over</span>
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
