import { Mind } from "../layers/Mind";
import { Vector3 } from "three";
import { RootState } from "@react-three/fiber/dist/declarations/src/core/store";

export class GooseMind implements Mind {
  target: Vector3;
  targetVector: Vector3;

  state: "wander" | "idle" | "follow" | "attack";

  playerInSight: boolean;

  lastStateChange: number;

  constructor() {
    this.target = new Vector3();
    this.targetVector = new Vector3();
    this.lastStateChange = 0;

    this.state = "wander";
    this.playerInSight = false;

    return this;
  }

  tick(state: RootState) {
    const rand = Math.random();
    const timeSinceLast = state.clock.getElapsedTime() - this.lastStateChange;
    if (rand < 0.002 && timeSinceLast > 4) {
      this.lastStateChange = state.clock.getElapsedTime();
      this.sendSignal("time");
      console.log("state: ", this.state);
    }
  }

  sendSignal(signal: string) {
    const rand = Math.random();

    switch (signal) {
      case "playerInSight":
        this.playerInSight = true;
        break;
      case "playerLost":
        this.playerInSight = false;
        break;
      case "time":
        if (this.state === "wander") {
          if (this.playerInSight) {
            if (rand < 0.3) this.state = "follow";
            else if (rand < 0.6) this.state = "attack";
          }
          if (this.state === "wander") this.state = "idle";
        } else if (this.state === "idle") {
          if (this.playerInSight) {
            if (rand < 0.3) this.state = "follow";
            else if (rand < 0.6) this.state = "attack";
          }
          if (this.state === "idle") this.state = "wander";
        } else if (this.state === "follow") {
          if (rand < 0.5) this.state = "idle";
          else this.state = "wander";
        } else if (this.state === "attack") {
          if (rand < 0.5) this.state = "idle";
          else this.state = "wander";
        }
        break;
    }
  }
}
