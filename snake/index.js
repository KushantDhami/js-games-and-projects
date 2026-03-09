document.addEventListener("DOMContentLoaded", () => {
  const gameArena = document.getElementById("game-arena");
  const arenaSize = 600;
  const cellSize = 20;

  let score = 0;
  let gameStarted = false;
  let food = { x: 300, y: 200 };
  let snake = [
    { x: 160, y: 200 },
    { x: 140, y: 200 },
    { x: 120, y: 200 },
  ];

  let gameSpeed = 200;
  let intervalId;
  let changingDirection = false;

  let dx = cellSize;
  let dy = 0;

  function drawDiv(x, y, className) {
    const divElement = document.createElement("div");
    divElement.classList.add(className);
    divElement.style.top = `${y}px`;
    divElement.style.left = `${x}px`;
    return divElement;
  }

  function drawFoodAndSnake() {
    gameArena.innerHTML = "";

    snake.forEach((snakeCell, index) => {
      const snakeElement = drawDiv(snakeCell.x, snakeCell.y, "snake");
      if (index === 0) {
        snakeElement.classList.add("snake-head");
      }
      gameArena.appendChild(snakeElement);
    });

    const foodElement = drawDiv(food.x, food.y, "food");
    gameArena.appendChild(foodElement);
  }

  function moveFood() {
    let newX, newY;
    do {
      newX = Math.floor(Math.random() * (arenaSize / cellSize)) * cellSize;
      newY = Math.floor(Math.random() * (arenaSize / cellSize)) * cellSize;
    } while (
      snake.some((snakeCell) => snakeCell.x === newX && snakeCell.y === newY)
    );

    food = { x: newX, y: newY };
  }

  function isGameOver() {
    for (let i = 1; i < snake.length; i++) {
      if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
        return true;
      }
    }

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x >= arenaSize;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y >= arenaSize;
    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
  }

  function gameLoop() {
    intervalId = setInterval(() => {
      if (!gameStarted) return;

      updateSnake();

      if (isGameOver()) {
        clearInterval(intervalId);
        gameStarted = false;
        alert(`Game Over! Your score is ${score}`);
        window.location.reload();
        return;
      }

      drawScoreBoard();
      drawFoodAndSnake();
      changingDirection = false;
    }, gameSpeed);
  }

  function updateSnake() {
    const newHead = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(newHead);

    if (newHead.x === food.x && newHead.y === food.y) {
      score += 5;
      moveFood();

      if (gameSpeed > 50) {
        clearInterval(intervalId);
        gameSpeed -= 10;
        gameLoop();
      }
    } else {
      snake.pop();
    }
  }

  function changeDirection(e) {
    if (changingDirection) return;

    const LEFT_KEY = 37;
    const UP_KEY = 38;
    const RIGHT_KEY = 39;
    const DOWN_KEY = 40;

    const keyPressed = e.keyCode;

    const isGoingUp = dy === -cellSize;
    const isGoingDown = dy === cellSize;
    const isGoingLeft = dx === -cellSize;
    const isGoingRight = dx === cellSize;

    if (keyPressed === LEFT_KEY && !isGoingRight) {
      dx = -cellSize;
      dy = 0;
      changingDirection = true;
    }
    if (keyPressed === RIGHT_KEY && !isGoingLeft) {
      dx = cellSize;
      dy = 0;
      changingDirection = true;
    }
    if (keyPressed === UP_KEY && !isGoingDown) {
      dx = 0;
      dy = -cellSize;
      changingDirection = true;
    }
    if (keyPressed === DOWN_KEY && !isGoingUp) {
      dx = 0;
      dy = cellSize;
      changingDirection = true;
    }
  }

  function runGame() {
    if (!gameStarted) {
      gameStarted = true;
      gameLoop();
      document.addEventListener("keydown", changeDirection);
    }
  }

  function drawScoreBoard() {
    const scoreBoard = document.getElementById("score-board");
    if (scoreBoard) {
      scoreBoard.textContent = `Score : ${score}`;
    }
  }

  function initiateGame() {
    const scoreBoard = document.createElement("div");
    scoreBoard.id = "score-board";
    scoreBoard.textContent = `Score : ${score}`;
    document.body.insertBefore(scoreBoard, gameArena);

    const startButton = document.createElement("button");
    startButton.textContent = "Start Game";
    startButton.classList.add("start-button");

    startButton.addEventListener("click", function startGame() {
      startButton.style.display = "none";
      runGame();
    });

    document.body.appendChild(startButton);
  }

  initiateGame();
});
