document.addEventListener("DOMContentLoaded", () => {
  openGame();
});

// State

let randomDriftX = 0;
let randomDriftY = 0;

let currentLevel = 0;
let score = 0;
let hits = 0;
let timeLeft = 20;

let delayAmount = 0.08;
let shakeAmount = 0;
let levelComplete = false;

let mouseX = 0;
let mouseY = 0;
let crosshairX = 0;
let crosshairY = 0;

let gameTimer = null;
let animationStarted = false;
let waitingForNextLevel = false;

// Elements

const introScreen = document.getElementById("introScreen");
const gameArea = document.getElementById("gameArea");
const endScreen = document.getElementById("endScreen");

const levelText = document.getElementById("levelText");
const scoreHUD = document.getElementById("scoreHUD");

const taskText = document.getElementById("taskText");
const timerText = document.getElementById("timerText");
const hitsText = document.getElementById("hitsText");
const feedback = document.getElementById("feedback");

const scoreText = document.getElementById("scoreText");
const achievementBox = document.getElementById("achievementBox");

const aimArea = document.getElementById("aimArea");
const target = document.getElementById("target");
const crosshair = document.getElementById("crosshair");

// Level Data

const levels = [
  {
    delay: 0.035,
    shake: 0,
    targetSize: 90,
    time: 30,
    targetGoal: 5,
    description: "Mode: Mild motor delay",
    explanation: "Small input delay affects reaction speed."
  },
  {
    delay: 0.02,
    shake: 4,
    targetSize: 65,
    time: 22,
    targetGoal: 7,
    description: "Mode: Moderate coordination difficulty",
    explanation: "Delayed response and unstable movement reduce precision."
  },
  {
    delay: 0.01,
    shake: 9,
    targetSize: 45,
    time: 16,
    targetGoal: 9,
    description: "Mode: Severe motor impairment simulation",
    explanation: "Heavy delay and tremor-like instability make aiming difficult."
  }
];

// Open Game

function openGame() {
  currentLevel = 0;
  score = 0;
  hits = 0;
  clearInterval(gameTimer);
  hideAllScreens();
  showIntro();
}

// Close Game

function closeGame() {
  window.location.href = "games.html";
}

// Screen Control

function hideAllScreens() {
  introScreen.classList.remove("active");
  gameArea.classList.remove("active");
  endScreen.classList.remove("active");
}

function showIntro() {
  hideAllScreens();
  introScreen.classList.add("active");
}

// Start Game

function startGame() {
  currentLevel = 0;
  score = 0;
  hits = 0;
  waitingForNextLevel = false;
  clearInterval(gameTimer);

  hideAllScreens();
  gameArea.classList.add("active");

  loadLevel();

  if (!animationStarted) {
    animationStarted = true;
    updateCrosshair();
  }
}

// Load Level

function loadLevel() {
  const level = levels[currentLevel];

  hits = 0;
  timeLeft = level.time;
  delayAmount = level.delay;
  shakeAmount = level.shake;
  levelComplete = false;
  waitingForNextLevel = false;

  randomDriftX = 0;
  randomDriftY = 0;

  levelText.textContent = `Level ${currentLevel + 1}/${levels.length}`;
  scoreHUD.textContent = `Score: ${score}`;
  timerText.textContent = `Time: ${timeLeft}`;
  hitsText.textContent = `Hits: ${hits}/${level.targetGoal}`;

  taskText.innerHTML = `
    Hit the targets before time runs out.<br>
    <small>${level.description}</small><br>
    <small>${level.explanation}</small>
  `;

  feedback.textContent = "";

  resetCursorPosition();
  moveTarget();
  startTimer();
}

// Reset Cursor

function resetCursorPosition() {
  const rect = aimArea.getBoundingClientRect();

  mouseX = rect.left + rect.width / 2;
  mouseY = rect.top + rect.height / 2;

  crosshairX = mouseX;
  crosshairY = mouseY;
}

// Track Mouse

document.addEventListener("mousemove", (e) => {
  const rect = aimArea.getBoundingClientRect();

  mouseX = Math.max(rect.left, Math.min(e.clientX, rect.right));
  mouseY = Math.max(rect.top, Math.min(e.clientY, rect.bottom));
});

// Delayed Crosshair

function updateCrosshair() {
  const rect = aimArea.getBoundingClientRect();

  crosshairX += (mouseX - crosshairX) * delayAmount;
  crosshairY += (mouseY - crosshairY) * delayAmount;

  randomDriftX += (Math.random() - 0.5) * shakeAmount;
  randomDriftY += (Math.random() - 0.5) * shakeAmount;

  randomDriftX *= 0.92;
  randomDriftY *= 0.92;

  let localX = crosshairX - rect.left + randomDriftX;
  let localY = crosshairY - rect.top + randomDriftY;

  const padding = 18;

  localX = Math.max(padding, Math.min(localX, rect.width - padding));
  localY = Math.max(padding, Math.min(localY, rect.height - padding));

  crosshair.style.left = `${localX}px`;
  crosshair.style.top = `${localY}px`;

  requestAnimationFrame(updateCrosshair);
}

// Move Target

function moveTarget() {
  const size = levels[currentLevel].targetSize;

  target.style.width = `${size}px`;
  target.style.height = `${size}px`;

  const maxX = aimArea.clientWidth - size;
  const maxY = aimArea.clientHeight - size;

  const x = Math.random() * maxX;
  const y = Math.random() * maxY;

  target.style.left = `${x}px`;
  target.style.top = `${y}px`;

  target.style.transition = `
    left ${Math.max(0.08, 0.25 - currentLevel * 0.05)}s linear,
    top ${Math.max(0.08, 0.25 - currentLevel * 0.05)}s linear,
    transform 0.1s ease
  `;
}

// Target Click

target.addEventListener("click", () => {
  if (levelComplete || waitingForNextLevel) return;

  const level = levels[currentLevel];

  hits++;
  score++;

  hitsText.textContent = `Hits: ${hits}/${level.targetGoal}`;
  scoreHUD.textContent = `Score: ${score}`;

  feedback.textContent = "✔ Target hit";

  if (hits >= level.targetGoal) {
    levelComplete = true;
    waitingForNextLevel = true;
    clearInterval(gameTimer);

    feedback.textContent = "✔ Level Complete!";

    setTimeout(() => {
      nextLevel();
    }, 1200);

    return;
  }

  moveTarget();
});

// Timer

function startTimer() {
  clearInterval(gameTimer);

  gameTimer = setInterval(() => {
    if (levelComplete || waitingForNextLevel) return;

    timeLeft--;
    timerText.textContent = `Time: ${timeLeft}`;

    if (timeLeft <= 0) {
      waitingForNextLevel = true;
      clearInterval(gameTimer);

      feedback.textContent = "⏰ Time Up!";

      setTimeout(() => {
        nextLevel();
      }, 1200);
    }
  }, 1000);
}

// Next Level

function nextLevel() {
  clearInterval(gameTimer);

  currentLevel++;

  if (currentLevel >= levels.length) {
    endGame();
    return;
  }

  loadLevel();
}

// End Game

function endGame() {
  clearInterval(gameTimer);
  hideAllScreens();

  endScreen.classList.add("active");

  const totalTargets = levels.reduce((sum, level) => sum + level.targetGoal, 0);

  scoreText.textContent = `You scored ${score} / ${totalTargets}`;

  let badge = "";
  let message = "";

  if (score >= totalTargets - 1) {
    badge = "🏆 Accessibility Champion";
    message = "You adapted extremely well despite severe motor barriers.";
  } else if (score >= totalTargets * 0.7) {
    badge = "🎯 Precision Survivor";
    message = "You maintained strong accuracy despite delayed controls.";
  } else if (score >= totalTargets * 0.4) {
    badge = "👍 Adaptive Player";
    message = "You experienced how difficult precise motor control can become.";
  } else {
    badge = "⚠ Motor Overload";
    message = "The simulation demonstrated how frustrating unstable controls can feel.";
  }

  achievementBox.innerHTML = `
    <h3>${badge}</h3>
    <p>${message}</p>
  `;
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