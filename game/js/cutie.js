// Duct taped together simple clicker game

var clicker = $('#clicker');
var cutie = $('#cutie');

var clickstart = function() {
  cutie.addClass('clicked');

  // start tracking clicks
};

var clickend = function() {
  cutie.removeClass('clicked');
};

clicker.on('touchstart', clickstart);
clicker.on('mousedown', clickstart);

clicker.on('touchend', clickend);
clicker.on('mouseup', clickend);
