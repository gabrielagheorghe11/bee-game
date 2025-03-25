import { strict as assert } from "assert";
import { GameService } from "../public/src/services/GameService.js";

describe("GameService", () => {
  let game;
  beforeEach(() => {
    game = new GameService();
  });

  it("should initialize swarm with correct number of bees", () => {
    const bees = game.bees;
    const queen = bees.filter((b) => b.type === "Queen");
    const workers = bees.filter((b) => b.type === "Worker");
    const drones = bees.filter((b) => b.type === "Drone");

    assert.equal(queen.length, 1);
    assert.equal(workers.length, 5);
    assert.equal(drones.length, 8);
  });

  it("should hit a random bee and reduce its Hp", () => {
    const aliveBeesBefore = game.bees.filter((b) => b.isAlive()).length;
    const result = game.hitRandomBee();

    assert.ok(result);
    assert.ok(result.hitBee.currentHp < result.hitBee.maxHp);

    const aliveBeesAfter = game.bees.filter((b) => b.isAlive()).length;
    assert.ok(aliveBeesAfter <= aliveBeesBefore);
  });

  it("should not hit a bee if game is over", () => {
    const queen = game.bees.find((b) => b.type === "Queen");
    queen.currentHp = 0;

    const result = game.hitRandomBee();
    assert.equal(result, null);
  });

  it("should detect game over if queen is dead", () => {
    const queen = game.bees.find((b) => b.type === "Queen");
    queen.currentHp = 0;
    assert.equal(game.isGameOver(), true);
  });

  it("should detect game over if no bees are alive", () => {
    game.bees.forEach((b) => (b.currentHp = 0));
    assert.equal(game.isGameOver(), true);
  });

  it("should not be game over at the beginging", () => {
    assert.equal(game.isGameOver(), false);
  });
});
