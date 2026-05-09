document.addEventListener("DOMContentLoaded", () => {
  openGame();
});

// State

let currentLevel = 0;
let score = 0;

// Elements

const modal = document.getElementById("gameModal");
const blurGame = document.getElementById("blurGame");

const introScreen = document.getElementById("introScreen");
const gameArea = document.getElementById("gameArea");
const endScreen = document.getElementById("endScreen");

const levelText = document.getElementById("levelText");
const scoreHUD = document.getElementById("scoreHUD");

const taskText = document.getElementById("taskText");
const blurImage = document.getElementById("blurImage");
const answersDiv = document.getElementById("answers");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");

const scoreText = document.getElementById("scoreText");
const achievementBox = document.getElementById("achievementBox");

// Level Data

const levels = [
  {
    image: "../images/apple.png",
    blur: 2,
    vision: "-1.0",
    description: "Mode: Mild myopia",
    task: "What object do you see?",
    answers: ["Apple", "Car", "Dog", "Banana"],
    correct: "Apple"
  },
  {
    image: "../images/square.png",
    blur: 4,
    vision: "-2.0",
    description: "Mode: Moderate myopia",
    task: "Identify the shape!",
    answers: ["Circle", "Square", "Triangle", "Rectangle"],
    correct: "Square"
  },
  {
    image: "../images/student.png",
    blur: 6,
    vision: "-3.5",
    description: "Mode: Strong myopia",
    task: "Read the word!",
    answers: ["HELLO", "WORLD", "ACCESS", "STUDENT"],
    correct: "STUDENT"
  },
  {
    image: "../images/fox.png",
    blur: 8,
    vision: "-5.0",
    description: "Mode: Severe myopia",
    task: "Identify the animal!",
    answers: ["Cat", "Dog", "Fox", "Horse"],
    correct: "Fox"
  },
  {
    image: "../images/fries.png",
    blur: 12,
    vision: "-7.0",
    description: "Mode: Extreme myopia",
    task: "Guess the type of fry!",
    answers: ["French Fries", "Curly Fries", "Wedges", "Chips"],
    correct: "French Fries"
  }
];

// Open Game

function openGame() {
  currentLevel = 0;
  score = 0;

  hideAllScreens();
  showIntro();
}

// Close Game

function closeGame() {
  window.location.href = "games.html";
}

// Screen Control

function hideAllScreens() {
  introScreen.style.display = "none";
  gameArea.style.display = "none";
  endScreen.style.display = "none";
}

function showIntro() {
  hideAllScreens();
  introScreen.style.display = "flex";
}

function startGame() {
  currentLevel = 0;
  score = 0;

  hideAllScreens();

  gameArea.style.display = "flex";

  resetUI();

  loadLevel();
}

function resetUI() {
  feedback.textContent = "";
  nextBtn.style.display = "none";
  answersDiv.innerHTML = "";

  scoreHUD.textContent = "Score: 0";
  levelText.textContent = "Level 1/5";
}

// Load Level

function loadLevel() {
  const level = levels[currentLevel];

// HUD

  levelText.textContent = `Level ${currentLevel + 1}/5`;
  scoreHUD.textContent = `Score: ${score}`;

  gameArea.style.minHeight = "60vh";

  taskText.innerHTML = `
    ${level.task}<br>
    <small>${level.description}</small><br>
    <strong>${level.vision} diopters</strong>
  `;

  blurImage.src = level.image;
  blurImage.style.filter = `grayscale(100%) blur(${level.blur}px)`;

  feedback.textContent = "";
  nextBtn.style.display = "none";
  answersDiv.innerHTML = "";

  level.answers.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;

    btn.onclick = () => {
      feedback.textContent =
        option === level.correct ? "✔ Correct" : "✖ Incorrect";

      if (option === level.correct) score++;

      scoreHUD.textContent = `Score: ${score}`;
      nextBtn.style.display = "inline-block";
    };

    answersDiv.appendChild(btn);
  });
}

// Next

nextBtn.onclick = () => {
  currentLevel++;

  if (currentLevel < levels.length) {
    loadLevel();
  } else {
    endGame();
  }
};

// End

function endGame() {
  hideAllScreens();
  endScreen.style.display = "flex";

  scoreText.textContent = `You scored ${score} / ${levels.length}`;

  let message = "";

  if (score === 5) {
    message = "Excellent visual perception accuracy 👁️";
  } else if (score >= 3) {
    message = "Good adaptation to visual blur 👍";
  } else {
    message = "You experienced significant perceptual difficulty — similar to uncorrected myopia 😖";
  }

  achievementBox.textContent = message;
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


