import { RoundedBox, Text } from "@react-three/drei";
import { animated, config, useSpring } from "react-spring/three";
import { Interactable } from "spacesvr";
import { ComponentProps, useEffect, useState } from "react";
import { GroupProps } from "@react-three/fiber";
import { Idea } from "../layers/basis";

const FONT_URL =
  "https://d27rt3a60hh1lx.cloudfront.net/fonts/Quicksand_Bold.otf";

type ButtonProps = {
  children?: string;
  textStyles?: Partial<ComponentProps<typeof Text>>;
  size?: number;
  onClick?: () => void;
  width?: number;
  idea?: Idea;
  color?: string;
} & GroupProps;

type HEX_STR = string;

export default function Button(props: ButtonProps) {
  const {
    children,
    textStyles,
    onClick,
    width = 1,
    size = 1,
    idea,
    color: passedColor,
    ...rest
  } = props;

  const HEIGHT = 0.1;
  const WIDTH = 0.1 * width;
  const DEPTH = 0.05;
  const RADIUS = Math.min(WIDTH, HEIGHT, DEPTH) * 0.5;

  const TEXT_STYLES: Partial<ComponentProps<typeof Text>> = {
    color: "black",
    font: FONT_URL,
    fontSize: 0.05,
    outlineWidth: 0.004,
    outlineColor: "white",
    anchorY: "middle",
    ...textStyles,
  };

  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const restColor: HEX_STR = passedColor || (idea ? idea.getHex() : "#aaa");
  const hoverColor = idea
    ? new Idea()
        .setFromCreation(
          idea.mediation,
          idea.specificity * 1.3,
          idea.utility * 1.3
        )
        .getHex()
    : "#fff";

  const { color, scale } = useSpring({
    color: hovered ? restColor : hoverColor,
    scale: clicked ? 0.75 : 1,
    ...config.stiff,
  });

  // spring animation on click
  useEffect(() => {
    if (clicked) {
      setTimeout(() => setClicked(false), 150);
    }
  }, [clicked]);

  const onButtonClick = () => {
    if (onClick) {
      onClick();
    }
    setClicked(true);
  };

  return (
    <group name={`button-${children}`} {...rest}>
      <group name="button-wrapper" scale={size}>
        <animated.group scale={scale}>
          {children && (
            <>
              {/* @ts-ignore */}
              <Text {...TEXT_STYLES} position-z={DEPTH / 2 + 0.001}>
                {children}
              </Text>
            </>
          )}
          <Interactable
            onClick={onButtonClick}
            onHover={() => setHovered(true)}
            onUnHover={() => setHovered(false)}
          >
            <mesh visible={false}>
              <boxBufferGeometry args={[WIDTH, HEIGHT, DEPTH]} />
            </mesh>
          </Interactable>
          <RoundedBox
            args={[WIDTH, HEIGHT, DEPTH]}
            radius={RADIUS}
            smoothness={10}
          >
            {/* @ts-ignore */}
            <animated.meshStandardMaterial color={color} flatShading={false} />
          </RoundedBox>
        </animated.group>
      </group>
    </group>
  );
}
