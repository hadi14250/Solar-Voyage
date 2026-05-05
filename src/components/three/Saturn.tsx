"use client";

import * as THREE from "three";
import Planet from "./Planet";
import { PLANETS } from "@/data/planets";

interface SaturnProps {
  speedFactor: number;
  reducedMotion: boolean;
  realSizes: boolean;
  showLabels: boolean;
  isHovered: boolean;
  isFocused: boolean;
  isNext?: boolean;
}

export default function Saturn(props: SaturnProps) {
  const data = PLANETS.find((p) => p.id === "saturn")!;

  // Ring sizes scale with planet radius (which can change in real-size mode)
  const planetR = props.realSizes
    ? Math.min(0.7 * data.realRadiusRelative, 3.4)
    : data.radius;
  const ringInner = planetR * 1.25;
  const ringOuter = planetR * 2.05;

  return (
    <Planet {...props} data={data}>
      {/* Main ring */}
      <mesh rotation={[Math.PI / 2.05, 0, 0]}>
        <ringGeometry args={[ringInner, ringOuter, 128]} />
        <meshBasicMaterial
          color={data.ringColor ?? "#bfa066"}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {/* Cassini gap (slightly darker thinner band) */}
      <mesh rotation={[Math.PI / 2.05, 0, 0]}>
        <ringGeometry args={[ringInner * 1.32, ringInner * 1.36, 128]} />
        <meshBasicMaterial
          color="#1a1a2e"
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {/* Subtle glow ring */}
      <mesh rotation={[Math.PI / 2.05, 0, 0]}>
        <ringGeometry args={[ringOuter, ringOuter * 1.05, 128]} />
        <meshBasicMaterial
          color="#E8C547"
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </Planet>
  );
}
