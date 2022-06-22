import { useBox } from "@react-three/cannon";
import { useLimiter } from "spacesvr";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Euler, Group, Quaternion, Vector3 } from "three";
import { useRainbowMat } from "../materials/rainbowMat";

type WallProps = {
  enabled: boolean;
  size: number;
};

export default function Wall(props: WallProps) {
  const { enabled, size } = props;

  const mat = useRainbowMat();

  const group = useRef<Group>(null);
  const pos = useMemo(() => new Vector3(), []);
  const quat = useMemo(() => new Quaternion(), []);
  const dummy = useMemo(() => new Euler(), []);

  const [, api] = useBox(
    () => ({ type: "Static", args: enabled ? [size, size, 0.01] : [0, 0, 0] }),
    undefined,
    [size, enabled]
  );

  const limiter = useLimiter(50);
  useFrame(({ clock }) => {
    if (!limiter.isReady(clock) || !group.current) return;

    group.current.getWorldPosition(pos);
    group.current?.getWorldQuaternion(quat);
    api.position.copy(pos);
    api.rotation.copy(dummy.setFromQuaternion(quat));
  });

  return (
    <group name="wall" ref={group} position-z={-0.1}>
      {enabled && (
        <>
          <mesh material={mat}>
            <boxBufferGeometry args={[size, size, 0.01]} />
          </mesh>
          <mesh position-z={0.01}>
            <boxBufferGeometry args={[size, size, 0.01, 10, 10]} />
            <meshStandardMaterial
              color="white"
              wireframe
              transparent
              opacity={0.2}
            />
          </mesh>
        </>
      )}
    </group>
  );
}
