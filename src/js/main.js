const gameOptions = document.querySelector("#options");
const difficulty = document.getElementsByName("difficulty");
const players = document.getElementsByName("player");
const startBtn = document.querySelector("#startBtn");
const newGame = document.querySelector(".new-game");

let gameDifficulty = "0";
let gameFormat = "twoPlayers";

difficulty.forEach((item) => {
  item.addEventListener("change", () => {
    gameDifficulty = item.value;
  });
});

players.forEach((player) => {
  player.addEventListener("change", () => {
    gameFormat = player.value;
  });
});

startBtn.addEventListener("click", () => {
  gameOptions.style.display = "none";
});

/// Логика для игры на 2х
const cells = document.querySelectorAll(".cell");
const statusTxt = document.querySelector("#status");
let player = "x";
let gameEnded = false;

// Выигрышные комбинации
const win = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

statusTxt.textContent = `${player} твой ход`;

const makeAMove = (cell) => {
  let innerHTML = document.createElement("div");
  innerHTML.classList.add(player);
  innerHTML.textContent = player;
  cell.appendChild(innerHTML);

  checkWin();

  if (gameEnded) {
    return;
  }

  player = player === "x" ? "o" : "x";
  statusTxt.textContent = `${player} твой ход`;
};

const theBestMove = () => {
  let emptyCells = Array.from(cells).filter((cell) => cell.innerHTML === "");
};

const randomMove = () => {
  let emptyCells = Array.from(cells).filter((cell) => cell.innerHTML === "");
  let randomCellIndex = Math.floor(Math.random() * emptyCells.length);

  return emptyCells[randomCellIndex];
};

const computerChoise = () => {
  if (gameDifficulty === "1") {
    return theBestMove();
  } else {
    return randomMove();
  }
};

cells.forEach((cell) => {
  cell.addEventListener("click", () => {
    if (gameEnded || cell.innerHTML !== "") {
      return;
    }

    makeAMove(cell);

    if (gameFormat === "computer") {
      makeAMove(computerChoise());
    }
  });
});

const checkWin = () => {
  for (let i = 0; i < win.length; i++) {
    if (
      document.getElementById(win[i][0]).textContent === player &&
      document.getElementById(win[i][1]).textContent === player &&
      document.getElementById(win[i][2]).textContent === player
    ) {
      document.getElementById(win[i][0]).children[0].classList.add("win-color");
      document.getElementById(win[i][1]).children[0].classList.add("win-color");
      document.getElementById(win[i][2]).children[0].classList.add("win-color");
      gameEnded = true;

      // тут мб стоит указать, чья победа? Типо statusTxt.textContent = `Победа ${player}!`;
      statusTxt.textContent = `Победа ${player}! `;

      newGame.style.display = "inline";
    }
  }

  let isCellsFilled = Array.from(cells).map((cell) =>
    ["x", "o"].includes(cell.textContent),
  );

  if (!gameEnded && !isCellsFilled.includes(false)) {
    gameEnded = true;
    statusTxt.textContent = `Ничья!`;
  }
};

newGame.addEventListener("click", () => {
  gameEnded = false;
  player = "x";

  cells.forEach((cell) => {
    cell.innerHTML = "";
  });

  statusTxt.textContent = `${player} твой ход`;
});
