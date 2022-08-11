import * as THREE from "three";
import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { Group } from "three";

type GLTFResult = GLTF & {
  nodes: {
    goose_1: THREE.SkinnedMesh;
    goose_2: THREE.SkinnedMesh;
    goose_3: THREE.SkinnedMesh;
    Bone: THREE.Bone;
  };
  materials: {
    fur: THREE.MeshStandardMaterial;
    beak: THREE.MeshStandardMaterial;
    eye: THREE.MeshStandardMaterial;
  };
};

type ActionName =
  | "attack"
  | "die"
  | "eat"
  | "hit"
  | "idle"
  | "run"
  | "sleep"
  | "sleep_end"
  | "sleep_start"
  | "swim"
  | "walk";
type GLTFActions = Record<ActionName, THREE.AnimationAction>;

const FILE_URL =
  "https://d27rt3a60hh1lx.cloudfront.net/models/Goose-1660210492/goose_01.glb.gz";

type GooseModelProps = {
  walking?: boolean;
};

export default function GooseModel(props: GooseModelProps) {
  const { walking } = props;

  const group = useRef<Group>(null);
  const { nodes, materials, animations } = useGLTF(FILE_URL) as GLTFResult;
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (!actions.walk || !actions.idle) return;
    actions.walk.setEffectiveTimeScale(1);
    if (walking) {
      actions.idle.stop();
      actions.walk.play();
    } else {
      actions.walk.stop();
      actions.idle.play();
    }
  }, [walking]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene" scale={0.15}>
        <group
          name="goose_armature"
          position={[0, 2.1055, -0.0086]}
          rotation={[0.9757, 0, 0]}
          scale={0.5645}
        >
          <primitive object={nodes.Bone} />
          <group name="goose">
            <skinnedMesh
              name="goose_1"
              geometry={nodes.goose_1.geometry}
              material={materials.fur}
              skeleton={nodes.goose_1.skeleton}
            />
            <skinnedMesh
              name="goose_2"
              geometry={nodes.goose_2.geometry}
              material={materials.beak}
              skeleton={nodes.goose_2.skeleton}
            />
            <skinnedMesh
              name="goose_3"
              geometry={nodes.goose_3.geometry}
              material={materials.eye}
              skeleton={nodes.goose_3.skeleton}
            />
          </group>
        </group>
      </group>
    </group>
  );
}
