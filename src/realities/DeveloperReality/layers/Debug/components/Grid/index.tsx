import { Box3, Color, DoubleSide, Group } from "three";
import { ReactNode, useEffect, useRef, useState } from "react";

const THICKNESS = 0.002;

export default function Grid(props: { children: ReactNode | ReactNode[] }) {
  const { children } = props;

  const group = useRef<Group>(null);
  const [ct, seCt] = useState(0);

  // show / hide the grid
  const [show, setShow] = useState(true);
  useEffect(() => {
    const onPress = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "g") setShow(!show);
      if (e.key.toLowerCase() === "r") seCt(Math.random());
    };
    document.addEventListener("keypress", onPress);
    return () => document.removeEventListener("keypress", onPress);
  }, [show]);

  // get bounding box of idea
  const [box, setBox] = useState<Box3>();
  useEffect(() => {
    if (!group.current) return;

    setBox(new Box3().setFromObject(group.current));
  }, [children, ct]);

  return (
    <group name="grid">
      {/*{box && <box3Helper args={[box, new Color("black")]} />}*/}
      {show && (
        <>
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
        </>
      )}
      <group ref={group}>{children}</group>
    </group>
  );
}
