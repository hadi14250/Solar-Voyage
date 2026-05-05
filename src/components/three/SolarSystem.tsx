"use client";

import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";

import { PLANETS } from "@/data/planets";
import { SceneApiProvider } from "@/lib/sceneContext";
import Sun from "./Sun";
import Planet from "./Planet";
import Earth from "./Earth";
import Mars from "./Mars";
import Jupiter from "./Jupiter";
import Saturn from "./Saturn";
import AsteroidBelt from "./AsteroidBelt";
import CameraController from "./CameraController";

interface SolarSystemProps {
  speedFactor: number;
  showRealSizes: boolean;
  showLabels: boolean;
  reducedMotion: boolean;
  focusedId: string | null;
  hoveredId: string | null;
  framePlanetHigh: boolean;
  setFocused: (id: string | null) => void;
  setHovered: (id: string | null) => void;
  nextPlanetId: string | null;
}

export default function SolarSystem({
  speedFactor,
  showRealSizes,
  showLabels,
  reducedMotion,
  focusedId,
  hoveredId,
  framePlanetHigh,
  setFocused,
  setHovered,
  nextPlanetId,
}: SolarSystemProps) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  const planetProps = (id: string) => ({
    speedFactor,
    reducedMotion,
    realSizes: showRealSizes,
    showLabels,
    isHovered: hoveredId === id,
    isFocused: focusedId === id,
    isNext: nextPlanetId === id,
  });

  return (
    <Canvas
      shadows={false}
      dpr={[1, 2]}
      camera={{ position: [0, 22, 55], fov: 50, near: 0.1, far: 600 }}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        alpha: false,
      }}
      onCreated={({ gl, scene }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        scene.fog = new THREE.FogExp2("#0F0F23", 0.0035);
      }}
      onPointerMissed={() => setFocused(null)}
    >
      <color attach="background" args={["#05050F"]} />

      <ambientLight intensity={0.18} />
      {/* A faint rim light so the dark sides of planets aren't pure black */}
      <directionalLight position={[0, 30, 80]} intensity={0.15} color="#9eb8ff" />

      <SceneApiProvider setFocused={setFocused} setHovered={setHovered}>
        <Suspense fallback={null}>
          <Stars
            radius={180}
            depth={60}
            count={3000}
            factor={4}
            saturation={0}
            fade
            speed={reducedMotion ? 0 : 0.4}
          />

          <Sun
            speedFactor={speedFactor}
            reducedMotion={reducedMotion}
            realSizes={showRealSizes}
          />

          {PLANETS.map((p) => {
            switch (p.id) {
              case "earth":
                return <Earth key={p.id} {...planetProps(p.id)} />;
              case "mars":
                return <Mars key={p.id} {...planetProps(p.id)} />;
              case "jupiter":
                return <Jupiter key={p.id} {...planetProps(p.id)} />;
              case "saturn":
                return <Saturn key={p.id} {...planetProps(p.id)} />;
              default:
                return <Planet key={p.id} data={p} {...planetProps(p.id)} />;
            }
          })}

          <AsteroidBelt
            count={120}
            innerRadius={19}
            outerRadius={22}
            speedFactor={speedFactor}
            reducedMotion={reducedMotion}
          />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.08}
          minDistance={4}
          maxDistance={140}
          enablePan={false}
          makeDefault
        />

        <CameraController
          controlsRef={controlsRef}
          focusedId={focusedId}
          reducedMotion={reducedMotion}
          framePlanetHigh={framePlanetHigh}
        />
      </SceneApiProvider>
    </Canvas>
  );
}
