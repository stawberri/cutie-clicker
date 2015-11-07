var clicker = document.getElementById('clicker');
var cutie = document.getElementById('cutie');

clicker.onmousedown = function() {
  cutie.className = 'clicked';
};

clicker.onmouseup = function() {
  cutie.className = '';
};
