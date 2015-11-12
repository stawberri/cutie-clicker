!function() {
  // Duct taped together simple clicker game
  var clicker = $('#cutie-clicker');
  var cutie = $('#cutie');

  var surpriseTimeout;

  var lastInterval = 0;
  var lastTime = $.now();
  var lastxp = '1';

  clicker.on('mousedown touchstart', function(ev) {
    ev.preventDefault();

    clearTimeout(surpriseTimeout);

    cutie.addClass('clicked');

    // Update click counter
    cc.stats.clicks.add(1);

    // Award excitement
    cc.cuties.m(function(cutie) {
      var now = $.now();
      var interval = now - lastTime;
      var xp = 1;

      if(lastInterval*.96 > interval) {
        xp = String(SchemeNumber.fn.ceiling(SchemeNumber.fn['*']('2', lastxp, String(lastInterval/interval))));
      } else if (interval < lastInterval * 2) {
        xp = String(SchemeNumber.fn.ceiling(SchemeNumber.fn['*']('.25', lastxp, String(lastInterval/interval))));
      }

      cutie.excitement(xp);

      lastInterval = interval;
      lastTime = now;
      lastxp = xp;
    })

    // Display
    populateClickCounter();
  });

  clicker.on('mouseup touchend', function(ev) {
    ev.preventDefault();

    surpriseTimeout = setTimeout(function() {
      cutie.removeClass('clicked');
    }, 250);
  });

  function populateClickCounter() {
    cc.cuties.m(function(cutie) {
      var msg = '';
      msg += 'LV ' + cutie.lv() + ' - ';
      msg += cutie.xp() + '/' + cutie.targetxp() + 'XP ';
      $('#click-counter').html(msg);
    });
  }

  populateClickCounter();
}();
