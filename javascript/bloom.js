let completedTasks = 0;

var myNodelist = document.getElementsByTagName("li");
for (var i = 0; i < myNodelist.length; i++) {
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className="close";
  span.appendChild(txt);
  myNodelist[i].appendChild(span);
}

var close = document.getElementsByClassName("close");
for (var i = 0; i < close.length; i++) {
  close[i].onclick = function() {
    var div = this.parentElement;
    div.style.display = "none";
  }
}

var list = document.querySelector('ul');
list.addEventListener('click', function(ev) {
  if (ev.target.tagName === 'LI') {
    ev.target.classList.toggle('checked');
    
    if (ev.target.classList.contains('checked')) {
      completedTasks++;
    } else {
      completedTasks--;
    }

    updatePlant();
    updateWeather();

    for (let i = 0; i <5; i++) {
      createSparkle();
    }
  }
}, false);

function updatePlant() {
  var plant = document.getElementById("plant");

  if (completedTasks <= 0) {
    plant.textContent = "🌰";
  }
  else if (completedTasks <= 2) {
    plant.textContent = "🌱";
  }
  else if (completedTasks <= 4) {
    plant.textContent = "🌿";
  }
  else {
    plant.textContent = "🌳";
  }
}

function createSparkle() {
  const sparkle = document.createElement("div");
  sparkle.className = "sparkle";
  sparkle.textContent = "✨";

  const randomX = Math.random() * 300;
  const randomY = Math.random() * 200;
  sparkle.style.left = randomX + "px";
  sparkle.style.bottom = randomY + "px"

  document.getElementById("sparkles").appendChild(sparkle);

  setTimeout(function () {
    sparkle.remove();
  }, 1200);

}

function updateWeather() {
  var weather = document.getElementById("weather");
   if (completedTasks <= 0) {
    weather.textContent = "🌧️";
  }
  else if (completedTasks <= 2) {
    weather.textContent = "🌤️";
  }
  else if (completedTasks <= 4) {
    weather.textContent = "☀️";
  }
  else {
    weather.textContent = "🌈";
  }
}

function newElement() {
  var li = document.createElement("li");
  var inputValue = document.getElementById("myInput").value;
  var t = document.createTextNode(inputValue);
  li.appendChild(t);
  if (inputValue === '') {
    alert("Please enter something");
  } else {
    document.getElementById("myUL").appendChild(li);
    document.getElementById("myInput").value = "";
  }

var span = document.createElement("SPAN");
var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);

span.onclick = function () {
  this.parentElement.style.display = "none";
} ;

}
