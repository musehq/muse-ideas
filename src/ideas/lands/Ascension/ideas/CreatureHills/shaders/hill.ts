const hsv_helper = `
    vec3 rgb2hsv(vec3 c)
    {
        vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
        vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
        vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
    
        float d = q.x - min(q.w, q.y);
        float e = 1.0e-10;
        return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
    }
    
    vec3 hsv2rgb(vec3 c)
    {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }
`;

const random = `
    float random( vec2 p ) {
    vec2 K1 = vec2(
      23.14069263277926, // e^pi (Gelfond's constant)
      2.665144142690225
    );
    return fract( cos( dot(p,K1) ) * 12345.6789 );
  }
`;

export const vert = `
    // this is line 62 on error printing
    
    varying float dist; // gets higher the further you go away
    varying vec3 vPos;
    varying vec3 vNormal;
    
    void main() {
        vec4 pos = vec4(position, 1.0);
        
        vec4 mvPosition = modelViewMatrix * vec4( pos );
        
        gl_Position = projectionMatrix * mvPosition;
        
        dist = (1. - gl_Position.z / 75.);
        vUv = uv; 
        vPos = pos.xyz;
        vNormal = normal;
    }
`;

// 6293cb
export const frag = `
    varying vec3 vPos;
    varying float dist;
     varying vec3 vNormal;
     
     #define PI 3.1415
     
     ${hsv_helper}
     ${random}
     
    vec3 addPath(vec3 color, float len, float theta) {
        float thick = 2.;
        
        float xp = (vPos.x+offset.x) * cos(theta) - (vPos.y+offset.y) * sin(theta);
        float yp = (vPos.y+offset.y) * cos(theta) + (vPos.x+offset.x) * sin(theta);
    
        // bound from -20 to 0 on x
        float path_x = abs(xp) / thick;
        path_x = pow(path_x, 1.5);
        
        // bound from -10 to 10 on z
        float path_y = (yp - 1. + len) / len;
        path_y = pow(path_y, 30.);
        
        // define path mix with pow for tighter edges
        float path_mix = clamp(path_y + path_x , 0., 1.);
        path_mix = pow(path_mix, 2.7);
        path_mix = 1. - path_mix;
        
        // get a brighter path color and mix in
        vec3 path_color = rgb2hsv(color);
        path_color.x -= 0.04;
        path_color.y = 0.6;
        path_color.z += 0.2;
        path_color = pathColor;
        color = mix(color, path_color, 0.9 * path_mix);
        
        return color;
    } 

    void main(){
        float angle = dot(vNormal, vec3(0., 1., 0.)) * 0.8 + 0.2;
        vec3 color = gl_FragColor.rgb;
        
        // make it darker
        vec3 base_color = grassColor;
        vec3 color_darker = mix(base_color, vec3(0.), 1.);
        color = mix(base_color, color_darker, angle);
        
        vec3 noisy = vec3(random(vUv*100.)) * 0.3 + 0.3;
        vec3 noisier_color = mix(color, noisy, 0.5);
        color = mix(color, noisier_color, angle);
        
        color = addPath(color, 40., PI * 2.);
        color = addPath(color, 35., PI * 2. * 1. / 3.);
        color = addPath(color, 20., PI * 2. * 2. / 3.);
        
        gl_FragColor.rgb = color;
    }
`;
