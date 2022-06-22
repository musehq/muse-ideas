import { Camera } from "three";
import { useEffect, useMemo, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useEnvironment, useLimiter } from "spacesvr";

export type Chunk = [number, number];

export class ChunkGenerator {
  chunk_size = 10;
  num_chunks = 70;
  camera: Camera;

  constructor(camera: Camera, numPerChunk?: number, numChunks?: number) {
    this.camera = camera;
    if (numPerChunk) this.chunk_size = numPerChunk;
    if (numChunks) this.num_chunks = numChunks;
  }

  // gets the chunk the player is standing on
  getCurrentChunk(): Chunk {
    const pos = this.camera.position;

    return [
      Math.floor(pos.x / this.chunk_size),
      Math.floor(pos.z / this.chunk_size),
    ];
  }

  // gets the chunks that should be generated given the settings
  getChunks(): Chunk[] {
    const chunks: Chunk[] = [];
    const pos = this.camera.position;
    const curr_chunk = this.getCurrentChunk();
    const NUM_CHUNKS =
      this.num_chunks % 2 === 1 ? this.num_chunks + 1 : this.num_chunks;

    for (let x = -NUM_CHUNKS / 2; x < NUM_CHUNKS / 2; x++) {
      for (let z = -NUM_CHUNKS / 2; z < NUM_CHUNKS / 2; z++) {
        chunks.push([x + curr_chunk[0], z + curr_chunk[1]]);
      }
    }

    const distToPlayer = (ch: Chunk) =>
      Math.sqrt(
        Math.pow(ch[0] * this.chunk_size - pos.x, 2) +
          Math.pow(ch[1] * this.chunk_size - pos.z, 2)
      );

    chunks.sort((a, b) => distToPlayer(a) - distToPlayer(b));

    return chunks.slice(0, this.num_chunks);
  }

  static isEqual(chunk1: Chunk, chunk2: Chunk): boolean {
    return chunk1[0] === chunk2[0] && chunk1[1] === chunk2[1];
  }

  setChunkSize(chunkSize: number) {
    this.chunk_size = chunkSize;
  }

  setNumChunks(numChunks: number) {
    this.num_chunks = numChunks;
  }

  setCamera(camera: Camera) {
    this.camera = camera;
  }
}

// given some chunk props will keep a live list of active chunks
export const useChunks = (
  chunkSize?: number,
  numChunks?: number
): { chunks: Chunk[]; currChunk: Chunk } => {
  const { camera } = useThree();
  const { paused } = useEnvironment();

  // create chunk gen and keep props up to date
  const chunkGen = useMemo(
    () => new ChunkGenerator(camera, chunkSize, numChunks),
    []
  );

  const [currChunk, setCurrChunk] = useState(chunkGen.getCurrentChunk());
  const [chunks, setChunks] = useState<Chunk[]>([]);

  // reset chunk gen on pause and on prop change
  useEffect(() => {
    const regen =
      !ChunkGenerator.isEqual(currChunk, chunkGen.getCurrentChunk()) ||
      numChunks !== chunkGen.num_chunks ||
      chunkSize !== chunkGen.chunk_size;
    if (numChunks) chunkGen.setNumChunks(numChunks);
    if (chunkSize) chunkGen.setChunkSize(chunkSize);
    if (regen) {
      setCurrChunk(chunkGen.getCurrentChunk());
    }
  }, [chunkGen, paused, chunkSize, numChunks, currChunk]);

  // keep global chunk list up to date
  useEffect(() => setChunks(chunkGen.getChunks()), [chunkGen, currChunk]);

  // keep current chunk up to date with player pos
  const chunkLimiter = useLimiter(5);
  useFrame(({ clock }) => {
    if (!chunkLimiter.isReady(clock)) return;
    const newCurChunk = chunkGen.getCurrentChunk();
    if (!ChunkGenerator.isEqual(newCurChunk, currChunk)) {
      setCurrChunk(newCurChunk);
    }
  });

  return { chunks, currChunk };
};
