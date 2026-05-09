document.addEventListener("DOMContentLoaded", () => {
  openGame();
});

// State

let currentLevel = 0;
let score = 0;
let currentCue = 0;
let timeLeft = 20;

let currentDirection = "";
let canAnswer = false;
let answerPhase = false;

let gameTimer = null;
let cueTimer = null;
let hideCueTimer = null;

// Elements

const introScreen = document.getElementById("introScreen");
const gameArea = document.getElementById("gameArea");
const endScreen = document.getElementById("endScreen");

const levelText = document.getElementById("levelText");
const scoreHUD = document.getElementById("scoreHUD");

const taskText = document.getElementById("taskText");
const timerText = document.getElementById("timerText");
const roundText = document.getElementById("roundText");
const feedback = document.getElementById("feedback");

const captionBox = document.getElementById("captionBox");
const visualCue = document.getElementById("visualCue");

const directionButtons = document.querySelectorAll(".direction-btn");

const scoreText = document.getElementById("scoreText");
const achievementBox = document.getElementById("achievementBox");

// Levels

const levels = [
  {
    name: "Full visual support",
    time: 25,
    cueGoal: 5,
    captionDelay: 0,
    captionDuration: 1800,
    visualDuration: 1800,
    visualStrength: "strong",
    description: "Captions and visual cues are clear and easy to notice."
  },
  {
    name: "Reduced support",
    time: 22,
    cueGoal: 6,
    captionDelay: 400,
    captionDuration: 900,
    visualDuration: 700,
    visualStrength: "strong",
    description: "Captions disappear faster and become harder to remember."
  },
  {
    name: "Delayed accessibility",
    time: 18,
    cueGoal: 7,
    captionDelay: 1000,
    captionDuration: 600,
    visualDuration: 500,
    visualStrength: "weak",
    description: "Visual alternatives appear late and disappear quickly."
  },
  {
    name: "Audio-dependent design",
    time: 15,
    cueGoal: 8,
    captionDelay: 1400,
    captionDuration: 350,
    visualDuration: 250,
    visualStrength: "weak",
    description: "Critical information relies mostly on inaccessible audio cues."
  }
];

// Directions

const directions = ["left", "right", "up", "down"];

const directionLabels = {
  left: "LEFT SIDE",
  right: "RIGHT SIDE",
  up: "ABOVE",
  down: "BELOW"
};

// Open Game

function openGame() {
  currentLevel = 0;
  score = 0;
  currentCue = 0;

  clearTimers();

  hideAllScreens();
  showIntro();
}

// Close

function closeGame() {
  window.location.href = "games.html";
}

// Screens

function hideAllScreens() {
  introScreen.classList.remove("active");
  gameArea.classList.remove("active");
  endScreen.classList.remove("active");
}

function showIntro() {
  hideAllScreens();
  introScreen.classList.add("active");
}

// Start

function startGame() {
  currentLevel = 0;
  score = 0;
  currentCue = 0;

  clearTimers();

  hideAllScreens();
  gameArea.classList.add("active");

  loadLevel();
}

// Load Level

function loadLevel() {
  const level = levels[currentLevel];

  currentCue = 0;
  timeLeft = level.time;
  canAnswer = false;
  answerPhase = false;

  levelText.textContent = `Level ${currentLevel + 1}/${levels.length}`;
  scoreHUD.textContent = `Score: ${score}`;
  timerText.textContent = `Time: ${timeLeft}`;
  roundText.textContent = `Cue: ${currentCue}/${level.cueGoal}`;

  taskText.innerHTML = `
    React to the warning cue.<br>
    <small>${level.name}</small><br>
    <small>${level.description}</small>
  `;

  feedback.textContent = "";
  captionBox.textContent = "Watch carefully for warning information...";
  visualCue.textContent = "";
  visualCue.className = "";

  setButtonsEnabled(false);

  startTimer();

  cueTimer = setTimeout(showCue, 1200);
}

// Show Cue

function showCue() {
  const level = levels[currentLevel];

  if (currentCue >= level.cueGoal) {
    nextLevel();
    return;
  }

  currentDirection = directions[Math.floor(Math.random() * directions.length)];

  canAnswer = false;
  answerPhase = false;

  setButtonsEnabled(false);

  feedback.textContent = "Watch the cue carefully...";

  const inaccessibleChance = currentLevel >= 2 && Math.random() < 0.4;

  visualCue.textContent = getArrow(currentDirection);

  if (level.visualStrength === "strong") {
    visualCue.classList.add("active");
    visualCue.classList.remove("weak");
  } else {
    visualCue.classList.add("weak");
    visualCue.classList.remove("active");
  }

  setTimeout(() => {
    visualCue.textContent = "";
    visualCue.className = "";
  }, level.visualDuration);

  captionBox.textContent = "";

  if (inaccessibleChance) {
    captionBox.textContent = "[Audio cue played]";
  } else {
    setTimeout(() => {
      captionBox.textContent = `Warning: ${directionLabels[currentDirection]}`;
    }, level.captionDelay);
  }

  hideCueTimer = setTimeout(() => {
    captionBox.textContent = "";

    answerPhase = true;
    canAnswer = true;

    setButtonsEnabled(true);

    feedback.textContent = "Choose the direction now";
  }, level.captionDuration + level.captionDelay);
}

// Mouse Input

directionButtons.forEach(button => {
  button.addEventListener("click", () => {
    if (!canAnswer || !answerPhase) return;

    const selected = button.dataset.direction;
    handleAnswer(selected);
  });
});

// Keyboard Input

document.addEventListener("keydown", (e) => {
  if (!gameArea.classList.contains("active")) return;
  if (!canAnswer || !answerPhase) return;

  let selectedDirection = "";

  if (e.key === "ArrowLeft") selectedDirection = "left";
  if (e.key === "ArrowRight") selectedDirection = "right";
  if (e.key === "ArrowUp") selectedDirection = "up";
  if (e.key === "ArrowDown") selectedDirection = "down";

  if (selectedDirection !== "") {
    e.preventDefault();
    handleAnswer(selectedDirection);
  }
});

// Answer Handler

function handleAnswer(selected) {
  if (!canAnswer || !answerPhase) return;

  canAnswer = false;
  answerPhase = false;

  setButtonsEnabled(false);

  if (selected === currentDirection) {
    score++;
    feedback.textContent = "✔ Correct reaction";
  } else {
    feedback.textContent = "✖ Missed cue";
  }

  scoreHUD.textContent = `Score: ${score}`;

  currentCue++;

  roundText.textContent =
    `Cue: ${currentCue}/${levels[currentLevel].cueGoal}`;

  clearTimeout(hideCueTimer);

  visualCue.textContent = "";
  visualCue.className = "";

  captionBox.textContent = "Waiting for next cue...";

  if (currentCue >= levels[currentLevel].cueGoal) {
    setTimeout(nextLevel, 1200);
  } else {
    cueTimer = setTimeout(showCue, 1200);
  }
}

// Timer

function startTimer() {
  clearInterval(gameTimer);

  gameTimer = setInterval(() => {
    timeLeft--;

    timerText.textContent = `Time: ${timeLeft}`;

    if (timeLeft <= 0) {
      nextLevel();
    }
  }, 1000);
}

// Next Level

function nextLevel() {
  clearTimers();

  currentLevel++;

  if (currentLevel >= levels.length) {
    endGame();
    return;
  }

  loadLevel();
}

// End Game

function endGame() {
  clearTimers();

  hideAllScreens();
  endScreen.classList.add("active");

  const totalCues = levels.reduce(
    (sum, level) => sum + level.cueGoal,
    0
  );

  scoreText.textContent = `You scored ${score} / ${totalCues}`;

  let badge = "";
  let message = "";

  if (score >= totalCues - 2) {
    badge = "🏆 Accessibility Awareness Expert";
    message =
      "You adapted extremely well despite reduced audio accessibility.";
  } else if (score >= totalCues * 0.7) {
    badge = "🔇 Visual Cue Survivor";
    message =
      "You managed to rely on limited visual alternatives.";
  } else if (score >= totalCues * 0.4) {
    badge = "👀 Accessibility Learner";
    message =
      "You experienced how difficult games become when important information is communicated mainly through sound.";
  } else {
    badge = "⚠ Audio Accessibility Barrier";
    message =
      "The simulation demonstrated how inaccessible audio-only gameplay can feel for deaf and hard-of-hearing players.";
  }

  achievementBox.innerHTML = `
    <h3>${badge}</h3>
    <p>${message}</p>
  `;
}

// Helpers

function getArrow(direction) {
  if (direction === "left") return "⬅";
  if (direction === "right") return "➡";
  if (direction === "up") return "⬆";
  if (direction === "down") return "⬇";

  return "⚠";
}

function setButtonsEnabled(enabled) {
  directionButtons.forEach(button => {
    button.disabled = !enabled;
    button.style.opacity = enabled ? "1" : "0.45";
    button.style.cursor = enabled ? "pointer" : "not-allowed";
  });
}

function clearTimers() {
  clearInterval(gameTimer);
  clearTimeout(cueTimer);
  clearTimeout(hideCueTimer);
}

// Fullscreen

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

// Accessibility Dropdown

const accessBtn = document.getElementById("accessBtn");
const accessMenu = document.getElementById("accessMenu");

if (accessBtn && accessMenu) {
  accessBtn.addEventListener("click", () => {
    const isOpen = accessMenu.classList.toggle("show");

    accessBtn.setAttribute("aria-expanded", isOpen);
    accessMenu.setAttribute("aria-hidden", !isOpen);
  });
}

// Theme Switch

const themeSelect = document.getElementById("themeSelect");

if (themeSelect) {
  themeSelect.addEventListener("change", () => {
    document.body.classList.remove("soft", "calm", "dark");

    if (themeSelect.value === "dark") {
      document.body.classList.add("dark");
    }

    if (themeSelect.value === "soft") {
      document.body.classList.add("soft");
    }

    if (themeSelect.value === "soft-dark") {
      document.body.classList.add("soft", "dark");
    }

    if (themeSelect.value === "calm") {
      document.body.classList.add("calm");
    }

    if (themeSelect.value === "calm-dark") {
      document.body.classList.add("calm", "dark");
    }
  });
}

// Font Size

let fontSize = 100;

function changeFontSize(amount) {
  fontSize += amount * 10;

  if (fontSize < 70) fontSize = 70;
  if (fontSize > 200) fontSize = 200;

  document.body.style.fontSize = fontSize + "%";
}

// Font Style

const fontSelect = document.getElementById("fontSelect");

if (fontSelect) {
  fontSelect.addEventListener("change", () => {
    const fonts = {
      rajdhani: "'Rajdhani', sans-serif",
      atkinson: "'Atkinson Hyperlegible', sans-serif",
      sharetech: "'Share Tech Mono', monospace"
    };

    document.body.style.fontFamily = fonts[fontSelect.value];
  });
}

// High Contrast

const highContrast = document.getElementById("highContrast");

if (highContrast) {
  highContrast.addEventListener("change", () => {
    document.body.classList.toggle("high-contrast", highContrast.checked);
  });
}

// Keyboard Mode

const keyboardMode = document.getElementById("keyboardMode");

if (keyboardMode) {
  keyboardMode.addEventListener("change", () => {
    document.body.classList.toggle("keyboard-mode", keyboardMode.checked);
  });
}

// Reset

const resetBtn = document.getElementById("resetBtn");

if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    document.body.className = "";
    document.body.style.fontSize = "100%";
    document.body.style.fontFamily = "'Rajdhani', sans-serif";

    fontSize = 100;

    if (themeSelect) themeSelect.value = "default";
    if (fontSelect) fontSelect.value = "rajdhani";
    if (highContrast) highContrast.checked = false;
    if (keyboardMode) keyboardMode.checked = false;
  });
}