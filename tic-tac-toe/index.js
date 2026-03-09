document.addEventListener("DOMContentLoaded", () => {
  const pName = document.getElementById("pname");
  const cells = document.querySelectorAll(".cell");
  const gameArena = document.querySelector(".game-arena");

  let board = ["", "", "", "", "", "", "", "", ""];
  let currentPlayer = "X";
  let gameActive = true;

  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  cells.forEach((cell, index) => {
    cell.addEventListener("click", () => handleCellClick(cell, index));
  });

  function handleCellClick(cell, index) {
    if (!gameActive || board[index] !== "") {
      return;
    }

    board[index] = currentPlayer;
    cell.innerText = currentPlayer;

    checkWinOrDraw();
  }

  function checkWinOrDraw() {
    let roundWon = false;

    for (let i = 0; i < winConditions.length; i++) {
      const [a, b, c] = winConditions[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        roundWon = true;
        break;
      }
    }

    if (roundWon) {
      pName.textContent = `Player ${currentPlayer} Wins!`;
      gameArena.classList.add("win");
      gameActive = false;

      setTimeout(() => {
        alert(`Player ${currentPlayer} wins!`);
        window.location.reload();
      }, 500);
      return;
    }

    if (!board.includes("")) {
      pName.textContent = "It's a Draw!";
      gameActive = false;
      setTimeout(() => {
        alert("Game ended in a draw!");
        window.location.reload();
      }, 500);
      return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    pName.textContent = `Turn of Player ${currentPlayer}`;
  }
});
