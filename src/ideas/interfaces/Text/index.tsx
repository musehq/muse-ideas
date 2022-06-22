import { GroupProps } from "@react-three/fiber";
import { RoundedBox, Text as TroikaText } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";

type TextProps = {
  text?: string;
  fontSize?: number;
  padding?: number;
  font?: string;
  width?: number;
  lineHeight?: number;
  textColor?: string;
  outlineColor?: string;
  outlineWidth?: number;
  backgroundColor?: string;
  hideBackground?: boolean;
  align?: string;
} & GroupProps;

export default function Text(props: TextProps) {
  const {
    text = "",
    fontSize = 0.1,
    lineHeight = 1.25,
    textColor = "black",
    outlineColor = "blue",
    font = "https://d27rt3a60hh1lx.cloudfront.net/fonts/Quicksand_Bold.otf",
    width = 1.5,
    outlineWidth = 0,
    align = "center",
    padding = 0.1,
    backgroundColor = "white",
    hideBackground = false,
    ...rest
  } = props;

  const textRef = useRef<any>();
  const [ct, setCt] = useState(Math.random());
  const [height, setHeight] = useState(1);

  const FONT = ["woff", ".otf", ".ttf"].includes(font.toLowerCase().substr(-4))
    ? font
    : "https://d27rt3a60hh1lx.cloudfront.net/fonts/Quicksand_Bold.otf";
  const ALIGN = ["center", "left", "right", "justify"].includes(
    align.toLowerCase()
  )
    ? align.toLowerCase()
    : "center";

  // adjust the height every time one of these props changes
  useEffect(() => {
    if (
      !textRef.current ||
      !textRef.current._textRenderInfo ||
      textRef.current._textRenderInfo.parameters.text !== text ||
      textRef.current._textRenderInfo.parameters.fontSize !== fontSize ||
      textRef.current._textRenderInfo.parameters.lineHeight !== lineHeight ||
      textRef.current._textRenderInfo.parameters.maxWidth !== width ||
      textRef.current._textRenderInfo.parameters.textAlign !== ALIGN ||
      textRef.current._textRenderInfo.parameters.font !== FONT
    ) {
      setTimeout(() => setCt(Math.random()), 100);
      return;
    }

    const bounds: number[] = textRef.current._textRenderInfo.blockBounds;
    setHeight(bounds[3] - bounds[1]);
  }, [text, fontSize, lineHeight, width, outlineWidth, ALIGN, FONT, ct]);

  return (
    <group name="text" {...rest}>
      <TroikaText
        ref={textRef}
        fontSize={fontSize}
        font={FONT}
        lineHeight={lineHeight}
        color={textColor}
        outlineColor={outlineColor}
        outlineWidth={outlineWidth}
        // @ts-ignore
        textAlign={ALIGN}
        anchorY="middle"
        width={width}
        maxWidth={width}
        whiteSpace="overflowWrap"
        position={[0, 0, 0.051]}
      >
        {text}
      </TroikaText>
      {!hideBackground && (
        <RoundedBox args={[width + padding * 2, height + padding * 2, 0.1]}>
          <meshStandardMaterial color={backgroundColor} />
        </RoundedBox>
      )}
    </group>
  );
}
