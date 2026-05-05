"use client";

import { useLayoutEffect, useMemo, useRef, ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { PlanetInfo } from "@/data/planets";
import { useSceneApi } from "@/lib/sceneContext";

interface PlanetProps {
  data: PlanetInfo;
  speedFactor: number;
  reducedMotion: boolean;
  realSizes: boolean;
  showLabels: boolean;
  isHovered: boolean;
  isFocused: boolean;
  /** When true, the planet pulses in gold to invite the next visit. */
  isNext?: boolean;
  /** Override the procedural material — used for Earth, Mars, etc. */
  materialOverride?: ReactNode;
  /** Extra children parented to the planet (rings, clouds, satellites). */
  children?: ReactNode;
}

const REAL_SIZE_EARTH_BASE = 0.7;

/**
 * Planet with orbit + self-rotation. Registers itself in sceneContext so the
 * camera controller can follow it.
 *
 * IMPORTANT: rotations are mutated imperatively via useFrame, so we must
 * never pass a `rotation` JSX prop or set rotation inside a callback ref —
 * both fire on every render and would clobber the accumulated angle, making
 * the planet snap backward whenever React re-renders the tree.
 */
export default function Planet({
  data,
  speedFactor,
  reducedMotion,
  realSizes,
  showLabels,
  isHovered,
  isFocused,
  isNext = false,
  materialOverride,
  children,
}: PlanetProps) {
  const orbitRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const nextRingRef = useRef<THREE.MeshBasicMaterial>(null);
  const { bodyRefs, setHovered, setFocused } = useSceneApi();

  const radius = useMemo(() => {
    if (!realSizes) return data.radius;
    const r = REAL_SIZE_EARTH_BASE * data.realRadiusRelative;
    return Math.min(r, 3.4);
  }, [data.radius, data.realRadiusRelative, realSizes]);

  // Initial rotations — set once on mount, never overwritten on re-render.
  useLayoutEffect(() => {
    if (orbitRef.current) orbitRef.current.rotation.y = data.orbitPhase;
    if (planetRef.current) planetRef.current.rotation.set(0, 0, data.axialTilt);
  }, [data.orbitPhase, data.axialTilt]);

  // Register the planet mesh so the camera controller can follow it.
  useLayoutEffect(() => {
    const m = meshRef.current;
    const map = bodyRefs.current;
    if (!m) return;
    map.set(data.id, m);
    return () => {
      map.delete(data.id);
    };
  }, [data.id, bodyRefs]);

  useFrame((state, delta) => {
    if (!orbitRef.current) return;
    if (reducedMotion) {
      // Snap to a stable angle so movement doesn't accumulate.
      orbitRef.current.rotation.y = data.orbitPhase;
    } else {
      orbitRef.current.rotation.y += delta * data.orbitSpeed * speedFactor;
      if (planetRef.current) {
        planetRef.current.rotation.y += delta * data.rotationSpeed * speedFactor;
      }
    }
    // Pulse the "next" invitation ring.
    if (nextRingRef.current && isNext) {
      const t = state.clock.elapsedTime;
      nextRingRef.current.opacity = reducedMotion
        ? 0.7
        : 0.45 + Math.sin(t * 2.4) * 0.3;
    }
  });

  return (
    <group ref={orbitRef}>
      <group position={[data.distance, 0, 0]}>
        <group ref={planetRef}>
          <mesh
            ref={meshRef}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHovered(data.id);
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              setHovered(null);
              document.body.style.cursor = "auto";
            }}
            onClick={(e) => {
              e.stopPropagation();
              setFocused(data.id);
            }}
          >
            <sphereGeometry args={[radius, 48, 48]} />
            {materialOverride ?? (
              <meshStandardMaterial
                color={data.color}
                emissive={data.emissive ?? "#000000"}
                emissiveIntensity={data.emissive ? 0.25 : 0}
                roughness={0.85}
                metalness={0.05}
              />
            )}
          </mesh>

          {/* Hover/focus highlight ring */}
          {(isHovered || isFocused) && (
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[radius * 1.25, radius * 1.32, 64]} />
              <meshBasicMaterial
                color={isFocused ? "#E8C547" : "#ffffff"}
                transparent
                opacity={isFocused ? 0.85 : 0.6}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
          )}

          {/* "Next stop" pulsing invite ring */}
          {isNext && (
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[radius * 1.45, radius * 1.6, 64]} />
              <meshBasicMaterial
                ref={nextRingRef}
                color="#E8C547"
                transparent
                opacity={0.6}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
          )}

          {children}
        </group>

        {showLabels && (
          <Html
            position={[0, radius + 0.6, 0]}
            center
            distanceFactor={18}
            zIndexRange={[10, 0]}
            style={{ pointerEvents: "none" }}
            wrapperClass="solar-html-label"
          >
            <div className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/15 text-[10px] tracking-wide text-white/90 whitespace-nowrap">
              {data.name}
              <span className="opacity-60 mx-1">·</span>
              <span dir="rtl">{data.nameAr}</span>
            </div>
          </Html>
        )}
      </group>

      {/* Orbit ring (static — rotation prop is safe here) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[data.distance - 0.012, data.distance + 0.012, 256]} />
        <meshBasicMaterial
          color="#D4AF37"
          transparent
          opacity={isFocused ? 0.35 : isNext ? 0.28 : 0.12}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
