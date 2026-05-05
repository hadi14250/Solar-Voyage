"use client";

import { Maximize2, Tag, FastForward, Volume2, VolumeX } from "lucide-react";
import PlanetSelector from "./PlanetSelector";
import { playSound } from "@/lib/audio";

interface ToolbarProps {
  showRealSizes: boolean;
  speedFactor: number;
  showLabels: boolean;
  muted: boolean;
  focusedId: string | null;
  onToggleRealSizes: () => void;
  onToggleSpeed: () => void;
  onToggleLabels: () => void;
  onToggleMuted: () => void;
  onSelectPlanet: (id: string) => void;
  isCompleted: (id: string) => boolean;
  starsFor: (id: string) => number;
  nextPlanetId: string | null;
}

interface ToggleButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  labelEn: string;
  labelAr: string;
  ariaLabel: string;
}

function ToggleButton({
  active,
  onClick,
  icon,
  labelEn,
  labelAr,
  ariaLabel,
}: ToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={() => {
        playSound("tap");
        onClick();
      }}
      aria-label={ariaLabel}
      aria-pressed={active}
      className={`
        group flex items-center gap-2 rounded-full
        px-3 sm:px-4 py-2.5 sm:py-2 text-xs sm:text-sm transition
        border ${
          active
            ? "bg-[#D4AF37]/20 border-[#D4AF37] text-[#FFE9A0]"
            : "bg-black/40 border-white/10 text-white/80 hover:border-[#D4AF37]/50 hover:text-[#FFE9A0]"
        }
      `}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span
        className="hidden sm:inline whitespace-nowrap"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {labelEn}
      </span>
      <span
        dir="rtl"
        className="hidden md:inline text-[11px] opacity-80 whitespace-nowrap"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {labelAr}
      </span>
    </button>
  );
}

export default function Toolbar({
  showRealSizes,
  speedFactor,
  showLabels,
  muted,
  focusedId,
  onToggleRealSizes,
  onToggleSpeed,
  onToggleLabels,
  onToggleMuted,
  onSelectPlanet,
  isCompleted,
  starsFor,
  nextPlanetId,
}: ToolbarProps) {
  return (
    <nav
      className="
        pointer-events-none absolute inset-x-0 bottom-0 z-20
        flex justify-center pb-[max(env(safe-area-inset-bottom),0.75rem)] px-3
      "
      aria-label="Scene controls"
    >
      <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-black/50 backdrop-blur-md gold-border px-2 sm:px-3 py-2">
        <PlanetSelector
          focusedId={focusedId}
          onSelect={onSelectPlanet}
          isCompleted={isCompleted}
          starsFor={starsFor}
          nextPlanetId={nextPlanetId}
        />

        <span className="h-5 w-px bg-white/15 mx-0.5" aria-hidden />

        <ToggleButton
          active={showRealSizes}
          onClick={onToggleRealSizes}
          icon={<Maximize2 size={14} strokeWidth={2.2} />}
          labelEn="Compare sizes"
          labelAr="مقارنة الأحجام"
          ariaLabel="Toggle realistic planet sizes"
        />
        <ToggleButton
          active={speedFactor > 1}
          onClick={onToggleSpeed}
          icon={<FastForward size={14} strokeWidth={2.2} />}
          labelEn="Speed up time"
          labelAr="تسريع الوقت"
          ariaLabel="Toggle 10x time speed"
        />
        <ToggleButton
          active={!showLabels}
          onClick={onToggleLabels}
          icon={<Tag size={14} strokeWidth={2.2} />}
          labelEn="Hide labels"
          labelAr="إخفاء التسميات"
          ariaLabel="Toggle planet labels"
        />

        <span className="h-5 w-px bg-white/15 mx-0.5" aria-hidden />

        {/* Audio toggle — icon-only */}
        <button
          type="button"
          onClick={() => {
            playSound("tap");
            onToggleMuted();
          }}
          aria-label={muted ? "Unmute sounds" : "Mute sounds"}
          aria-pressed={muted}
          className={`
            flex items-center justify-center rounded-full
            size-9 transition border
            ${
              muted
                ? "bg-white/5 border-white/10 text-white/50"
                : "bg-[#D4AF37]/20 border-[#D4AF37] text-[#FFE9A0]"
            }
          `}
        >
          {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
        </button>
      </div>
    </nav>
  );
}
