"use client";

/**
 * Tiny WebAudio sound bank — fully synthesized so no asset files ship.
 * Designed to feel Duolingo-ish: short, bright, friendly.
 *
 * Usage: `playSound("correct")`. Audio is unlocked on the first user gesture.
 */

type SoundName =
  | "correct"
  | "wrong"
  | "tap"
  | "star"
  | "complete"
  | "reveal"
  | "whoosh";

let ctx: AudioContext | null = null;
let muted = false;
let unlocked = false;

const STORAGE_KEY = "solar-voyage-muted-v1";

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    try {
      ctx = new Ctor();
    } catch {
      return null;
    }
  }
  return ctx;
}

export function initAudio(): void {
  if (typeof window === "undefined") return;
  // Hydrate mute pref.
  try {
    muted = localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    muted = false;
  }
  // Try to unlock on the first user gesture (autoplay policy).
  const unlock = () => {
    const c = getCtx();
    if (!c) return;
    if (c.state === "suspended") c.resume().catch(() => {});
    unlocked = true;
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
    window.removeEventListener("touchstart", unlock);
  };
  window.addEventListener("pointerdown", unlock, { once: true });
  window.addEventListener("keydown", unlock, { once: true });
  window.addEventListener("touchstart", unlock, { once: true });
}

export function isMuted(): boolean {
  return muted;
}

export function setMuted(next: boolean): void {
  muted = next;
  try {
    localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
  } catch {
    /* ignore */
  }
}

interface NoteOpts {
  freq: number;
  /** seconds */
  duration?: number;
  /** seconds */
  delay?: number;
  type?: OscillatorType;
  gain?: number;
  /** Glide to this frequency over the note's duration. */
  freqEnd?: number;
}

function note(opts: NoteOpts): void {
  const c = getCtx();
  if (!c) return;
  const now = c.currentTime + (opts.delay ?? 0);
  const dur = opts.duration ?? 0.18;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = opts.type ?? "sine";
  osc.frequency.setValueAtTime(opts.freq, now);
  if (opts.freqEnd !== undefined) {
    osc.frequency.exponentialRampToValueAtTime(opts.freqEnd, now + dur);
  }
  const peak = (opts.gain ?? 0.18);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(peak, now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(now);
  osc.stop(now + dur + 0.02);
}

function noiseBurst(durationSec = 0.12, gainPeak = 0.12): void {
  const c = getCtx();
  if (!c) return;
  const buf = c.createBuffer(1, Math.floor(c.sampleRate * durationSec), c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    // Decaying noise.
    const t = i / data.length;
    data[i] = (Math.random() * 2 - 1) * (1 - t);
  }
  const src = c.createBufferSource();
  src.buffer = buf;
  const gain = c.createGain();
  gain.gain.setValueAtTime(gainPeak, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + durationSec);
  // Low-pass to soften.
  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 1800;
  src.connect(filter).connect(gain).connect(c.destination);
  src.start();
}

export function playSound(name: SoundName): void {
  if (muted) return;
  const c = getCtx();
  if (!c) return;
  // Best-effort resume; if still suspended we'll just silently no-op.
  if (c.state === "suspended" && unlocked) c.resume().catch(() => {});

  switch (name) {
    case "correct": {
      // Bright ascending major-third arpeggio — Duolingo-like ding.
      note({ freq: 660, duration: 0.12, type: "triangle", gain: 0.18 });
      note({ freq: 880, duration: 0.14, delay: 0.08, type: "triangle", gain: 0.18 });
      note({ freq: 1320, duration: 0.22, delay: 0.16, type: "triangle", gain: 0.2 });
      break;
    }
    case "wrong": {
      // Soft descending "uh-oh" — not punishing.
      note({ freq: 320, freqEnd: 220, duration: 0.18, type: "sine", gain: 0.18 });
      note({ freq: 260, freqEnd: 180, duration: 0.22, delay: 0.12, type: "sine", gain: 0.18 });
      break;
    }
    case "tap": {
      note({ freq: 520, duration: 0.06, type: "sine", gain: 0.1 });
      break;
    }
    case "star": {
      note({ freq: 1175, duration: 0.1, type: "triangle", gain: 0.16 });
      note({ freq: 1568, duration: 0.18, delay: 0.06, type: "triangle", gain: 0.18 });
      break;
    }
    case "complete": {
      // Triumphant 5-note flourish.
      const seq: Array<[number, number]> = [
        [523, 0],
        [659, 0.09],
        [784, 0.18],
        [988, 0.28],
        [1318, 0.4],
      ];
      for (const [f, d] of seq) {
        note({ freq: f, duration: 0.22, delay: d, type: "triangle", gain: 0.2 });
      }
      // Sparkle tail.
      note({ freq: 1760, duration: 0.5, delay: 0.55, type: "sine", gain: 0.12 });
      noiseBurst(0.4, 0.06);
      break;
    }
    case "reveal": {
      note({ freq: 440, freqEnd: 880, duration: 0.32, type: "triangle", gain: 0.16 });
      break;
    }
    case "whoosh": {
      noiseBurst(0.22, 0.1);
      break;
    }
  }
}
