"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Planet from "./Planet";
import { PLANETS } from "@/data/planets";
import { makeEarthTexture, makeCloudsTexture } from "@/lib/textures";

interface EarthProps {
  speedFactor: number;
  reducedMotion: boolean;
  realSizes: boolean;
  showLabels: boolean;
  isHovered: boolean;
  isFocused: boolean;
  isNext?: boolean;
}

export default function Earth(props: EarthProps) {
  const data = PLANETS.find((p) => p.id === "earth")!;
  const earthTex = useMemo(() => makeEarthTexture(), []);
  const cloudsTex = useMemo(() => makeCloudsTexture(), []);
  const cloudRef = useRef<THREE.Mesh>(null);

  useFrame((_s, delta) => {
    if (!cloudRef.current || props.reducedMotion) return;
    cloudRef.current.rotation.y += delta * 0.04 * props.speedFactor;
  });

  return (
    <Planet
      {...props}
      data={data}
      materialOverride={
        <meshStandardMaterial
          map={earthTex}
          roughness={0.85}
          metalness={0.05}
          emissive="#0a1a2a"
          emissiveIntensity={0.1}
        />
      }
    >
      {/* Cloud layer */}
      <mesh ref={cloudRef} scale={1.02}>
        <sphereGeometry args={[data.radius, 48, 48]} />
        <meshStandardMaterial
          map={cloudsTex}
          transparent
          opacity={0.55}
          depthWrite={false}
          roughness={1}
        />
      </mesh>

      {/* Atmosphere glow */}
      <mesh scale={1.08}>
        <sphereGeometry args={[data.radius, 32, 32]} />
        <meshBasicMaterial
          color="#7ec8ff"
          transparent
          opacity={0.12}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>
    </Planet>
  );
}
