import { strict as assert } from "assert";
import {
  saveGame,
  loadGame,
  clearGameData,
} from "../public/src/utils/storage.js";
import { BeeQueen } from "../public/src/models/BeeQueen.js";
import { BeeWorker } from "../public/src/models/BeeWorker.js";
import { BeeDrone } from "../public/src/models/BeeDrone.js";

describe("LocalStorage", () => {
  const mockStorage = (() => {
    let store = {};
    return {
      getItem: (key) => store[key] || null,
      setItem: (key, value) => {
        store[key] = value.toString();
      },
      removeItem: (key) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };
  })();

  beforeEach(() => {
    global.localStorage = mockStorage;
    localStorage.clear();
  });

  it("should save and load bee game state", () => {
    const bees = [new BeeQueen(), new BeeWorker(), new BeeDrone()];

    bees[0].currentHp = 90;
    const playerName = "John";

    saveGame(bees, playerName, false);
    const loaded = loadGame();
    assert.equal(loaded.playerName, playerName);
    assert.equal(loaded.gameOver, false);
    assert.equal(loaded.bees.length, 3);
    assert.equal(loaded.bees[0].currentHp, 90);
    assert.equal(loaded.bees[0].type, "Queen");
  });

  it("should return null if no data in localStorage", () => {
    const loaded = loadGame();
    assert.equal(loaded, null);
  });

  it("should clear game data", () => {
    const bees = [new BeeQueen()];
    saveGame(bees, "player", false);
    clearGameData();
    const loaded = loadGame();
    assert.equal(loaded, null);
  });
});
