document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("board");
  const ball = document.querySelector(".ball");
  const paddle1 = document.querySelector(".paddle_1");
  const paddle2 = document.querySelector(".paddle_2");
  const msg = document.querySelector(".message");
  const score1El = document.querySelector(".player_1_score");
  const score2El = document.querySelector(".player_2_score");

  const BOARD_WIDTH = 1000;
  const BOARD_HEIGHT = 600;
  const PADDLE_WIDTH = 20;
  const PADDLE_HEIGHT = 100;
  const BALL_SIZE = 20;
  const PADDLE_OFFSET = 20;

  const PADDLE_SPEED = 12;
  const BALL_SPEED = 6;
  const WINNING_SCORE = 5;

  let ballX = (BOARD_WIDTH - BALL_SIZE) / 2;
  let ballY = (BOARD_HEIGHT - BALL_SIZE) / 2;
  let ballVX = BALL_SPEED;
  let ballVY = BALL_SPEED * 0.4;

  let paddle1Y = (BOARD_HEIGHT - PADDLE_HEIGHT) / 2;
  let paddle2Y = (BOARD_HEIGHT - PADDLE_HEIGHT) / 2;

  let score1 = 0;
  let score2 = 0;

  let running = false;
  let animationId = null;
  let lastTimestamp = 0;

  const keys = {};

  const overlayButton = createOverlayButton();

  function createOverlayButton() {
    const btn = document.createElement("button");
    btn.classList.add("btn");
    btn.style.display = "none";
    btn.addEventListener("click", () => {
      resetGame();
      startGame();
    });
    document.body.appendChild(btn);
    return btn;
  }

  function setMessage(text) {
    msg.innerText = text;
  }

  function updateScoreDisplay() {
    score1El.innerText = score1;
    score2El.innerText = score2;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function resetBall(direction = 1) {
    ballX = (BOARD_WIDTH - BALL_SIZE) / 2;
    ballY = (BOARD_HEIGHT - BALL_SIZE) / 2;
    ballVX = BALL_SPEED * direction;
    ballVY = (Math.random() * 2 - 1) * BALL_SPEED * 0.35;
  }

  function resetPaddles() {
    paddle1Y = (BOARD_HEIGHT - PADDLE_HEIGHT) / 2;
    paddle2Y = (BOARD_HEIGHT - PADDLE_HEIGHT) / 2;
  }

  function resetGame() {
    running = false;
    score1 = 0;
    score2 = 0;
    updateScoreDisplay();
    resetPaddles();
    resetBall(1);
    setMessage("Press Enter to Start (W/S + ↑/↓)");
    overlayButton.style.display = "none";
    updateStyles();
  }

  function updateStyles() {
    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;

    paddle1.style.top = `${paddle1Y}px`;
    paddle2.style.top = `${paddle2Y}px`;
  }

  function startGame() {
    if (running) return;
    running = true;
    setMessage("");
    overlayButton.style.display = "none";
    lastTimestamp = performance.now();

    if (animationId) {
      cancelAnimationFrame(animationId);
    }

    animationId = requestAnimationFrame(gameLoop);
  }

  function endGame(message) {
    running = false;
    setMessage(message);
    overlayButton.innerText = "Play Again";
    overlayButton.style.display = "block";
  }

  function handleWinCheck() {
    if (score1 >= WINNING_SCORE) {
      endGame("Player 1 Wins!");
      return true;
    }
    if (score2 >= WINNING_SCORE) {
      endGame("Player 2 Wins!");
      return true;
    }
    return false;
  }

  function gameLoop(timestamp) {
    if (!running) return;
    if (!lastTimestamp) lastTimestamp = timestamp;

    const delta = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    const timeScale = delta * 60;

    if (keys["w"] || keys["W"])
      paddle1Y = clamp(
        paddle1Y - PADDLE_SPEED * timeScale,
        0,
        BOARD_HEIGHT - PADDLE_HEIGHT,
      );
    if (keys["s"] || keys["S"])
      paddle1Y = clamp(
        paddle1Y + PADDLE_SPEED * timeScale,
        0,
        BOARD_HEIGHT - PADDLE_HEIGHT,
      );
    if (keys["ArrowUp"])
      paddle2Y = clamp(
        paddle2Y - PADDLE_SPEED * timeScale,
        0,
        BOARD_HEIGHT - PADDLE_HEIGHT,
      );
    if (keys["ArrowDown"])
      paddle2Y = clamp(
        paddle2Y + PADDLE_SPEED * timeScale,
        0,
        BOARD_HEIGHT - PADDLE_HEIGHT,
      );

    ballX += ballVX * timeScale;
    ballY += ballVY * timeScale;

    if (ballY <= 0) {
      ballY = 0;
      ballVY *= -1;
    }

    if (ballY + BALL_SIZE >= BOARD_HEIGHT) {
      ballY = BOARD_HEIGHT - BALL_SIZE;
      ballVY *= -1;
    }

    const ballBounds = {
      left: ballX,
      right: ballX + BALL_SIZE,
      top: ballY,
      bottom: ballY + BALL_SIZE,
    };

    const paddle1Bounds = {
      left: PADDLE_OFFSET,
      right: PADDLE_OFFSET + PADDLE_WIDTH,
      top: paddle1Y,
      bottom: paddle1Y + PADDLE_HEIGHT,
    };

    const paddle2Bounds = {
      left: BOARD_WIDTH - PADDLE_OFFSET - PADDLE_WIDTH,
      right: BOARD_WIDTH - PADDLE_OFFSET,
      top: paddle2Y,
      bottom: paddle2Y + PADDLE_HEIGHT,
    };

    const intersects = (a, b) =>
      a.left < b.right &&
      a.right > b.left &&
      a.top < b.bottom &&
      a.bottom > b.top;

    if (intersects(ballBounds, paddle1Bounds) && ballVX < 0) {
      ballX = PADDLE_OFFSET + PADDLE_WIDTH;
      ballVX *= -1;
      ballVY = (ballY + BALL_SIZE / 2 - (paddle1Y + PADDLE_HEIGHT / 2)) * 0.12;
    }

    if (intersects(ballBounds, paddle2Bounds) && ballVX > 0) {
      ballX = BOARD_WIDTH - PADDLE_OFFSET - PADDLE_WIDTH - BALL_SIZE;
      ballVX *= -1;
      ballVY = (ballY + BALL_SIZE / 2 - (paddle2Y + PADDLE_HEIGHT / 2)) * 0.12;
    }

    if (ballX <= 0) {
      score2 += 1;
      updateScoreDisplay();
      if (!handleWinCheck()) resetBall(1);
    } else if (ballX + BALL_SIZE >= BOARD_WIDTH) {
      score1 += 1;
      updateScoreDisplay();
      if (!handleWinCheck()) resetBall(-1);
    }

    updateStyles();
    if (running) animationId = requestAnimationFrame(gameLoop);
  }

  document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
    if (e.key === "Enter") startGame();
  });

  document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
  });

  resetGame();
});
