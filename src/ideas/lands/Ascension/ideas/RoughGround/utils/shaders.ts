import { Uniform, Vector2, Vector3, Vector4 } from "three";

export const printUniforms = (uniforms: { [p: string]: Uniform }): string => {
  return Object.keys(uniforms).reduce((acc, key) => {
    let { value } = uniforms[key];
    let type = typeof value as string;
    // Coerce strings to floats (useful when feeding data from HTML inputs).
    if (type === "string") {
      value = parseFloat(value);
      type = "number";
    }
    if (value instanceof Vector2) {
      type = "vec2";
    }
    if (value instanceof Vector3) {
      type = "vec3";
    }
    if (value instanceof Vector4) {
      type = "vec4";
    }
    switch (type) {
      case "number":
        acc += `uniform float ${key};\n`;
        break;
      case "boolean":
        acc += `uniform bool ${key};\n`;
        break;
      case "vec2":
        acc += `uniform vec2 ${key};\n`;
        break;
      case "vec3":
        acc += `uniform vec3 ${key};\n`;
        break;
      case "vec4":
        acc += `uniform vec4 ${key};\n`;
        break;
    }
    return acc;
  }, `varying vec2 vUv;`);
};
