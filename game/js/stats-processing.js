// A file for processing stat changes and things like that
!function() {
  // Run cutie ticks
  cc.loop.tick(function(now) {
    if(cc.ls.d.burst) {
      cc.cuties.m(function(cutie) {
        // We're in burst mode!
        // Ensure that current cutie is in burst list
        cutie.burstPoints();

        // Run every burst cutie's tick function (different from normal)
        $.each(cc.ls.d.burst, function(key, value) {
          cc.cuties(Number(key), function(innerCutie) {
            innerCutie.tick(now);
          });
        });
      });
    } else {
      // Run tick for all equipped cuties
    }
  })

  // XP Drain
  cc.loop.tick(function(now) {
    // Require a middle cutie
    cc.cuties.m(function(cutie) {
      // How long has it been since this was last calculated?
      var sinceThen = now - (cc.util.rhanum(cc.ls.d, 'lastXpDrain') || cc.util.rhanum(cc.ls.d, 'lastXpDrain', now));
      if(sinceThen < 1) return;

      // Reset xp to zero if it's negative
      // And then update time and stop because there's nothing left to drain
      if(SchemeNumber.fn['<='](cc.stats.excitement(), 0)) {
        cc.stats.xp('0');
        cc.util.rhanum(cc.ls.d, 'lastXpDrain', now);
        return;
      }

      // How much does middle cutie wannya drain?
      var drainAmount = cutie.xpDrain() || '0';

      // Only drain based on number of cuties when not in burst mode
      if(!cc.ls.d.burst) {
        drainAmount = SchemeNumber.fn['+'](drainAmount, SchemeNumber.fn['*'](String(cc.cuties.list().length), '1'));
      }

      // Make it relative to time passed (convert to milliseconds too)
      drainAmount = String(SchemeNumber.fn.floor(SchemeNumber.fn['*']('1/1000', drainAmount, String(sinceThen))));

      // Return if draining fails
      if(!cc.stats.xpToMp(drainAmount)) { return; }

      // Update time
      cc.util.rhanum(cc.ls.d, 'lastXpDrain', now);
    });
  });

  // Lv Up & Bursting
  cc.loop.tick(function(now) {
    cc.cuties.m(function(cutie) {
      if(cc.ls.d.burst) {
        // When xp runs out
        if(cc.stats.noxp()) {
          // If current cutie doesn't lv up, no one lvs up.
          if(cutie.targetBpMet()) {
            // Check every cutie's bptargets and lv them up if necessary
            $.each(cc.ls.d.burst, function(key, value) {
              cc.cuties(Number(key), function(innerCutie) {
                // Has targetbp been met?
                if(innerCutie.targetBpMet()) {
                  // Just do what it used to do for now
                  innerCutie.loveup();

                  // Google analytics for fun data
                  // ga('send', 'event', 'cuties', 'lv up', cutie.cutie, Number(cutie.love()));
                }
              });
            });


            // Exit burst mode
            cc.burstEnd = 1;
          } else {
            // Current cutie doesn't lv up


            // Exit burst mode
            cc.burstEnd = -1;
          }
        }
      } else {
        // Not in burst mode. Figure out if we're ready for it.

        // Are we ready to burst?
        cc.burstReady = cutie.targetXpMet();
      }
    });
  });
}();
