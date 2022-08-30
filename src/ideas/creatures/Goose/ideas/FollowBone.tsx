import { Bone, Group, Quaternion, Vector3 } from "three";
import { ReactNode, useMemo, useRef } from "react";
import { useLimitedFrame } from "spacesvr";
import { GroupProps } from "@react-three/fiber";

type FollowBoneProps = {
  bone: Bone;
  children: ReactNode | ReactNode[];
} & GroupProps;

/**
 * Given a bone, this modifier will make its children's transform follow the bone
 * @param props
 * @constructor
 */
export default function FollowBone(props: FollowBoneProps) {
  const { bone, children, ...rest } = props;

  const refGroup = useRef<Group>(null);
  const group = useRef<Group>(null);

  const parent_pos = useMemo(() => new Vector3(), []);
  const parent_quat = useMemo(() => new Quaternion(), []);

  const bone_pos = useMemo(() => new Vector3(), []);
  const bone_quat = useMemo(() => new Quaternion(), []);

  useLimitedFrame(40, () => {
    if (!group.current || !refGroup.current || !bone) return;
    refGroup.current.getWorldPosition(parent_pos);
    refGroup.current.getWorldQuaternion(parent_quat);
    bone.getWorldPosition(bone_pos);
    bone.getWorldQuaternion(bone_quat);

    // get diff between bone pos and parent pos
    bone_pos.sub(parent_pos);

    // apply the parent's roation since it will be applied to the group .. or something idk, but this is v important!!
    bone_pos.applyQuaternion(parent_quat.invert());

    group.current.position.copy(bone_pos);
    group.current.quaternion.copy(parent_quat.multiply(bone_quat));
  });

  return (
    <group ref={refGroup}>
      <group {...rest}>
        <group ref={group} name="follow-bone">
          {children}
        </group>
      </group>
    </group>
  );
}
