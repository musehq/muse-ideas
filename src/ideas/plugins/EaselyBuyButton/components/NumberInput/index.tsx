import { RoundedBox, Text } from "@react-three/drei";
import { GroupProps } from "@react-three/fiber";
import React, { useRef } from "react";
import { animated, useSpring } from "react-spring/three";
import { useNumberInput } from "./utils/input";
import { Interactable } from "spacesvr";

type Props = {
  value: string;
  setValue: (s: string) => void;
  onSubmit?: () => void;
  onChange?: (s: string) => string;
} & GroupProps;

const FONT_FILE =
  "https://d27rt3a60hh1lx.cloudfront.net/fonts/Quicksand_Bold.otf";

export default function NumberInput(props: Props) {
  const { value, setValue, onChange, ...rest } = props;

  const textRef = useRef<any>();

  const { focused, cursorPos, focusInput } = useNumberInput(
    value,
    setValue,
    onChange
  );

  const { color } = useSpring({ color: focused ? "#000" : "#828282" });

  const BORDER = 0.005;
  const OUTER_WIDTH = 0.2;
  const PADDING_X = 0.01;
  const INNER_WIDTH = OUTER_WIDTH - PADDING_X * 2;
  const FONT_SIZE = 0.04;

  const textStyles: Partial<typeof Text.defaultProps> = {
    font: FONT_FILE,
    anchorX: "left",
    maxWidth: INNER_WIDTH,
    textAlign: "left",
    fontSize: FONT_SIZE,
    color: "black",
    // @ts-ignore
    whiteSpace: "nowrap",
    sdfGlyphSize: 16,
  };

  const val = value || "";
  const displayValue =
    cursorPos !== null && focused
      ? val.substring(0, cursorPos) + "|" + val.substring(cursorPos)
      : val;

  const percWidth =
    textRef.current?._textRenderInfo?.blockBounds[2] / INNER_WIDTH;
  const percCursor = (focused ? cursorPos || 0 : 0) / displayValue.length;
  const offsetX = Math.max(percCursor * percWidth - 1 + 0.1, 0) * OUTER_WIDTH;

  const TEXT_WIDTH = OUTER_WIDTH + 0.1;
  const TEXT_HEIGHT = FONT_SIZE * 1.75;
  const TEXT_DEPTH = 0.1;

  return (
    <group name="input" {...rest}>
      {/* @ts-ignore */}
      <Text
        name="displayText"
        ref={textRef}
        {...textStyles}
        position-z={0.051}
        position-x={-INNER_WIDTH / 2 - offsetX}
        clipRect={[
          -PADDING_X + offsetX,
          -Infinity,
          INNER_WIDTH + PADDING_X + offsetX,
          Infinity,
        ]}
      >
        {displayValue}
      </Text>
      <Interactable onClick={() => focusInput()}>
        <RoundedBox
          args={[TEXT_WIDTH, TEXT_HEIGHT, TEXT_DEPTH]}
          radius={0.025}
          smoothness={4}
        >
          <meshStandardMaterial color="white" />
        </RoundedBox>
      </Interactable>
      <RoundedBox
        args={[TEXT_WIDTH + BORDER, TEXT_HEIGHT + BORDER, TEXT_DEPTH]}
        radius={0.025}
        smoothness={4}
        position-z={-0.001}
      >
        <animated.meshStandardMaterial color={color} />
      </RoundedBox>
    </group>
  );
}
