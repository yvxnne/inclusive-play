document.addEventListener("DOMContentLoaded", () => {

 // Accessibility Menu Toggle
  const accessBtn = document.getElementById("accessBtn");
  const accessMenu = document.getElementById("accessMenu");

  if (accessBtn && accessMenu) {
    accessBtn.addEventListener("click", () => {
      accessMenu.classList.toggle("show");
      accessMenu.style.maxHeight = accessMenu.classList.contains("show") ? "500px" : "0";
      accessMenu.style.opacity = accessMenu.classList.contains("show") ? "1" : "0";
      accessBtn.setAttribute("aria-expanded", accessMenu.classList.contains("show"));
    });
  }

  // Theme Switch
  const themeSelect = document.getElementById("themeSelect");
  if (themeSelect) {
    themeSelect.addEventListener("change", function () {
      document.body.classList.remove("soft", "calm", "dark");
      switch (this.value) {
        case "soft": document.body.classList.add("soft"); break;
        case "soft-dark": document.body.classList.add("soft", "dark"); break;
        case "calm": document.body.classList.add("calm"); break;
        case "calm-dark": document.body.classList.add("calm", "dark"); break;
        case "dark": document.body.classList.add("dark"); break;
      }
    });
  }

  // Font Size
  let fontSize = 100;
  window.changeFontSize = (amount) => {
    fontSize += amount * 10;
    fontSize = Math.min(Math.max(fontSize, 70), 200);
    document.body.style.fontSize = fontSize + "%";
  };

  function changeFontSize(amount) {
  fontSize += amount * 10;
  if (fontSize < 70) fontSize = 70;
  if (fontSize > 200) fontSize = 200;
  document.body.style.fontSize = fontSize + "%";
  document.getElementById("fontStatus").textContent = `Font size set to ${fontSize}%`;
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
      document.body.style.fontFamily = fonts[fontSelect.value] || fonts.rajdhani;
    });
  }

  // High Contrast Mode
  const contrastCheckbox = document.getElementById("highContrast");

contrastCheckbox.addEventListener("change", () => {
  if (contrastCheckbox.checked) {
    document.body.classList.add("high-contrast");
  } else {
    document.body.classList.remove("high-contrast");
  }
});

  // Colour Blind Mode
  const cbSelect = document.getElementById("cbSelect");
  if (cbSelect) {
    cbSelect.addEventListener("change", () => {
      document.documentElement.style.filter = cbSelect.value === "none" ? "none" : `url(#${cbSelect.value})`;
    });
  }

  // Reset Settings
  const resetBtn = document.getElementById("resetBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      document.body.className = "";
      if (themeSelect) themeSelect.value = "default";
      fontSize = 100;
      document.body.style.fontSize = "100%";
      document.body.style.fontFamily = "'Rajdhani', sans-serif";
      if (fontSelect) fontSelect.value = "rajdhani";
      document.documentElement.style.filter = "none";
      if (cbSelect) cbSelect.value = "none";
    });
  }

  // Scroll Progress
  const scrollBar = document.getElementById("scrollProgress");
  if (scrollBar) {
    window.addEventListener("scroll", () => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = (scrollHeight > 0) ? (scrollTop / scrollHeight) * 100 : 0;
      scrollBar.style.width = scrollPercent + "%";
    });
  }

  // Scroll Reveal
  const faders = document.querySelectorAll("section.fade-in");
  if (faders.length > 0) {
    const revealOnScroll = () => {
      const triggerBottom = window.innerHeight * 0.85;
      faders.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop < triggerBottom) section.classList.add("visible");
      });
    };
    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll();
  }

});

// Keyboard Navigation Mode

const keyboardToggle = document.getElementById("keyboardMode");

if (keyboardToggle) {
  keyboardToggle.addEventListener("change", function () {
    document.body.classList.toggle("keyboard-mode", this.checked);
  });
}

accessBtn.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    accessMenu.classList.remove("show");
    accessBtn.setAttribute("aria-expanded", "false");
  }
});

document.addEventListener("keydown", () => {
  document.body.classList.add("keyboard-mode");
});

document.addEventListener("mousedown", () => {
  document.body.classList.remove("keyboard-mode");
});

const accessBtn = document.getElementById("accessBtn");
const accessMenu = document.getElementById("accessMenu");

accessBtn.addEventListener("click", () => {
  const isOpen = accessMenu.classList.contains("show");
  accessMenu.classList.toggle("show");
  accessBtn.setAttribute("aria-expanded", !isOpen);
  accessMenu.setAttribute("aria-hidden", isOpen); // hidden when false
});

