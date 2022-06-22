import { useMemo, useRef } from "react";
import { Floating, Spinning, useLimiter } from "spacesvr";
import { Idea, VisualIdea } from "../../../../basis";
import { animated, useSpring } from "react-spring/three";
import { GroupProps, useFrame } from "@react-three/fiber";
import { Group, Vector3 } from "three";

type Bubble = {
  idea: Idea;
  size: number;
  pos: [number, number, number];
};

type BubbleProps = {
  i: number;
  num: number;
  enabled: boolean;
} & Bubble;

function Bubble(props: BubbleProps) {
  const { i, num, enabled, pos, size, idea } = props;

  const { scale } = useSpring({ scale: enabled ? 1 : 0 });

  return (
    <group name={`bubble-${i}`} position={pos}>
      <Floating height={size * 0.25}>
        <Spinning xSpeed={0.1} ySpeed={0.1} zSpeed={0.1}>
          <animated.group scale={scale}>
            <VisualIdea idea={idea} size={size} />
          </animated.group>
        </Spinning>
      </Floating>
    </group>
  );
}

type BubblesProps = {
  numStops: number;
  idea: Idea;
  enabled: boolean;
  anchorPos: Vector3;
} & GroupProps;

export default function Bubbles(props: BubblesProps) {
  const { numStops, idea, enabled, anchorPos, ...rest } = props;

  const source = [0, 0, 0];
  const group = useRef<Group>(null);
  const limiter = useLimiter(50);

  const bubbles: Bubble[] = useMemo(() => {
    const arr: Bubble[] = [];
    for (let i = 0; i < numStops; i++) {
      const perc = i / (numStops - 1);
      arr.push({
        idea: new Idea().setFromCreation(
          idea.mediation,
          idea.specificity * perc,
          idea.utility * perc
        ),
        size: 0.01 + perc * 0.05,
        pos: [
          source[0] * (1 - perc),
          source[1] * (1 - perc),
          source[2] * (1 - perc),
        ],
      });
    }
    return arr;
  }, [numStops, source]);

  useFrame(({ clock }) => {
    if (!group.current || !limiter.isReady(clock)) return;

    for (let i = 0; i < numStops; i++) {
      const perc = i / (numStops - 1);
      const child = group.current.children[i];
      child.position.copy(anchorPos).multiplyScalar(perc);
    }
  });

  return (
    <group name="bubbles" {...rest} ref={group}>
      {bubbles.map((bubble, i) => (
        <Bubble
          key={i}
          i={i}
          num={bubbles.length}
          enabled={enabled}
          {...bubble}
        />
      ))}
    </group>
  );
}
