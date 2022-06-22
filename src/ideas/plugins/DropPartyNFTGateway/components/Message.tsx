import { RoundedBox, Text } from "@react-three/drei";

type MessageProps = {
  children: string;
};

export default function Message(props: MessageProps) {
  const { children } = props;

  return (
    <group name="message">
      {/* @ts-ignore */}
      <Text fontSize={0.05} color="black" maxWidth={0.7} textAlign="center">
        {children}
      </Text>
      <RoundedBox
        args={[0.75, 0.25, 0.1]}
        radius={0.05}
        position-z={-0.05 - 0.001}
      >
        <meshLambertMaterial color="white" />
      </RoundedBox>
    </group>
  );
}
