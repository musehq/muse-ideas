import * as THREE from "three";
import { Color } from "three";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

type FogProps = {
  color: Color | string | number;
  near: number;
  far: number;
};

export const Fog = (props: FogProps) => {
  const { color, near, far } = props;

  const scene = useThree((state) => state.scene);

  useEffect(() => {
    scene.fog = new THREE.Fog(new Color(color), near, far);

    return () => {
      scene.fog = null;
    };
  }, [scene, color, near, far]);

  return null;
};
