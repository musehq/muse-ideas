import { ReactNode, useMemo, useRef } from "react";
import { Euler, Group, Quaternion, Vector2, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { useLimiter } from "spacesvr";

type Props = {
  enabled?: boolean;
  children: ReactNode;
};

const AXIS = new Vector3(0, 1, 0);

const LookAtPlayer = (props: Props) => {
  const { enabled = true, children } = props;

  const group = useRef<Group>(null);
  const wrapper = useRef<Group>(null);

  const limiter = useLimiter(70);
  const dummy1 = useMemo(() => new Vector2(), []);
  const dummy2 = useMemo(() => new Vector2(), []);
  const dummy3 = useMemo(() => new Vector3(), []);
  const dummy4 = useMemo(() => new Quaternion().setFromAxisAngle(AXIS, 0), []);
  const dummy5 = useMemo(() => new Euler(), []);

  useFrame(({ clock, camera }, delta) => {
    if (!group.current || !wrapper.current || !limiter.isReady(clock)) return;

    let rot = 0;

    if (enabled) {
      group.current.getWorldPosition(dummy3);
      group.current.getWorldQuaternion(dummy4);
      dummy1.set(dummy3.x, dummy3.z);
      dummy2.set(camera.position.x, camera.position.z);
      dummy1.sub(dummy2);

      rot = -dummy1.normalize().angle() - Math.PI / 2;
      rot -= dummy5.setFromQuaternion(dummy4).y;
      while (rot < 0) {
        rot += Math.PI * 2;
      }
      while (rot > Math.PI * 2) {
        rot -= Math.PI * 2;
      }
    }

    dummy4.setFromAxisAngle(AXIS, rot);

    wrapper.current.quaternion.slerp(dummy4, 0.11);
  });

  return (
    <group name="look-at-player" ref={group}>
      <group name="wrapper" ref={wrapper}>
        {children}
      </group>
    </group>
  );
};

export default LookAtPlayer;
