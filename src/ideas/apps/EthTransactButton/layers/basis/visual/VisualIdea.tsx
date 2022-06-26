import { useMemo } from "react";
import { GroupProps, useFrame } from "@react-three/fiber";
import { Color, DoubleSide, MeshStandardMaterial, Uniform } from "three";
import { useLimiter } from "spacesvr";
import { Idea } from "../classes/idea";
import { frag, vert, vertHead } from "./shaders/idea";

type Props = {
  size?: number | [number, number, number];
  idea?: Idea;
} & Partial<Idea> &
  GroupProps;

/**
 * Pure Idea
 *
 *
 * @param props
 * @constructor
 */
export function VisualIdea(props: Props) {
  const {
    size = 1,
    idea,
    mediation = 0,
    specificity = 0,
    utility = 0.5,
    ...restProps
  } = props;

  const HEX = idea
    ? idea.getHex()
    : new Idea().setFromCreation(mediation, specificity, utility).getHex();
  const seed = useMemo(() => Math.random(), []);
  const color = useMemo(() => new Color(HEX), [HEX]);
  const RADIUS = 4;
  const NOISE_AMPLITUDE = 0.82;
  const NOISE_FREQ = 0.154;
  const SIZE: [number, number, number] = Array.isArray(size)
    ? [size[0] * 0.2, size[1] * 0.2, size[2] * 0.2]
    : [size * 0.2, size * 0.2, size * 0.2];

  const mat = useMemo(() => {
    const m = new MeshStandardMaterial({
      metalness: 0.18,
      roughness: 0.49,
      envMapIntensity: 0.66,
      side: DoubleSide,
    });

    m.onBeforeCompile = function (shader) {
      shader.uniforms.radius = new Uniform(RADIUS);
      shader.uniforms.time = new Uniform(0);
      shader.uniforms.color = new Uniform(color);
      shader.uniforms.radiusVariationAmplitude = new Uniform(NOISE_AMPLITUDE);
      shader.uniforms.radiusNoiseFrequency = new Uniform(NOISE_FREQ);

      const uniforms = `
        uniform float radius;
        uniform float time;
        uniform vec3 color;
        uniform float radiusVariationAmplitude;
        uniform float radiusNoiseFrequency;
      `;

      shader.vertexShader =
        uniforms +
        vertHead +
        shader.vertexShader.replace("#include <begin_vertex>", vert);

      shader.fragmentShader =
        uniforms +
        shader.fragmentShader.replace("#include <dithering_fragment>", frag);

      m.userData.shader = shader;
    };

    return m;
  }, [RADIUS, color, NOISE_AMPLITUDE, NOISE_FREQ, frag, vert]);

  const limiter = useLimiter(50);
  useFrame(({ clock }) => {
    if (!mat?.userData?.shader || !limiter.isReady(clock)) return;

    mat.userData.shader.uniforms.time.value =
      clock.getElapsedTime() / 6 + seed * 1000;
  });

  return (
    <group {...restProps} name="idea">
      <group scale={SIZE}>
        <mesh material={mat}>
          <sphereBufferGeometry args={[RADIUS, 64, 32]} />
        </mesh>
      </group>
    </group>
  );
}
