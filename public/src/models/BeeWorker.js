import { Bee } from "./Bee.js";

export class BeeWorker extends Bee {
  constructor() {
    super("Worker", 75, 10);
  }
}
