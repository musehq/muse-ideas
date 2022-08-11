import { Suspense, useMemo } from "react";
import GooseModel from "./models/Goose";
import { GroupProps } from "@react-three/fiber";
import Mind from "./layers/Mind";
import Body, { BodyConsumer } from "./layers/Body";
import Pathfinding from "./ideas/Pathfinding";
import { GooseMind } from "./logic/goose";
import GooseAudio from "./ideas/GooseAudio";

type GooseProps = {
  color?: string;
} & GroupProps;

export default function Goose(props: GooseProps) {
  const { color = "white", ...rest } = props;

  const mind = useMemo(() => new GooseMind(), []);

  return (
    <group name="Goose" {...rest}>
      <Mind mind={mind}>
        <Body height={0.5} radius={0.2} speed={1}>
          <Pathfinding />
          <BodyConsumer>
            {(bodyState) => (
              <Suspense fallback={null}>
                <GooseAudio walking={bodyState.moving} />
                <GooseModel walking={bodyState.moving} />
              </Suspense>
            )}
          </BodyConsumer>
        </Body>
      </Mind>
    </group>
  );
}
