import { useEffect, useMemo } from "react";
import { Color, DoubleSide, MeshBasicMaterial } from "three";
import { useFrame } from "@react-three/fiber";

const REPS = 5;

function convertColorToVec3String(color: Color): string {
  return `vec3(${color.r}, ${color.g}, ${color.b})`;
}

const frag = `
    vec2 center = vec2(0.5, 0.5);
    float dist = length(vUv - center);
    float alpha = fract(dist * ${REPS}. - uTime * SPEED * 0.7);
    alpha *= ALPHA;
    gl_FragColor = vec4(COLOR, alpha);
    
`;

export const useCircleMat = (color: string, speed: number, alpha: number) => {
  const mat = useMemo(() => {
    const m = new MeshBasicMaterial({
      side: DoubleSide,
      transparent: true,
    });

    // pass here instead of as parameter or it won't be set properly
    // https://github.com/mrdoob/three.js/blob/master/src/materials/Material.js#L129
    m.defines = {
      COLOR: convertColorToVec3String(new Color("white")),
      SPEED: "-1.0",
      ALPHA: "0.3",
    };

    m.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 };

      shader.vertexShader = `
        varying vec2 vUv;
        ${shader.vertexShader}
      `;

      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\n" + "vUv = uv;\n"
      );

      shader.fragmentShader = `
            uniform float uTime;
            varying vec2 vUv;
            ${shader.fragmentShader}
      `;

      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <dithering_fragment>",
        "#include <dithering_fragment>\n" + frag
      );

      m.userData.shader = shader;
    };

    m.customProgramCacheKey = () => frag;

    return m;
  }, []);

  useEffect(() => {
    if (!mat.defines) mat.defines = {};
    mat.defines.COLOR = convertColorToVec3String(new Color(color));
    mat.defines.SPEED = (-speed).toFixed(3);
    mat.defines.ALPHA = alpha.toFixed(3);
    mat.needsUpdate = true;
  }, [mat, speed, color, alpha]);

  useFrame(({ clock }) => {
    if (!mat.userData.shader) return;
    mat.userData.shader.uniforms.uTime.value = clock.elapsedTime;
  });

  return mat;
};
