import { Collidable } from "spacesvr";
import { GroupProps, useThree } from "@react-three/fiber";
import { useEffect, useRef, Suspense } from "react";
import { Fog, FogBase } from "three";
import GeneralModel from "./ideas/GeneralModel";

type FogMachineProps = {
  color?: string;
  near?: number;
  far?: number;
  enabled?: boolean;
} & GroupProps;

const MODEL_URL =
  "https://d1htv66kutdwsl.cloudfront.net/e6f54a93-5de2-40e7-9a0c-62c833892366/ca5726f6-ddb0-4b99-ab43-178d1932a689.glb";

export default function FogMachine(props: FogMachineProps) {
  const { color = "#d0d0d0", near, far, enabled, ...rest } = props;

  const scene = useThree((st) => st.scene);

  const lastFog = useRef<FogBase | null>(null);
  const thisFog = useRef<Fog | null>(null);

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

  // change back on unload
  useEffect(() => {
    return () => {
      if (lastFog.current) scene.fog = lastFog.current;
    };
  }, []);

  return (
    <group name="fog-machine" {...rest}>
      <Collidable triLimit={100}>
        <Suspense fallback={null}>
          <GeneralModel url={MODEL_URL} />
        </Suspense>
      </Collidable>
    </group>
  );
}
