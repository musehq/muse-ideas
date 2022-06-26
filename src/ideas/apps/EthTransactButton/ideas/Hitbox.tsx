import { Interactable } from "spacesvr";
import { ComponentProps } from "react";

type HitboxProps = {
  args: [number, number, number];
} & Omit<ComponentProps<typeof Interactable>, "children">;

/**
 * Invisible box mesh to act as interactable
 *
 * @param props
 * @constructor
 */
export default function Hitbox(props: HitboxProps) {
  const { args, onClick, onHover, onUnHover } = props;

  return (
    <Interactable onClick={onClick} onHover={onHover} onUnHover={onUnHover}>
      <mesh visible={false}>
        <boxBufferGeometry args={args} />
      </mesh>
    </Interactable>
  );
}
