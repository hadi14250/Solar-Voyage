"use client";

import { useMemo } from "react";
import Planet from "./Planet";
import { PLANETS } from "@/data/planets";
import { makeMarsTexture } from "@/lib/textures";
import HopeProbe from "./HopeProbe";

interface MarsProps {
  speedFactor: number;
  reducedMotion: boolean;
  realSizes: boolean;
  showLabels: boolean;
  isHovered: boolean;
  isFocused: boolean;
  isNext?: boolean;
}

export default function Mars(props: MarsProps) {
  const data = PLANETS.find((p) => p.id === "mars")!;
  const tex = useMemo(() => makeMarsTexture(), []);

  return (
    <Planet
      {...props}
      data={data}
      materialOverride={
        <meshStandardMaterial
          map={tex}
          roughness={0.95}
          metalness={0.03}
        />
      }
    >
      <HopeProbe
        marsRadius={data.radius}
        speedFactor={props.speedFactor}
        reducedMotion={props.reducedMotion}
      />
    </Planet>
  );
}
