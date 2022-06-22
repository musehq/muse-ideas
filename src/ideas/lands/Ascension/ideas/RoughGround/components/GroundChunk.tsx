import { Material } from "three";
import { useGroundChunkGeo } from "../utils/generation";
import { Chunk } from "../utils/chunks";
import HeightmapCollider from "./HeightmapChunk";
import { GenFunc } from "../index";

type GroundChunk = {
  chunk: Chunk;
  size: number;
  seed: string;
  height: number;
  smoothness?: number;
  collision?: boolean;
  material: Material;
  generate?: GenFunc;
};
export default function GroundChunk(props: GroundChunk) {
  const {
    chunk,
    size,
    seed,
    material,
    height,
    collision = false,
    smoothness = 45,
    generate,
  } = props;

  const geo = useGroundChunkGeo(
    chunk,
    size,
    height,
    seed,
    smoothness,
    generate
  );

  if (!geo || !material) return null;

  const X = chunk[0] * size;
  const Z = chunk[1] * size;

  return (
    <group name={`chunk-${chunk[0]}-${chunk[1]}`} position={[X, 0, Z]}>
      <mesh name="terrain" geometry={geo} material={material} />
      {collision && (
        <HeightmapCollider
          geo={geo}
          height={height}
          chunk={chunk}
          size={size}
        />
      )}
    </group>
  );
}
