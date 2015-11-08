// Duct taped together simple clicker game
var clicker = document.getElementById('clicker');
var cutie = document.getElementById('cutie');

var clickstart = function() {
  cutie.className = 'clicked';
};

var clickend = function() {
  cutie.className = '';
};

clicker.ontouchstart = clicker.onmousedown = clickstart;
clicker.ontouchend = clicker.onmouseup = clickend;
