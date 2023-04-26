import { GroupProps } from "@react-three/fiber";
import { DoubleSide, Mesh, Vector3 } from "three";
import { useRef, useState, useContext } from "react";
import { useLimitedFrame } from "spacesvr";
import { useSpot } from "./logic/spot";
import { useCircleMat } from "./logic/circleMat";
import { VisibleContext } from "../..";

type SpotProps = {
  radius?: number;
  strength?: number;
  color?: string;
  alpha?: number;
} & GroupProps;

export default function Spot(props: SpotProps) {
  const {
    radius = 1,
    strength = 1,
    color = "white",
    alpha = 0.3,
    ...rest
  } = props;

  const mesh = useRef<Mesh>(null);
  const [worldPos] = useState(new Vector3());

  useLimitedFrame(1, () => {
    if (!mesh.current) return;
    mesh.current.getWorldPosition(worldPos);
  });

  const { visible, setVisible } = useContext(VisibleContext);
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
