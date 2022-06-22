import { useFrame } from "@react-three/fiber";
import { RefObject, useMemo, useState } from "react";
import { Group, Vector3 } from "three";
import { useLimiter } from "spacesvr";

type ProximityState = {
  idle: boolean;
  visible: boolean;
  speaking: boolean;
};

type State = "idle" | "visible" | "speaking";

export const useProximity = (
  group: RefObject<Group | undefined>
): ProximityState => {
  const dummy = useMemo(() => new Vector3(), []);

  const [state, setState] = useState<State>("idle");

  const limiter = useLimiter(20);
  useFrame(({ camera, clock }) => {
    if (!group.current || !limiter.isReady(clock)) return;

    const worldPos = group.current.getWorldPosition(dummy);
    const dist = camera.position.distanceTo(worldPos);
    if (dist < 1.75) setState("speaking");
    else if (dist < 2) setState("visible");
    else if (dist >= 2) setState("idle");
  });

  return {
    idle: state === "idle",
    visible: state === "visible",
    speaking: state === "speaking",
  };
};
