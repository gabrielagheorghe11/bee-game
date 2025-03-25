import { BeeQueen } from "../models/BeeQueen.js";
import { BeeWorker } from "../models/BeeWorker.js";
import { BeeDrone } from "../models/BeeDrone.js";

export function saveGame(bees, playerName, gameOver = false) {
  const beeData = bees.map((bee) => ({
    type: bee.type,
    currentHp: bee.currentHp,
  }));
  localStorage.setItem(
    "beeGameData",
    JSON.stringify({
      playerName,
      bees: beeData,
      gameOver,
    })
  );
}

export function loadGame() {
  const rawData = localStorage.getItem("beeGameData");
  if (!rawData) {
    return null;
  }

  try {
    const parsedData = JSON.parse(rawData);
    const bees = parsedData.bees.map((item) => {
      let bee = null;
      switch (item.type) {
        case "Queen":
          bee = new BeeQueen();
          break;
        case "Worker":
          bee = new BeeWorker();
          break;
        case "Drone":
          bee = new BeeDrone();
          break;
        default:
          return null;
      }

      bee.currentHp = item.currentHp;
      return bee;
    });
    return {
      playerName: parsedData.playerName,
      gameOver: parsedData.gameOver,
      bees: bees.filter(Boolean),
    };
  } catch (error) {
    console.error("Error while parsing localStorage", error);
    return null;
  }
}

export function clearGameData() {
  localStorage.removeItem("beeGameData");
}
