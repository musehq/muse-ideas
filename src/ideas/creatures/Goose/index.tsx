import { Suspense, useEffect, useMemo, useRef } from "react";
import GooseModel from "./models/Goose";
import { GroupProps } from "@react-three/fiber";
import Mind from "./layers/Mind";
import Body, { BodyConsumer } from "./layers/Body";
import Pathfinding from "./ideas/Pathfinding";
import { GooseMind } from "./logic/goose";
import GooseAudio from "./ideas/GooseAudio";
import { Group } from "three";
import { useLimitedFrame } from "spacesvr";

type GooseProps = {
  name?: string;
  alwaysFollow?: boolean;
} & GroupProps;

export default function Goose(props: GooseProps) {
  const { name, alwaysFollow, rotation, scale, position, ...rest } = props;

  const ref = useRef<Group>(null);

  const mind = useMemo(() => new GooseMind(), []);

  useEffect(() => {
    mind.updateBeliefs({ alwaysFollow });
  }, [alwaysFollow]);

  useLimitedFrame(4, () => {
    if (!ref.current) return;
    ref.current.position.set(0, 0, 0);
  });

  return (
    <group
      ref={ref}
      name={`goose-${name}`}
      {...rest}
      rotation={[0, 0, 0]}
      position={[0, 0, 0]}
      scale={1}
    >
      <Mind mind={mind}>
        <Body height={0.5} radius={0.2} speed={1} initPos={position}>
          <Pathfinding />
          <BodyConsumer>
            {(bodyState) => (
              <Suspense fallback={null}>
                <GooseAudio walking={bodyState.moving} />
                <GooseModel walking={bodyState.moving} name={name} />
              </Suspense>
            )}
          </BodyConsumer>
        </Body>
      </Mind>
    </group>
  );
}
