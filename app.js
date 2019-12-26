let countdown,
    lastSetTimer,
    timerCurrentValue;

const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const navButtons = document.querySelectorAll('[data-time]');
const timerControls = document.getElementById('timer_controls');

let isNotificationsAllowed = false;
let returnBtnState = false;

resolveNotificationsPermission();

function timer(seconds) {

  //show timer controls
  timerControls.classList.add('active');

  if (seconds <= 0 ) return; 

  // clear any existing timers
  clearInterval(countdown);

  const then = Date.now() + seconds * 1000;
  displayTimeLeft(seconds);
  displayEndTime(then);

  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000);
          timerCurrentValue = secondsLeft;
    // check if we should stop it!
    if(secondsLeft < 0) {
      clearInterval(countdown);
      return;
    }
    // display it
    displayTimeLeft(secondsLeft);
  }, 1000);
}

function displayTimeLeft(seconds) {
  if (seconds <= 0) {
    timerDisplay.classList.add('pulse');
    playSound('tone');
    if (isNotificationsAllowed) notify();
  }
  else {
    timerDisplay.classList.remove('pulse');
  }
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = seconds % 60;
  const display = `${minutes}:${remainderSeconds < 10 ? '0' : '' }${remainderSeconds}`;
  document.title = display;
  
  timerDisplay.textContent = display;
}

function displayEndTime(timestamp) {
  const end = new Date(timestamp);
  const hour = end.getHours();
  const adjustedHour = hour > 12 ? hour - 12 : hour;
  const minutes = end.getMinutes();
  endTime.innerHTML = `Be Back At <span class="end_time_val">${adjustedHour}:${minutes < 10 ? '0' : ''}${minutes}</span>`;
}

function startTimer() {
  const seconds = parseInt(this.dataset.time);
  lastSetTimer = seconds;
  timer(seconds);
}

navButtons.forEach(button => button.addEventListener('click', startTimer));
document.customForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const mins = this.minutes.value;
  lastSetTimer = mins * 60;
  timer(mins * 60);
  this.reset();
});

function changeReturnBtnState(state){
  returnBtnState = state;
}

function resolveNotificationsPermission() {
    if (!("Notification" in window)) {
      console.log("This browser doesn't support system notifications!");
    } else if (Notification.permission === "granted") {
      isNotificationsAllowed = true;
    } else if (Notification.permission !== "denied"){
      Notification.requestPermission(function(permission){
        if (permission === "granted") isNotificationsAllowed = true;
      });
    }
}

function notify() {
    var notification = new Notification("Time's Up Now ⏰",{
      body: "Click to set a new timer",
    });

    notification.onclick = function(){
      window.open("https://pomodoro.lyutskanov.info");
    }
}

function playSound(filename){   
  document.getElementById("sound").innerHTML='<audio autoplay="autoplay"><source src="' + filename + '.mp3" type="audio/mpeg" /><source src="' + filename + '.ogg" type="audio/ogg" /><embed hidden="true" autostart="true" loop="false" src="' + filename +'.mp3" /></audio>';
}