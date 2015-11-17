// A file for processing stat changes and things like that
!function() {
  // XP Drain
  cc.render.tick(function(now) {
    // How long has it been since this was last calculated?
    var sinceThen = now - (cc.util.rhanum(cc.ls.d, 'lastXpDrain') || cc.util.rhanum(cc.ls.d, 'lastXpDrain', now));
    if(sinceThen < 1) return;

    // Reset xp to zero if it's less than or equal to zero
    // And then update time and stop because there's nothing left to drain
    if(SchemeNumber.fn['<='](cc.stats.xp(), '0')) {
      cc.stats.xp('0');
      cc.util.rhanum(cc.ls.d, 'lastXpDrain', now);
      return;
    }

    var drainAmount = 0;

    // Prevent divide by zero (make sure we have cuties before doing anything)
    if(String(cc.cuties.list().length) != 0) {
      drainAmount += SchemeNumber.fn['/'](String(cc.cuties.list().length), '1000');
    }

    // Make it relative to time passed
    drainAmount = SchemeNumber.fn.floor(SchemeNumber.fn['*'](drainAmount, String(sinceThen)));

    // Return if draining fails
    if(!cc.stats.xpToMp(drainAmount)) { return; }

    // Update time
    cc.util.rhanum(cc.ls.d, 'lastXpDrain', now);
  });

  // Lv Up & Bursting
  cc.render.tick(function(now) {
    cc.cuties.m(function(cutie) {
      if(cc.ls.d.burst) {
        // Bursting is a special case.


      } else {
        // Are we ready to burst?
        if(SchemeNumber.fn['>='](cc.stats.xp(), cutie.targetxp())) {

          cutie.loveup();
          cc.stats.empathy(cc.stats.excitement());
          cc.stats.xp('0');

          // Google analytics for fun data
          // ga('send', 'event', 'cuties', 'lv up', cutie.cutie, Number(cutie.love()));
        }
      }
    });
  });
}();
