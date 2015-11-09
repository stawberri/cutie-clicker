// Duct taped together simple clicker game

var clicker = $('#clicker');
var cutie = $('#cutie');

var clickstart = function() {
  cutie.addClass('clicked');

  // Set clicks to either clicks + 1, or just 1.
  cc.ls.d.write('clicks', cc.ls.d.clicks ? cc.ls.d.clicks + 1 : 1);
};

var clickend = function() {
  cutie.removeClass('clicked');
};

clicker.on('touchstart', clickstart);
clicker.on('mousedown', clickstart);

clicker.on('touchend', clickend);
clicker.on('mouseup', clickend);
