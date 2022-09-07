import { useNetwork } from "spacesvr";
import { GroupProps } from "@react-three/fiber";
import { useEffect } from "react";
import { Text } from "@react-three/drei";
import { MicAndLight } from "./ideas/MicAndLight";

type OnAirLightProps = {
  enable?: boolean;
} & GroupProps;

const FONT_URL =
  "https://d27rt3a60hh1lx.cloudfront.net/fonts/BlueHighwayCondensed.otf";

export default function OnAirLight(props: OnAirLightProps) {
  const { enable, ...rest } = props;

  const { connected, voice, setVoice } = useNetwork();

  // this is all the logic
  useEffect(() => {
    if (!connected) return;
    if (voice != !!enable) setVoice(!!enable);
  }, [connected, voice, enable]);

  return (
    <group name="OnAirLight" {...rest}>
      <MicAndLight
        rotation-y={Math.PI}
        scale={1.75}
        connected={connected}
        voice={voice}
        enable={enable}
      />
      {!connected && (
        <Text
          font={FONT_URL}
          color="red"
          fontSize={0.125}
          rotation-z={-0.25}
          position={[0.1, 0.15, 0.1]}
        >
          not connected
        </Text>
      )}
    </group>
  );
}
