import { GroupProps } from "@react-three/fiber";
import { DoubleSide, Mesh, Vector3 } from "three";
import React, { useRef, useState, useContext } from "react";
import { useLimitedFrame } from "spacesvr";
import { useSpot } from "./logic/spot";
import { useCircleMat } from "./logic/circleMat";

type SpotProps = {
  radius?: number;
  strength?: number;
  color?: string;
  alpha?: number;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
} & GroupProps;

export default function Spot(props: SpotProps) {
  const {
    radius = 1,
    strength = 1,
    color = "white",
    alpha = 0.3,
    setVisible,
    ...rest
  } = props;

  const mesh = useRef<Mesh>(null);
  const [worldPos] = useState(new Vector3());

  useLimitedFrame(1, () => {
    if (!mesh.current) return;
    mesh.current.getWorldPosition(worldPos);
  });

  useSpot(worldPos, radius, strength, {
    onEnter: () => setVisible(true),
    onLeave: () => setVisible(false),
  });

  const mat = useCircleMat(color, strength, alpha);

  return (
    <group name="spot">
      <mesh ref={mesh} rotation-x={-Math.PI / 2} material={mat}>
        <circleBufferGeometry args={[radius, 32, 32]} />
      </mesh>
    </group>
  );
}
