import * as THREE from "three";
import React, { useEffect, useMemo, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import {
  Euler,
  Group,
  LoopRepeat,
  Object3D,
  Quaternion,
  Spherical,
  Vector3,
} from "three";
import { angleToMathPiRange, rotateBones, useBones } from "./logic/bones";
import { useThree, useFrame } from "@react-three/fiber";

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

interface GLTFAction extends THREE.AnimationClip {
  name: ActionName;
}

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
  animations: GLTFAction[];
};

const FILE_URL =
  "https://d27rt3a60hh1lx.cloudfront.net/models/Goose-1660213279/goose_02.glb.gz";

const HEAD_OFFSET = new THREE.Vector3(0, 0.705, 0.15);
const HEAD_RANGE = Math.PI / 2 - 0.2;

type GooseModelProps = {
  walking?: boolean;
  looking?: boolean;
};

export default function GooseModel(props: GooseModelProps) {
  const { walking, looking = true } = props;

  const { scene } = useThree();
  const group = useRef<Group>(null);
  const { nodes, materials, animations } = useGLTF(FILE_URL) as GLTFResult;
  const { actions } = useAnimations(animations, group);

  const bones = useBones(nodes.Bone);

  useEffect(() => {
    if (!actions.walk || !actions.idle) return;
    actions.walk.loop = LoopRepeat;
    actions.idle.loop = LoopRepeat;
    if (walking) {
      actions.idle.fadeOut(0.4);
      actions.walk.reset().fadeIn(0.4).play().setEffectiveTimeScale(2);
    } else {
      actions.walk.fadeOut(0.4);
      actions.idle.reset().fadeIn(0.4).play();
    }
  }, [walking]);

  const pos = useMemo(() => new Vector3(), []);
  const spher = useMemo(() => new Spherical(), []);
  const rot = useMemo(() => new Vector3(), []);
  useFrame(({ camera }) => {
    if (!bones || !group.current) return;
    group.current.getWorldPosition(pos);
    const posOffset = pos.add(HEAD_OFFSET).sub(camera.position);

    const offsetAngle = spher.setFromCartesianCoords(
      -posOffset.x,
      0,
      -posOffset.z
    ).theta;

    group.current.getWorldDirection(rot);

    const originalAngle = spher.setFromCartesianCoords(rot.x, 0, rot.z).theta;
    const angle = offsetAngle - originalAngle;

    if (Math.abs(angleToMathPiRange(angle)) <= HEAD_RANGE) {
      rotateBones(bones, angle);
    } else {
      rotateBones(bones, 0);
    }
  });

  return (
    <group ref={group} {...props}>
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
