/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef } from "react";
import * as THREE from "three";
import { AudioAnalyser } from "three";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useFrame } from "@react-three/fiber";
import { useLimiter, useModel } from "spacesvr";
import { useDistortMat } from "../logic/distorMat";

type GLTFResult = GLTF & {
  nodes: {
    screen: THREE.Mesh;
    "TV-Mat": THREE.Mesh;
    "TV-Mat2": THREE.Mesh;
    "TV-Mat001": THREE.Mesh;
    "NEs-Mat": THREE.Mesh;
    "NEs-Mat1": THREE.Mesh;
    "NEs-Mat2": THREE.Mesh;
    "NEs-Mat3": THREE.Mesh;
  };
  materials: {
    ["Mat2"]: THREE.MeshStandardMaterial;
    ["Mat1"]: THREE.MeshStandardMaterial;
    ["Mat3"]: THREE.MeshStandardMaterial;
    ["Mat4"]: THREE.MeshStandardMaterial;
    ["TVMat1"]: THREE.MeshStandardMaterial;
    ["TVMat2"]: THREE.MeshStandardMaterial;
    Mat: THREE.MeshStandardMaterial;
  };
};

type ModelProps = JSX.IntrinsicElements["group"];

const fileURL =
  "https://d1htv66kutdwsl.cloudfront.net/284a7d50-b70f-4afe-8642-f56d62c2c984/8025c333-33ac-41b7-916e-8a83e954be61.glb";

export function TV(props: ModelProps) {
  const { nodes, materials } = useModel(fileURL) as GLTFResult;
  const distortMat = useDistortMat(0.5);
  return (
    <group {...props} dispose={null}>
      <group position={[0, 0, 49.13]}>
        <mesh geometry={nodes.screen.geometry} material={distortMat} />
        <mesh geometry={nodes["TV-Mat"].geometry} material={materials.TVMat1} />
        <mesh
          geometry={nodes["TV-Mat2"].geometry}
          material={materials.TVMat2}
        />
      </group>
    </group>
  );
}

useModel.preload(fileURL);
