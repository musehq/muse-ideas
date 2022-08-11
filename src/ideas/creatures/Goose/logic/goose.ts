import { Mind } from "../layers/Mind";
import { Vector3 } from "three";
import { RootState } from "@react-three/fiber/dist/declarations/src/core/store";

export class GooseMind implements Mind {
  target: Vector3;
  targetVector: Vector3;
  state: "walk" | "idle" | "eat" | "attack";
  playerNear: boolean;
  playerInSight: boolean;

  constructor() {
    this.target = new Vector3();
    this.targetVector = new Vector3();

    this.state = "idle";
    this.playerNear = false;
    this.playerInSight = false;

    return this;
  }

  update(state: RootState) {
    const l = 1 + 2; // dummy placeholder
  }
}
