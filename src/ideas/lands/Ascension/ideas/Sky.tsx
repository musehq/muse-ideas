import { useRef } from "react";
import { Group } from "three";
import { useLimiter } from "spacesvr";
import { useFrame } from "@react-three/fiber";
import AscensionSky from "./AscensionSky";

type SkyProps = {
  color?: string;
};

export default function Sky(props: SkyProps) {
  const { color } = props;

  const group = useRef<Group>(null);

  const limiter = useLimiter(5);
  useFrame(({ clock, camera }) => {
    if (!limiter.isReady(clock) || !group.current) return;

    group.current.position.x = camera.position.x;
    group.current.position.z = camera.position.z;
  });

  return (
    <group name="sky" ref={group}>
      <AscensionSky radius={150} color={color} />
    </group>
  );
}
