import { Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { useMind } from "../../layers/Mind";
import { useBody } from "../../layers/Body";

const RELAX = 0.1;

export default function Pathfinding() {
  const { target } = useMind();
  const { pos, setDir } = useBody();

  useFrame(({ camera }) => {
    // move towards target
    const dist = pos.distanceTo(target);
    if (dist < RELAX) setDir(new Vector3());
    else setDir(target.clone().sub(pos));
  });

  return null;
}
