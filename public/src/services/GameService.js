import { BeeQueen } from "../models/BeeQueen.js";
import { BeeWorker } from "../models/BeeWorker.js";
import { BeeDrone } from "../models/BeeDrone.js";

export class GameService {
  constructor() {
    this.bees = [];
    this.initializeSwarm();
  }

  initializeSwarm() {
    this.bees = [];
    this.bees.push(new BeeQueen());
    for (let i = 0; i < 5; i++) {
      this.bees.push(new BeeWorker());
    }
    for (let i = 0; i < 8; i++) {
      this.bees.push(new BeeDrone());
    }
  }

  hitRandomBee() {
    if (this.isGameOver()) {
      return null;
    }

    const aliveBees = this.bees.filter((bee) => bee.isAlive());

    const randomIndex = Math.floor(Math.random() * aliveBees.length);
    const chosenBee = aliveBees[randomIndex];
    chosenBee.hit();

    if (chosenBee.type === "Queen" && !chosenBee.isAlive()) {
      this.bees.forEach((bee) => {
        bee.currentHp = 0;
      });
    }
    return {
      beeType: chosenBee.type,
      damage: chosenBee.damageOnHit,
      hitBee: chosenBee,
    };
  }

  isGameOver() {
    const queen = this.bees.find((bee) => bee.type === "Queen");
    if (!queen || !queen.isAlive()) {
      return true;
    }

    const anyBeeAlive = this.bees.some((bee) => bee.isAlive());
    return !anyBeeAlive;
  }
}
