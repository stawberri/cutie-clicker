// A file for processing stat changes and things like that
!function() {
  // XP Drain from number of cuties
  cc.loop.tick(function(now) {
    // Make sure we have cuties before doing anything
    if(String(cc.cuties.list().length) != 0) {
      // How long has it been since this was last calculated?
      var sinceThen = now - (cc.util.rhanum(cc.ls.d, 'lastXpDrain') || cc.util.rhanum(cc.ls.d, 'lastXpDrain', now));
      if(sinceThen < 1) return;

      // Reset xp to zero if it's negative
      // And then update time and stop because there's nothing left to drain
      if(SchemeNumber.fn['<='](cc.stats.xp(), 0)) {
        cc.stats.xp('0');
        cc.util.rhanum(cc.ls.d, 'lastXpDrain', now);
        return;
      }

      var drainAmount = SchemeNumber.fn['/'](String(cc.cuties.list().length), '1000');

      // Make it relative to time passed
      drainAmount = String(SchemeNumber.fn.floor(SchemeNumber.fn['*'](drainAmount, String(sinceThen))));

      // Return if draining fails
      if(!cc.stats.xpToMp(drainAmount)) { return; }

      // Update time
      cc.util.rhanum(cc.ls.d, 'lastXpDrain', now);
    }
  });

  // Lv Up & Bursting
  cc.loop.tick(function(now) {
    cc.cuties.m(function(cutie) {
      if(cc.ls.d.burst) {
        // We're in burst mode!

        // Set burst to not ready just in case.
        cc.burstReady = false;

        // Quick functionality restorer
        if(cutie.targetBpMet()) {
          // Exit burst mode
          cc.ls.d.erase('burst');

          // Just do what it used to do for now
          cutie.loveup();
          cc.stats.xpToMp(cc.stats.excitement());

          // Google analytics for fun data
          // ga('send', 'event', 'cuties', 'lv up', cutie.cutie, Number(cutie.love()));
        }

      } else {
        // Not in burst mode. Figure out if we're ready for it.

        // Are we ready to burst?
        cc.burstReady = cutie.targetXpMet();
      }
    });
  });
}();
