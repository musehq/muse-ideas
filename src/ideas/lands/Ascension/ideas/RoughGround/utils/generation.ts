import { BufferGeometry, PlaneBufferGeometry } from "three";
import { useEffect, useMemo, useState } from "react";
import SimplexNoise from "simplex-noise";
import { Chunk } from "./chunks";
import { GenFunc } from "../index";

export const useGroundChunkGeo = (
  chunk: Chunk,
  size: number,
  height: number,
  seed: string,
  smoothness: number,
  generate?: GenFunc
): BufferGeometry | undefined => {
  const WIDTH = size;
  const DEPTH = size;
  const HEIGHT = height;

  const [geo, setGeo] = useState<BufferGeometry>();

  const simplex = useMemo(() => new SimplexNoise(seed), [seed]);

  useEffect(() => {
    if (!simplex || geo) return;

    const g = new PlaneBufferGeometry(WIDTH, DEPTH, WIDTH, DEPTH);

    const vertices = g.attributes.position.array;
    const count = g.attributes.position.count;

    g.rotateX(-Math.PI / 2);

    // helper functions
    const getHeight = (x: number, z: number) =>
      generate
        ? generate(simplex, x, z)
        : (HEIGHT * (simplex.noise2D(x / smoothness, z / smoothness) + 1)) / 2;

    for (let i = 0; i < count; i++) {
      const x = vertices[i * 3] + chunk[0] * size; // from -width/2 to width/2
      const z = vertices[i * 3 + 2] + chunk[1] * size; // from -height/2 to height/2

      const newY = getHeight(x, z);

      g.attributes.position.setY(i, newY);
    }

    g.computeVertexNormals();

    setGeo(g);
  }, [DEPTH, HEIGHT, WIDTH, chunk, geo, simplex, size, smoothness]);

  return geo;
};
