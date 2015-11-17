// Outsource click processing to this script to keep index.js cleaner
// Also does xp drain and general xp stuff processing

!function() {
  // Clicking
    var recentClickTimeout;
    var lastInterval = 0;
    var lastxp = '1';

    $('#cutie-clicker').on('mousedown touchstart', function(ev) {
      ev.preventDefault();

      clearTimeout(recentClickTimeout);

      // Update click counter
      cc.stats.clicks.add(1);

      // Award excitement
      cc.cuties.m(function(cutie) {
        var now = $.now();
        var interval = now - (cc.util.rhanum(cc.ls.d, 'tempClickStreakTime') || cc.util.rhanum(cc.ls.d, 'tempClickStreakTime', now));
        var xp = 1;

        if(cc.ls.d.tempClickStreakPassive) {
          if(cc.stats.mpcost(1, true)) {
            if(lastInterval*.96 > interval) {
              xp = String(SchemeNumber.fn.ceiling(SchemeNumber.fn['*']('3', lastxp, String(lastInterval/interval))));
            } else if (interval < lastInterval * 2) {
              xp = String(SchemeNumber.fn.ceiling(SchemeNumber.fn['*']('.5', lastxp, String(lastInterval/interval))));
            }

            $('#temp-mp-button-2').html('1 C + 1+0.01% MP = XP+++ (&#9745;)<br>&diams; ' + xp + '<br><br><img src="http://zippy.gfycat.com/AmpleDescriptiveBlackfootedferret.gif" width="150px">');
            $('#cutie-bar-r .cutie-card .glyph').css('fontSize', '5rem').html('&diams; ' + xp);
          } else {
            $('#temp-mp-button-2').html('1 C + 1+0.01% MP = XP+++ (&#9745;)<br>&#9888; 0 &clubs;<br><br><img src="http://zippy.gfycat.com/AmpleDescriptiveBlackfootedferret.gif" width="150px">');
            $('#cutie-bar-r .cutie-card .glyph').css('fontSize', '5rem').html('&#9888; 0 &clubs;');
          }
        }

        cc.stats.excitement(xp);

        lastInterval = interval;
        cc.util.rhanum(cc.ls.d, 'tempClickStreakTime', now);
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

    // If drainAmount is greater than available xp, make them equal.
    drainAmount = SchemeNumber.fn.min(drainAmount, cc.stats.excitement());

    // Stop if we're draining less than 1 xp.
    if(SchemeNumber.fn['<'](drainAmount, '1')) { return; }

    // Drain xp, award mp.
    cc.stats.excitement(SchemeNumber.fn['*']('-1', drainAmount));
    cc.stats.empathy(drainAmount);

    // Update time
    cc.util.rhanum(cc.ls.d, 'lastXpDrain', now);
  });

  // Lv Up
  cc.render.tick(function(now) {
    cc.cuties.m(function(cutie) {
      // automatically attempt to love up for now
      if(SchemeNumber.fn['>='](cc.stats.xp(), cutie.targetxp())) {
        cutie.loveup();
        cc.stats.empathy(cc.stats.excitement());
        cc.stats.xp('0');

        // Google analytics for fun data
        ga('send', 'event', 'cuties', 'lv up', cutie.cutie, Number(cutie.love()));
      }
    });
  });

  // Temp buttons
  $('#cutie-bar-l, #temp-mp-button-1').click(function() {
    if(cc.stats.mpcost('1000', true)) {
      var xpGain = Math.floor((Math.random() * 351) + 750);
      cc.stats.excitement(xpGain);

      var yay = (xpGain > 1000) ? '!!!' : '!'
      $('#temp-mp-button-1').html('1000+10% MP -> (750 ~ 1100) XP<br>&diams; ' + xpGain + yay)
      $('#cutie-bar-l .cutie-card .glyph').css('fontSize', '5rem').html('&diams; ' + xpGain + yay)
    } else {
      $('#temp-mp-button-1').html('1000+10% MP -> (750 ~ 1100) XP<br>&#9888;: ' + cc.stats.empathy() + ' &clubs;')
      $('#cutie-bar-l .cutie-card .glyph').css('fontSize', '5rem').html('&#9888; ' + cc.stats.empathy() + ' &clubs;')

    }
  });

  if(cc.ls.d.tempClickStreakPassive) {
    $('#temp-mp-button-2').html('1 C + 1+0.01% MP = XP+++ (&#9745;)<br><br><img src="http://zippy.gfycat.com/AmpleDescriptiveBlackfootedferret.gif" width="150px">');
  }
  $('#cutie-bar-r, #temp-mp-button-2').click(function() {
    cc.ls.d.write('tempClickStreakPassive', !cc.ls.d.tempClickStreakPassive);
    if(cc.ls.d.tempClickStreakPassive) {
      $('#temp-mp-button-2').html('1 C + 1+0.01% MP = XP+++ (&#9745;)<br><br><img src="http://zippy.gfycat.com/AmpleDescriptiveBlackfootedferret.gif" width="150px">');
    } else {
      $('#temp-mp-button-2').html('1 C + 1+0.01% MP = XP+++ (&#10060;)');
      $('#cutie-bar-r .cutie-card .glyph').html('');
    }
  });
}();
