import { ReactNode, useEffect, useState } from "react";

type MovableProps = { children: ReactNode | ReactNode[] };

export default function Movable(props: MovableProps) {
  const { children } = props;

  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [z, setZ] = useState(0);

  useEffect(() => {
    const onPress = (e: KeyboardEvent) => {
      if (!e.shiftKey) return;

      if (e.key === "ArrowUp") setY(y + 0.1);
      if (e.key === "ArrowDown") setY(y - 0.1);
    };
    document.addEventListener("keydown", onPress);
    return () => document.removeEventListener("keydown", onPress);
  }, [x, y, z]);

  return (
    <group name="movable" position={[x, y, z]}>
      {children}
    </group>
  );
}
