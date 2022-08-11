import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Group, Quaternion, Vector3 } from "three";
import { useCapsuleCollider } from "./logic/collider";
import { setYRotFromXZ } from "../../modifiers/Pathfinding/logic/move";
import { useLimitedFrame } from "spacesvr";

type BodyState = {
  pos: Vector3;
  setDir: (dir: Vector3) => void;
  moving: boolean;
};
export const BodyContext = createContext({} as BodyState);
export const BodyConsumer = BodyContext.Consumer;
export const useBody = () => useContext(BodyContext);

type BodyLayerProps = {
  children: ReactNode | ReactNode[];
  speed?: number;
  height?: number;
  radius?: number;
};

export default function BodyLayer(props: BodyLayerProps) {
  const { speed = 1, height = 0.9, radius = 0.2, children } = props;

  const SPEED = speed * 1.2;
  const group = useRef<Group>(null);
  const [moving, setMoving] = useState(false);

  // readonly values ================================================================
  const pos = useMemo(
    () =>
      group.current
        ?.getWorldPosition(new Vector3())
        .add(new Vector3(0, height, 0)) || new Vector3(0, height, 0),
    []
  );
  const vel = useMemo(() => new Vector3(), []);
  const [, bodyApi] = useCapsuleCollider(pos.toArray(), height, radius);
  useEffect(() => {
    bodyApi.position.subscribe((p) => pos.fromArray(p));
    bodyApi.velocity.subscribe((v) => vel.fromArray(v));
  }, []);

  // mutable values ================================================================
  const targetRot = useMemo(() => new Quaternion(), []);
  const dir = useMemo(() => new Vector3(), []);

  useLimitedFrame(70, ({ camera }) => {
    if (!group.current) return;

    // helpers ================================================================
    const lookAtTarget = () => setYRotFromXZ(targetRot, dir.x, dir.z);
    const lookAtPlayer = () =>
      setYRotFromXZ(
        targetRot,
        camera.position.x - pos.x,
        camera.position.z - pos.z
      );

    // updates ================================================================
    // update pos value
    group.current.position.copy(pos);
    group.current.position.y -= height;

    // slerp towards target rot
    group.current.quaternion.slerp(targetRot, 0.17);
    lookAtTarget();

    // logic ================================================================
    // move towards target
    if (dir.length() <= 0.1) {
      setMoving(false);
    } else {
      setMoving(true);
      bodyApi.velocity.set(dir.x * SPEED, vel.y, dir.z * SPEED);
    }
  });

  const setDir = (d: Vector3) => {
    if (d.length() < 0.5) {
      dir.x = 0;
      dir.y = 0;
      dir.z = 0;
    } else {
      dir.copy(d).normalize();
    }
  };

  const value = { pos, setDir, moving };

  return (
    <BodyContext.Provider value={value}>
      <group name="body" ref={group}>
        {children}
      </group>
    </BodyContext.Provider>
  );
}
