import { useThree } from "@react-three/fiber";
import { usePlayer } from "spacesvr";
import { useEffect, useState } from "react";
import { Vector3 } from "three";

type SpawnPointProps = {
  position?: [x: number, y: number, z: number];
  rotation?: [x: number, y: number, z: number];
};

export default function SpawnPoint(props: SpawnPointProps) {
  const { position, rotation } = props;

  const { camera } = useThree();
  const { position: playerPos } = usePlayer();
  const [setup, setSetup] = useState(false);

  useEffect(() => {
    if (playerPos && !setup) {
      if (position) {
        playerPos.set(new Vector3().fromArray(position as number[]));
      }
      if (rotation) {
        camera.rotation.fromArray(rotation);
      }
      setSetup(true);
    }
  }, [camera, setup, playerPos]);

  return null;
}
