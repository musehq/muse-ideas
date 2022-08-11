import { ShapeType, Triplet, useCompoundBody } from "@react-three/cannon";
import { useMemo } from "react";

// height of 0.9 (eye level) for a perceived height of 1
export const useCapsuleCollider = (
  pos = [0, 0, 0],
  height = 0.9,
  radius = height / 3
) => {
  const vPos = pos as Triplet;

  const HEIGHT = height;
  const RADIUS = radius;

  const spheres = useMemo(() => {
    const SHAPE_TYPE: ShapeType = "Sphere";

    const sphereProps = { type: SHAPE_TYPE, args: [RADIUS] };
    const sphere1 = { ...sphereProps, position: [0, -(HEIGHT - RADIUS), 0] };
    const sphere2 = { ...sphereProps, position: [0, -(HEIGHT / 2), 0] };
    const sphere3 = { ...sphereProps, position: [0, -RADIUS, 0] };

    return [sphere1, sphere2, sphere3];
  }, [HEIGHT, RADIUS]);

  const compoundBody = useCompoundBody(() => ({
    mass: 60,
    position: vPos,
    segments: 8,
    fixedRotation: true,
    type: "Dynamic",
    shapes: spheres,
  }));

  return compoundBody;
};
