import AmbientParticles from "./ideas/AmbientParticles";
import { Background, InfinitePlane } from "spacesvr";
import { Fog } from "./ideas/Fog";

type LostProps = {
  color?: string;
  ideas?: boolean;
  fog?: boolean;
  fogDistance?: number;
  sunlight?: boolean;
};

export default function LostUniverse(props: LostProps) {
  const {
    color = "white",
    ideas = true,
    fog = true,
    fogDistance = 40,
    sunlight = false,
    ...restProps
  } = props;

  return (
    <group name="lost-universe" {...restProps}>
      <ambientLight intensity={0.8} />
      {sunlight && <directionalLight position={[1, 1, 1]} intensity={0.4} />}
      <Background key={`bg-${color}`} color={color} />
      {ideas && (
        <AmbientParticles fog={fog} color={color} fogDistance={fogDistance} />
      )}
      {fog && <Fog color={color} near={0} far={fogDistance} />}
      <mesh rotation-x={-Math.PI / 2}>
        <planeBufferGeometry args={[500, 500]} />
        <meshStandardMaterial color="white" transparent opacity={0.6} />
      </mesh>
      <InfinitePlane height={-0.001} />
    </group>
  );
}
