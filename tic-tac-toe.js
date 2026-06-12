// ============================================================
// TIC-TAC-TOE — JavaScript game logic
// ============================================================
// This file handles: game state, clicks, win/draw checks, and score updates.
// HTML = structure | CSS = look | JS = behavior

// All 8 ways to win on a 3×3 board (row, column, or diagonal).
// Each inner array holds 3 cell indexes (0–8, left-to-right, top-to-bottom).
const WIN_LINES = [
  [0, 1, 2], // top row
  [3, 4, 5], // middle row
  [6, 7, 8], // bottom row
  [0, 3, 6], // left column
  [1, 4, 7], // middle column
  [2, 5, 8], // right column
  [0, 4, 8], // diagonal ↘
  [2, 4, 6], // diagonal ↙
];

// --- Game state (variables the game remembers between clicks) ---
const board = Array(9).fill(""); // "" = empty, "X" or "O" once played
let currentPlayer = "X";        // whose turn it is
let gameOver = false;           // true after a win or draw
let scores = { X: 0, O: 0, draw: 0 };

// --- Grab HTML elements once so we can update them from JS ---
const cells = document.querySelectorAll(".ttt-cell");
const statusEl = document.getElementById("ttt-status");
const scoreXEl = document.getElementById("score-x");
const scoreOEl = document.getElementById("score-o");
const scoreDrawEl = document.getElementById("score-draw");

// Update the status text (e.g. "Player O's turn")
function updateStatus(message) {
  statusEl.textContent = message;
}

// Push current scores into the scoreboard on screen
function updateScores() {
  scoreXEl.textContent = scores.X;
  scoreOEl.textContent = scores.O;
  scoreDrawEl.textContent = scores.draw;
}

// Check every winning line; return winner + winning cells, or null
function checkWinner() {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] };
    }
  }
  return null;
}

// Draw = all 9 cells are filled and nobody won
function isDraw() {
  return board.every((cell) => cell !== "");
}

// Add a CSS class so the winning cells pulse/highlight
function highlightWin(line) {
  line.forEach((index) => {
    cells[index].classList.add("ttt-cell--win");
  });
}

// Show X or O on a cell, style it, and block further clicks on that cell
function setCellState(cell, player) {
  cell.textContent = player;
  cell.classList.add(player === "X" ? "ttt-cell--x" : "ttt-cell--o");
  cell.disabled = true;
  cell.setAttribute("aria-label", `Cell ${Number(cell.dataset.index) + 1}, ${player}`);
}

// Runs when a player clicks a cell
function handleCellClick(event) {
  const cell = event.target;
  const index = Number(cell.dataset.index); // read data-index from HTML

  // Ignore click if game ended or cell already taken
  if (gameOver || board[index] !== "") {
    return;
  }

  // Record the move in our board array and update the button on screen
  board[index] = currentPlayer;
  setCellState(cell, currentPlayer);

  // Did someone win?
  const result = checkWinner();
  if (result) {
    gameOver = true;
    highlightWin(result.line);
    scores[result.winner]++;
    updateScores();
    updateStatus(`Player ${result.winner} wins!`);
    return;
  }

  // Board full with no winner?
  if (isDraw()) {
    gameOver = true;
    scores.draw++;
    updateScores();
    updateStatus("It's a draw!");
    return;
  }

  // Otherwise switch turns and prompt the next player
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateStatus(`Player ${currentPlayer}'s turn`);
}

// Clear the board for another round (scores stay)
function resetRound() {
  board.fill("");
  currentPlayer = "X";
  gameOver = false;

  cells.forEach((cell, index) => {
    cell.textContent = "";
    cell.disabled = false;
    cell.classList.remove("ttt-cell--x", "ttt-cell--o", "ttt-cell--win");
    cell.setAttribute("aria-label", `Cell ${index + 1}, empty`);
  });

  updateStatus("Player X's turn");
}

// Zero out scores and start a fresh round
function resetScores() {
  scores = { X: 0, O: 0, draw: 0 };
  updateScores();
  resetRound();
}

// --- Wire up interactivity: listen for clicks ---
cells.forEach((cell) => cell.addEventListener("click", handleCellClick));
document.getElementById("reset-round").addEventListener("click", resetRound);
document.getElementById("reset-scores").addEventListener("click", resetScores);

// Show initial scores on page load
updateScores();
