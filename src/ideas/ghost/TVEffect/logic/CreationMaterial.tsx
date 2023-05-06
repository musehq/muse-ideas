import { Suspense, useRef } from "react";
import { Color } from "three";
import Three from "three";
import { GroupProps } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { extend } from "@react-three/fiber";
import { Vector3 } from "three";

const CreationMaterial = shaderMaterial(
  {
    time: 0,
    resolution: new Vector3(),
  },
  `
  varying vec2 vUv;
  
  void main()	{
    vUv = uv;
  
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
  }
  `,
  `
  uniform vec3 resolution;
  uniform float time;
  
  void mainImage( out vec4 fragColor, in vec2 fragCoord ){
      vec3 c;
      float l, z = time;
  
      for(int i=0;i<10;i++) {
          vec2 uv, p = fragCoord.xy/resolution.xy;
          uv = p;
          p -= .5;
          p.x *= resolution.x / resolution.y;
          z += 2.0;
          l = length(p);
          uv += p / l * (sin(z / 2.) + 1.) * abs(sin(l * 3. - z * .5));
          c[i] = .01 / length(abs(mod(uv, 1.) -.5));
      }
  
      fragColor = vec4(c / l, time / 2.);
  }
  
  void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
  }
  `
);

extend({ CreationMaterial });
