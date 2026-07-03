let time = 1500;
let isRunning = false;

setInterval(function () {
  if (isRunning === true) {
    
    time=time-1;
    
    minutes = Math.floor(time/60);
    seconds = time % 60;
    
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    
    document.getElementById("time").textContent = minute + ":" + seconds;
  }
  
},1000);
    
