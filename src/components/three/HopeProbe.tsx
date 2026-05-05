"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";

interface HopeProbeProps {
  marsRadius: number;
  speedFactor: number;
  reducedMotion: boolean;
}

const ORBIT_TILT = 0.4;

/**
 * UAE Hope Probe — orbits its parent (Mars). Stylised, not to scale.
 *
 * Note: orbit tilt is set imperatively (not via JSX rotation prop) because
 * useFrame mutates rotation.y; passing rotation as a prop would reset it
 * on every re-render and snap the probe back.
 */
export default function HopeProbe({
  marsRadius,
  speedFactor,
  reducedMotion,
}: HopeProbeProps) {
  const orbitRef = useRef<THREE.Group>(null);
  const probeRef = useRef<THREE.Group>(null);

  const orbitRadius = marsRadius * 2.4;

  useLayoutEffect(() => {
    if (orbitRef.current) {
      orbitRef.current.rotation.set(ORBIT_TILT, 0, 0);
    }
  }, []);

  // Solar-panel grid lines as a baked LineSegments geometry
  const gridGeo = useMemo(() => {
    const points: number[] = [];
    const w = 0.55;
    const h = 0.22;
    // 4 vertical splits
    for (let i = 1; i < 5; i++) {
      const x = -w / 2 + (w * i) / 5;
      points.push(x, -h / 2, 0.011, x, h / 2, 0.011);
    }
    // 1 horizontal split
    points.push(-w / 2, 0, 0.011, w / 2, 0, 0.011);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(points, 3)
    );
    return geo;
  }, []);

  useFrame((state, delta) => {
    if (!orbitRef.current || !probeRef.current) return;
    if (reducedMotion) {
      orbitRef.current.rotation.y = 0.6;
      probeRef.current.position.y = 0;
      probeRef.current.rotation.y = 0;
      return;
    }
    orbitRef.current.rotation.y += delta * 0.7 * speedFactor;
    probeRef.current.rotation.y += delta * 0.9 * speedFactor;
    probeRef.current.position.y =
      Math.sin(state.clock.elapsedTime * 1.4) * 0.04;
  });

  return (
    <group>
      {/* Orbit ring around Mars */}
      <mesh rotation={[Math.PI / 2.4, 0, 0]}>
        <ringGeometry args={[orbitRadius - 0.012, orbitRadius + 0.012, 128]} />
        <meshBasicMaterial
          color="#E8C547"
          transparent
          opacity={0.55}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Tiny UAE flag indicator on the planet's surface */}
      <group position={[0, marsRadius * 1.05, 0]}>
        <mesh>
          <cylinderGeometry args={[0.005, 0.005, 0.18, 8]} />
          <meshStandardMaterial color="#ddd" />
        </mesh>
        <group position={[0.07, 0.06, 0]}>
          {/* 3 horizontal stripes: green (top), white (middle), black (bottom) */}
          <mesh position={[0, 0.04, 0]}>
            <planeGeometry args={[0.14, 0.04]} />
            <meshBasicMaterial color="#009639" side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[0.14, 0.04]} />
            <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, -0.04, 0]}>
            <planeGeometry args={[0.14, 0.04]} />
            <meshBasicMaterial color="#000000" side={THREE.DoubleSide} />
          </mesh>
          {/* Red hoist on the left (overlays the stripes) */}
          <mesh position={[-0.05, 0, 0.001]}>
            <planeGeometry args={[0.04, 0.12]} />
            <meshBasicMaterial color="#CE1126" side={THREE.DoubleSide} />
          </mesh>
        </group>
      </group>

      {/* Orbiting probe (initial tilt set in useLayoutEffect above) */}
      <group ref={orbitRef}>
        <group position={[orbitRadius, 0, 0]}>
          <group ref={probeRef}>
            {/* Body — gold cube */}
            <mesh>
              <boxGeometry args={[0.18, 0.18, 0.22]} />
              <meshStandardMaterial
                color="#D4AF37"
                emissive="#3a2c0c"
                emissiveIntensity={0.4}
                metalness={0.85}
                roughness={0.25}
              />
            </mesh>
            {/* Antenna mast */}
            <mesh position={[0, 0.18, 0]}>
              <cylinderGeometry args={[0.01, 0.01, 0.18, 8]} />
              <meshStandardMaterial color="#888" metalness={0.7} roughness={0.4} />
            </mesh>
            {/* Dish */}
            <mesh position={[0, 0.32, 0]} rotation={[Math.PI, 0, 0]}>
              <coneGeometry args={[0.09, 0.05, 24, 1, true]} />
              <meshStandardMaterial
                color="#E8E8E8"
                metalness={0.6}
                roughness={0.3}
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* Dish receiver */}
            <mesh position={[0, 0.34, 0]}>
              <sphereGeometry args={[0.018, 12, 12]} />
              <meshStandardMaterial color="#222" metalness={0.5} />
            </mesh>

            {/* Left solar panel */}
            <group position={[-0.36, 0, 0]}>
              <mesh>
                <boxGeometry args={[0.55, 0.22, 0.02]} />
                <meshStandardMaterial
                  color="#1c4b9e"
                  emissive="#0a1a3a"
                  emissiveIntensity={0.3}
                  metalness={0.55}
                  roughness={0.4}
                />
              </mesh>
              <lineSegments geometry={gridGeo}>
                <lineBasicMaterial
                  color="#7fb6ff"
                  transparent
                  opacity={0.85}
                />
              </lineSegments>
              {/* Connector arm */}
              <mesh position={[0.32, 0, 0]}>
                <boxGeometry args={[0.1, 0.03, 0.03]} />
                <meshStandardMaterial color="#bbb" />
              </mesh>
            </group>

            {/* Right solar panel */}
            <group position={[0.36, 0, 0]}>
              <mesh>
                <boxGeometry args={[0.55, 0.22, 0.02]} />
                <meshStandardMaterial
                  color="#1c4b9e"
                  emissive="#0a1a3a"
                  emissiveIntensity={0.3}
                  metalness={0.55}
                  roughness={0.4}
                />
              </mesh>
              <lineSegments geometry={gridGeo}>
                <lineBasicMaterial
                  color="#7fb6ff"
                  transparent
                  opacity={0.85}
                />
              </lineSegments>
              <mesh position={[-0.32, 0, 0]}>
                <boxGeometry args={[0.1, 0.03, 0.03]} />
                <meshStandardMaterial color="#bbb" />
              </mesh>
            </group>

            {/* Subtle glow */}
            <pointLight color="#FFD27A" intensity={0.4} distance={1.2} />

            {/* Probe label — low zIndexRange so the panel sits above it */}
            <Html
              position={[0, -0.28, 0]}
              center
              distanceFactor={9}
              zIndexRange={[10, 0]}
              style={{ pointerEvents: "none" }}
              wrapperClass="solar-html-label"
            >
              <div className="px-1.5 py-0.5 rounded bg-black/70 border border-[#D4AF37]/50 text-[8px] text-[#E8C547] tracking-wide whitespace-nowrap">
                Hope Probe · مسبار الأمل
              </div>
            </Html>
          </group>
        </group>
      </group>
    </group>
  );
}
