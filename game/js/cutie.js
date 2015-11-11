!function() {
  // Duct taped together simple clicker game
  var clicker = $('#cutie-clicker');
  var cutie = $('#cutie');

  var surpriseTimeout;

  var clickstart = function() {
    clearTimeout(surpriseTimeout);

    cutie.addClass('clicked');

    // Update click counter and display
    $('#click-counter').html(cc.stats.clicks.add(1));
  };
  // Populate click counter
  $('#click-counter').html(cc.stats.clicks());

  var clickend = function() {
    surpriseTimeout = setTimeout(function() {
      cutie.removeClass('clicked');
    }, 250);
  };

  clicker.on('touchstart', clickstart);
  clicker.on('mousedown', clickstart);

  clicker.on('touchend', clickend);
  clicker.on('mouseup', clickend);

}();
