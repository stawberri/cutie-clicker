!function() {
  // Duct taped together simple clicker game
  var clicker = $('#cutie-clicker');
  var cutie = $('#cutie');

  // LET'S JUST TEST IT
  var middlecutie = cc.cuties.m();

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
