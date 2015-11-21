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

  // Lv Up & Bursting
  cc.loop.tick(function(now) {
    cc.cuties.m(function(cutie) {
      if(cc.ls.d.burst && !cc.burstEnd && !cc.ls.d.postBurst) {
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

  // If xp is negative or higher than targetxp, cap it
  cc.loop.tick(function(now) {
    cc.cuties.m(function(cutie) {
      // Reset xp to zero if it's negative
      if(SchemeNumber.fn['<='](cc.stats.excitement(), 0)) {
        cc.stats.xp('0');

        // No need to drain this step, since there's no xp.
        cc.stats.resetXpDrain();
      }

      // If XP met, reset to xp (to keep it from going over or draining)
      if(cutie.targetXpMet()) {
        cc.stats.xp(cutie.targetxp());

        // Do allow draining in burst mode
        if(!cc.ls.d.burst) {
          cc.stats.resetXpDrain();
        }
      }
    });
  });

  cc.loop.tick(function(now) {
    // Require a middle cutie
    cc.cuties.m(function(cutie) {
      // How long has it been since this was last calculated?
      var sinceThen = now - (cc.util.rhanum(cc.ls.d, 'lastXpDrain') || cc.stats.resetXpDrain());
      if(sinceThen < 1) return;

      // How much does middle cutie wannya drain?
      var drainAmount = cutie.xpDrain() || '0';

      // Only drain based on number of cuties when not in burst mode
      if(!cc.ls.d.burst) {
        drainAmount = SchemeNumber.fn['+'](drainAmount, SchemeNumber.fn['*'](String(cc.cuties.list().length), '1/9'));
      }

      // Make it relative to time passed (convert to milliseconds too)
      drainAmount = String(SchemeNumber.fn.floor(SchemeNumber.fn['*']('1/1000', drainAmount, String(sinceThen))));

      // Return if draining fails
      if(!cc.stats.xpToMp(drainAmount)) {
        return;
      }

      // Update time
      cc.stats.resetXpDrain();
    });
  });
}();
