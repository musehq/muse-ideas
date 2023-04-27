import { Suspense, useRef } from "react";
import { GroupProps } from "@react-three/fiber";
import { findColliderMeshes } from "./utils/mesh";
import { Model } from "spacesvr";
import { Group } from "three";
import { TV } from "./models/TV";

type TVEffectProps = {
  model?: string;
} & GroupProps;

export default function TVEffect(props: TVEffectProps) {
  const {
    model = "https://d1htv66kutdwsl.cloudfront.net/e560b133-3173-4656-9b0b-7879fc3c4025/e32d759b-9ccb-400e-8c3a-c76b54085a09.glb",
    ...restProps
  } = props;

  return (
    <group name="tveffect" {...restProps}>
      <Suspense fallback={null}>
        <TV scale={0.02} position-y={1} />
      </Suspense>
    </group>
  );
}
