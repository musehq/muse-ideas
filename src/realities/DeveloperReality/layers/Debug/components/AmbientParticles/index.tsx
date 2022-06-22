import { useParticleMaterial } from "./shaders/particles";
import { useEffect, useMemo, useRef } from "react";
import {
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  InstancedMesh,
  Object3D,
} from "three";
import { GroupProps, useFrame } from "@react-three/fiber";

const COUNT = 500;
const X_RANGE = 50;
const Z_RANGE = 50;
const XZ_POW = 1.2;
const Y_RANGE = 30;
const Y_POW = 2;
const SCALE = 30;

export default function AmbientParticles(props: GroupProps) {
  const mesh = useRef<InstancedMesh>(null);

  const particleMaterial = useParticleMaterial();

  const dummy = useMemo(() => new Object3D(), []);

  useEffect(() => {
    if (!mesh.current) return;

    const seeds = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      const rx = (Math.pow(Math.random(), XZ_POW) - 0.5) * 2;
      const ry = (Math.pow(Math.random(), Y_POW) - 0.5) * 2;
      const rz = (Math.pow(Math.random(), XZ_POW) - 0.5) * 2;

      const x = rx * X_RANGE;
      const z = rz * Z_RANGE;
      const y = ry * Y_RANGE;
      dummy.position.fromArray([x, y, z]);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
      seeds[i] = Math.random();
    }
    mesh.current.instanceMatrix.needsUpdate = true;

    (mesh.current.geometry as InstancedBufferGeometry).setAttribute(
      "seed",
      new InstancedBufferAttribute(seeds, 1)
    );
  }, [COUNT, mesh]);

  useFrame(({ clock }) => {
    if (particleMaterial) {
      particleMaterial.uniforms.time.value = clock.getElapsedTime() * 0.4;
    }
  });

  return (
    <group name="ambient-particles" {...props}>
      {/* @ts-ignore */}
      <instancedMesh
        ref={mesh}
        // @ts-ignore
        args={[null, null, COUNT]}
        material={particleMaterial}
      >
        <sphereBufferGeometry args={[0.015 * SCALE, 16, 20]} />
      </instancedMesh>
    </group>
  );
}
