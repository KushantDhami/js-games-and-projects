document.addEventListener("DOMContentLoaded", () => {
  const levelLabel = document.getElementById("level");
  const startButton = document.getElementById("start");
  const buttons = {
    red: document.getElementById("red"),
    yellow: document.getElementById("yellow"),
    green: document.getElementById("green"),
    purple: document.getElementById("purple"),
  };

  const colors = Object.keys(buttons);

  let sequence = [];
  let userIndex = 0;
  let level = 0;
  let acceptingInput = false;

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  function setStatus(text) {
    levelLabel.textContent = text;
  }

  function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
  }

  async function flashButton(color, duration = 400) {
    const btn = buttons[color];
    if (!btn) return;

    btn.classList.add("flash");
    await delay(duration);
    btn.classList.remove("flash");
  }

  async function playSequence() {
    acceptingInput = false;
    setStatus(`Level ${level} — Watch the sequence`);

    await delay(800);

    for (const color of sequence) {
      await flashButton(color, 400);
      await delay(200);
    }

    setStatus(`Level ${level} — Your turn`);
    userIndex = 0;
    acceptingInput = true;
  }

  function startGame() {
    startButton.disabled = true;
    document.body.classList.remove("game-over");
    sequence = [];
    level = 0;
    nextLevel();
  }

  function nextLevel() {
    level += 1;
    sequence.push(getRandomColor());
    playSequence();
  }

  function endGame() {
    acceptingInput = false;
    startButton.disabled = false;
    document.body.classList.add("game-over");
    setStatus(
      `Game Over — Score ${level > 0 ? level - 1 : 0}. Press Start to try again`,
    );
  }

  async function handleUserInput(color) {
    if (!acceptingInput) return;

    flashButton(color, 150);
    const expected = sequence[userIndex];

    if (color === expected) {
      userIndex += 1;

      if (userIndex >= sequence.length) {
        acceptingInput = false;
        await delay(600);
        nextLevel();
      }
    } else {
      endGame();
    }
  }

  Object.entries(buttons).forEach(([color, btn]) => {
    btn.addEventListener("click", () => handleUserInput(color));
  });

  startButton.addEventListener("click", startGame);

  setStatus("Press Start to Play");
});
