import { DoubleSide } from "three";

const THICKNESS = 0.002;

export default function Grid() {
  return (
    <group name="grid">
      <line>
        <boxBufferGeometry args={[THICKNESS, 1000, THICKNESS]} />
        <lineBasicMaterial color="red" side={DoubleSide} />
      </line>
      <line>
        <boxBufferGeometry args={[1000, THICKNESS, THICKNESS]} />
        <lineBasicMaterial color="green" side={DoubleSide} />
      </line>
      <line>
        <boxBufferGeometry args={[THICKNESS, THICKNESS, 1000]} />
        <lineBasicMaterial color="blue" side={DoubleSide} />
      </line>
    </group>
  );
}
