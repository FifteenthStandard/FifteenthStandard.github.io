const COLS = 4;
const ROWS = 4;

const sizes = [
  { size: 512, cell: 102, margin: 52 },
  { size: 192, cell: 38, margin: 20 },
  { size: 64, cell: 12, margin: 8 },
  { size: 32, cell: 6, margin: 4 },
];

const style = getComputedStyle(document.documentElement);
const background = style.getPropertyValue('--background').trim();
const foreground = style.getPropertyValue('--foreground').trim();

let painting = false;
let paintColor = foreground;

function getCell(event) {
  const canvas = event.currentTarget;
  const rect = canvas.getBoundingClientRect();
  const { cell, margin } = sizes[0];

  const boundLeft = rect.left + margin;
  const boundRight = boundLeft + cell * COLS;
  const boundTop = rect.top + margin;
  const boundBottom = boundTop + cell * ROWS;

  if (event.clientX < boundLeft || event.clientX > boundRight || event.clientY < boundTop || event.clientY > boundBottom) {
    return null;
  }

  const x = Math.floor((event.clientX - boundLeft) / cell);
  const y = Math.floor((event.clientY - boundTop)  / cell);

  return { x, y };
};

function paint(event) {
  const cell = getCell(event);
  if (!cell) return;

  const { x, y } = cell;

  for (const { size, cell, margin } of sizes) {
    const canvas = document.getElementById(`logo-${size}`);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = paintColor;
    ctx.fillRect(margin + x * cell, margin + y * cell, cell, cell);
  }
};

function handleMouseDown(event) {
  event.preventDefault();
  paintColor = event.button === 2 ? background : foreground;
  painting = true;
  paint(event);
};

function handleMouseMove(event) {
  if (!painting) return;
  paint(event);
};

function handleMouseUp() {
  painting = false;
};

window.addEventListener('mouseup', handleMouseUp);