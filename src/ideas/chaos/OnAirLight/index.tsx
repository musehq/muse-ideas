import { Interactable, useNetwork } from "spacesvr";
import { GroupProps } from "@react-three/fiber";

type OnAirLightProps = {
  color?: string;
} & GroupProps;

export default function OnAirLight(props: OnAirLightProps) {
  const { color = "white", ...rest } = props;

  const { voice, setVoice } = useNetwork();

  return (
    <group name="OnAirLight" {...rest}>
      <Interactable onClick={() => setVoice(!voice)}>
        <mesh>
          <boxBufferGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={voice ? "red" : "black"} />
        </mesh>
      </Interactable>
    </group>
  );
}
