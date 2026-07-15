const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const center = { x: canvas.width / 2, y: canvas.height / 2};
const sphereRadius = 150;

const normal = {
  x: Math.cos(angleRad),
  y: Math.sin(angleRad),
  z: 0
};

const handlePos = {
  x: center.x + light3D.x * displayDistance,
  y: center.y - light3D.y * displayDistnace
};

const dot = normal.x * light3D.x +
  normal.y * light3D.y +
  normal.z * light3D.x;

const angle = Math.acos(dot);


let lightDir = { x: -1, y: 1};
let light3D = { x: 0, y: 1, z: 1};
let isDraggingLight = false;

function getMousePos(event) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  return {
    x: mouseX - center.x,
    y: -(mouseY - center.y)
  };
}

function distance (p1, p2) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

canvas.addEventListener("mousedown", (event) => {
  const mousePos = getMousePos(event);
  if (distance(mousePos, lightHandle) < 20) {
    isDraggingLight = true;
  }
});

canvas.addEventListener("mousemove", (event) => {
  if (!isDraggingLight) return;
  lightHandle = getMousePos(event);
  draw();
});

canvas.addEventListener("mouseup", () => {
  isDraggingLight = false;
});

function normalise(v) {
  const mag = Math.sqrt(v.x * v.x + v.y * v.y);
  return { x: v.x / mag, y: v.y / mag};
}

function drawSphere() {
  const unitLight = normalise(lightHandle);

for (let angleDeg = 0; angleDeg < 360; angleDeg++) {
  const angleRad = angleDeg * (Math.PI / 180);
  const normal = { x: Math.cos(angleRad), y: Math.sin(angleRad) };

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

function drawLightHandle() {
  const unitLight = normalise(lightHandle);
  const displayDistance = sphereRadius + 70;
  
  const handlePos = {
    x: center.x + lightHandle.x,
    y: center.y - lightHandle.y
  };

  ctx.fillStyle = "#ffd54f";
  ctx.beginPath();
  ctx.arc(handlePos.x, handlePos.y, 14, 0, Math.PI * 2);
  ctx.fill();
  };

  ctx.fillStyle = "#ffd54f";
  ctx.beginPath();
  ctx.arc(handlePos.x, handlePos.y, 14, 0, Math.PI * 2);
  ctx.fill();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSphere();
  drawLightHandle();
}

draw();

function updateLightFromHandle() {
  const azimuth = lightHandle.x * 0.01;
  const elevation = lightHandle.y * 0.01;

  light3D.x = Math.cos(elevation) * Math.cos(azimuth);
  light3D.y = Math.sin(elevation);
  light3D.z = Math.cos(elevation) * Math.sin(azimuth);
}



