const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const origin = { x: canvas.width / 2, y: canvas.height / 2};

let vectorA = { x: 150, y: 100 };

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

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawArrow(vectorA, "#ff6b47");
}

draw();
