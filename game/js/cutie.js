// This script corresponds with cutie.html. Not to be confused with cuties.js

!function() {
  // Duct taped together simple clicker game
  var clicker = $('#cutie-clicker');
  var cutie = $('#cutie');

  var surpriseTimeout;

  clicker.on('mousedown', function() {
    clearTimeout(surpriseTimeout);

    cutie.addClass('clicked');

    // Update click counter and display
    $('#click-counter').html(cc.stats.clicks.add(1));
  });

  clicker.on('mouseup', function() {
    surpriseTimeout = setTimeout(function() {
      cutie.removeClass('clicked');
    }, 250);
  });

  // Populate click counter
  $('#click-counter').html(cc.stats.clicks());

}();
