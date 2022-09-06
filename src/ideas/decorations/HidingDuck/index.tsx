import { GroupProps, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useState, useRef, useMemo } from "react";
import { Group, Vector3 } from "three";

export type HidingDuckProps = {
  distance?: number;
} & GroupProps;

export default function HidingDuck(props: HidingDuckProps) {
  const { distance = 4, ...rest } = props;

  const [near, setNear] = useState(false);
  const group = useRef<Group>(null);
  const dummy = useMemo(() => new Vector3(), []);

  const gltf = useGLTF(
    "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/duck/model.gltf"
  );

  //three js
  useFrame(({ camera }) => {
    if (!group.current) return;

    group.current.getWorldPosition(dummy);
    const dist = dummy.distanceTo(camera.position);
    setNear(dist < distance);
  });

  return (
    <group name="hiding-duck" {...rest}>
      <group ref={group} scale={near ? 0.2 : 1}>
        <primitive object={gltf.scene} />
      </group>
    </group>
  );
}
