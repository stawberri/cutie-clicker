// Outsource click processing to this script to keep index.js cleaner

!function() {
  // Variables for button clicked events
  var surpriseTimeout;

  var lastInterval = 0;
  var lastTime = $.now();
  var lastxp = '1';

  $('#cutie-clicker').on('mousedown touchstart', function(ev) {
    ev.preventDefault();

    clearTimeout(surpriseTimeout);

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

      cc.stats.excitement(xp);

      // automatically attempt to love up for now
      cutie.loveup();

      lastInterval = interval;
      lastTime = now;
      lastxp = xp;

      // Add event classes
      $('body').addClass('ce-recent-click ce-mousedown');
    });
  });

  $('#cutie-clicker').on('mouseup touchend', function(ev) {
    ev.preventDefault();

    // Add event classes
    $('body').removeClass('ce-mousedown');

    surpriseTimeout = setTimeout(function() {
      $('body').removeClass('ce-recent-click');
    }, 250);
  });
}();
