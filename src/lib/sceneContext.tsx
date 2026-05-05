"use client";

import { createContext, useContext, useRef, ReactNode } from "react";
import * as THREE from "three";

export interface SceneSettings {
  speedFactor: number;
  showRealSizes: boolean;
  showLabels: boolean;
  reducedMotion: boolean;
  focusedId: string | null;
  hoveredId: string | null;
}

export interface SceneApi {
  bodyRefs: React.RefObject<Map<string, THREE.Object3D>>;
  setHovered: (id: string | null) => void;
  setFocused: (id: string | null) => void;
}

const SceneApiContext = createContext<SceneApi | null>(null);

export function SceneApiProvider({
  children,
  setHovered,
  setFocused,
}: {
  children: ReactNode;
  setHovered: (id: string | null) => void;
  setFocused: (id: string | null) => void;
}) {
  const bodyRefs = useRef<Map<string, THREE.Object3D>>(new Map());
  return (
    <SceneApiContext.Provider value={{ bodyRefs, setHovered, setFocused }}>
      {children}
    </SceneApiContext.Provider>
  );
}

export function useSceneApi(): SceneApi {
  const ctx = useContext(SceneApiContext);
  if (!ctx) throw new Error("useSceneApi must be used inside SceneApiProvider");
  return ctx;
}
