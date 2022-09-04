import { Spinning } from "spacesvr";
import { GroupProps, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Fog, FogBase } from "three";

type FogMachineProps = {
  color?: string;
  near?: number;
  far?: number;
  enabled?: boolean;
} & GroupProps;

export default function FogMachine(props: FogMachineProps) {
  const { color = "#d0d0d0", near, far, enabled, ...rest } = props;

  const scene = useThree((st) => st.scene);

  const lastFog = useRef<FogBase | null>(null);
  const thisFog = useRef<Fog | null>(null);

  // apply current fog
  useEffect(() => {
    // save last fog unless current fog is loaded
    if (!thisFog.current) lastFog.current = scene.fog;

    if (!enabled) {
      scene.fog = lastFog.current;
      thisFog.current = null;
    } else {
      thisFog.current = new Fog(color, near, far);
      scene.fog = thisFog.current;
    }
  }, [color, near, far, enabled]);

  return (
    <group name="FogMachine" {...rest}>
      <mesh>
        <boxBufferGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}
