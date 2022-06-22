import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Group, Vector3 } from "three";
import { Spinning, useLimiter, usePlayer } from "spacesvr";
import { useRainbowMat } from "../materials/rainbowMat";

type CentrifyProps = {
  enabled: boolean;
  distance?: number;
};

export default function Centrify(props: CentrifyProps) {
  const { enabled, distance = 6 } = props;

  const group = useRef<Group>(null);
  const player = usePlayer();
  const dummy = useMemo(() => new Vector3(), []);

  const mat = useRainbowMat();

  const limiter = useLimiter(40);
  useFrame(({ clock, camera }) => {
    if (!limiter.isReady(clock) || !enabled || !group.current) return;

    group.current.getWorldPosition(dummy);
    if (camera.position.distanceTo(dummy) > distance - 0.1) {
      dummy.y += 1.1;
      player.position.set(dummy);
    }
  });

  return (
    <group name="centrify" ref={group}>
      {enabled && (
        <>
          <mesh material={mat}>
            <sphereBufferGeometry args={[distance, 30, 30]} />
          </mesh>
          <Spinning ySpeed={0.65}>
            <mesh>
              <sphereBufferGeometry args={[distance * 0.99, 30, 30]} />
              <meshStandardMaterial
                color="white"
                wireframe
                transparent
                opacity={0.2}
              />
            </mesh>
          </Spinning>
        </>
      )}
    </group>
  );
}
