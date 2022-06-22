import { useEffect } from "react";
import { usePlayer } from "spacesvr";
import { Vector3 } from "three";
import { isTyping } from "../../logic/dom";

type JumpProps = any;

export default function Jump(props: JumpProps) {
  const { velocity } = usePlayer();

  useEffect(() => {
    const jump = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === " " && !isTyping()) {
        velocity.set(velocity.get().add(new Vector3(0, 5, 0)));
      }
    };

    document.addEventListener("keypress", jump);
    return () => {
      document.removeEventListener("keypress", jump);
    };
  }, [velocity]);

  return null;
}
