import { GroupProps } from "@react-three/fiber";
import { useCallback, useState } from "react";
import { Interactable } from "spacesvr";
import { RoundedBox, Text } from "@react-three/drei";
import { animated, config, useSpring } from "react-spring/three";
import { analytics } from "./utils/analytics";

const FONT_FILE =
  "https://d27rt3a60hh1lx.cloudfront.net/fonts/Quicksand_Bold.otf";

type ButtonProps = {
  link?: string;
  text?: string;
  color?: string;
} & GroupProps;

export default function Button(props: ButtonProps) {
  const { link, text = "click me", color = "black", ...restProps } = props;

  //found by taking a small sample and getting line of best fit
  const buttonLengthFactor = text.length * 0.04 + 0.13;
  const restColor = "#fff";
  const hoverColor = "#ccc";

  const [hovered, setHovered] = useState(false);

  const { innerColor, scale, posZ } = useSpring({
    innerColor: hovered ? hoverColor : restColor,
    scale: hovered ? 0.99 : 1,
    posZ: hovered ? -0.015 : 0,
    ...config.stiff,
  });

  const handleClick = useCallback(() => {
    if (!link) return;
    window.open(link, "_blank");
    analytics.capture("idea-link_button-click", props);
  }, [link]);

  return (
    <group name="button" {...restProps}>
      <RoundedBox
        args={[buttonLengthFactor + 0.05, 0.175, 0.05]}
        position-z={-0.035}
        radius={0.015}
        smoothness={10}
      >
        {/* @ts-ignore */}
        <animated.meshStandardMaterial
          color={color}
          metalness={0.5}
          roughness={0.3}
        />
      </RoundedBox>
      <Interactable
        onClick={handleClick}
        onHover={() => setHovered(true)}
        onUnHover={() => setHovered(false)}
      >
        <mesh visible={false}>
          <boxBufferGeometry args={[buttonLengthFactor, 0.15, 0.05]} />
        </mesh>
      </Interactable>
      <animated.group scale={scale} position-z={posZ}>
        <RoundedBox
          args={[buttonLengthFactor, 0.15, 0.05]}
          radius={0.015}
          smoothness={10}
        >
          <animated.meshStandardMaterial
            color={innerColor}
            metalness={0.2}
            roughness={0.8}
          />
        </RoundedBox>
        {/* @ts-ignore */}
        <Text font={FONT_FILE} color={color} position-z={0.03} fontSize={0.075}>
          {text}
        </Text>
      </animated.group>
    </group>
  );
}
