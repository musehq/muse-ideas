import { GroupProps } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import React, { useState } from "react";
import { animated, config, useSpring } from "@react-spring/three";
import { Button, Collidable, Image } from "spacesvr";

type LoginForm = {
  opacity?: number;
  content?: string;
  logo: string;
} & GroupProps;

export default function LoginForm(props: LoginForm) {
  const {
    opacity = 0.6,
    content = "log in with spotify",
    logo = "https://i.scdn.co/image/ab67757000003b8255c25988a6ac314394d3fbf5",
    ...restProps
  } = props;
  const spotifyLogo = logo;
  return (
    <group name="door">
      <group position-y={1} position-z={1} position-x={0.9}>
        <animated.group position-y={0.6} scale={1}>
          <group position-y={-0.2}>
            <Button
              position-y={-0.625}
              position-z={0.1}
              rotation-x={-0.3}
              width={0.9}
              scale={0.8}
              color="#1ed760"
            >
              {content}
            </Button>
          </group>
        </animated.group>
      </group>
      <Collidable>
        <animated.group position-x={1}>
          <mesh rotation-x={-Math.PI / 2}>
            <boxBufferGeometry args={[3, 0.1, 5]} />
            <Image
              size={0.3}
              src={spotifyLogo}
              rotation-x={-1.3}
              rotation-z={Math.PI}
              position-z={1.7}
              position-y={-0.5}
            />
            <meshStandardMaterial color="#000000" roughness={1} />
          </mesh>
        </animated.group>
      </Collidable>
    </group>
  );
}
