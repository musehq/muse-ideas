import { Suspense, useEffect, useMemo } from "react";
import GooseModel from "./models/Goose";
import { GroupProps } from "@react-three/fiber";
import Mind from "./layers/Mind";
import Body, { BodyConsumer } from "./layers/Body";
import Pathfinding from "./ideas/Pathfinding";
import { GooseMind } from "./logic/goose";
import GooseAudio from "./ideas/GooseAudio";

type GooseProps = {
  name?: string;
  alwaysFollow?: boolean;
} & GroupProps;

export default function Goose(props: GooseProps) {
  const { name, alwaysFollow, ...rest } = props;

  const mind = useMemo(() => new GooseMind(), []);

  useEffect(() => {
    mind.updateBeliefs({ alwaysFollow });
  }, [alwaysFollow]);

  return (
    <group
      name={`goose-${name}`}
      {...rest}
      rotation={[0, 0, 0]}
      position={[0, 0, 0]}
      scale={1}
    >
      <Mind mind={mind}>
        <Body height={0.5} radius={0.2} speed={1} initPos={rest.position}>
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
