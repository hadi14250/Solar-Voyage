"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";

import TitleBar from "@/components/ui/TitleBar";
import Toolbar from "@/components/ui/Toolbar";
import PlanetPanel from "@/components/ui/PlanetPanel";
import LoadingScreen from "@/components/ui/LoadingScreen";
import MissionComplete from "@/components/ui/MissionComplete";
import { useIsDesktop, useMediaQuery } from "@/lib/useMediaQuery";
import { useProgress } from "@/lib/useProgress";
import { initAudio, isMuted, playSound, setMuted } from "@/lib/audio";

// Lazy-load the Three.js scene so initial JS bundle stays small
const SolarSystem = dynamic(() => import("@/components/three/SolarSystem"), {
  ssr: false,
  loading: () => null,
});

export default function Home() {
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showRealSizes, setShowRealSizes] = useState(false);
  const [speedFactor, setSpeedFactor] = useState(1);
  const [showLabels, setShowLabels] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [muted, setMutedState] = useState(() => {
    if (typeof window === "undefined") return false;
    return isMuted();
  });

  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)", false);
  const isDesktop = useIsDesktop();

  const {
    completedCount,
    totalStars,
    maxStars,
    journey,
    isComplete,
    nextPlanetId,
    isCompleted,
    starsFor,
    recordQuiz,
    state: progressState,
    markCelebrationSeen,
    reset: resetProgress,
  } = useProgress();

  // Set up audio unlock listeners on mount.
  useEffect(() => {
    initAudio();
  }, []);

  const handleToggleMuted = useCallback(() => {
    const next = !muted;
    setMutedState(next);
    setMuted(next);
  }, [muted]);

  const handleStart = useCallback(() => {
    setHasStarted(true);
    playSound("reveal");
  }, []);

  // Trip the celebration once the journey completes (and the user has started).
  useEffect(() => {
    if (!hasStarted) return;
    if (isComplete && !progressState.celebrationSeen) {
      // Small delay so the last quiz's "complete" animation is visible first.
      const t = setTimeout(() => {
        setShowCelebration(true);
        playSound("complete");
      }, 700);
      return () => clearTimeout(t);
    }
  }, [hasStarted, isComplete, progressState.celebrationSeen]);

  const handleCloseCelebration = useCallback(() => {
    setShowCelebration(false);
    markCelebrationSeen();
  }, [markCelebrationSeen]);

  const handleResetJourney = useCallback(() => {
    resetProgress();
    setShowCelebration(false);
    setFocusedId(null);
  }, [resetProgress]);

  const handleSelectPlanet = useCallback((id: string | null) => {
    setFocusedId(id);
    if (id) playSound("reveal");
  }, []);

  return (
    <main className="relative w-screen h-dvh overflow-hidden bg-[#05050F] text-white">
      <SolarSystem
        speedFactor={speedFactor}
        showRealSizes={showRealSizes}
        showLabels={showLabels}
        reducedMotion={reducedMotion}
        focusedId={focusedId}
        hoveredId={hoveredId}
        framePlanetHigh={!isDesktop && focusedId !== null}
        setFocused={handleSelectPlanet}
        setHovered={setHoveredId}
        nextPlanetId={nextPlanetId}
      />

      <TitleBar
        completedCount={completedCount}
        totalPlanets={journey.length}
        totalStars={totalStars}
        maxStars={maxStars}
      />

      <Toolbar
        showRealSizes={showRealSizes}
        speedFactor={speedFactor}
        showLabels={showLabels}
        muted={muted}
        focusedId={focusedId}
        onToggleRealSizes={() => setShowRealSizes((v) => !v)}
        onToggleSpeed={() => setSpeedFactor((v) => (v > 1 ? 1 : 10))}
        onToggleLabels={() => setShowLabels((v) => !v)}
        onToggleMuted={handleToggleMuted}
        onSelectPlanet={handleSelectPlanet}
        isCompleted={isCompleted}
        starsFor={starsFor}
        nextPlanetId={nextPlanetId}
      />

      <PlanetPanel
        focusedId={focusedId}
        onClose={() => setFocusedId(null)}
        starsFor={starsFor}
        isCompleted={isCompleted}
        recordQuiz={recordQuiz}
      />

      <AnimatePresence>
        {!hasStarted && (
          <LoadingScreen
            showCTA
            onStart={handleStart}
            hasProgress={completedCount > 0}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCelebration && (
          <MissionComplete
            totalStars={totalStars}
            maxStars={maxStars}
            onClose={handleCloseCelebration}
            onReset={handleResetJourney}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
