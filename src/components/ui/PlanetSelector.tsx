"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Star, Target } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { ALL_BODIES, getBodyById } from "@/data/planets";
import { playSound } from "@/lib/audio";

interface PlanetSelectorProps {
  focusedId: string | null;
  onSelect: (id: string) => void;
  isCompleted: (id: string) => boolean;
  starsFor: (id: string) => number;
  nextPlanetId: string | null;
}

export default function PlanetSelector({
  focusedId,
  onSelect,
  isCompleted,
  starsFor,
  nextPlanetId,
}: PlanetSelectorProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const focused = focusedId ? getBodyById(focusedId) : null;

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => {
          playSound("tap");
          setOpen((v) => !v);
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Find a planet"
        className={`
          group flex items-center gap-2 rounded-full
          px-3 sm:px-4 py-2.5 sm:py-2 text-xs sm:text-sm transition border
          ${
            open
              ? "bg-[#D4AF37]/20 border-[#D4AF37] text-[#FFE9A0]"
              : "bg-black/40 border-white/10 text-white/80 hover:border-[#D4AF37]/50 hover:text-[#FFE9A0]"
          }
        `}
      >
        <Target size={14} strokeWidth={2.2} />
        <span
          className="hidden sm:inline whitespace-nowrap"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {focused ? focused.name : "Pick a planet"}
        </span>
        <span
          dir="rtl"
          className="hidden md:inline text-[11px] opacity-80 whitespace-nowrap"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {focused ? focused.nameAr : "اختر كوكبًا"}
        </span>
        <ChevronDown
          size={13}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.14 }}
            className="
              absolute bottom-full left-0 mb-2 z-30
              min-w-[260px] rounded-2xl
              bg-[#0F0F23]/95 backdrop-blur-xl
              border border-[#D4AF37]/30 shadow-[0_0_40px_rgba(212,175,55,0.18)]
              py-1.5 panel-scroll max-h-[60vh] overflow-y-auto
            "
          >
            {ALL_BODIES.map((body, idx) => {
              const isCurrent = focusedId === body.id;
              const completed = isCompleted(body.id);
              const stars = starsFor(body.id);
              const isNext = body.id === nextPlanetId;
              const stopNumber = body.id === "sun" ? null : idx; // 1..8 for planets

              return (
                <li key={body.id} role="option" aria-selected={isCurrent}>
                  <button
                    type="button"
                    onClick={() => {
                      playSound("tap");
                      onSelect(body.id);
                      setOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 text-left
                      transition relative
                      ${
                        isCurrent
                          ? "bg-[#D4AF37]/15 text-[#FFE9A0]"
                          : "text-white/85 hover:bg-white/5 hover:text-[#FFE9A0]"
                      }
                    `}
                  >
                    <span
                      className={`
                        size-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0
                        ${
                          completed
                            ? "bg-[#D4AF37]/30 text-[#FFE9A0] ring-1 ring-[#D4AF37]/60"
                            : isNext
                              ? "bg-[#E8C547]/20 text-[#FFE9A0] ring-1 ring-[#E8C547]/80 animate-pulse-soft"
                              : "bg-white/10 text-white/70"
                        }
                      `}
                      aria-hidden
                    >
                      {stopNumber === null ? "★" : stopNumber}
                    </span>

                    <span
                      className="size-3 rounded-full ring-1 ring-white/20 flex-shrink-0"
                      style={{
                        background: body.color,
                        boxShadow: `0 0 10px ${body.color}80`,
                      }}
                      aria-hidden
                    />
                    <span
                      className="flex-1 text-sm"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {body.name}
                    </span>

                    {stopNumber !== null && completed && (
                      <span className="flex items-center gap-0.5" aria-hidden>
                        {[0, 1, 2].map((i) => (
                          <Star
                            key={i}
                            size={9}
                            fill={i < stars ? "#E8C547" : "transparent"}
                            color={i < stars ? "#E8C547" : "#ffffff40"}
                            strokeWidth={1.5}
                          />
                        ))}
                      </span>
                    )}

                    <span
                      dir="rtl"
                      className="text-xs text-white/55"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {body.nameAr}
                    </span>
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
