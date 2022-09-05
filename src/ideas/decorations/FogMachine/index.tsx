import { Collidable } from "spacesvr";
import { GroupProps, useThree } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
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
      {enabled && (
        <Sparkles
          count={150}
          position-y={0.01}
          scale={[1.05, 0.01, 0.5]}
          rotation-y={0.4}
          opacity={0.75}
          size={20}
          speed={0.2}
          noise={40.1}
          position-z={0.7}
          color={color}
        />
      )}
    </group>
  );
}

//  /** Number of particles (default: 100) */
// count?: number
// /** Speed of particles (default: 1) */
// speed?: number | Float32Array
// /** Opacity of particles (default: 1) */
// opacity?: number | Float32Array
// /** Color of particles (default: 100) */
// color?: THREE.ColorRepresentation | Float32Array
// /** Size of particles (default: randomized between 0 and 1) */
// size?: number | Float32Array
// /** The space the particles occupy (default: 1) */
// scale?: number | [number, number, number] | THREE.Vector3
// /** Movement factor (default: 1) */
// noise?: number | [number, number, number] | THREE.Vector3 | Float32Array
