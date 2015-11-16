// Outsource click processing to this script to keep index.js cleaner
// Also does xp drain

!function() {
  // Clicking
    var recentClickTimeout;
    var lastInterval = 0;
    var lastTime = $.now();
    var lastxp = '1';

    $('#cutie-clicker').on('mousedown touchstart', function(ev) {
      ev.preventDefault();

      clearTimeout(recentClickTimeout);

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
        if(SchemeNumber.fn['>'](cc.stats.xp(), cutie.targetxp())) {
          cutie.loveup();
          cc.stats.xp('0');
        }

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

      recentClickTimeout = setTimeout(function() {
        $('body').removeClass('ce-recent-click');
      }, 250);
    });

  // XP Drain
  cc.render.tick(function(now) {
    // How long has it been since this was last calculated?
    var sinceThen = now - (cc.ls.d.lastXpDrain || cc.ls.d.write('lastXpDrain', now).lastXpDrain);
    if(sinceThen < 1) return;

    // Update time but don't run if xp is 0
    if(SchemeNumber.fn['<'](cc.stats.excitement(), '1')) {
      // Give a second of leeway so we don't keep running this
      if(sinceThen > 1000) {
        cc.ls.d.write('lastXpDrain', now);
      }
      return;
    }

    // How much should we drain per ms?
    var drainAmount = SchemeNumber.fn['/'](String(cc.cuties.list().length), '1000');

    // Make it relative to time passed
    drainAmount = SchemeNumber.fn.floor(SchemeNumber.fn['*'](drainAmount, String(sinceThen)));

    // If drainAmount is greater than available xp, make them equal
    drainAmount = SchemeNumber.fn.min(drainAmount, cc.stats.excitement());

    // Stop if we're draining less than 1 xp.
    if(SchemeNumber.fn['<'](drainAmount, '1')) { return; }

    // Drain xp, award mp.
    cc.stats.excitement(SchemeNumber.fn['*']('-1', drainAmount));
    cc.stats.empathy(drainAmount);

    // Update time
    cc.ls.d.write('lastXpDrain', now);
  });
}();
