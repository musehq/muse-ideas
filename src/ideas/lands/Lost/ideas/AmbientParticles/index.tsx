import { useParticleMaterial } from "./shaders/particles";
import { useEffect, useMemo, useRef } from "react";
import {
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  InstancedMesh,
  Object3D,
  SphereBufferGeometry,
} from "three";
import { GroupProps, useFrame } from "@react-three/fiber";

const COUNT = 500;
const X_RANGE = 50;
const Z_RANGE = 50;
const XZ_POW = 1.2;
const Y_RANGE = 30;
const Y_POW = 2.8;
const SCALE = 20;

type AmbientParticleProps = {
  fog: boolean;
  color: string;
  fogDistance: number;
} & GroupProps;

export default function AmbientParticles(props: AmbientParticleProps) {
  const { fog, color, fogDistance, ...restProps } = props;

  const mesh = useRef<InstancedMesh>(null);

  const particleMaterial = useParticleMaterial(fog, color, fogDistance);

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

  const geo = useMemo(
    () => new SphereBufferGeometry(0.005 * SCALE, 16, 20),
    []
  );

  return (
    <group name="ambient-particles" {...restProps}>
      <instancedMesh ref={mesh} args={[geo, particleMaterial, COUNT]} />
    </group>
  );
}
