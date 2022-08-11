import { Mind } from "../layers/Mind";
import { Vector3 } from "three";
import { RootState } from "@react-three/fiber/dist/declarations/src/core/store";

export class GooseMind implements Mind {
  target: Vector3;
  lastSwitch: number;

  constructor() {
    this.lastSwitch = 0;
    this.target = new Vector3();
    return this;
  }

  update(state: RootState) {
    if (state.clock.getElapsedTime() - this.lastSwitch > 8) {
      this.lastSwitch = state.clock.getElapsedTime();
      this.target.x = Math.random() * 2 - 1;
      this.target.z = Math.random() * 2 - 1;
      this.target.multiplyScalar(5);
      this.target.y = 0;
    }
  }
}
