import * as THREE from "three";
import { DoubleSide, Material, MathUtils } from "three";
import { useMemo } from "react";
import { useLimitedFrame } from "spacesvr";

const uniforms = `
    uniform float time;
    uniform float intensity;
    uniform float fade;
    
    varying vec3 vPos;
    varying vec2 vUv;
`;

const vert = `
    #include <begin_vertex>
    float theta = sin( time + position.y / 255.0 ) / 3.0;
    gl_Position.x += sin(time  * 0.9);
    vPos = gl_Position.xyz;
    vUv = uv;
`;

const fragHeader = `
  // fbm from https://www.shadertoy.com/view/4lfSWl
  const float e = 2.7182818284590452353602874713527;

  vec4 noise(vec2 texCoord)
  {
      float G = e + (iTime * 0.1);
      vec2 r = (G * sin(G * texCoord.xy));
      return vec4(fract(r.x * r.y * (1.0 + texCoord.x)));
  }
  void mainImage(out vec4 o, vec2 texCoord)
{
    o = noise(texCoord);
}
 
`;

const frag = `
  float x_mod = 0.5 * vUv.x + 0.25;
  float fade_mod = clamp( abs(fade * 3. - 1. - x_mod) / 0.5 - 0.5, 0., 1.);
  float a = fbm(vec3(vUv.x * 40., vUv.y * 10., time + 0.9));
  
  a *= 2.6;
  a = clamp(a, 0., 1.);
  
  if ( a <= intensity * fade_mod ) discard;
  
  vec3 diff = mix( vec3(1., 1., 1.), vec3(1., 1., 1.), 0.1 + a * 0.9);
  // diff *= 1.3;
  
  vec4 diffuseColor = vec4( diff, a );
`;

export const useDistortMat = (fade: number) => {
  const distortMat = useMemo<Material>(() => {
    const material = new THREE.MeshBasicMaterial();

    material.onBeforeCompile = function (shader) {
      shader.uniforms.time = { value: 0 };
      shader.uniforms.intensity = { value: 1 };
      shader.uniforms.fade = { value: 0 };
      shader.vertexShader = uniforms + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        vert
      );

      shader.fragmentShader =
        uniforms +
        fragHeader +
        shader.fragmentShader.replace(
          "vec4 diffuseColor = vec4( diffuse, opacity );",
          frag
        );

      material.userData.shader = shader;

      material.customProgramCacheKey = () => frag + vert + fragHeader;
    };

    material.side = DoubleSide;

    return material;
  }, [frag, vert]);

  useLimitedFrame(60, ({ clock }) => {
    if (distortMat.userData.shader) {
      const uniforms = distortMat.userData.shader.uniforms;
      uniforms.time.value = clock.elapsedTime * 1.5;
      uniforms.fade.value = MathUtils.lerp(uniforms.fade.value, fade, 0.01);
    }
  });

  return distortMat;
};
