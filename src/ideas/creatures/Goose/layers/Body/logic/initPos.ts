import { GroupProps } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Vector3 } from "three";
import { useLimitedFrame } from "spacesvr";
import { PublicApi } from "@react-three/cannon";

/**
 * kinda janky i know .. but every time initpos changes (which will be checked 5 times per second)
 * this will reset the body to that position so you can move it using builder tools
 *
 * @param initPos
 * @param bodyApi
 * @param height
 */
export const useInitialPosition = (
  initPos: GroupProps["position"],
  bodyApi: PublicApi,
  height: number
) => {
  const getInitPos = () => getVecPos(initPos).add(new Vector3(0, height, 0));

  const lastPos = useRef(getInitPos());

  const [reset, setReset] = useState(false);

  useLimitedFrame(5, () => {
    if (!reset && getInitPos().equals(lastPos.current)) return;
    setReset(true);
    lastPos.current = getInitPos();
  });

  // reset position when initpos changes
  useEffect(() => {
    if (!reset) return;
    const p = getInitPos();
    bodyApi.position.set(p.x, p.y, p.z);
    setReset(false);
  }, [reset, initPos]);
};

export const getVecPos = (pos: GroupProps["position"]): Vector3 =>
  pos
    ? Array.isArray(pos)
      ? new Vector3().fromArray(pos)
      : typeof pos === "object"
      ? pos
      : new Vector3(pos, pos, pos)
    : new Vector3();
