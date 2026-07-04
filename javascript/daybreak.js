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

const sunriseTop = [255, 209, 220];
const sunriseBottom = [255, 230, 167];

const middayTop = [135, 206, 235];
const middayBottom = [255, 255, 255];

const sunsetTop = [255, 126, 95];
const sunsetBottom = [44, 83, 100];

console.log("JS Loaded!");





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

  sun.style.opacity = 1;
  let p = getProgress();
  let x = lerp(10, 85, p);
  let y = 80 - Math.sin(p * Math.PI) * 60;

  sun.style.transform = `translate(${x}vw, ${y}vh)`;
}

function startSunsetToNightTransition() {
  nightTransition = true;

  setTimeout(() => {
    startBreak();
  }, 1500);
}





function refreshUI() {
  updateDisplay();
  updateMessage();
  updateButtons();
  updateSky();
  updateSun();
}

function getProgress() {
  if(appState === "focus") {
     return (focusLength - time) / focusLength;
  } 
  if (appState === "break") {
    return (breakLength - time) / breakLength;
  }
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
  
  time = Math.max(0, time - 0.25);
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
