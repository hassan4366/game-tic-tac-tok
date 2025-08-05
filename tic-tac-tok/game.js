const board = document.getElementById("board");
const status = document.getElementById("status");
const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popup-message");
const difficultySelector = document.getElementById("difficulty");

let currentPlayer = "X";
let cells = [];
let gameOver = false;

function createBoard() {
  board.innerHTML = "";
  cells = [];

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.addEventListener("click", () => handleMove(i, cell));
    board.appendChild(cell);
    cells.push(cell);
  }
}

function handleMove(index, cell) {
  if (gameOver || cell.textContent !== "") return;

  cell.textContent = currentPlayer;
  cell.classList.add("filled");

  if (checkWinner()) {
    showPopup(`🎉 Player ${currentPlayer} Wins!`);
    gameOver = true;
    return;
  }

  if (cells.every((c) => c.textContent !== "")) {
    showPopup("😐 It's a draw!");
    gameOver = true;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  status.textContent = `Player ${currentPlayer}'s turn`;

  if (currentPlayer === "O") {
    setTimeout(() => computerMove(), 400); // small delay
  }
}

function computerMove() {
  if (gameOver) return;

  const difficulty = difficultySelector.value;
  let move;

  if (difficulty === "easy") {
    let empty = cells
      .map((c, i) => (c.textContent === "" ? i : null))
      .filter((i) => i !== null);
    move = empty[Math.floor(Math.random() * empty.length)];
  } else if (difficulty === "medium") {
    move = findWinningMove("O") || findWinningMove("X") || getRandomMove();
  } else {
    move = minimax("O").index;
  }

  if (move != null) handleMove(move, cells[move]);
}

function getRandomMove() {
  let empty = cells
    .map((c, i) => (c.textContent === "" ? i : null))
    .filter((i) => i !== null);
  return empty[Math.floor(Math.random() * empty.length)];
}

function findWinningMove(player) {
  const wins = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let [a, b, c] of wins) {
    let values = [
      cells[a].textContent,
      cells[b].textContent,
      cells[c].textContent,
    ];
    let filled = values.filter((v) => v === player).length;
    let emptyIndex = [a, b, c].find((i) => cells[i].textContent === "");
    if (filled === 2 && emptyIndex !== undefined) return emptyIndex;
  }
  return null;
}

function minimax(player) {
  let empty = cells
    .map((c, i) => (c.textContent === "" ? i : null))
    .filter((i) => i !== null);

  if (checkWinnerState("X")) return { score: -10 };
  if (checkWinnerState("O")) return { score: 10 };
  if (empty.length === 0) return { score: 0 };

  let moves = [];
  for (let i of empty) {
    cells[i].textContent = player;
    let result = minimax(player === "O" ? "X" : "O");
    cells[i].textContent = "";
    moves.push({ index: i, score: result.score });
  }

  let best =
    player === "O"
      ? Math.max(...moves.map((m) => m.score))
      : Math.min(...moves.map((m) => m.score));

  return moves.find((m) => m.score === best);
}

function checkWinner() {
  return checkWinnerState(currentPlayer);
}

function checkWinnerState(player) {
  const wins = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  return wins.some(
    ([a, b, c]) =>
      cells[a].textContent === player &&
      cells[b].textContent === player &&
      cells[c].textContent === player
  );
}

function showPopup(message) {
  popupMessage.textContent = message;
  popup.style.display = "flex";
  setTimeout(() => {
    popup.style.display = "none";
    resetGame();
  }, 2000);
}

function resetGame() {
  gameOver = false;
  currentPlayer = "X";
  status.textContent = "Player X's turn";
  createBoard();
}

createBoard();
