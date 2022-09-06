import { ReactNode, useRef } from "react";
import { Group } from "three";
import { useLimitedFrame } from "spacesvr";

type ShakeProps = {
  xIntensity?: number;
  xSpeed?: number;
  yIntensity?: number;
  ySpeed?: number;
  zIntensity?: number;
  zSpeed?: number;
  children: ReactNode | ReactNode[];
};

export default function Shake(props: ShakeProps) {
  const {
    xIntensity = 0,
    xSpeed = 80,
    yIntensity = 0,
    ySpeed = 80,
    zIntensity = 0,
    zSpeed = 80,
    children,
  } = props;

  const group = useRef<Group>(null);

  useLimitedFrame(50, ({ clock }) => {
    if (!group.current) return;
    const time = clock.getElapsedTime();
    group.current.position.x = xIntensity * Math.sin(time * xSpeed);
    group.current.position.y = yIntensity * Math.sin(time * ySpeed + 1342);
    group.current.position.z = zIntensity * Math.sin(time * zSpeed - 234);
  });

  return (
    <group name="shake" ref={group}>
      {children}
    </group>
  );
}
