import { Color, DoubleSide, ShaderMaterial, Uniform, Vector3 } from "three";
import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useLimiter } from "spacesvr";
import { frag, vert } from "./shaders/sky";
import { config, useSpring } from "react-spring/three";

type AscensionSkyProps = {
  color?: string;
  radius?: number;
};

export default function AscensionSky(props: AscensionSkyProps) {
  const { color = "#6192ca", radius = 80 } = props;

  const { skyColor } = useSpring({
    skyColor: color,
    config: config.molasses,
  });

  const mat = useMemo(() => {
    const uniforms = {
      time: new Uniform(0),
      skyColor: new Uniform(new Vector3()),
    };
    return new ShaderMaterial({
      uniforms: uniforms,
      side: DoubleSide,
      vertexShader: vert,
      fragmentShader: frag,
    });
  }, [vert, frag]);

  const limiter = useLimiter(50);
  useFrame(({ clock }) => {
    if (!mat || !limiter.isReady(clock)) return;

    mat.uniforms.time.value = clock.getElapsedTime();
    mat.uniforms.skyColor.value.fromArray(new Color(skyColor.get()).toArray());
  });

  return (
    <group name="sky">
      <mesh material={mat}>
        <sphereBufferGeometry args={[radius, 64, 64]} />
      </mesh>
    </group>
  );
}
