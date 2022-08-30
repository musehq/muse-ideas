import { GroupProps } from "@react-three/fiber";
import { Image } from "spacesvr";
import { Text } from "@react-three/drei";

type NametagProps = {
  name: string;
} & GroupProps;

const FONT_FILE =
  "https://d27rt3a60hh1lx.cloudfront.net/fonts/GrapeNuts-Regular.ttf";

export default function Nametag(props: NametagProps) {
  const { name, ...rest } = props;

  return (
    <group {...rest} name={`nametag-${name}`}>
      <mesh name="pin">
        <sphereBufferGeometry args={[0.0075, 10, 10]} />
        <meshBasicMaterial color="black" />
      </mesh>
      <group position-y={-0.0525}>
        <Image
          src="https://d1htv66kutdwsl.cloudfront.net/00e31fc1-f8c5-4710-bed9-b494e5401587/295a087b-62fc-4570-a0a5-a3fb0e9a43d3.ktx2"
          size={0.15}
        />
        <Text
          font={FONT_FILE}
          color="black"
          position-z={0.01}
          fontSize={0.035}
          rotation-z={0.09}
          position-y={-0.005}
        >
          {name}
        </Text>
      </group>
    </group>
  );
}
