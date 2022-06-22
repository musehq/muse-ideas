import { useMemo } from "react";
import { DoubleSide, ShaderMaterial, Uniform } from "three";
import { useLimiter } from "spacesvr";
import { useFrame } from "@react-three/fiber";

export const useRainbowMat = () => {
  const mat = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: {
          time: new Uniform(0),
        },
        vertexShader: vert,
        fragmentShader: frag,
        side: DoubleSide,
      }),
    []
  );

  const limiter = useLimiter(70);
  useFrame(({ clock }) => {
    if (!limiter.isReady(clock)) return;
    mat.uniforms.time.value = clock.getElapsedTime();
  });

  return mat;
};

const perlin = `
  vec2 hash22( vec2 p )
  {
    p = vec2( dot(p,vec2(127.1,311.7)),
          dot(p,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(p)*43758.5453123);
  }
  float perlinnoise( in vec2 p )
  {
    const float K1 = 0.366025404; 
    const float K2 = 0.211324865; 
    vec2 i = floor( p + (p.x+p.y)*K1 );
    vec2 a = p - i + (i.x+i.y)*K2;
    vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0*K2;
    vec3 h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
    vec3 n = h*h*h*h*vec3( dot(a,hash22(i+0.0)), dot(b,hash22(i+o)), dot(c,hash22(i+1.0)));
    return dot( n, vec3(70.0) );
    
  }
`;

export const vert = `
  uniform float time;
  varying vec3 vPos;
  
  void main() {
      vec3 pos = position;
      vPos = pos;    
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
  }
`;

export const frag = `
  uniform float time;
  varying vec3 vPos;

  ${perlin}

  void main() {
    gl_FragColor.r = (perlinnoise(vec2(vPos.x / 10., time * 0.15)) + 1.) / 2.;
    gl_FragColor.g = (perlinnoise(vec2(vPos.y / 10. + 100., time * 0.3)) + 1.) / 2.;
    gl_FragColor.b = (perlinnoise(vec2(vPos.z / 10. + 3000., time * 0.2)) + 1.) / 2.;
    
    gl_FragColor.a = 1.0;;
  }
`;
