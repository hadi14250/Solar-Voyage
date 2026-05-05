"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useSceneApi } from "@/lib/sceneContext";
import { getBodyById } from "@/data/planets";

interface CameraControllerProps {
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
  focusedId: string | null;
  reducedMotion: boolean;
  /** When true, push the focused planet upward in the frame so it sits
   *  above the bottom-sheet panel on mobile. */
  framePlanetHigh: boolean;
}

const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0);
const DEFAULT_POS = new THREE.Vector3(0, 22, 55);

const SETTLE_POS_EPS = 0.6; // squared distance threshold to consider us "settled"
const SETTLE_TARGET_EPS = 0.08;

/**
 * Smoothly tweens the camera + OrbitControls target to follow the focused
 * body. When focusedId is null, animates back to the default system view
 * once, then yields control entirely back to OrbitControls (so user input
 * isn't overridden every frame).
 */
export default function CameraController({
  controlsRef,
  focusedId,
  reducedMotion,
  framePlanetHigh,
}: CameraControllerProps) {
  const { camera } = useThree();
  const { bodyRefs } = useSceneApi();

  // Whether the controller is currently driving the camera.
  // True while focused, or briefly while returning to default after unfocus.
  const drivingRef = useRef(false);
  const prevFocusedRef = useRef<string | null>(null);

  const desiredPos = useRef(new THREE.Vector3().copy(DEFAULT_POS));
  const desiredTarget = useRef(new THREE.Vector3().copy(DEFAULT_TARGET));
  const tmp = useRef(new THREE.Vector3());
  const dirScratch = useRef(new THREE.Vector3());

  // Drive the camera whenever focus changes; for reduced motion, snap.
  useEffect(() => {
    const justUnfocused =
      prevFocusedRef.current !== null && focusedId === null;
    prevFocusedRef.current = focusedId;

    if (focusedId) {
      drivingRef.current = true;
      if (reducedMotion) {
        const body = bodyRefs.current.get(focusedId);
        const data = getBodyById(focusedId);
        if (body && data) {
          const worldPos = body.getWorldPosition(new THREE.Vector3());
          const offsetDist = Math.max(data.radius * 5, 3);
          camera.position.set(
            worldPos.x + offsetDist,
            worldPos.y + offsetDist * 0.45,
            worldPos.z + offsetDist
          );
          controlsRef.current?.target.copy(worldPos);
          controlsRef.current?.update();
        }
      }
      return;
    }

    if (justUnfocused) {
      if (reducedMotion) {
        camera.position.copy(DEFAULT_POS);
        controlsRef.current?.target.copy(DEFAULT_TARGET);
        controlsRef.current?.update();
        drivingRef.current = false;
      } else {
        // Re-enter driving mode just long enough to fly back to default.
        drivingRef.current = true;
      }
    }
  }, [focusedId, reducedMotion, camera, controlsRef, bodyRefs]);

  useFrame((_state, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;

    // When not driving, hand full control back to OrbitControls.
    if (!drivingRef.current) {
      if (!controls.enabled) controls.enabled = true;
      return;
    }

    // We're driving — disable user input so we don't fight it.
    if (controls.enabled) controls.enabled = false;

    if (focusedId) {
      const body = bodyRefs.current.get(focusedId);
      const data = getBodyById(focusedId);
      if (body && data) {
        const worldPos = body.getWorldPosition(tmp.current);

        const offsetDist = Math.max(data.radius * 5, 3);
        const dirFromSun = dirScratch.current.copy(worldPos).normalize();
        if (dirFromSun.lengthSq() < 0.0001) dirFromSun.set(0, 0, 1);
        desiredPos.current
          .copy(worldPos)
          .addScaledVector(dirFromSun, offsetDist);
        desiredPos.current.y += offsetDist * 0.5;

        // Lower the OrbitControls target so the planet sits in the upper
        // part of the frame (above the bottom-sheet panel on mobile).
        desiredTarget.current.copy(worldPos);
        if (framePlanetHigh) {
          desiredTarget.current.y -= data.radius * 1.4 + offsetDist * 0.45;
        }
      }
    } else {
      // Returning to default
      desiredPos.current.copy(DEFAULT_POS);
      desiredTarget.current.copy(DEFAULT_TARGET);
    }

    if (reducedMotion) {
      camera.position.copy(desiredPos.current);
      controls.target.copy(desiredTarget.current);
    } else {
      const k = 1 - Math.pow(0.001, delta * 2.4);
      camera.position.lerp(desiredPos.current, k);
      controls.target.lerp(desiredTarget.current, k);
    }
    controls.update();

    // If we were returning to default and we're close enough, stop driving
    // so OrbitControls picks up cleanly.
    if (!focusedId) {
      const posClose =
        camera.position.distanceToSquared(DEFAULT_POS) < SETTLE_POS_EPS;
      const targetClose =
        controls.target.distanceToSquared(DEFAULT_TARGET) < SETTLE_TARGET_EPS;
      if (posClose && targetClose) {
        camera.position.copy(DEFAULT_POS);
        controls.target.copy(DEFAULT_TARGET);
        controls.update();
        drivingRef.current = false;
      }
    }
  });

  return null;
}
