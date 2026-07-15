// -------------------------------------------------------------
//  CANVAS SETUP
// -------------------------------------------------------------

const canvas = document.getElementById("canvas");
canvas.width = 600;
canvas.height = 600;

const ctx = canvas.getContext("2d");

const center = { x: canvas.width / 2, y: canvas.height / 2 };
const sphereRadius = 150;

// -------------------------------------------------------------
//  LIGHT VECTOR (3D)
// -------------------------------------------------------------

let light3D = { x: 0, y: 1, z: 1 };

let lightHandle = { x: 100, y: -100 };
let isDraggingLight = false;

// -------------------------------------------------------------
//  MOUSE POSITION 
// -------------------------------------------------------------

function getMousePos(event) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  return {
    x: mouseX - center.x,
    y: -(mouseY - center.y)
  };
}

// -------------------------------------------------------------
//  NORMALISE A VECTOR SAFELY
// -------------------------------------------------------------

function normalise(v) {
  const mag = Math.sqrt(v.x * v.x + v.y * v.y + (v.z || 0) * (v.z || 0));
  if (mag === 0) return { x: 0, y: 0, z: 0 };
  return { x: v.x / mag, y: v.y / mag, z: (v.z || 0) / mag };
}

// -------------------------------------------------------------
//  UPDATE LIGHT3D FROM HANDLE POSITION
// -------------------------------------------------------------

function updateLightDirection() {
  const azimuth = lightHandle.x * 0.01;
  const elevation = lightHandle.y * 0.01;

  light3D.x = Math.cos(elevation) * Math.cos(azimuth);
  light3D.y = Math.sin(elevation);
  light3D.z = Math.cos(elevation) * Math.sin(azimuth);

  light3D = normalise(light3D);
}

// -------------------------------------------------------------
// 6. DRAW THE SPHERE WITH 3D DOT PRODUCT LIGHTING
// -------------------------------------------------------------

function drawSphere() {
  for (let angleDeg = 0; angleDeg < 360; angleDeg++) {
    const angleRad = angleDeg * (Math.PI / 180);

    const normal = {
      x: Math.cos(angleRad),
      y: Math.sin(angleRad),
      z: 0
    };

    let brightness =
      normal.x * light3D.x +
      normal.y * light3D.y +
      normal.z * light3D.z;

    brightness = Math.max(0, brightness);

    const shade = Math.round(brightness * 255);
    ctx.fillStyle = `rgb(${shade}, ${shade}, ${shade})`;

    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.arc(center.x, center.y, sphereRadius, angleRad, angleRad + (Math.PI / 180));
    ctx.closePath();
    ctx.fill();
  }
}

// -------------------------------------------------------------
//  DRAW THE LIGHT HANDLE (project 3D → 2D)
// -------------------------------------------------------------

function drawLightHandle() {
  const displayDistance = sphereRadius + 70;

  const handlePos = {
    x: center.x + light3D.x * displayDistance,
    y: center.y - light3D.y * displayDistance
  };

  ctx.fillStyle = "#ffd54f";
  ctx.beginPath();
  ctx.arc(handlePos.x, handlePos.y, 14, 0, Math.PI * 2);
  ctx.fill();
}

// -------------------------------------------------------------
//  MOUSE EVENTS
// -------------------------------------------------------------
canvas.addEventListener("mousedown", (event) => {
  const mousePos = getMousePos(event);

  const displayDistance = sphereRadius + 70;
  const handlePos = {
    x: center.x + light3D.x * displayDistance,
    y: center.y - light3D.y * displayDistance
  };

  const dx = mousePos.x - (handlePos.x - center.x);
  const dy = mousePos.y + (handlePos.y - center.y);

  if (Math.sqrt(dx * dx + dy * dy) < 20) {
    isDraggingLight = true;
  }
});

canvas.addEventListener("mousemove", (event) => {
  if (!isDraggingLight) return;

  lightHandle = getMousePos(event);
  updateLightDirection();
  draw();
});

canvas.addEventListener("mouseup", () => {
  isDraggingLight = false;
});

// -------------------------------------------------------------
//  MAIN DRAW FUNCTION
// -------------------------------------------------------------
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSphere();
  drawLightHandle();
}

updateLightDirection();
draw();
