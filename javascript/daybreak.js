let time = 0;
let focusLength = 1500;
let breakLength = 300;
let progress = (focusLength - time) / focusLength; 
let nightTransition = false;
  
let isRunning = false; 
let appState = "ready";
let breakPhase = "night";  

const message = document.getElementById("message");
const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const resetButton = document.getElementById("resetButton");

const sky = document.getElementById("sky");
const sun = document.getElementById("sun");
const moon = document.getElementById("moon");
const starsContainer = document.getElementById("stars");

let stars = [];

const sunriseTop = [255, 209, 220];
const sunriseBottom = [255, 230, 167];

const middayTop = [135, 206, 235];
const middayBottom = [255, 255, 255];

const sunsetTop = [255, 126, 95];
const sunsetBottom = [44, 83, 100];

console.log("JS Loaded!");

const CITY_NS = "http://www.w3.org/2000/svg";
const groundY = 220;

refreshUI();



const backBuildingsData = [
  { x: -10, width: 120, height: 90 },
  { x: 100, width: 100, height: 120 },
  { x: 190, width: 140, height: 80 },
  { x: 320, width: 110, height: 130 },
  { x: 420, width: 130, height: 95 },
  { x: 540, width: 100, height: 140 },
  { x: 630, width: 150, height: 85 },
  { x: 770, width: 120, height: 125 },
  { x: 880, width: 130, height: 100 },
];

const frontBuildingsData = [
  { x: 0,   width: 50, height: 140 },
  { x: 52,  width: 35, height: 90 },
  { x: 89,  width: 60, height: 170, spire: true },
  { x: 151, width: 40, height: 110 },
  { x: 193, width: 70, height: 205, spire: true },
  { x: 265, width: 45, height: 130 },
  { x: 312, width: 55, height: 160 },
  { x: 369, width: 35, height: 95 },
  { x: 406, width: 65, height: 185 },
  { x: 473, width: 40, height: 120 },
  { x: 515, width: 80, height: 215, spire: true },
  { x: 597, width: 50, height: 140 },
  { x: 649, width: 60, height: 175 },
  { x: 711, width: 45, height: 100 },
  { x: 758, width: 70, height: 190 },
  { x: 830, width: 55, height: 150 },
  { x: 887, width: 40, height: 115 },
  { x: 929, width: 65, height: 180 },
];

function buildCity() {
  const backGroup = document.getElementById("backBuildings");
  const frontGroup = document.getElementById("frontBuildings");

  backBuildingsData.forEach(b => {
    const rect = document.createElementNS(CITY_NS, "rect");
    rect.setAttribute("x", b.x);
    rect.setAttribute("y", groundY - b.height);
    rect.setAttribute("width", b.width);
    rect.setAttribute("height", b.height);
    rect.setAttribute("class", "building-back");
    backGroup.appendChild(rect);
  });

  frontBuildingsData.forEach(b => {
    const y = groundY - b.height;

    const rect = document.createElementNS(CITY_NS, "rect");
    rect.setAttribute("x", b.x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", b.width);
    rect.setAttribute("height", b.height);
    rect.setAttribute("class", "building-front");
    frontGroup.appendChild(rect);

    if (b.spire) {
      const spire = document.createElementNS(CITY_NS, "rect");
      spire.setAttribute("x", b.x + b.width / 2 - 2);
      spire.setAttribute("y", y - 25);
      spire.setAttribute("width", 4);
      spire.setAttribute("height", 25);
      spire.setAttribute("class", "spire");
      frontGroup.appendChild(spire);
    }

    addWindows(frontGroup, b.x, y, b.width, b.height);
  });
}

function addWindows(group, bx, by, bw, bh) {
  const margin = 6, spacingX = 14, spacingY = 18, size = 6;

  for (let wy = by + margin; wy < by + bh - margin; wy += spacingY) {
    for (let wx = bx + margin; wx < bx + bw - margin; wx += spacingX) {
      const win = document.createElementNS(CITY_NS, "rect");
      win.setAttribute("x", wx);
      win.setAttribute("y", wy);
      win.setAttribute("width", size);
      win.setAttribute("height", size);
      win.setAttribute("class", Math.random() < 0.65 ? "window lit" : "window");
      group.appendChild(win);
    }
  }
}

buildCity()





function pauseTimer() {
  if (isRunning) {
    isRunning = false;

    if (appState === "focus") {
      pauseButton.textContent = "Resume Session";
    } else if (appState === "break") {
      pauseButton.textContent = "Resume Break";
    }
  } else  {
    isRunning = true;

    if (appState === "focus") {
      pauseButton.textContent = "Pause Session";
    } else if (appState === "break") {
      pauseButton.textContent = "Pause Break";
    }
  }
}

function resetTimer() {
  isRunning = false;
  appState = "ready";
  time = focusLength;

  refreshUI();
}




function startFocusSession() {
  console.log("Start button pressed");
  
  appState = "focus";
  time = focusLength;
  isRunning = true;
  refreshUI();
  }

function finishFocusSession() {
  appState = "complete";
  isRunning = false;
  refreshUI();

  startSunsetToNightTransition();
  setTimeout ( function() {
    startBreak();
  }, 3000);
}

function startBreak() {
  appState = "break";
  time = breakLength;
  isRunning = true;
  
  refreshUI();
  nightTransition = false;

  sky.classList.add("night-active");
}

function finishBreak() {
  isRunning = false;
  refreshUI();
  setTimeout (function () {
    returnToReady();
  }, 3000);
}

function returnToReady() {
  appState = "ready";
  time = focusLength;
  isRunning = false;

  sky.classList.remove("night-active");
  
  refreshUI();
}





setInterval(function () {
  if (isRunning === true) {    
    time = time - 1;
    refreshUI();
    checkTimerFinished();
  }  
}, 1000);

function updateDisplay() {
  let totalSeconds = Math.ceil(time);
  
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;

  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  document.getElementById("time").textContent = minutes + ":" + seconds;
}

function checkTimerFinished() {
  if (time === 0) {
      if (appState === "focus") {
        finishFocusSession();
      } else if (appState === "break") {
        finishBreak();
      }
  }
}




function updateSun() {
  if (appState !== "focus") {
    sun.style.opacity = 0;
    return;
  }

  sun.style.fontSizw = "80px";
  
  sun.style.opacity = 1;
  
  let p = getProgress();
  
  let x = lerp(10, 85, p);
  let y = 80 - Math.sin(p * Math.PI) * 60;

  sun.style.transform = `translate(${x}vw, ${y}vh)`;
}

function updateMoon() {
  if (appState !== "break") {
    moon.style.opacity = 0;
    return;
  }

  moon.style.opacity = 1;

  let p = getProgress();

  let x = lerp(15, 85, p);
  let y = 25 - Math.sin(p * Math.PI) * 10;

  moon.style.transform = `translate(${x}vw, ${y}vh)`;
}

function createStars(count = 80) {
  for (let i = 0; i < count; i++) {
    let star = document.createElement("div");
    star.className = "star";

    star.style.left = Math.random() * 100  + "vw";
    star.style.top = Math.random() * 100 + "vh";
    star.dataset.brightness = Math.random();
    star.style.opacity = 0;

    starsContainer.appendChild(star);
    stars.push(star);
  }
}

createStars();

function updateStars() {
  let isNight = (appState === "break");

  stars.forEach(star => {

    if (isNight) {
      star.style.opacity = star.dataset.brightness;
    } else {
      star.style.opacity = 0;
    }
  });
 }

function createShootingStar() {
  if (appState !== "break") return;

  let star = document.createElement("div");
  star.className = "shooting-star";

  star.style.top = Math.random() * 40 + "%";
  star.style.left = "100%";

  document.body.appendChild(star);

  star.animate([
    {transform: "translateX(0)", opacity: 1},
    {transform: "translateX(-120vw)", opacity: 0}
    ], {
    duration: 1200,
    easing: "ease-out"
  });

  setTimeout(() => star.remove(), 1200);
}

function startSunsetToNightTransition() {
  nightTransition = true;

  setTimeout(() => {
    startBreak();
  }, 1500);
}

setInterval(() => {
  if (appState === "break" && Math.random() < 0.2) {
    createShootingStar();
  }
}, 2000);

function createCloud() {
  let cloud = document.createElement("div");
  cloud.className = "cloud";
  cloud.style.top = (10 + Math.random() * 30) + "vh";
  cloud.style.left = "100%";
  document.body.appendChild(cloud);

  let duration = 20000 + Math.random() * 15000;

  cloud.animate([
    { transform: "translateX(0)" },
    { transform: "translateX(-140vw)" }
    ], {
    duration: duration,
    easing: "linear"
  });

  setTimeout(() => cloud.remove(), duration);
}

setInterval(() => {
  if (Math.random() < 0.3) createCloud();
}, 8000);

function createBird() {
  if (appState !== "focus") return;

  let bird = document.createElement("div");
  bird.className = "bird";
  bird.textContent = "🕊️";
  bird.style.top = (15 + Math.random() * 25) + "vh";
  bird.style.left = "100%";
  document.body.appendChild(bird);

  let duration = 6000 + Math.random() * 3000;

  bird.animate([
    { transform: "translateX(0)" },
    { transform: "translateX(-120vw)" }
    ], {
    duration: duration,
    easing: "linear"
  });

  setTimeout(() => bird.remove(), duration);
}

setInterval(() => {
  if (appState === "focus" && Math.random() < 0.2) createBird();
}, 5000);

function createPlane() {
  if (appState !== "focus") return;

  let plane = document.createElement("div");
  plane.className = "plane";
  plane.textContent = "✈️";
  plane.style.top = (5 + Math.random() * 15) + "vh";
  plane.style.left = "100%";
  document.body.appendChild(plane);

  let duration = 15000;

  plane.animate([
    { transform: "translateX(0)" },
    { transform: "translateX(-130vw)" }
    ], { 
    duration: duration,
    easing: "linear"
  });

  setTimeout(() => plane.remove(), duration);
}

setInterval(() => {
  if (appState === "focus" && Math.random() < 0.05) createPlane()
}, 10000);




function refreshUI() {
  updateDisplay();
  updateMessage();
  updateButtons();
  updateSky();
  
  updateSun();
  updateMoon();
  updateStars();
}

function getProgress() {
  if(appState === "focus") {
     return (focusLength - time) / focusLength;
  } 
  if (appState === "break") {
    return (breakLength - time) / breakLength;
  }
  return 0;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function mixColor(c1, c2, t) {
  return [
    Math.round(lerp(c1[0], c2[0], t)),
    Math.round(lerp(c1[1], c2[1], t)),
    Math.round(lerp(c1[2], c2[2], t))
  ];
}

function updateSky() {
  let rawP = getProgress();
  
  let p = Math.min(1, Math.max(0, rawP));
  
  let top, bottom;

  if (nightTransition) {
    top = sunsetBottom;
    bottom = [15, 20, 40];
  } else {
    if (p < 0.5) {
      let t = p / 0.5;
      top = mixColor(sunriseTop, middayTop, t);
      bottom = mixColor(sunriseBottom, middayBottom, t);
    } else {
      let t = (p - 0.5) / 0.5;
      top = mixColor(middayTop, sunsetTop, t);
      bottom = mixColor(middayBottom, sunsetBottom, t);
    }
  }

  sky.style.background = `
    linear-gradient(to top,
    rgb(${bottom[0]}, ${bottom[1]}, ${bottom[2]}),
    rgb(${top[0]}, ${top[1]}, ${top[2]})
    )
    `;
}



    
function updateMessage() {
    if (appState === "ready") {
      message.textContent = "Ready to begin?";
    }
  else if (appState === "focus") {
    message.textContent = "Stay Focused!";
  }
  else if (appState === "complete") {
    message.textContent = "Session Complete!";
  }
  else if (appState === "break") {
    message.textContent = "Enjoy your break";
  }
  else {
    message.textContent = "";
  }
}


function updateButtons() {
  if (appState === "ready") {
    startButton.textContent = "Start Focus";
    startButton.style.display = "inline-block";
    
    pauseButton.style.display = "none";
    resetButton.style.display = "none";
  }
  else if (appState === "focus") {
    startButton.style.display = "none";
    
    pauseButton.textContent = isRunning ? "Pause Session" : "Resume Session";
    pauseButton.style.display = "inline-block";
    
    resetButton.textContent = "Reset Session";
    resetButton.style.display = "inline-block";
  }
  else if (appState === "complete") {
    startButton.textContent = "Start Break";
    startButton.style.display = "inline-block";
    
    pauseButton.style.display = "none";
    resetButton.style.display = "none";
  }
  else if (appState === "break") {
    startButton.style.display = "none";
    
    pauseButton.textContent = isRunning ? "Pause Break" : "Resume Break";
    pauseButton.style.display = "inline-block";
    
    resetButton.textContent = "Skip Break";
    resetButton.style.display = "inline-block";
  }
}

window.startFocusSession = startFocusSession;
window.pauseTimer = pauseTimer;
window.resetTimer = resetTimer;
