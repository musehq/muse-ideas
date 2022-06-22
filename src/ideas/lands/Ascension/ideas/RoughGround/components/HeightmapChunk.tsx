import { BufferGeometry } from "three";
import { useMemo } from "react";
import { useHeightfield } from "@react-three/cannon";
import { Chunk } from "../utils/chunks";

type HeightmapColliderProps = {
  geo: BufferGeometry;
  height: number;
  chunk: Chunk;
  size: number;
};

export default function HeightmapCollider(props: HeightmapColliderProps) {
  const { geo, height, chunk, size } = props;

  const heights = useMemo(() => {
    const verts = geo.attributes.position.array;
    const side = Math.sqrt(verts.length / 3);
    const h: number[][] = [];
    for (let x = 0; x < side; x++) {
      h.push([]);
      for (let z = 0; z < side; z++) {
        const i = (x * side + z) * 3 + 1;
        h[x].push(verts[i]);
      }
    }
    return h;
  }, [geo]);

  const X = chunk[0] * size - size / 2;
  const Z = chunk[1] * size - size / 2;

  // dont ask me why we have these offsets but we do....
  useHeightfield(() => ({
    args: [heights, { minValue: 0, maxValue: height, elementSize: 1 }],
    rotation: [-Math.PI / 2, 0, -Math.PI / 2],
    position: [X, 0, Z],
  }));

  return null;
}
