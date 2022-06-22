const random = `
float random( vec3 p ) {
  vec3 K1 = vec3(
    23.14069263277926, // e^pi (Gelfond's constant)
    2.665144142690225, 
    2.665144142690225  // 2^sqrt(2) (Gelfondâ€“Schneider constant)
  );
  return fract( cos( dot(p,K1) ) * 12345.6789 );
}
`;

export const vert = `
    varying vec2 vUv;
    varying float dist; // gets higher the further you go away
    varying vec2 proj_uv;
    varying vec3 vPos;

    void main() {
        // model matrix is translation, rotation, scaling for vertices
        // view matrix applies transformations of the camera
        // projection matrix puts it onto the screen (perspective camera)
    
        vec4 pos = vec4(position, 1.0);
        vec4 mvPosition = modelViewMatrix * vec4( pos );
        vUv = uv; 
        gl_Position = projectionMatrix * mvPosition;
        
        dist = (1. - gl_Position.z / 55.);
        proj_uv = pos.xy;
        vPos = pos.xyz;
    }
`;

// 6293cb
export const frag = `
    ${random}
    
    uniform float time;
    uniform vec3 skyColor;

    varying vec2 vUv;
    varying vec3 vPos;
    varying float dist;
    varying vec2 proj_uv;
   
    #define ENABLE_FOG false
    #define fogNear 10.
    #define fogFar 100.
    #define fogColor vec3(0.62,0.616,0.616)
  

    void main(){
        gl_FragColor.rgb = skyColor; //vec3(0.384,0.576,0.796);
        
        float const_offset = 10.;
        float time_offset = 0.2 * (sin(time * 0.001) + 1.);
        vec3 noisy = vec3(random((vPos / 100.) + time_offset)) * 0.2;
        
        gl_FragColor.rgb = mix(gl_FragColor.rgb, noisy, dist * 0.6);
    
        if(ENABLE_FOG) {
            float depth = gl_FragCoord.z / gl_FragCoord.w;
            float fogFactor = smoothstep( fogNear, fogFar, depth );
            gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
        }
        
        gl_FragColor.a = 1.;
    }
`;
