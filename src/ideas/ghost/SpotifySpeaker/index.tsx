import { useFrame, GroupProps } from "@react-three/fiber";
import { useState } from "react";
import React from "react";
import { animated, config, useSpring } from "@react-spring/three";
import { Button, TextInput, Image, Collidable } from "spacesvr";

type ImageZoomProps = { opacity?: number; password?: string } & GroupProps;

export default function PhotoZoom(props: ImageZoomProps) {
  const { opacity = 0.6, password = "test", ...restProps } = props;
  const [stage, setStage] = useState(1);

  return (
    <group name="door">
      <Image src="" />
    </group>
  );
}
