"use client";

import { useMemo } from "react";
import Planet from "./Planet";
import { PLANETS } from "@/data/planets";
import { makeJupiterTexture } from "@/lib/textures";

interface JupiterProps {
  speedFactor: number;
  reducedMotion: boolean;
  realSizes: boolean;
  showLabels: boolean;
  isHovered: boolean;
  isFocused: boolean;
  isNext?: boolean;
}

export default function Jupiter(props: JupiterProps) {
  const data = PLANETS.find((p) => p.id === "jupiter")!;
  const tex = useMemo(() => makeJupiterTexture(), []);

  return (
    <Planet
      {...props}
      data={data}
      materialOverride={
        <meshStandardMaterial map={tex} roughness={0.7} metalness={0.05} />
      }
    />
  );
}
