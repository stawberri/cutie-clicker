!function() {
  // Duct taped together simple clicker game
  var clicker = $('#cutie-clicker');
  var cutie = $('#cutie');

  var surpriseTimeout;

  clicker.on('mousedown', function() {
    clearTimeout(surpriseTimeout);

    cutie.addClass('clicked');

    // Update click counter
    cc.stats.clicks.add(1);

    // Award excitement
    cc.cuties.m(function(cutie) {
      cutie.excitement(1);
    })

    // Display
    populateClickCounter();
  });

  clicker.on('mouseup', function() {
    surpriseTimeout = setTimeout(function() {
      cutie.removeClass('clicked');
    }, 250);
  });

  function populateClickCounter() {
    cc.cuties.m(function(cutie) {
      var msg = '';
      msg += cutie.lv() + 'LV ';
      msg += cutie.xp() + '/' + cutie.targetxp() + 'XP ';
      msg += cc.stats.clicks() + 'C ';
      $('#click-counter').html(msg);
    });
  }

  populateClickCounter();

}();
