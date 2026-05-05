"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SUN } from "@/data/planets";
import { useSceneApi } from "@/lib/sceneContext";

interface SunProps {
  speedFactor: number;
  reducedMotion: boolean;
  realSizes: boolean;
}

export default function Sun({ speedFactor, reducedMotion, realSizes }: SunProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const { bodyRefs, setHovered, setFocused } = useSceneApi();

  // Aesthetic radius. In real-size mode the Sun would dwarf the scene; cap it.
  const radius = realSizes ? Math.min(SUN.radius * 2.4, 8) : SUN.radius;

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    if (!reducedMotion) {
      meshRef.current.rotation.y += delta * 0.06 * speedFactor;
    }
    // Subtle pulse on the corona
    const t = state.clock.elapsedTime;
    const pulse = 1 + (reducedMotion ? 0 : Math.sin(t * 1.2) * 0.04);
    if (coronaRef.current) coronaRef.current.scale.setScalar(pulse);
    if (matRef.current) {
      matRef.current.opacity = 0.25 + (reducedMotion ? 0 : Math.sin(t * 1.6) * 0.04);
    }
  });

  return (
    <group
      ref={(g) => {
        if (g) bodyRefs.current.set(SUN.id, g);
      }}
    >
      <pointLight color="#FFE8B0" intensity={3.2} distance={220} decay={1.3} />

      {/* Core */}
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(SUN.id);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(null);
          document.body.style.cursor = "auto";
        }}
        onClick={(e) => {
          e.stopPropagation();
          setFocused(SUN.id);
        }}
      >
        <sphereGeometry args={[radius, 64, 64]} />
        <meshBasicMaterial color={SUN.color} toneMapped={false} />
      </mesh>

      {/* Inner glow */}
      <mesh scale={1.18}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshBasicMaterial
          color="#FFC857"
          transparent
          opacity={0.32}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Outer corona */}
      <mesh ref={coronaRef} scale={1.55}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshBasicMaterial
          ref={matRef}
          color="#FF9A3C"
          transparent
          opacity={0.22}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}
