import { Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { useMind } from "../../layers/Mind";
import { useBody } from "../../layers/Body";
import { useLimitedFrame, usePlayer } from "spacesvr";
import { useRef } from "react";

const RELAX = 1.2;

export default function Pathfinding() {
  const mind = useMind();
  const { pos, setDir } = useBody();
  const player = usePlayer();

  const nextMoveTime = useRef(0);

  useFrame(({ camera }) => {
    // move towards target
    const dist = pos.distanceTo(mind.target);
    if (dist < RELAX) setDir(new Vector3());
    else setDir(mind.target.clone().sub(pos));
  });

  const lastState = useRef(mind.state);
  useFrame(() => {
    if (lastState.current !== mind.state) {
      lastState.current = mind.state;
      nextMoveTime.current = 0;
    }
  });

  useLimitedFrame(20, ({ clock, camera }) => {
    if (mind.state === "wander" || mind.state === "idle") {
      if (clock.getElapsedTime() > nextMoveTime.current) {
        const nextDelta = 12 + Math.pow(Math.random(), 0.15) * 30;
        nextMoveTime.current = clock.getElapsedTime() + nextDelta;
        mind.target.x = (Math.random() * 2 - 1) * 8;
        mind.target.z = (Math.random() * 2 - 1) * 8;
      }
    } else if (mind.state === "follow" || mind.state === "attack") {
      if (clock.getElapsedTime() > nextMoveTime.current) {
        nextMoveTime.current = clock.getElapsedTime() + 0.3;
        mind.target.x = camera.position.x;
        mind.target.z = camera.position.z;
      }
    }
  });

  return null;
}
