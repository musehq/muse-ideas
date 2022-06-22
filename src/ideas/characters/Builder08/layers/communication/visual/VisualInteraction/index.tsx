import { useContext, useEffect, useMemo, useState } from "react";
import { animated, useSpring } from "react-spring/three";
import { Text } from "@react-three/drei";
import { Flex } from "@react-three/flex";
import { DialogueContext } from "../VisualDialogue";
import { Interaction } from "../../index";
import VisualDecision from "./components/VisualDecision";
import TextInput from "../components/TextInput";

const FONT_FILE =
  "https://d27rt3a60hh1lx.cloudfront.net/fonts/Quicksand_Bold.otf";

export function VisualInteraction(props: Interaction & { enabled: boolean }) {
  const { effect, text, input, decisions, enabled } = props;

  const { setKey } = useContext(DialogueContext);
  const [prevEnabled, setPrevEnabled] = useState(false);

  const { posZ, scaleY } = useSpring({
    posZ: enabled ? 0.003 : -0.003,
    scaleY: enabled ? 1 : 0,
  });

  const onSubmit = useMemo(() => {
    if (!decisions)
      return () => {
        return;
      };
    for (const decision of decisions) {
      if (decision.name === "submit") {
        return () => {
          if (decision.onClick) decision.onClick();
          if (decision.nextKey) setKey(decision.nextKey || "");
        };
      }
    }
  }, [decisions]);

  useEffect(() => {
    if (prevEnabled !== enabled) {
      setPrevEnabled(enabled);
      if (enabled && effect) {
        effect().then((newKey: string) => {
          if (newKey) {
            setKey(newKey);
          }
        });
      }
    }
  }, [effect, setKey, prevEnabled, enabled]);

  const textStyles: Partial<typeof Text.defaultProps> = {
    font: FONT_FILE,
    maxWidth: 0.8,
    textAlign: "center",
    fontSize: 0.06,
    outlineWidth: 0.0065,
  };

  return (
    <animated.group
      name={`interaction-${text.substr(0, 8)}`}
      position-z={posZ}
      scale-y={scaleY}
    >
      {/* @ts-ignore */}
      <Text
        {...textStyles}
        anchorY={input ? "bottom" : "middle"}
        position-y={0}
      >
        {text}
      </Text>
      {input && (input.persist || enabled) && (
        <TextInput
          value={input.value}
          setValue={input.setValue}
          position-y={-0.09}
          onSubmit={onSubmit}
          enabled={enabled}
          inputType={input.type}
          persist={input.persist}
        />
      )}
      {decisions && (
        <Flex
          name="decisions"
          size={[1, 0.4, 0.1]}
          position={[-0.5, -0.35 / 2, 0.05]}
          justifyContent="center"
          alignItems="flex-start"
          flexWrap="wrap"
          flexDir="row"
        >
          {decisions.map((decision) => (
            <VisualDecision key={decision.name} {...decision} />
          ))}
        </Flex>
      )}
    </animated.group>
  );
}
