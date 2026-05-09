document.addEventListener("DOMContentLoaded", () => {
  showScreen(introScreen);
});

let currentLevel = 0;
let score = 0;
let fontSize = 100;
let hintsOn = false;

// Screens

const introScreen = document.getElementById("introScreen");
const gameArea = document.getElementById("gameArea");
const endScreen = document.getElementById("endScreen");

// UI

const levelText = document.getElementById("levelText");
const scoreHUD = document.getElementById("scoreHUD");

const taskText = document.getElementById("taskText");
const answers = document.getElementById("answers");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");

const targetBox = document.getElementById("targetColorBox");
const endInsight = document.getElementById("endInsight");

const hintToggle = document.getElementById("hintToggle");

// Hint Toggle

if (hintToggle) {
  hintToggle.addEventListener("change", () => {
    hintsOn = hintToggle.checked;
    document.body.classList.toggle("hints-on", hintsOn);
  });
}

// Colours

const colorSets = [

  {
    name: "Protanopia (Red Weakness)",
    filter: "protanopia(1)",

    target: {
      name: "Red",
      color: "#ff0000"
    },

    options: [
      { name: "Red", color: "#a56868", correct: true },
      { name: "Red-like", color: "#c24a4a", correct: false },
      { name: "Red-like", color: "#8a3f3f", correct: false },
      { name: "Red-like", color: "#d06a6a", correct: false }
    ]
  },

  {
    name: "Deuteranopia (Green Weakness)",
    filter: "deuteranopia(1)",

    target: {
      name: "Green",
      color: "#00ff1e"
    },

    options: [
      { name: "Green", color: "#7cb482", correct: true },
      { name: "Green-like", color: "#4fa85a", correct: false },
      { name: "Green-like", color: "#3f7f4f", correct: false },
      { name: "Green-like", color: "#6ab87a", correct: false }
    ]
  },

  {
    name: "Tritanopia (Blue Weakness)",
    filter: "tritanopia(1)",

    target: {
      name: "Blue",
      color: "#0037ff"
    },

    options: [
      { name: "Blue", color: "#6a7cbd", correct: true },
      { name: "Blue-like", color: "#4f66b8", correct: false },
      { name: "Blue-like", color: "#3f4fa6", correct: false },
      { name: "Blue-like", color: "#6a7ad6", correct: false }
    ]
  }

];

// Levels

const levels = [];

colorSets.forEach(set => {

  for (let i = 0; i < 2; i++) {

    levels.push({
      modeName: set.name,
      filter: set.filter,
      target: set.target,
      options: shuffle([...set.options])
    });

  }

});

// Start Game

function startGame() {

  currentLevel = 0;
  score = 0;

  showScreen(gameArea);

  loadLevel();
}

// Load Level

function loadLevel() {

  const level = levels[currentLevel];

  levelText.textContent =
    `Level ${currentLevel + 1}`;

  scoreHUD.textContent =
    `Score: ${score}`;

  targetBox.style.background =
    level.target.color;

  targetBox.style.filter = "none";

  taskText.innerHTML = `
    <b>Identify the colour under:</b><br>
    ${level.modeName}
  `;

  answers.innerHTML = "";
  feedback.textContent = "";
  nextBtn.style.display = "none";

  level.options.forEach(option => {

    const tile = document.createElement("div");

    tile.className = "answer-box";

    tile.style.background =
      option.color;

    // Apply filter only to answers
    tile.style.filter =
      level.filter;

    // Hint label

    const label =
      document.createElement("span");

    label.className = "hint-label";

    label.textContent =
      option.name;

    tile.appendChild(label);

    // Click

    tile.onclick = () => {

      document.querySelectorAll(".answer-box")
        .forEach(t =>
          t.classList.remove("selected")
        );

      tile.classList.add("selected");

      if (option.correct) {

        score++;

        feedback.textContent =
          "✔ Correct";

      } else {

        feedback.textContent =
          "✖ Incorrect";
      }

      scoreHUD.textContent =
        `Score: ${score}`;

      nextBtn.style.display =
        "inline-block";
    };

    answers.appendChild(tile);
  });
}

// Next Level

nextBtn.onclick = () => {

  currentLevel++;

  if (currentLevel < levels.length) {

    loadLevel();

  } else {

    endGame();
  }
};

// End Game

function endGame() {

  showScreen(endScreen);

  document.getElementById("scoreText").textContent =
    `Score: ${score} / ${levels.length}`;

  let badge = "";
  let msg = "";

  if (score === levels.length) {

    badge =
      "🏆 Colour Accessibility Expert";

    msg =
      "You adapted extremely well to altered colour perception conditions.";

  }

  else if (score >= 4) {

    badge =
      "🎨 Visual Pattern Recogniser";

    msg =
      "You successfully adapted to several colour interpretation challenges.";

  }

  else {

    badge =
      "⚠ Perceptual Difficulty Detected";

    msg =
      "The simulation demonstrated how difficult colour-dependent interfaces can become.";
  }

  document.getElementById("achievementBox").innerHTML = `
    <h3>${badge}</h3>
    <p>${msg}</p>
  `;

  endInsight.textContent =
    "This demonstrates how colour vision deficiencies affect real-world design, accessibility, and visual decision-making.\n\n" +

    "Different types of colour blindness can change how users interpret interfaces, charts, maps, and warnings, often leading to confusion or misidentification of important information.\n\n" +

    "Designing with accessibility in mind helps ensure digital systems remain usable and fair for everyone.";
}

// Helpers

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

// Controls

function closeGame() {
  window.location.href = "games.html";
}

function toggleFullscreen() {

  if (!document.fullscreenElement) {

    document.documentElement.requestFullscreen();

  } else {

    document.exitFullscreen();
  }
}

// Screen Switch

function showScreen(screen) {

  introScreen.classList.remove("active");
  gameArea.classList.remove("active");
  endScreen.classList.remove("active");

  screen.classList.add("active");
}

// Accessibility Dropdown

const accessBtn =
  document.getElementById("accessBtn");

const accessMenu =
  document.getElementById("accessMenu");

if (accessBtn && accessMenu) {

  accessBtn.addEventListener("click", () => {

    const isOpen =
      accessMenu.classList.toggle("show");

    accessBtn.setAttribute(
      "aria-expanded",
      isOpen
    );

    accessMenu.setAttribute(
      "aria-hidden",
      !isOpen
    );
  });
}

// Theme Switch

const themeSelect =
  document.getElementById("themeSelect");

if (themeSelect) {

  themeSelect.addEventListener("change", () => {

    document.body.classList.remove(
      "soft",
      "calm",
      "dark"
    );

    if (themeSelect.value === "dark") {
      document.body.classList.add("dark");
    }

    if (themeSelect.value === "soft") {
      document.body.classList.add("soft");
    }

    if (themeSelect.value === "soft-dark") {
      document.body.classList.add(
        "soft",
        "dark"
      );
    }

    if (themeSelect.value === "calm") {
      document.body.classList.add("calm");
    }

    if (themeSelect.value === "calm-dark") {
      document.body.classList.add(
        "calm",
        "dark"
      );
    }
  });
}

// Font Size

function changeFontSize(amount) {

  fontSize += amount * 10;

  if (fontSize < 70) fontSize = 70;
  if (fontSize > 200) fontSize = 200;

  document.body.style.fontSize =
    fontSize + "%";
}

// Font Style

const fontSelect =
  document.getElementById("fontSelect");

if (fontSelect) {

  fontSelect.addEventListener("change", () => {

    const fonts = {

      rajdhani:
        "'Rajdhani', sans-serif",

      atkinson:
        "'Atkinson Hyperlegible', sans-serif",

      sharetech:
        "'Share Tech Mono', monospace"
    };

    document.body.style.fontFamily =
      fonts[fontSelect.value];
  });
}

// High Contrast

const highContrast =
  document.getElementById("highContrast");

if (highContrast) {

  highContrast.addEventListener("change", () => {

    document.body.classList.toggle(
      "high-contrast",
      highContrast.checked
    );
  });
}

// Keyboard Mode

const keyboardMode =
  document.getElementById("keyboardMode");

if (keyboardMode) {

  keyboardMode.addEventListener("change", () => {

    document.body.classList.toggle(
      "keyboard-mode",
      keyboardMode.checked
    );
  });
}

// Reset

const resetBtn =
  document.getElementById("resetBtn");

if (resetBtn) {

  resetBtn.addEventListener("click", () => {

    document.body.className = "";

    document.body.style.fontSize = "100%";

    document.body.style.fontFamily =
      "'Rajdhani', sans-serif";

    fontSize = 100;
    hintsOn = false;

    if (themeSelect)
      themeSelect.value = "default";

    if (fontSelect)
      fontSelect.value = "rajdhani";

    if (highContrast)
      highContrast.checked = false;

    if (keyboardMode)
      keyboardMode.checked = false;

    if (hintToggle)
      hintToggle.checked = false;
  });
}