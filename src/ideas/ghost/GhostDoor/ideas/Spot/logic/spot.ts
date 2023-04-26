import { Vector2, Vector3 } from "three";
import { useLimitedFrame, usePlayer } from "spacesvr";
import { useMemo, useRef, useState } from "react";

const getFlatPos = (pos: Vector3): Vector2 => new Vector2(pos.x, pos.z);

const INNER_RADIUS = 0.05;
const STRENGTH_MULT = 0.08;
const MIN_HEIGHT_OFF = -0.5;
const MAX_HEIGHT_OFF = 1.5;

export const useSpot = (
  position: Vector3,
  outerRadius: number,
  strength: number,
  props?: { onEnter: () => void; onLeave: () => void }
) => {
  const player = usePlayer();

  const [delt] = useState(new Vector2());
  const [movePos] = useState(new Vector3());
  const enabled = useRef(true);
  const spotPos = useMemo(() => getFlatPos(position), [position]);
  const [playerPos] = useState(new Vector2());

  useLimitedFrame(70, () => {
    spotPos.x = position.x;
    spotPos.y = position.z;

    const pos = player.position.get();
    playerPos.x = pos.x;
    playerPos.y = pos.z;

    const dist = spotPos.distanceTo(playerPos);
    const height = pos.y - position.y;
    if (
      dist < outerRadius &&
      height > MIN_HEIGHT_OFF &&
      height < MAX_HEIGHT_OFF
    ) {
      if (dist > INNER_RADIUS && enabled.current) {
        player.controls.lock();
        delt.x = spotPos.x - playerPos.x;
        delt.y = spotPos.y - playerPos.y;
        delt.normalize();

        movePos.copy(pos);
        movePos.x += delt.x * strength * STRENGTH_MULT;
        movePos.z += delt.y * strength * STRENGTH_MULT;

        player.position.set(movePos);
      } else {
        enabled.current = false;
        player.controls.unlock();
        props?.onEnter();
      }
    } else {
      enabled.current = true;
      props?.onLeave();
    }
  });

  return null;
};
