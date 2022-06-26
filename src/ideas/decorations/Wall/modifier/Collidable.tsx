import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Box3, Euler, Group, Quaternion, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { useLimiter } from "spacesvr";
import { useBox } from "@react-three/cannon";

type CollidableProps = {
  enabled?: boolean;
  width: number;
  height: number;
  depth: number;
  children: ReactNode | ReactNode[];
};

type ColliderProps = { size: Vector3 };

function Collider(props: ColliderProps) {
  const { size } = props;

  const group = useRef<Group>(null);

  const pos = useMemo(() => new Vector3(), []);
  const quat = useMemo(() => new Quaternion(), []);
  const dummy = useMemo(() => new Euler(), []);

  const [, api] = useBox(
    () => ({ type: "Static", args: size.toArray() }),
    undefined,
    [size]
  );

  const limiter = useLimiter(50);
  useFrame(({ clock }) => {
    if (!limiter.isReady(clock) || !group.current) return;

    group.current.getWorldPosition(pos);
    group.current?.getWorldQuaternion(quat);
    api.position.copy(pos);
    api.rotation.copy(dummy.setFromQuaternion(quat));
  });

  return <group name="collider" ref={group} />;
}

export default function Collidable(props: CollidableProps) {
  const { enabled, width, height, depth, children } = props;

  const [size, setSize] = useState<Vector3>();

  useEffect(() => {
    if (!enabled) return;

    const bbox = new Box3().set(
      new Vector3(-width / 2, -height / 2, -depth / 2),
      new Vector3(width / 2, height / 2, depth / 2)
    );
    const dummy = new Vector3();
    bbox.getSize(dummy);

    if (!size || !dummy.equals(size)) setSize(dummy.clone());
  }, [width, height, depth, children, enabled]);

  return (
    <group name="collidable">
      {children}
      {enabled && size && <Collider size={size} />}
    </group>
  );
}
