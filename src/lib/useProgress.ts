"use client";

import { useCallback, useSyncExternalStore } from "react";
import { PLANETS } from "@/data/planets";

const STORAGE_KEY = "solar-voyage-progress-v1";

export interface ProgressState {
  /** Stars earned per planet id (0–3). 0 means visited but no stars; missing = unvisited. */
  stars: Record<string, number>;
  /** Whether the user has explicitly seen the mission-complete celebration. */
  celebrationSeen: boolean;
}

const EMPTY: ProgressState = { stars: {}, celebrationSeen: false };

function readStorage(): ProgressState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return {
      stars: parsed.stars ?? {},
      celebrationSeen: parsed.celebrationSeen ?? false,
    };
  } catch {
    return EMPTY;
  }
}

function writeStorage(state: ProgressState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* quota / private mode — ignore */
  }
}

// Cached snapshot so useSyncExternalStore returns a stable reference between
// reads when nothing has changed (otherwise React panics about infinite loops).
let cachedSnapshot: ProgressState = EMPTY;
let cachedRaw: string | null = null;
const listeners = new Set<() => void>();

function getSnapshot(): ProgressState {
  if (typeof window === "undefined") return EMPTY;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedSnapshot;
  cachedRaw = raw;
  cachedSnapshot = readStorage();
  return cachedSnapshot;
}

function getServerSnapshot(): ProgressState {
  return EMPTY;
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

function notify() {
  listeners.forEach((l) => l());
}

function setStored(next: ProgressState) {
  writeStorage(next);
  // Invalidate cache so the next snapshot read reflects the change.
  cachedRaw = JSON.stringify(next);
  cachedSnapshot = next;
  notify();
}

export interface ProgressApi {
  state: ProgressState;
  /** Number of unique planets that have been completed (any star count, including 0). */
  completedCount: number;
  /** Total stars earned across all planets. */
  totalStars: number;
  /** Maximum possible stars (3 per planet × all planets). */
  maxStars: number;
  /** Ordered list of planet ids the journey expects, in sequence. */
  journey: string[];
  /** True once every planet in the journey has at least one entry. */
  isComplete: boolean;
  /** The id of the next planet the student should visit, or null if done. */
  nextPlanetId: string | null;
  /** Whether this planet has been completed (quiz attempted). */
  isCompleted: (id: string) => boolean;
  /** Stars for a given planet (0 if none). */
  starsFor: (id: string) => number;
  /** Record a quiz result (0–3 stars). Higher score wins on retake. */
  recordQuiz: (planetId: string, stars: number) => void;
  /** Mark the celebration screen as seen so it doesn't auto-show again. */
  markCelebrationSeen: () => void;
  /** Wipe all progress. */
  reset: () => void;
}

export function useProgress(): ProgressApi {
  const state = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const update = useCallback((next: ProgressState) => {
    setStored(next);
  }, []);

  const journey = PLANETS.map((p) => p.id);
  const completedCount = Object.keys(state.stars).filter((id) =>
    journey.includes(id)
  ).length;
  const totalStars = journey.reduce(
    (sum, id) => sum + (state.stars[id] ?? 0),
    0
  );
  const maxStars = journey.length * 3;
  const isComplete = completedCount >= journey.length;

  const nextPlanetId =
    journey.find((id) => state.stars[id] === undefined) ?? null;

  const isCompleted = useCallback(
    (id: string) => state.stars[id] !== undefined,
    [state.stars]
  );

  const starsFor = useCallback(
    (id: string) => state.stars[id] ?? 0,
    [state.stars]
  );

  const recordQuiz = useCallback(
    (planetId: string, stars: number) => {
      const clamped = Math.max(0, Math.min(3, Math.round(stars)));
      const prev = state.stars[planetId];
      // Keep the best score if the student retakes the quiz.
      const best = prev === undefined ? clamped : Math.max(prev, clamped);
      update({ ...state, stars: { ...state.stars, [planetId]: best } });
    },
    [state, update]
  );

  const markCelebrationSeen = useCallback(() => {
    if (state.celebrationSeen) return;
    update({ ...state, celebrationSeen: true });
  }, [state, update]);

  const reset = useCallback(() => update(EMPTY), [update]);

  return {
    state,
    completedCount,
    totalStars,
    maxStars,
    journey,
    isComplete,
    nextPlanetId,
    isCompleted,
    starsFor,
    recordQuiz,
    markCelebrationSeen,
    reset,
  };
}
