window.currentPlayer = null;
window.currentTimer = 0;

window.play = function play() {
  var interval = 10;
  var container = document.querySelector('.container');

  function updateTimer() {
    window.currentTimer += interval;
    container.innerHTML = window.currentTimer;
  }

  window.currentPlayer = setInterval(updateTimer, interval);
  updateTimer();
};

window.stop = function stop() {
  clearInterval(window.currentPlayer);
};
