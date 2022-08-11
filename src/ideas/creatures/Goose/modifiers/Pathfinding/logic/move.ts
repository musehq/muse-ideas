import { Quaternion, Spherical, Vector3 } from "three";

const dummy = new Spherical();
const UP_NORMAL = new Vector3(0, 1, 0);

export const setYRot = (rot: Quaternion, angle: number) =>
  rot.setFromAxisAngle(UP_NORMAL, angle);

export const setYRotFromXZ = (rot: Quaternion, x: number, z: number) =>
  setYRot(rot, dummy.setFromCartesianCoords(x, 0, z).theta);
