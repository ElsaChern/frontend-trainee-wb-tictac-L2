const gameOptions = document.querySelector("#options");
const difficulty = document.getElementsByName("difficulty");
const players = document.getElementsByName("player");
const startBtn = document.querySelector("#startBtn");
const newGame = document.querySelector(".new-game");

let gameDifficulty = "0";
let gameFormat = "twoPlayers";
let humanPlayer = "x";
let computerPlayer = "o";

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

const miniMax = (field, player) => {
  let emptyCells = field.filter((item) => item === "");

  if (isPlayerWon(field, humanPlayer)) {
    return { score: -10 };
  } else if (isPlayerWon(field, computerPlayer)) {
    return { score: 10 };
  } else if (emptyCells.length === 0) {
    return { score: 0 };
  }

  let moves = [];

  for (let i = 0; i < field.length; i++) {
    if (field[i] !== "") {
      continue;
    }

    let currentMove = {};

    currentMove.index = i;
    field[i] = player;

    let nextPlayer = player === "x" ? "o" : "x";
    let result = miniMax(field, nextPlayer);
    currentMove.score = result.score;

    field[i] = "";
    moves.push(currentMove);
  }

  let bestMove;
  if (player === computerPlayer) {
    let bestScore = -10000;

    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = 10000;

    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
};

const theBestMove = () => {
  let field = Array.from(cells).map((cell) => cell.textContent);

  let result = miniMax(field, player);
  return cells[result.index];
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

cells.forEach((cell) => {
  cell.addEventListener("click", () => {
    if (gameEnded || cell.innerHTML !== "") {
      return;
    }

    makeAMove(cell);

    if (!gameEnded && gameFormat === "computer") {
      makeAMove(computerChoise());
    }
  });
});

const isPlayerWon = (field, player) => {
  for (let i = 0; i < win.length; i++) {
    if (
      field[win[i][0]] === player &&
      field[win[i][1]] === player &&
      field[win[i][2]] === player
    ) {
      return true;
    }
  }
  return false;
};

const gameOver = (isDraw = false) => {
  gameEnded = true;
  statusTxt.textContent = isDraw ? "Ничья!" : `Победа ${player}! `;
  newGame.style.display = "inline";
};

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

      gameOver();
    }
  }

  let emptyCells = Array.from(cells).filter((cell) => cell.textContent === "");

  if (!gameEnded && emptyCells.length === 0) {
    gameOver(true);
  }
};

newGame.addEventListener("click", () => {
  gameEnded = false;
  player = "x";

  cells.forEach((cell) => {
    cell.innerHTML = "";
  });

  statusTxt.textContent = `${player} твой ход`;
  gameOptions.style.display = "block";
});
