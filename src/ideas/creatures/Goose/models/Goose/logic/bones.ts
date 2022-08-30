import { Bone, MathUtils } from "three";
import { useMemo } from "react";

type Bones = {
  head: Bone;
  mouth: Bone;
  neck4: Bone;
  neck3: Bone;
  neck2: Bone;
  neck1: Bone;
};

export const useBones = (mainBone: Bone) => {
  return useMemo<Bones>(() => {
    const bones: Bones = {} as Bones;
    const names = ["head", "mouth", "neck4", "neck3", "neck2", "neck1"];
    mainBone.traverse((node) => {
      if (names.includes((node as Bone).name)) {
        // @ts-ignore
        bones[(node as Bone).name] = node as Bone;
      }
    });
    return bones;
  }, [mainBone]);
};

export const rotateBones = (bones: Bones, angle: number) => {
  const ang = angleToMathPiRange(angle);

  bones.neck1.rotation.y = MathUtils.lerp(
    bones.neck1.rotation.y,
    ang * 0.15,
    0.15
  );
  bones.neck2.rotation.y = MathUtils.lerp(
    bones.neck2.rotation.y,
    ang * 0.4,
    0.15
  );

  bones.neck3.rotation.y = MathUtils.lerp(
    bones.neck3.rotation.y,
    ang * 0.3,
    0.15
  );
  bones.neck4.rotation.y = MathUtils.lerp(
    bones.neck4.rotation.y,
    ang * 0.15,
    0.15
  );
};

export const angleToMathPiRange = (angle: number) => {
  let ang = angle;

  // normalize between 0 and 2PI
  ang = ang > Math.PI ? ang - Math.PI * 2 : ang;
  ang = ang < -Math.PI ? ang + Math.PI * 2 : ang;

  return ang;
};

export const setHeadHeight = (bones: Bones, angle: number) => {
  bones.head.rotation.x = MathUtils.lerp(bones.head.rotation.x, angle, 0.15);
};

export const openMouth = (bones: Bones) => {
  bones.mouth.rotation.x = MathUtils.lerp(bones.mouth.rotation.x, -0.34, 0.1);
};

export const closeMouth = (bones: Bones) => {
  bones.mouth.rotation.x = MathUtils.lerp(bones.mouth.rotation.x, -0.2, 0.19);
};
