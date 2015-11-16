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

        if(cc.ls.d.tempClickStreakPassive) {
          if(SchemeNumber.fn['>='](cc.stats.empathy(), 1)) {
            if(lastInterval*.96 > interval) {
              xp = String(SchemeNumber.fn.ceiling(SchemeNumber.fn['*']('2', lastxp, String(lastInterval/interval))));
            } else if (interval < lastInterval * 2) {
              xp = String(SchemeNumber.fn.ceiling(SchemeNumber.fn['*']('.25', lastxp, String(lastInterval/interval))));
            }

            cc.stats.empathy('-1');

            $('#temp-mp-button-2').html('1 C + 1 MP = XP+++ (&#9745;)<br>&diams; ' + xp + '<br><br><img src="http://zippy.gfycat.com/AmpleDescriptiveBlackfootedferret.gif" width="150px">');
            $('#cutie-bar-r .cutie-card .glyph').css('fontSize', '5rem').html('&diams; ' + xp);
          } else {
            $('#temp-mp-button-2').html('1 C + 1 MP = XP+++ (&#9745;)<br>&#9888; 0 &clubs;<br><br><img src="http://zippy.gfycat.com/AmpleDescriptiveBlackfootedferret.gif" width="150px">');
            $('#cutie-bar-r .cutie-card .glyph').css('fontSize', '5rem').html('&#9888; 0 &clubs;');
          }
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

    // Prevent divide by zero
    if(String(cc.cuties.list().length) < 1) { return; }

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

  // Temp buttons
  $('#cutie-bar-l, #temp-mp-button-1').click(function() {
    if(SchemeNumber.fn['>='](cc.stats.empathy(), 1000)) {
      cc.stats.empathy('-1000');
      var xpGain = Math.floor((Math.random() * 351) + 750);
      cc.stats.excitement(xpGain);

      var yay = (xpGain > 1000) ? '!!!' : '!'
      $('#temp-mp-button-1').html('1000 MP -> (750 ~ 1100) XP<br>&diams; ' + xpGain + yay)
      $('#cutie-bar-l .cutie-card .glyph').css('fontSize', '5rem').html('&diams; ' + xpGain + yay)
    } else {
      $('#temp-mp-button-1').html('1000 MP -> (750 ~ 1100) XP<br>&#9888;: ' + cc.stats.empathy() + ' &clubs;')
      $('#cutie-bar-l .cutie-card .glyph').css('fontSize', '5rem').html('&#9888; ' + cc.stats.empathy() + ' &clubs;')

    }
  });

  if(cc.ls.d.tempClickStreakPassive) {
    $('#temp-mp-button-2').html('1 C + 1 MP = XP+++ (&#9745;)<br><br><img src="http://zippy.gfycat.com/AmpleDescriptiveBlackfootedferret.gif" width="150px">');
  }
  $('#cutie-bar-r, #temp-mp-button-2').click(function() {
    cc.ls.d.write('tempClickStreakPassive', !cc.ls.d.tempClickStreakPassive && SchemeNumber.fn['>='](cc.stats.empathy(), 1));
    if(cc.ls.d.tempClickStreakPassive) {
      $('#temp-mp-button-2').html('1 C + 1 MP = XP+++ (&#9745;)<br><br><img src="http://zippy.gfycat.com/AmpleDescriptiveBlackfootedferret.gif" width="150px">');
    } else {
      $('#temp-mp-button-2').html('1 C + 1 MP = XP+++ (&#10060;)');
      $('#cutie-bar-r .cutie-card .glyph').html('');
    }
  });
}();
