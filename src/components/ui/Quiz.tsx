"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Star,
  X,
  ArrowRight,
  RotateCcw,
  Heart,
  Trophy,
} from "lucide-react";
import { getQuiz, QuizQuestion } from "@/data/quizzes";
import { playSound } from "@/lib/audio";

interface QuizProps {
  planetId: string;
  accent: string;
  /** Stars already earned for this planet (for retake context). */
  previousStars: number;
  /** Called when the user completes (or retakes) the quiz. */
  onComplete: (stars: number) => void;
}

const TOTAL_HEARTS = 3;

function starsForResult(correct: number, total: number): number {
  const pct = correct / total;
  if (pct >= 0.99) return 3;
  if (pct >= 0.66) return 2;
  if (pct >= 0.33) return 1;
  return 0;
}

export default function Quiz({
  planetId,
  accent,
  previousStars,
  onComplete,
}: QuizProps) {
  const questions = useMemo<QuizQuestion[]>(
    () => getQuiz(planetId) ?? [],
    [planetId]
  );

  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [hearts, setHearts] = useState(TOTAL_HEARTS);
  const [done, setDone] = useState(false);
  const [shake, setShake] = useState(false);
  const [burstKey, setBurstKey] = useState(0);

  if (questions.length === 0) return null;

  const total = questions.length;
  const current = questions[step];
  const showResult = picked !== null;
  const isCorrect = showResult && picked === current.answer;

  const handlePick = (idx: number) => {
    if (picked !== null) return;
    setPicked(idx);
    if (idx === current.answer) {
      setCorrectCount((c) => c + 1);
      playSound("correct");
      setBurstKey((k) => k + 1);
    } else {
      setHearts((h) => Math.max(0, h - 1));
      playSound("wrong");
      setShake(true);
      setTimeout(() => setShake(false), 450);
    }
  };

  const handleNext = () => {
    playSound("tap");
    setPicked(null);

    if (step + 1 >= total) {
      const finalStars = starsForResult(correctCount, total);
      setTimeout(() => {
        if (finalStars > 0) playSound("star");
      }, 120);
      onComplete(finalStars);
      setDone(true);
    } else {
      setStep(step + 1);
    }
  };

  const handleRetake = () => {
    playSound("reveal");
    setStep(0);
    setPicked(null);
    setCorrectCount(0);
    setHearts(TOTAL_HEARTS);
    setDone(false);
  };

  // -------- Done state — fills the panel center --------
  if (done) {
    const finalStars = starsForResult(correctCount, total);
    const beat = finalStars > previousStars && previousStars > 0;
    return (
      <div className="flex-1 min-h-0 flex flex-col justify-center px-5 py-6 pb-[max(env(safe-area-inset-bottom),1rem)] text-center">
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 14, delay: 0.05 }}
          className="mx-auto mb-3 size-20 rounded-full flex items-center justify-center"
          style={{
            background: finalStars > 0 ? `${accent}30` : "#ffffff10",
            boxShadow: finalStars > 0 ? `0 0 40px ${accent}70` : undefined,
          }}
        >
          {finalStars > 0 ? (
            <Trophy size={40} fill={accent} color={accent} strokeWidth={1.5} />
          ) : (
            <RotateCcw size={32} color="#fff8" strokeWidth={2} />
          )}
        </motion.div>

        <div className="flex items-center justify-center gap-2 mb-3">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              initial={{ scale: 0, rotate: -30, y: -10 }}
              animate={{ scale: 1, rotate: 0, y: 0 }}
              transition={{
                delay: 0.2 + i * 0.18,
                type: "spring",
                stiffness: 380,
                damping: 12,
              }}
            >
              <Star
                size={40}
                strokeWidth={1.5}
                fill={i < finalStars ? "#E8C547" : "transparent"}
                color={i < finalStars ? "#E8C547" : "#ffffff44"}
                style={{
                  filter:
                    i < finalStars
                      ? "drop-shadow(0 0 10px #E8C547aa)"
                      : undefined,
                }}
              />
            </motion.span>
          ))}
        </div>

        <p
          className="text-2xl font-extrabold text-white"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {finalStars === 3
            ? "Perfect!"
            : finalStars === 2
              ? "Great job!"
              : finalStars === 1
                ? "Nice try!"
                : "Almost there!"}
        </p>
        <p
          dir="rtl"
          className="text-lg text-white/75 mt-0.5"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {finalStars === 3
            ? "ممتاز!"
            : finalStars === 2
              ? "أحسنت!"
              : finalStars === 1
                ? "محاولة جيدة!"
                : "اقتربت كثيرًا!"}
        </p>

        <p className="mt-3 text-sm text-white/70">
          You got <span className="font-bold text-white">{correctCount}</span>{" "}
          out of <span className="font-bold text-white">{total}</span> correct.
        </p>

        {beat && (
          <motion.p
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7, type: "spring" }}
            className="mt-2 text-xs font-bold"
            style={{ color: accent }}
          >
            ✨ NEW BEST SCORE ✨
          </motion.p>
        )}

        <button
          type="button"
          onClick={handleRetake}
          className="mt-6 mx-auto inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-extrabold uppercase tracking-wide border-2 border-white/15 text-white/85 hover:border-[#D4AF37]/60 hover:text-[#FFE9A0] hover:bg-white/5 transition active:translate-y-px"
        >
          <RotateCcw size={15} strokeWidth={2.5} />
          <span>Try again</span>
        </button>
      </div>
    );
  }

  // -------- Active question state — three-row flex column --------
  return (
    <motion.div
      animate={
        shake
          ? {
              x: [0, -10, 10, -8, 8, -4, 4, 0],
              transition: { duration: 0.45 },
            }
          : { x: 0 }
      }
      className="flex-1 min-h-0 flex flex-col"
    >
      {/* Top: hearts + counter + progress dots (compact, fixed height) */}
      <div
        className="px-4 pt-3 pb-2"
        style={{
          background: showResult
            ? isCorrect
              ? "linear-gradient(180deg, rgba(34,197,94,0.10), transparent)"
              : "linear-gradient(180deg, rgba(239,68,68,0.10), transparent)"
            : "transparent",
          transition: "background 0.25s ease",
        }}
      >
        <div className="flex items-center justify-between gap-3 mb-2">
          <div
            className="flex items-center gap-1"
            aria-label={`${hearts} hearts remaining`}
          >
            {Array.from({ length: TOTAL_HEARTS }).map((_, i) => (
              <motion.span
                key={i}
                animate={
                  i === hearts && shake
                    ? { scale: [1, 1.4, 0.6, 1], rotate: [0, -20, 20, 0] }
                    : { scale: 1, rotate: 0 }
                }
                transition={{ duration: 0.4 }}
              >
                <Heart
                  size={18}
                  fill={i < hearts ? "#ef4444" : "transparent"}
                  color={i < hearts ? "#ef4444" : "#ffffff35"}
                  strokeWidth={2}
                />
              </motion.span>
            ))}
          </div>

          <span className="text-[12px] font-bold text-white/70 tabular-nums">
            {step + 1} / {total}
          </span>
        </div>

        {/* Progress dots */}
        <div className="flex gap-1.5" aria-hidden>
          {questions.map((_, i) => (
            <span
              key={i}
              className="h-2 flex-1 rounded-full overflow-hidden bg-white/10"
            >
              <motion.span
                className="block h-full rounded-full"
                initial={false}
                animate={{
                  width: i < step ? "100%" : i === step ? "60%" : "0%",
                  background:
                    i === step
                      ? accent
                      : i < step
                        ? "#22c55e"
                        : "transparent",
                }}
                transition={{ duration: 0.35 }}
              />
            </span>
          ))}
        </div>
      </div>

      {/* Middle: question + choices (fills remaining space, scrollable only if truly tall) */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pt-3 pb-2 panel-scroll relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <p
              className="text-[15px] sm:text-[17px] text-white font-semibold leading-snug"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {current.question.en}
            </p>
            <p
              dir="rtl"
              className="text-[13px] text-white/65 leading-snug mt-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {current.question.ar}
            </p>

            <ul className="mt-3 space-y-2">
              {current.choices.map((choice, idx) => {
                const isPicked = picked === idx;
                const isAnswer = idx === current.answer;
                const tone = !showResult
                  ? "border-white/15 bg-white/[0.04] text-white hover:border-[#D4AF37] hover:bg-white/[0.08]"
                  : isAnswer
                    ? "border-emerald-400 bg-emerald-400/15 text-emerald-100"
                    : isPicked
                      ? "border-rose-400 bg-rose-400/15 text-rose-100"
                      : "border-white/10 bg-white/[0.02] text-white/45";

                return (
                  <motion.li
                    key={idx}
                    whileTap={!showResult ? { scale: 0.97 } : undefined}
                  >
                    <button
                      type="button"
                      onClick={() => handlePick(idx)}
                      disabled={showResult}
                      className={`
                        w-full flex items-center gap-3 rounded-2xl border-2 px-3 py-2.5 text-left
                        transition-all duration-150 active:translate-y-px
                        ${tone}
                      `}
                      style={{
                        boxShadow: !showResult
                          ? "0 3px 0 rgba(255,255,255,0.05) inset"
                          : isPicked && !isAnswer
                            ? "0 0 18px rgba(239,68,68,0.35)"
                            : isAnswer
                              ? "0 0 18px rgba(34,197,94,0.35)"
                              : undefined,
                      }}
                    >
                      <span
                        className={`
                          size-8 rounded-xl flex items-center justify-center text-sm font-extrabold flex-shrink-0
                          ${
                            !showResult
                              ? "bg-white/10 text-white/85 border border-white/15"
                              : isAnswer
                                ? "bg-emerald-500 text-white border-2 border-emerald-300"
                                : isPicked
                                  ? "bg-rose-500 text-white border-2 border-rose-300"
                                  : "bg-white/5 text-white/40 border border-white/10"
                          }
                        `}
                      >
                        {showResult && isAnswer ? (
                          <motion.span
                            initial={{ scale: 0, rotate: -30 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 420,
                              damping: 12,
                            }}
                          >
                            <Check size={16} strokeWidth={3} />
                          </motion.span>
                        ) : showResult && isPicked ? (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 380,
                              damping: 14,
                            }}
                          >
                            <X size={16} strokeWidth={3} />
                          </motion.span>
                        ) : (
                          String.fromCharCode(65 + idx)
                        )}
                      </span>

                      <span className="flex-1 min-w-0">
                        <span className="block text-[13.5px] sm:text-[14.5px] leading-tight font-semibold">
                          {choice.en}
                        </span>
                        <span
                          dir="rtl"
                          className="block text-[12px] leading-tight opacity-75 mt-0.5"
                        >
                          {choice.ar}
                        </span>
                      </span>
                    </button>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        </AnimatePresence>

        {/* Star burst — fires when correct */}
        <CorrectBurst trigger={burstKey} accent={accent} />
      </div>

      {/* Bottom: action area — pinned, content swaps based on state */}
      <div
        className="border-t px-4 pt-3 pb-[max(env(safe-area-inset-bottom),0.75rem)]"
        style={{
          borderColor: showResult
            ? isCorrect
              ? "rgba(34,197,94,0.4)"
              : "rgba(239,68,68,0.4)"
            : "rgba(255,255,255,0.08)",
          background: showResult
            ? isCorrect
              ? "linear-gradient(0deg, rgba(34,197,94,0.18), rgba(34,197,94,0.04))"
              : "linear-gradient(0deg, rgba(239,68,68,0.18), rgba(239,68,68,0.04))"
            : "transparent",
          transition: "background 0.2s ease, border-color 0.2s ease",
        }}
      >
        {showResult ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-start gap-2 mb-2.5">
              <span
                className="size-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: isCorrect ? "#22c55e" : "#ef4444" }}
              >
                {isCorrect ? (
                  <Check size={15} color="#fff" strokeWidth={3} />
                ) : (
                  <X size={15} color="#fff" strokeWidth={3} />
                )}
              </span>
              <div className="flex-1 min-w-0">
                <p
                  className="text-[13px] font-extrabold leading-tight"
                  style={{ color: isCorrect ? "#bbf7d0" : "#fecaca" }}
                >
                  {isCorrect ? "Excellent!" : "Not quite!"}
                  <span dir="rtl" className="opacity-80 font-medium ml-2">
                    {isCorrect ? "ممتاز!" : "ليس تمامًا!"}
                  </span>
                </p>
                <p className="mt-0.5 text-[12px] text-white/85 leading-snug">
                  {current.explain.en}
                </p>
              </div>
            </div>

            <motion.button
              type="button"
              onClick={handleNext}
              whileTap={{ scale: 0.97, y: 2 }}
              className="w-full rounded-2xl py-3 text-sm font-extrabold flex items-center justify-center gap-2 uppercase tracking-wide transition"
              style={{
                background: isCorrect ? "#22c55e" : "#ef4444",
                color: "#fff",
                boxShadow: `0 4px 0 ${isCorrect ? "#15803d" : "#b91c1c"}`,
              }}
            >
              <span>{step + 1 >= total ? "See result" : "Continue"}</span>
              <ArrowRight size={16} strokeWidth={3} />
            </motion.button>
          </motion.div>
        ) : (
          <p className="text-[12px] text-white/45 text-center py-2">
            Tap an answer to continue
            <span dir="rtl" className="opacity-80 ml-2">
              · انقر على إجابة
            </span>
          </p>
        )}
      </div>
    </motion.div>
  );
}

/** Mini star/sparkle particle burst that fires when an answer is correct. */
function CorrectBurst({ trigger, accent }: { trigger: number; accent: string }) {
  if (trigger === 0) return null;

  const count = 12;
  return (
    <div
      key={trigger}
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
    >
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const dist = 80 + (i % 3) * 25;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist;
        return (
          <motion.span
            key={i}
            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
            animate={{
              x: dx,
              y: dy,
              scale: [0, 1.2, 0.6],
              opacity: [1, 1, 0],
              rotate: i * 30,
            }}
            transition={{ duration: 0.85, ease: "easeOut" }}
            className="absolute"
          >
            <Star
              size={14}
              fill={i % 2 ? accent : "#E8C547"}
              color={i % 2 ? accent : "#E8C547"}
              strokeWidth={1.2}
            />
          </motion.span>
        );
      })}
    </div>
  );
}
