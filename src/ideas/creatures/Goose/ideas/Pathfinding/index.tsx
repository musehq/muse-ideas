import { Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { useMind } from "../../layers/Mind";
import { useBody } from "../../layers/Body";
import { useLimitedFrame } from "spacesvr";
import { useState } from "react";

const RELAX = 0.1;

export default function Pathfinding() {
  const { target } = useMind();
  const { pos, setDir } = useBody();

  const [nextMove, setNextMove] = useState(0);

  useFrame(({ camera }) => {
    // move towards target
    const dist = pos.distanceTo(target);
    if (dist < RELAX) setDir(new Vector3());
    else setDir(target.clone().sub(pos));
  });

  useLimitedFrame(20, ({ clock }) => {
    if (clock.getElapsedTime() > nextMove) {
      const nextDelta = 12 + Math.pow(Math.random(), 0.15) * 30;
      setNextMove(clock.elapsedTime + nextDelta);
      target.x = (Math.random() * 2 - 1) * 8;
      target.z = (Math.random() * 2 - 1) * 8;
    }
  });

  return null;
}
