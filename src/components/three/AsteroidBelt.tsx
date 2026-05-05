"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface AsteroidBeltProps {
  count?: number;
  innerRadius?: number;
  outerRadius?: number;
  speedFactor: number;
  reducedMotion: boolean;
}

/** Seeded PRNG so the belt layout is deterministic across renders. */
function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Instanced asteroid belt — distributed in a thin torus. */
export default function AsteroidBelt({
  count = 120,
  innerRadius = 19,
  outerRadius = 22,
  speedFactor,
  reducedMotion,
}: AsteroidBeltProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Pre-compute matrices + per-instance spin axes (deterministic).
  const { matrices, axes, speeds } = useMemo(() => {
    const rand = mulberry32(1337);
    const dummy = new THREE.Object3D();
    const mats: THREE.Matrix4[] = [];
    const ax: THREE.Vector3[] = [];
    const sp: number[] = [];

    for (let i = 0; i < count; i++) {
      const angle = rand() * Math.PI * 2;
      const r = innerRadius + rand() * (outerRadius - innerRadius);
      const y = (rand() - 0.5) * 0.6;
      const scale = 0.05 + rand() * 0.18;

      dummy.position.set(Math.cos(angle) * r, y, Math.sin(angle) * r);
      dummy.rotation.set(rand() * Math.PI, rand() * Math.PI, rand() * Math.PI);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      mats.push(dummy.matrix.clone());

      ax.push(
        new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize()
      );
      sp.push((rand() - 0.5) * 1.4);
    }
    return { matrices: mats, axes: ax, speeds: sp };
  }, [count, innerRadius, outerRadius]);

  // Push the initial matrices onto the instanced mesh once mounted.
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    matrices.forEach((m, i) => mesh.setMatrixAt(i, m));
    mesh.instanceMatrix.needsUpdate = true;
  }, [matrices]);

  // Reusable scratch objects for the per-frame tumble
  const scratch = useRef({
    tmp: new THREE.Matrix4(),
    rot: new THREE.Matrix4(),
    q: new THREE.Quaternion(),
  });

  useFrame((_s, delta) => {
    if (!groupRef.current || reducedMotion) return;
    groupRef.current.rotation.y += delta * 0.02 * speedFactor;

    const mesh = meshRef.current;
    if (!mesh || speedFactor <= 0) return;

    const { tmp, rot, q } = scratch.current;
    for (let i = 0; i < count; i++) {
      mesh.getMatrixAt(i, tmp);
      q.setFromAxisAngle(axes[i], delta * speeds[i] * speedFactor);
      rot.makeRotationFromQuaternion(q);
      tmp.multiply(rot);
      mesh.setMatrixAt(i, tmp);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, count]}
        frustumCulled={false}
      >
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#7d6c5b" roughness={0.95} metalness={0.05} />
      </instancedMesh>
    </group>
  );
}
