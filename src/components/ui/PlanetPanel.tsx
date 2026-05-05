"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import {
  X,
  ChevronLeft,
  Sparkles,
  Star,
  Rocket,
  BookOpen,
} from "lucide-react";
import { ALL_BODIES } from "@/data/planets";
import { useIsDesktop } from "@/lib/useMediaQuery";
import { playSound } from "@/lib/audio";
import UAEFlag from "./UAEFlag";
import Quiz from "./Quiz";

interface PlanetPanelProps {
  focusedId: string | null;
  onClose: () => void;
  starsFor: (id: string) => number;
  isCompleted: (id: string) => boolean;
  recordQuiz: (planetId: string, stars: number) => void;
}

const TYPE_COLORS: Record<string, string> = {
  rocky: "#D4A574",
  "gas-giant": "#E8C547",
  "ice-giant": "#7DD3FC",
  star: "#FFB347",
};

type View = "intro" | "facts" | "quiz";

export default function PlanetPanel({
  focusedId,
  onClose,
  starsFor,
  isCompleted,
  recordQuiz,
}: PlanetPanelProps) {
  const data = focusedId ? ALL_BODIES.find((b) => b.id === focusedId) : null;
  const isMars = data?.id === "mars";
  const isPlanet = !!data && data.type !== "star";
  const accent = data ? TYPE_COLORS[data.type] : "#D4AF37";
  const isDesktop = useIsDesktop();
  const dragControls = useDragControls();
  const earnedStars = data ? starsFor(data.id) : 0;
  const completed = data ? isCompleted(data.id) : false;

  const [view, setView] = useState<View>("intro");

  // Mark the body so 3D scene labels (rendered via drei <Html>) hide while a
  // planet panel is open. Otherwise on mobile they bleed through the panel
  // because <Html> renders into a portal at the document root.
  useEffect(() => {
    if (!data) return;
    document.body.dataset.panelOpen = "true";
    return () => {
      delete document.body.dataset.panelOpen;
    };
  }, [data]);

  return (
    <AnimatePresence>
      {data && (
        <>
          {/* Mobile-only backdrop — desktop keeps scene visible alongside */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-30 bg-black/40 sm:hidden"
            onClick={onClose}
            aria-hidden
          />

          <motion.aside
            key={data.id}
            role="dialog"
            aria-label={`${data.name} information`}
            initial={isDesktop ? { x: "100%", y: 0 } : { y: "100%", x: 0 }}
            animate={{ x: 0, y: 0 }}
            exit={isDesktop ? { x: "100%" } : { y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            drag={isDesktop ? false : "y"}
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) onClose();
            }}
            className={`
              absolute z-40 flex flex-col
              bg-[#0F0F23]/94 backdrop-blur-xl
              shadow-[0_-10px_60px_rgba(0,0,0,0.6),0_0_60px_rgba(212,175,55,0.12)]

              left-0 right-0 bottom-0 border-t border-[#D4AF37]/30
              ${
                view === "quiz"
                  ? "h-dvh max-h-dvh rounded-t-none"
                  : "h-[80dvh] max-h-[85dvh] rounded-t-3xl"
              }

              sm:left-auto sm:right-0 sm:top-0 sm:bottom-auto
              sm:h-full sm:max-h-none sm:w-[420px] md:w-[460px]
              sm:rounded-none sm:border-t-0 sm:border-l sm:border-[#D4AF37]/25
            `}
          >
            {/* Mobile drag handle — only when NOT in quiz (full-screen quiz shouldn't be draggable closed) */}
            {view !== "quiz" && (
              <div
                onPointerDown={(e) => {
                  if (!isDesktop) dragControls.start(e);
                }}
                style={{ touchAction: "none" }}
                className="sm:hidden flex justify-center pt-2.5 pb-1.5 cursor-grab active:cursor-grabbing"
                aria-hidden
              >
                <span className="block h-1 w-10 rounded-full bg-white/30" />
              </div>
            )}

            {/* Compact header for quiz mode — just close button + planet name */}
            {view === "quiz" ? (
              <div
                className="px-4 pt-[max(env(safe-area-inset-top),0.6rem)] pb-2 flex items-center justify-between gap-2 border-b border-white/5"
                style={{
                  background: `linear-gradient(180deg, ${accent}20, transparent)`,
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    playSound("tap");
                    setView("intro");
                  }}
                  aria-label="Back to intro"
                  className="rounded-full p-1.5 -m-1 text-white/70 hover:text-white hover:bg-white/10 transition"
                >
                  <ChevronLeft size={20} />
                </button>
                <span
                  className="text-sm font-bold text-white truncate"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {data.name}
                  <span dir="rtl" className="text-white/55 ml-2 font-normal">
                    {data.nameAr}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    playSound("tap");
                    onClose();
                  }}
                  aria-label="Close panel"
                  className="rounded-full p-1.5 -m-1 text-white/70 hover:text-white hover:bg-white/10 transition"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <div
                className="px-5 pt-2 sm:pt-[max(env(safe-area-inset-top),1rem)] pb-3 border-b border-white/5"
                style={{
                  background: `linear-gradient(180deg, ${accent}20, transparent)`,
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      playSound("tap");
                      onClose();
                    }}
                    aria-label="Back to system view"
                    className="flex items-center gap-1.5 text-xs text-white/70 hover:text-[#E8C547] transition"
                  >
                    <ChevronLeft size={16} />
                    <span className="hidden sm:inline">Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playSound("tap");
                      onClose();
                    }}
                    aria-label="Close panel"
                    className="rounded-full p-2 -m-1 text-white/70 hover:text-white hover:bg-white/10 transition"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="mt-2 flex items-baseline justify-between gap-3">
                  <h2
                    className="text-2xl sm:text-3xl font-bold text-white tracking-wide"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {data.name}
                  </h2>
                  <span
                    dir="rtl"
                    className="text-xl sm:text-2xl font-medium"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: accent,
                    }}
                  >
                    {data.nameAr}
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-2 text-[11px] uppercase tracking-widest">
                  <span
                    className="px-2 py-0.5 rounded-full border"
                    style={{ borderColor: `${accent}66`, color: accent }}
                  >
                    {data.type === "gas-giant"
                      ? "Gas Giant"
                      : data.type === "ice-giant"
                        ? "Ice Giant"
                        : data.type === "star"
                          ? "Star"
                          : "Rocky"}
                  </span>
                  <span dir="rtl" className="text-white/60 text-xs">
                    {data.typeAr}
                  </span>
                  {isPlanet && completed && (
                    <span
                      className="ml-auto flex items-center gap-0.5"
                      aria-label={`${earnedStars} of 3 stars earned`}
                    >
                      {[0, 1, 2].map((i) => (
                        <Star
                          key={i}
                          size={13}
                          fill={i < earnedStars ? "#E8C547" : "transparent"}
                          color={i < earnedStars ? "#E8C547" : "#ffffff55"}
                          strokeWidth={1.5}
                        />
                      ))}
                    </span>
                  )}
                </div>

                {/* View tabs — only show for planets, not in quiz */}
                {isPlanet && (
                  <div className="mt-3 flex gap-1 p-1 rounded-full bg-white/5 border border-white/10">
                    {([
                      { id: "intro", label: "Intro", labelAr: "مقدمة", icon: Rocket },
                      { id: "facts", label: "Facts", labelAr: "حقائق", icon: BookOpen },
                      { id: "quiz", label: "Quiz", labelAr: "اختبار", icon: Sparkles },
                    ] as const).map(({ id, label, labelAr, icon: Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => {
                          playSound("tap");
                          setView(id);
                        }}
                        className={`
                          flex-1 flex items-center justify-center gap-1.5 rounded-full py-1.5 text-[11px] font-bold uppercase tracking-wide
                          transition
                          ${
                            view === id
                              ? "bg-[#D4AF37] text-[#1A1A2E] shadow-[0_2px_0_#B8962E]"
                              : "text-white/65 hover:text-white"
                          }
                        `}
                      >
                        <Icon size={11} strokeWidth={2.5} />
                        <span>{label}</span>
                        <span dir="rtl" className="hidden sm:inline opacity-80 font-normal text-[10px]">
                          {labelAr}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Body — quiz fills the remaining space exactly; intro/facts scroll. */}
            {isPlanet && view === "quiz" ? (
              <div className="flex-1 min-h-0 flex flex-col">
                <Quiz
                  key={`${data.id}-${earnedStars}`}
                  planetId={data.id}
                  accent={accent}
                  previousStars={earnedStars}
                  onComplete={(s) => recordQuiz(data.id, s)}
                />
              </div>
            ) : (
              <div className="panel-scroll flex-1 overflow-y-auto px-5 py-4 sm:py-5 space-y-4 pb-[max(env(safe-area-inset-bottom),1rem)]">
                {!isPlanet && <SunIntro accent={accent} />}

                {isPlanet && view === "intro" && (
                  <IntroView
                    data={data}
                    isMars={isMars}
                    accent={accent}
                    earnedStars={earnedStars}
                    completed={completed}
                    onLearn={() => {
                      playSound("tap");
                      setView("facts");
                    }}
                    onStartQuiz={() => {
                      playSound("whoosh");
                      setView("quiz");
                    }}
                  />
                )}

                {isPlanet && view === "facts" && (
                  <FactsView
                    data={data}
                    accent={accent}
                    isMars={isMars}
                    onStartQuiz={() => {
                      playSound("whoosh");
                      setView("quiz");
                    }}
                  />
                )}
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Intro view — the welcoming card the kid sees first.

interface IntroViewProps {
  data: typeof ALL_BODIES[number];
  isMars: boolean;
  accent: string;
  earnedStars: number;
  completed: boolean;
  onLearn: () => void;
  onStartQuiz: () => void;
}

function IntroView({
  data,
  isMars,
  accent,
  earnedStars,
  completed,
  onLearn,
  onStartQuiz,
}: IntroViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Big planet emoji-style avatar */}
      <div className="flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.05 }}
          className="size-24 rounded-full mb-3"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${data.color}, #000)`,
            boxShadow: `0 0 50px ${accent}80, inset -8px -8px 24px #000a`,
          }}
          aria-hidden
        />

        <p
          className="text-[15px] sm:text-base text-white/90 leading-relaxed max-w-sm"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Welcome to <span className="font-bold" style={{ color: accent }}>{data.name}</span>!
        </p>
        <p
          dir="rtl"
          className="mt-1 text-sm text-white/70 max-w-sm"
          style={{ fontFamily: "var(--font-display)" }}
        >
          أهلاً بك في <span className="font-bold" style={{ color: accent }}>{data.nameAr}</span>!
        </p>

        <p className="mt-3 text-[13px] text-white/65 leading-relaxed max-w-sm">
          Learn 4 cool facts, then play a 3-question quiz to earn stars.
        </p>
        <p
          dir="rtl"
          className="mt-1 text-[13px] text-white/55 leading-relaxed max-w-sm"
        >
          تعلّم ٤ حقائق ممتعة، ثم العب اختبارًا من ٣ أسئلة لتكسب النجوم.
        </p>
      </div>

      {/* Mars Hope Probe shoutout */}
      {isMars && (
        <div className="rounded-xl border border-[#CE1126]/40 bg-gradient-to-br from-[#CE1126]/15 via-white/5 to-[#009639]/15 p-3.5">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <UAEFlag size={26} className="rounded-sm" />
            <span
              className="text-[13px] font-bold text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              UAE Hope Probe
            </span>
            <span
              dir="rtl"
              className="text-[13px] text-[#E8C547]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              مسبار الأمل
            </span>
          </div>
          <p className="text-[12px] text-white/85 leading-snug">
            See the gold satellite circling Mars? That&apos;s the UAE&apos;s
            Hope Probe — the first Arab spacecraft to reach another planet!
          </p>
        </div>
      )}

      {/* Action stack — Duolingo-style big buttons */}
      <div className="space-y-2.5 pt-1">
        <BigButton
          onClick={onStartQuiz}
          color={accent}
          shadowColor="#B8962E"
          icon={<Rocket size={18} strokeWidth={2.5} />}
          label={completed ? "Play again" : "Start mission"}
          labelAr={completed ? "العب مجددًا" : "ابدأ المهمة"}
          subtitle={
            completed
              ? `Best: ${earnedStars}/3 ★`
              : "Earn up to 3 ★"
          }
        />

        <button
          type="button"
          onClick={onLearn}
          className="w-full rounded-2xl border-2 border-white/15 hover:border-white/30 bg-white/[0.04] hover:bg-white/[0.08] py-3 px-4 flex items-center justify-center gap-2 text-sm font-bold text-white/85 transition active:translate-y-px"
        >
          <BookOpen size={15} strokeWidth={2.5} />
          <span>Read the facts first</span>
          <span dir="rtl" className="opacity-70 font-normal text-xs">
            اقرأ الحقائق أولاً
          </span>
        </button>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Facts view — stats grid + did-you-knows.

interface FactsViewProps {
  data: typeof ALL_BODIES[number];
  accent: string;
  isMars: boolean;
  onStartQuiz: () => void;
}

function FactsView({ data, accent, isMars, onStartQuiz }: FactsViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {isMars && (
        <div className="rounded-xl border border-[#CE1126]/40 bg-gradient-to-br from-[#CE1126]/15 via-white/5 to-[#009639]/15 p-3.5">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <UAEFlag size={26} className="rounded-sm" />
            <span
              className="text-[13px] font-bold text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              UAE Hope Probe
            </span>
            <span
              dir="rtl"
              className="text-[13px] text-[#E8C547]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              مسبار الأمل
            </span>
          </div>
          <p className="text-[12px] text-white/85 leading-snug">
            The UAE Hope Probe reached Mars in February 2021 — the first Arab
            interplanetary mission and the first to study the planet&apos;s
            entire weather cycle from orbit.
          </p>
          <p
            dir="rtl"
            className="mt-1.5 text-[12px] text-white/70 leading-snug"
          >
            وصل مسبار الأمل إلى المريخ في فبراير ٢٠٢١، وهو أول مهمة عربية بين
            الكواكب.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <Stat label="Distance from Sun" labelAr="المسافة من الشمس" value={data.distanceFromSun.en} valueAr={data.distanceFromSun.ar} accent={accent} />
        <Stat label="Diameter" labelAr="القطر" value={data.diameter.en} valueAr={data.diameter.ar} accent={accent} />
        <Stat label="Day length" labelAr="طول اليوم" value={data.dayLength.en} valueAr={data.dayLength.ar} accent={accent} />
        <Stat label="Year length" labelAr="طول السنة" value={data.yearLength.en} valueAr={data.yearLength.ar} accent={accent} />
      </div>

      <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-[#D4AF37]/20 p-4 space-y-3">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-[#E8C547]">
          <Sparkles size={13} />
          <span>Did you know?</span>
          <span dir="rtl" className="opacity-70 normal-case tracking-normal">
            هل تعلم؟
          </span>
        </div>
        <ul className="space-y-3">
          {data.facts.map((f, i) => (
            <li key={i} className="text-[13px] leading-relaxed">
              <p className="text-white/90">{f.en}</p>
              <p dir="rtl" className="mt-1 text-white/65">
                {f.ar}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <BigButton
        onClick={onStartQuiz}
        color={accent}
        shadowColor="#B8962E"
        icon={<Rocket size={18} strokeWidth={2.5} />}
        label="I'm ready — start quiz!"
        labelAr="أنا جاهز — ابدأ الاختبار!"
        subtitle="3 questions · earn up to 3 ★"
      />
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Read-only Sun view.

function SunIntro({ accent }: { accent: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: 360 }}
        transition={{ scale: { type: "spring" }, rotate: { duration: 60, repeat: Infinity, ease: "linear" } }}
        className="size-24 rounded-full mx-auto mt-2"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, #FFE08A, #FDB813 60%, #c1440e)",
          boxShadow: "0 0 60px #FFB347aa",
        }}
        aria-hidden
      />
      <p className="text-[15px] text-white/90 max-w-sm mx-auto leading-relaxed">
        The Sun is our star! It holds the solar system together with its
        gravity, and gives us light and warmth.
      </p>
      <p dir="rtl" className="text-[13px] text-white/65 max-w-sm mx-auto leading-relaxed">
        الشمس نجمنا! تحافظ على تماسك المجموعة الشمسية بجاذبيتها، وتمنحنا الضوء والدفء.
      </p>
      <div className="rounded-xl border p-3 mx-auto max-w-sm" style={{ borderColor: `${accent}40`, background: `${accent}10` }}>
        <p className="text-[12px] text-white/75 leading-snug">
          The Sun contains 99.86% of the mass of the entire solar system.
        </p>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Shared bits.

interface BigButtonProps {
  onClick: () => void;
  color: string;
  shadowColor: string;
  icon: React.ReactNode;
  label: string;
  labelAr: string;
  subtitle?: string;
}

function BigButton({
  onClick,
  color,
  shadowColor,
  icon,
  label,
  labelAr,
  subtitle,
}: BigButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.97, y: 3 }}
      className="w-full rounded-2xl py-3.5 px-4 flex items-center justify-center gap-2.5 text-base font-extrabold uppercase tracking-wide transition"
      style={{
        background: color,
        color: "#1A1A2E",
        boxShadow: `0 4px 0 ${shadowColor}`,
        fontFamily: "var(--font-display)",
      }}
    >
      <span className="flex flex-col items-center leading-tight">
        <span className="flex items-center gap-2">
          {icon}
          <span>{label}</span>
        </span>
        {subtitle && (
          <span className="text-[10px] font-bold opacity-65 mt-0.5 normal-case tracking-wide">
            {subtitle}
          </span>
        )}
      </span>
      <span
        dir="rtl"
        className="hidden sm:inline text-[12px] opacity-80 font-bold normal-case ml-1"
      >
        {labelAr}
      </span>
    </motion.button>
  );
}

interface StatProps {
  label: string;
  labelAr: string;
  value: string;
  valueAr: string;
  accent: string;
}

function Stat({ label, labelAr, value, valueAr, accent }: StatProps) {
  return (
    <div className="rounded-lg bg-white/5 border border-white/10 p-3">
      <div className="text-[10px] uppercase tracking-wider text-white/50 leading-tight">
        {label}
      </div>
      <div
        dir="rtl"
        className="text-[10px] text-white/40 mt-0.5"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {labelAr}
      </div>
      <div
        className="mt-1.5 text-sm font-bold leading-tight"
        style={{ color: accent, fontFamily: "var(--font-display)" }}
      >
        {value}
      </div>
      <div dir="rtl" className="text-[11px] text-white/60 mt-0.5">
        {valueAr}
      </div>
    </div>
  );
}
