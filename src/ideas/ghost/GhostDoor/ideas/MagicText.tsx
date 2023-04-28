import { useDistortMat } from "../logic/distorMat";
import { GroupProps } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { KORN_FONT } from "../logic/constants";
import { useEffect, useRef, useState } from "react";
import { a, config, useSpring } from "@react-spring/three";

type MagicText = { stage: number; visible: boolean } & GroupProps;

export default function MagicText(props: MagicText) {
  const { stage, visible, ...rest } = props;

  const distortMat = useDistortMat(0.5);

  const textRef = useRef<any>(null);
  const [height, setHeight] = useState(0);

  const { scale } = useSpring({
    scale: visible ? 1 : 0,
    ...config.gentle,
  });

  const WIDTH = 0.8;

  const TEXT = !visible
    ? ""
    : stage === 1
    ? "What is the password?"
    : stage === 2
    ? "You got it wrong, try again"
    : stage === 3
    ? "You got it right"
    : stage === 4
    ? "WHERE SHOULD THIS TOKEN BE EMAILED?"
    : stage === 5
    ? "YOUR REMEMBRANCE WILL BE HONORED. SEND ANOTHER TOMORROW."
    : "";

  useEffect(() => {
    if (!textRef.current) return;
    textRef.current.addEventListener("synccomplete", () => {
      if (!textRef.current?.textRenderInfo) return;
      const info = textRef.current.textRenderInfo;
      const h = info.blockBounds[3] - info.blockBounds[1];
      setHeight(h);
    });
    textRef.current.text = TEXT;
    textRef.current.sync();
  }, [TEXT]);

  return (
    <group name="magic-text" {...rest}>
      <a.group scale={scale}>
        <Text
          key={TEXT}
          ref={textRef}
          font={KORN_FONT}
          fontSize={0.065}
          renderOrder={1}
          textAlign="center"
          anchorY="bottom"
          maxWidth={WIDTH}
          // color="black"
          outlineWidth={0.05 * 0.05}
          outlineColor="white"
          material={distortMat}
          lineHeight={1.15}
        >
          {TEXT}
        </Text>
        <a.mesh position-y={height / 2} position-z={-0.01} scale={1.15}>
          <planeBufferGeometry args={[WIDTH, height]} />
          <meshStandardMaterial opacity={0.9} color="black" transparent />
        </a.mesh>
      </a.group>
    </group>
  );
}
