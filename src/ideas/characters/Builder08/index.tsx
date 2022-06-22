import { Suspense, useRef } from "react";
import { Group } from "three";
import { GroupProps } from "@react-three/fiber";

import { useProximity } from "./utils/proximity";
import BuilderModel from "./models/Builder";
import { Dialogue, VisualDialogue } from "./layers/communication";
import LookAtPlayer from "./modifiers/LookAtPlayer";

type Builder08Props = {
  dialogue?: string;
  response?: string;
  link?: string;
  anim?: string;
} & GroupProps;

const MESSAGES = ["i'm daydreaming ... and i want to build what i see!"];

export default function Builder08(props: Builder08Props) {
  const { dialogue, response, link, anim = "idle", ...rest } = props;

  const group = useRef<Group>(null);

  // dialogue stuffs
  const message = useRef(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
  const modUrl = link && link.indexOf("://") === -1 ? "https://" + link : link;
  const d: Dialogue = [
    {
      key: "init",
      text: dialogue || message.current,
    },
  ];

  if (response || link) {
    d[0].decisions = [];
    d[0].decisions.push({
      name: response || "",
      onClick: modUrl
        ? () => {
            window.open(modUrl, "_blank");
          }
        : undefined,
    });
  } else if (!dialogue) {
    d[0].decisions = [];
    d[0].decisions.push({
      name: "build a world",
      onClick: () => window.open("https://www.muse.place", "_blank"),
    });
  }

  // animation and model picker (based on anim)
  const builder2Anims = ["swimmin", "idle", "lay", "wave"];
  const safeAnim = !builder2Anims.includes(anim) ? "idle" : anim;

  // proximity
  const proximity = useProximity(group);
  const animation = proximity.idle ? safeAnim : "idle";

  return (
    <group name="builder-08" {...rest} rotation-x={0} rotation-z={0}>
      <LookAtPlayer enabled={!proximity.idle}>
        <group ref={group}>
          <group position-y={-0.5}>
            <Suspense fallback={null}>
              {/* @ts-ignore */}
              <BuilderModel animation={animation} />
            </Suspense>
            {!proximity.idle && (
              <VisualDialogue
                enabled={proximity.speaking}
                position={[0.2, 1.05, 0.25]}
                dialogue={d}
              />
            )}
          </group>
        </group>
      </LookAtPlayer>
    </group>
  );
}
