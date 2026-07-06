const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const origin = { x: canvas.width / 2, y: canvas.height / 2};

let vectorA = { x: 150, y: 100 };
let vectorB = { x: -80, y: 130};

let draggedVector = null;

function getMousePos(event) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  return {
    x: mouseX - origin.x,
    y: -(mouseY - origin.y)
  };
}

function distance(p1, p2) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

canvas.addEventListener("mousedown", (event) => {
  const mousePos = getMousePos(event);
  console.log("mousePos:", mousePos);
  console.log("vectorA:", vectorA);
  console.log("distance to A:", distance(mousePos, vectorA));

  if (distance(mousePos, vectorA) < 20) {
    draggedVector = "A";
  } else if (distance(mousePos, vectorB) < 20) {
    draggedVector = "B";
  }
});

canvas.addEventListener("mousemove", (event) => {
  if (draggedVector === null) return;

  const mousePos = getMousePos(event);

  if (draggedVector === "A") {
    vectorA = mousePos;
  } else if (draggedVector === "B") {
    vectorB = mousePos;
  }

  draw();
});

canvas.addEventListener("mouseup", () => {
  draggedVector = null;
});

function toCanvasSpace(point) {
  return {
    x: origin.x + point.x,
    y: origin.y - point.y
  };
}

function drawArrow(vector, color) {
  const tip = toCanvasSpace(vector);

  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 3;

  const angle = Math.atan2(tip.y - origin.y, tip.x - origin.x);
  const headLength = 12;

  ctx.beginPath();
  ctx.moveTo(tip.x, tip.y);
  ctx.lineTo(origin.x, origin.y);
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(tip.x, tip.y);
  ctx.lineTo(
    tip.x - headLength * Math.cos(angle - Math.PI / 6),
    tip.y - headLength * Math.sin(angle - Math.PI / 6)
    );
  ctx.lineTo(
    tip.x - headLength * Math.cos(angle + Math.PI / 6),
    tip.y - headLength * Math.sin(angle + Math.PI / 6)
    );
  ctx.closePath();
  ctx.fill();
}

function dotProduct(v1, v2) {
  return v1.x * v2.x + v1.y * v2.y;
}

function magnitude(v) {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

function angleBetween(v1, v2) {
  const dot = dotProduct(v1, v2);
  const mag1 = magnitude(v1);
  const mag2 = magnitude(v2);
  const cosTheta = dot / (mag1 * mag2);
  const radians = Math.acos(cosTheta);
  return radians * (180 / Math.PI);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawArrow(vectorA, "#ff6b47");
  drawArrow(vectorB, "#4a7fff");

  const dot = dotProduct(vectorA, vectorB);
  const angle = angleBetween(vectorA, vectorB);

  ctx.fillStyle = "#222";
  ctx.font = "16px sans-serif";
  ctx.fillText(`Dot Product: ${dot.toFixed(1)}`, 20, 30);
  ctx.fillText(`Angle: ${angle.toFixed(1)}°`, 20, 55);
}

draw();
