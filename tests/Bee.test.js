import { Bee } from "../public/src/models/Bee.js";
import { BeeQueen } from "../public/src/models/BeeQueen.js";
import { BeeWorker } from "../public/src/models/BeeWorker.js";
import { BeeDrone } from "../public/src/models/BeeDrone.js";
import { strict as assert } from "assert";

describe("Bee Base Class", () => {
  it("should initialize with correct values", () => {
    const bee = new Bee("Test", 100, 10);
    assert.equal(bee.type, "Test");
    assert.equal(bee.maxHp, 100);
    assert.equal(bee.currentHp, 100);
    assert.equal(bee.damageOnHit, 10);
  });

  it("should reduce HP on hit", () => {
    const bee = new Bee("Test", 100, 10);
    bee.hit();
    assert.equal(bee.currentHp, 90);
  });

  it("should no go below 0 HP", () => {
    const bee = new Bee("Test", 10, 15);
    bee.hit();
    assert.equal(bee.currentHp, 0);
  });
  it("should report if alive correctly", () => {
    const bee = new Bee("Test", 50, 25);
    assert.equal(bee.isAlive(), true);
    bee.hit();
    bee.hit();
    assert.equal(bee.isAlive(), false);
  });
});

describe("Bee Subclasses", () => {
  it("BeeQueen should have 100 HP and 8 damage", () => {
    const queen = new BeeQueen();
    assert.equal(queen.maxHp, 100);
    assert.equal(queen.damageOnHit, 8);
  });
  it("BeeWorker should have 75 HP and 10 damage", () => {
    const worker = new BeeWorker();
    assert.equal(worker.maxHp, 75);
    assert.equal(worker.damageOnHit, 10);
  });
  it("BeeDrone should have 50 HP and 12 damage", () => {
    const drone = new BeeDrone();
    assert.equal(drone.maxHp, 50);
    assert.equal(drone.damageOnHit, 12);
  });

  it("Queen should take 8 damage when hit", () => {
    const queen = new BeeQueen();
    queen.hit();
    assert.equal(queen.currentHp, 92);
  });
  it("Worker should take 10 damage when hit", () => {
    const worker = new BeeWorker();
    worker.hit();
    assert.equal(worker.currentHp, 65);
  });
  it("Drone should take 12 damage when hit", () => {
    const drone = new BeeDrone();
    drone.hit();
    assert.equal(drone.currentHp, 38);
  });
});
