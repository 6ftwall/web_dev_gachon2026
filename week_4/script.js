// Default initial colors (6 colored boxes requirement)
const defaultColors = ["#FF5733", "#33FF57", "#3357FF", "#F39C12", "#9B59B6", "#1ABC9C"];

const palette = document.getElementById("palette");
const colorInput = document.getElementById("colorInput");
const addColorBtn = document.getElementById("addColorBtn");
const exportBtn = document.getElementById("exportBtn");

// 1. Load colors from localStorage or fallback to defaults
function loadColors() {
  const savedColors = localStorage.getItem("myColorPalette");
  if (savedColors) {
    return JSON.parse(savedColors);
  }
  return [...defaultColors];
}

// 2. Save current palette to localStorage
function savePalette() {
  const currentBoxes = document.querySelectorAll(".color-box");
  const colors = Array.from(currentBoxes).map(box => box.dataset.color);
  localStorage.setItem("myColorPalette", JSON.stringify(colors));
}

// 3. Helper function to create a color div box
function createColorBox(colorValue) {
  const box = document.createElement("div");
  box.classList.add("color-box");
  box.style.backgroundColor = colorValue;
  box.dataset.color = colorValue;

  const hexText = document.createElement("span");
  hexText.textContent = colorValue; // Show hex code when expanded
  box.appendChild(hexText);

  // Requirement: Click box -> toggle expansion
  box.addEventListener("click", () => {
    box.classList.toggle("expanded");
  });

  // Requirement: Double-click box to remove it (dblclick event)
  box.addEventListener("dblclick", () => {
    box.remove();
    savePalette(); // Update localStorage after removal
  });

  return box;
}

// 4. Render initial set of boxes
function initPalette() {
  palette.innerHTML = "";
  const colors = loadColors();
  colors.forEach(color => {
    const box = createColorBox(color);
    palette.appendChild(box);
  });
}

// 5. Add new color from text input
addColorBtn.addEventListener("click", () => {
  const newColor = colorInput.value.trim();
  if (newColor !== "") {
    const box = createColorBox(newColor);
    palette.appendChild(box);
    savePalette(); // Save to localStorage
    colorInput.value = "";
  }
});

// 6. Bonus: Export palette as PNG using html2canvas
exportBtn.addEventListener("click", () => {
  html2canvas(palette).then(canvas => {
    const link = document.createElement("a");
    link.download = "color-palette.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
});

// Initialize on page load
initPalette();