import { Suspense, useState } from "react";
import { GroupProps } from "@react-three/fiber";
import { findScreenMesh } from "./utils/mesh";

import { Model, Interactable, useToolbelt, VisualEffect } from "spacesvr";
import Bloom from "./components/Bloom";
import { TV } from "./models/TV";
// import Audio from "./components/Audio";
import { setConstantValue } from "typescript";

type TVEffectProps = {
  model?: string;
} & GroupProps;

export default function TVEffect(props: TVEffectProps) {
  const {
    model = "https://d1htv66kutdwsl.cloudfront.net/7efb17bd-9d7c-4b64-8edc-c73fe1179b3f/3d393953-03df-4ccb-97e7-01f37b173575.glb",
    ...restProps
  } = props;

  return (
    <group name="tveffect" {...restProps}>
      <Suspense fallback={null}>
        <TV scale={10} position={[0, 0, 0]} />
      </Suspense>
    </group>
  );
}
