let time = 0;
let focusLength = 1500;
let breakLength = 300;

let isRunning = false;
let appState = "ready";
let breakPhase = "night";

const message = document.getElementById("message");
const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const resetButton = document.getElementById("resetButton");
const sky = document.getElementById("sky");

console.log("JS Loaded!");



function pauseTimer() {
  isRunning = false;
}

function resetTimer() {
  isRunning = false;
  appState = "ready";
  time = focusLength;

  refreshUI();
}




function startFocusSession() {
  appState = "focus";
  time = focusLength;
  isRunning = true;
  refreshUI();
  }

function finishFocusSession() {
  appState = "complete";
  isRunning = false;
  refreshUI();
  setTimeout ( function() {
    startBreak();
  }, 3000);
}

function startBreak() {
  appState = "break";
  time = breakLength;
  isRunning = true;
  refreshUI();
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
  refreshUI();
}



setInterval(function () {
  if (isRunning === true) {
    
    time=time-1;
    refreshUI();
  }
  
},1000);

function updateDisplay() {
  let minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  document.getElementById("time").textContent = minutes + ":" + seconds;
}

function checkTimerFinished() {
  if (time === 0) {
    finishFocusSession();
  }
}



function refreshUI() {
  updateDisplay();
  updateMessage();
  updateButtons();
  updateSky();
}

function updateSky() {
  if (appState === "ready"){
    sky.className = "sunrise";
    }
  else if (appState === "focus") {
    if (time > 1200) {
      sky.className = "sunrise";
    }
    else if (time > 900) {
      sky.className = "morning";
    }
    else if (time > 600) {
      sky.className = "midday";
    }
    else if (time > 300) {
      sky.className = "evening";
    }
    else if (time > 0) {
      sky.className = "sunset";
    }
    else {
      sky.className = "night";
    }
  }
  else if (appState === "complete") {
    sky.className = "sunset-to-night";
  }
  else if (appState === "break") {
    if (time % 10 === 0) {
      breakPhase = (breakPhase === "night") ? "dawn" : "night";
    } 
      sky.className = breakPhase;
    
  }
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
    
    pauseButton.textContent = "Pause Session";
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
    
    pauseButton.textContent = "Pause Break";
    pauseButton.style.display = "inline-block";
    
    resetButton.textContent = "Skip Break";
    resetButton.style.display = "inline-block";
  }
}

