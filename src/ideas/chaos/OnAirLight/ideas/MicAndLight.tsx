import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { GroupProps } from "@react-three/fiber";
import { animated, useSpring } from "@react-spring/three";

type GLTFResult = GLTF & {
  nodes: {
    mic_black: THREE.Mesh;
    mic_fuzz: THREE.Mesh;
    mic_logo: THREE.Mesh;
    on_air: THREE.Mesh;
    on_air_1: THREE.Mesh;
    on_air_2: THREE.Mesh;
  };
  materials: {
    black: THREE.MeshStandardMaterial;
    fuzz: THREE.MeshStandardMaterial;
    logo: THREE.MeshStandardMaterial;
    text: THREE.MeshStandardMaterial;
    chrome: THREE.MeshStandardMaterial;
    light: THREE.MeshStandardMaterial;
  };
};

const MODEL_URL =
  "https://d27rt3a60hh1lx.cloudfront.net/content/on-air-light/light_and_mic_01.glb.br";

type MicAndLightProps = {
  connected?: boolean;
  voice?: boolean;
  enable?: boolean;
} & GroupProps;

export function MicAndLight(props: MicAndLightProps) {
  const { connected, voice, enable, ...rest } = props;

  const { nodes, materials } = useGLTF(MODEL_URL) as GLTFResult;

  const { textColor, innerColor } = useSpring({
    textColor: voice ? "#ff0000" : "white",
    innerColor: voice ? "#ffb29b" : "white",
  });

  return (
    <group {...rest} dispose={null}>
      <mesh geometry={nodes.mic_black.geometry} material={materials.black} />
      <mesh geometry={nodes.mic_fuzz.geometry} material={materials.fuzz} />
      <mesh geometry={nodes.mic_logo.geometry} material={materials.logo} />
      <mesh geometry={nodes.on_air.geometry}>
        {/* @ts-ignore */}
        <animated.meshStandardMaterial color={textColor} />
      </mesh>
      <mesh geometry={nodes.on_air_1.geometry} material={materials.chrome} />
      <mesh geometry={nodes.on_air_2.geometry}>
        <animated.meshStandardMaterial
          map={materials.light.map}
          color={innerColor}
        />
      </mesh>
    </group>
  );
}
