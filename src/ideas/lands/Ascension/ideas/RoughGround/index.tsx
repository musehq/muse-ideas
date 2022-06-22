import { Chunk, ChunkGenerator, useChunks } from "./utils/chunks";
import GroundChunk from "./components/GroundChunk";
import { Material, MeshStandardMaterial } from "three";
import { useMemo } from "react";
import SimplexNoise from "simplex-noise";

export type GenFunc = (simplex: SimplexNoise, x: number, z: number) => number;

type RoughGroundProps = {
  seed?: string;
  smoothness?: number;
  chunkSize?: number;
  numChunks?: number;
  height?: number;
  material?: Material;
  generate?: GenFunc;
};

export default function RoughGround(props: RoughGroundProps) {
  const {
    seed = "seed",
    chunkSize = 42,
    smoothness = 45,
    numChunks = 50,
    height = 1,
    material,
    generate,
  } = props;

  const { chunks: groundChunks } = useChunks(chunkSize, numChunks);
  const { chunks: physicsChunks } = useChunks(chunkSize, 20);

  const mat = useMemo(
    () => material || new MeshStandardMaterial({ color: "#ccc" }),
    [material]
  );

  const shouldCollide = (c: Chunk) =>
    physicsChunks.find((otherChunk: Chunk) =>
      ChunkGenerator.isEqual(c, otherChunk)
    ) !== undefined;

  const key = (c: Chunk) =>
    [
      c[0],
      c[1],
      seed,
      chunkSize,
      smoothness,
      numChunks,
      height,
      material?.uuid,
    ].join("-");

  return (
    <group name="rough-ground">
      {groundChunks.map((chunk) => (
        <GroundChunk
          key={key(chunk)}
          chunk={chunk}
          height={height}
          smoothness={smoothness}
          size={chunkSize}
          seed={seed}
          material={mat}
          collision={shouldCollide(chunk)}
          generate={generate}
        />
      ))}
    </group>
  );
}
