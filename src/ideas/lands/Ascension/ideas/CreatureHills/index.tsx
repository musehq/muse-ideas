import RoughGround, { GenFunc } from "../RoughGround";
import { Color, MathUtils, MeshStandardMaterial, Vector2 } from "three";
import { useCallback, useEffect, useMemo } from "react";

const HEIGHT = 8;
const SMOOTH = 45;

type ConvexHillsProps = {
  seed: string;
  grassColor: string;
  pathColor: string;
};

export default function ConvexHills(props: ConvexHillsProps) {
  const { grassColor, pathColor, seed } = props;

  const mat = useMemo(() => {
    const m = new MeshStandardMaterial({
      color: new Color(grassColor),
      metalness: 0,
      roughness: 1,
    });

    m.onBeforeCompile = (shader) => {
      shader.vertexShader = vert_head + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        "#include <project_vertex>",
        "#include <project_vertex>\n" + vert_body
      );

      shader.fragmentShader = frag_head + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <aomap_fragment>",
        " " + frag_body
      );

      m.userData.shader = shader;
    };

    m.needsUpdate = true;

    return m;
  }, []);

  useEffect(() => {
    mat.color = new Color(grassColor);
    mat.needsUpdate = true;
  }, [mat, grassColor]);

  const dummy = useMemo(() => new Vector2(), []);
  const generate: GenFunc = useCallback((simplex, x, z) => {
    let newY = (HEIGHT * (simplex.noise2D(x / SMOOTH, z / SMOOTH) + 1)) / 2;

    dummy.set(x, z);
    const dist = dummy.length();

    const SIZE = 24;
    if (dist <= SIZE) {
      newY = mix(
        newY,
        2,
        Math.pow(MathUtils.clamp((SIZE - dist) / SIZE, 0, 1), 0.8)
      );
    }

    return newY;
  }, []);

  return (
    <RoughGround
      seed={seed}
      material={mat}
      numChunks={60}
      chunkSize={45}
      height={HEIGHT}
      smoothness={SMOOTH}
      generate={generate}
    />
  );
}

const random = `
    float random( vec2 p ) {
    vec2 K1 = vec2(
      23.14069263277926, // e^pi (Gelfond's constant)
      2.665144142690225
    );
    return fract( cos( dot(p,K1) ) * 12345.6789 );
  }
`;

const vert_head = `
    varying vec3 vPos;
    varying vec3 vfNormal;
    varying vec2 vUv;
`;

const vert_body = `
   vPos = (modelMatrix * vec4(position, 1.)).xyz;
   vfNormal = normal;
   vUv = uv;
`;

const frag_head = `
  varying vec3 vPos;
  varying vec3 vfNormal;
  varying vec2 vUv;
  
  float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
  }

  ${random}
`;

const frag_body = `
    // float dist = length(vPos);
    //
    // float angle = dot(vfNormal, vec3(0., 0., 1.)) + 0.2;
    //
    // // make it darker
    // vec3 base_color = diffuseColor.rgb;
    // vec3 color_darker = mix(base_color, vec3(0.), 1.);
    // diffuseColor.rgb = mix(base_color, color_darker, angle);
    //
    // // add noisiness
    // vec3 noisy = vec3(random(vUv*100.)) * 0.3 + 0.3;
    // vec3 noisier_color = mix(diffuseColor.rgb, noisy, 0.5);
    // diffuseColor.rgb = mix(diffuseColor.rgb, noisier_color, angle);
  
    
    float angle = dot(vfNormal, vec3(0., 0., 1.)) + 0.2;
    float ambientOcclusion = 0.9 * angle + 0.2;
    reflectedLight.indirectDiffuse *= ambientOcclusion;
`;

const mix = (x: number, y: number, a: number) => x * (1 - a) + y * a;
