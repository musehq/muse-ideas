import Sky from "./ideas/Sky";
import CreatureHills from "./ideas/CreatureHills";
import SpawnPoint from "./ideas/SpawnPoint";

type AscensionUniverseProps = {
  grassColor?: string;
  pathColor?: string;
  skyColor?: string;
  seed?: string;
};

export default function AscensionUniverse(props: AscensionUniverseProps) {
  const {
    grassColor = "#009c00",
    pathColor = "#62ff1a",
    skyColor = "#6192ca",
    seed = "hello world",
    ...restProps
  } = props;

  return (
    <group name="ascension-universe" {...restProps}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[0, 10, 0]} intensity={0.7} />
      <Sky color={skyColor} />
      <SpawnPoint position={[0, 5, 0]} rotation={[0, Math.PI + 0.5, 0]} />
      <CreatureHills
        seed={seed}
        grassColor={grassColor}
        pathColor={pathColor}
      />
    </group>
  );
}
