import { GameService } from "../src/services/GameService.js";
import { loadGame, saveGame, clearGameData } from "./utils/storage.js";

const gameService = new GameService();
let lastHitBeeRef = null;

const startBtn = document.getElementById("startBtn");
const hitBtn = document.getElementById("hitBtn");
const resetBtn = document.getElementById("resetBtn");
const lastHitDiv = document.getElementById("lastHit");
const beeStatusDiv = document.getElementById("beeStatus");
const playerNameElem = document.getElementById("playerName");

const savedGame = loadGame();
if (savedGame && !savedGame.gameOver) {
  gameService.bees = savedGame.bees;
  playerNameElem.textContent = savedGame.playerName;

  document.getElementById("startSection").classList.add("hidden-section");
  document.getElementById("gameSection").classList.remove("hidden-section");
  renderBeeStatus();
} else {
  document.getElementById("startSection").classList.remove("hidden-section");
  document.getElementById("gameSection").classList.add("hidden-section");
}

startBtn.addEventListener("click", () => {
  const name = document.getElementById("playerNameInput").value.trim();
  if (name) {
    playerNameElem.textContent = name;
    document.getElementById("startSection").classList.add("hidden-section");
    document.getElementById("gameSection").classList.remove("hidden-section");
    gameService.initializeSwarm();
    renderBeeStatus();
    saveGame(gameService.bees, name, false);
  }
});

hitBtn.addEventListener("click", () => {
  if (!gameService.isGameOver()) {
    const result = gameService.hitRandomBee();
    lastHitBeeRef = result.hitBee;
    lastHitDiv.innerHTML = `You hit a <span class="hit-type"> ${result.beeType}</span> with <span class="hit-damage"> ${result.damage}</span> damage.💥`;
    saveGame(
      gameService.bees,
      playerNameElem.textContent,
      gameService.isGameOver()
    );
    renderBeeStatus();
  } else {
    lastHitDiv.textContent = "Game Over! To play again please click Reset.";
  }
});

resetBtn.addEventListener("click", () => {
  gameService.initializeSwarm();
  clearGameData();
  location.reload();
});

function renderBeeStatus() {
  const swarmHealth = calculateSwarmHealth(gameService.bees);
  document.getElementById("swarmHealth").textContent = gameService.isGameOver()
    ? "💀 Swarm destroyed"
    : `Swarm Health: ${swarmHealth}%`;
  beeStatusDiv.innerHTML = "";
  const groups = groupBeeByType(gameService.bees);

  Object.keys(groups).forEach((type) => {
    const bees = groups[type];
    const groupDiv = document.createElement("div");
    groupDiv.classList.add("bee-group");
    const aliveBees = bees.filter((b) => b.isAlive()).length;
    groupDiv.innerHTML = `<strong>${type}</strong> (alive: ${aliveBees}/${bees.length})`;

    bees.forEach((bee, index) => {
      const hpRatio = bee.currentHp / bee.maxHp;
      let barcolor = "#a1e89d";
      switch (bee.type) {
        case "Queen":
          if (bee.currentHp <= 25) {
            barcolor = "#f06565";
          } else if (bee.currentHp <= 50) {
            barcolor = "#f2c94c";
          }
          break;
        case "Worker":
          if (bee.currentHp <= 20) {
            barcolor = "#f06565";
          } else if (bee.currentHp <= 40) {
            barcolor = "#f2c94c";
          }
          break;
        case "Drone":
          if (bee.currentHp <= 14) {
            barcolor = "#f06565";
          } else if (bee.currentHp <= 26) {
            barcolor = "#f2c94c";
          }
          break;
      }
      const beeDiv = document.createElement("div");
      beeDiv.classList.add("bee");
      if (!bee.isAlive()) {
        beeDiv.style.opacity = "0.3";
      }

      if (bee === lastHitBeeRef) {
        beeDiv.classList.add("hit");
      }

      beeDiv.innerHTML = `<div>HP:${bee.currentHp}/${bee.maxHp}</div>
      <div class="bee-bar" style="width:${
        hpRatio * 100
      }%; background-color: ${barcolor};"></div>`;
      groupDiv.appendChild(beeDiv);
    });
    beeStatusDiv.appendChild(groupDiv);
  });
  if (gameService.isGameOver()) {
    saveGame(gameService.bees, playerNameElem.textContent, true);
    lastHitDiv.textContent = "Game Over!";
  }
}

function groupBeeByType(bees) {
  return bees.reduce((acc, bee) => {
    if (!acc[bee.type]) {
      acc[bee.type] = [];
    }
    acc[bee.type].push(bee);
    return acc;
  }, {});
}

function calculateSwarmHealth(bees) {
  const queen = bees.find((b) => b.type === "Queen");
  if (!queen || !queen.isAlive()) return 0;
  const alivesBee = bees.filter((bee) => bee.isAlive());
  const totalHp = alivesBee.reduce((sum, bee) => sum + bee.maxHp, 0);
  const currentHp = alivesBee.reduce((sum, bee) => sum + bee.currentHp, 0);
  return totalHp === 0 ? 0 : Math.round((currentHp / totalHp) * 100);
}

function sayHello(name) {
  return `Hi ${name}`;
}
