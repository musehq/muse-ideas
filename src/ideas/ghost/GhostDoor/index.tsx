import { GroupProps } from "@react-three/fiber";
import { useState } from "react";
import React, { useContext, createContext } from "react";
import MagicText from "./ideas/MagicText";
import { KORN_FONT } from "./logic/constants";
import { animated, config, useSpring } from "@react-spring/three";
import { Model } from "spacesvr";
import Spot from "./ideas/Spot";

import { Button, TextInput, Collidable } from "spacesvr";

type GhostDoorProps = {
  spotColor?: string;
  password?: string;
  inputYPosition?: number;
} & GroupProps;
type GhostDoorState = { visible?: boolean; setVisible: (b: boolean) => void };

/*
1 - question
2 - wrong
3 - right
*/
// export const VisibleContext = createContext<GhostDoorState>({} as GhostDoorState);
const GhostDoorContext = createContext({} as GhostDoorState);
export const useGhostDoor = () => useContext(GhostDoorContext);

export default function GhostDoor(props: GhostDoorProps) {
  const {
    inputYPosition = 1,
    spotColor = "red",
    password = "test",
    ...restProps
  } = props;
  const [stage, setStage] = useState(1);

  const [who, setWho] = useState("");
  const [why, setWhy] = useState("");

  const [email, setEmail] = useState("");

  const inValue =
    stage === 1 ? who : stage === 2 ? why : stage === 4 ? email : "";

  const inSetter =
    stage === 1
      ? setWho
      : stage === 2
      ? setWhy
      : stage === 4
      ? setEmail
      : undefined;

  const BUTTON_ENABLED =
    (stage === 1 && who.length > 0) ||
    (stage === 2 && why.length > 0) ||
    (stage === 4 && email.length > 0);

  const [visible, setVisible] = useState(false);

  const { posY, scale, posX } = useSpring({
    posY: visible ? 0.6 : -0.8,
    scale: visible ? 1 : 0,
    posX: stage === 3 ? 1.1 : 0,
    ...config.gentle,
  });

  const checkPassword = (userPassword: string, password: string) => {
    if (password === userPassword) {
      return 3;
    }
    return 2;
  };

  const value = {
    visible,
    setVisible,
  };

  return (
    <group name="password-door" {...restProps}>
      <group position-y={inputYPosition} position-z={1} name="input-field">
        <MagicText stage={stage} visible={visible} />
        {stage != 3 && (
          <animated.group position-y={posY} scale={scale}>
            <group position-y={-0.2}>
              <TextInput
                key={`input-${stage}`}
                position-y={-0.5}
                fontSize={0.065}
                width={1}
                // @ts-ignore
                font={null}
                value={inValue}
                onChange={inSetter}
                rotation-x={-0.1}
                placeholder={"type a password"}
              />
              {BUTTON_ENABLED && (
                <Button
                  position-y={-0.625}
                  position-z={0.1}
                  rotation-x={-0.3}
                  width={0.4}
                  scale={0.8}
                  font={KORN_FONT}
                  onClick={() => setStage(checkPassword(inValue, password))}
                >
                  submit
                </Button>
              )}
            </group>
          </animated.group>
        )}
      </group>
      <Collidable enabled={stage === 3 ? false : true}>
        <animated.group position-x={posX} name="door">
          <Model
            scale={2}
            normalize
            src={
              "https://d1htv66kutdwsl.cloudfront.net/bc1f22e5-d9c6-4708-800d-cd31a17b17a9/51135c50-b589-4ba1-afd4-127f656e7179.glb"
            }
          />
        </animated.group>
      </Collidable>
      <GhostDoorContext.Provider value={value}>
        <group position={[0, 0.1, 1.8]}>
          <Spot strength={1} color={spotColor} />
        </group>
      </GhostDoorContext.Provider>
    </group>
  );
}
