// This script processes general input tasks

!function() {
  // Clicking
  var recentClickTimeout;
  var lastInterval = '1';
  var lastxp = '1';

  $('#cutie-clicker').on('mousedown touchstart', function(ev) {
    ev.preventDefault();

    clearTimeout(recentClickTimeout);

    // Update click counter
    cc.stats.clicks.add(1);

    // Award excitement
    cc.cuties.m(function(cutie) {
      var now = $.now();
      var interval = String(now - (cc.util.rhanum(cc.ls.d, 'tempClickStreakTime') || cc.util.rhanum(cc.ls.d, 'tempClickStreakTime', now - 1)));
      var xp = '1';

      if(cc.ls.d.tempClickStreakPassive) {
        if(cc.stats.mpcost('10', true)) {
          if(lastInterval - 100 > interval) {
            xp = String(SchemeNumber.fn.ceiling(SchemeNumber.fn['*']('2', lastxp, SchemeNumber.fn['/'](lastInterval, interval))));
            xp = String(SchemeNumber.fn.floor(SchemeNumber.fn['+'](xp, SchemeNumber.fn['/'](cutie.targetxp(), '200'))));
          } else if (interval < lastInterval + 100) {
            xp = String(SchemeNumber.fn.ceiling(SchemeNumber.fn['*']('.5', lastxp, SchemeNumber.fn['/'](lastInterval, interval))));
            xp = String(SchemeNumber.fn.floor(SchemeNumber.fn['+'](xp, SchemeNumber.fn['/'](cutie.targetxp(), '200'))));
          }

          $('#temp-mp-button-2').html('1 &lowast; + 10+0.1% &spades; = &diams;&diams;&diams;&diams; (&#9745;)<br>&diams; ' + xp + '<br><br><img src="http://zippy.gfycat.com/AmpleDescriptiveBlackfootedferret.gif" width="150px">');
          $('#cutie-bar-r .cutie-card .glyph').css('fontSize', '5rem').html('&diams; ' + xp);
        } else {
          $('#temp-mp-button-2').html('1 &lowast; + 10+0.1% &spades; = &diams;&diams;&diams;&diams; (&#9745;)<br>&#9888; 0 &clubs;<br><br><img src="http://zippy.gfycat.com/AmpleDescriptiveBlackfootedferret.gif" width="150px">');
          $('#cutie-bar-r .cutie-card .glyph').css('fontSize', '5rem').html('&#9888; ' + cc.stats.empathy() + ' &clubs;');
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

  // Temp buttons
  $('#cutie-bar-l, #temp-mp-button-1').click(function() {
    if(cc.stats.mpcost('1000', true)) {
      var xpGain = Math.floor((Math.random() * 351) + 750);
      cc.stats.excitement(xpGain);

      var yay = (xpGain > 1000) ? '!!!' : '!'
      $('#temp-mp-button-1').html('1000+10% &spades; -> (750 ~ 1100) &diams;<br>&diams; ' + xpGain + yay)
      $('#cutie-bar-l .cutie-card .glyph').css('fontSize', '5rem').html('&diams; ' + xpGain + yay)
    } else {
      $('#temp-mp-button-1').html('1000+10% &spades; -> (750 ~ 1100) &diams;<br>&#9888;: ' + cc.stats.empathy() + ' &clubs;')
      $('#cutie-bar-l .cutie-card .glyph').css('fontSize', '5rem').html('&#9888; ' + cc.stats.empathy() + ' &clubs;')

    }
  });

  $('#cutie-bar-r, #temp-mp-button-2').click(function() {
    cc.ls.d.write('tempClickStreakPassive', !cc.ls.d.tempClickStreakPassive);
    if(cc.ls.d.tempClickStreakPassive) {
      $('#temp-mp-button-2').html('1 &lowast; + 10+0.1% &spades; = &diams;&diams;&diams;&diams; (&#9745;)<br><br><img src="http://zippy.gfycat.com/AmpleDescriptiveBlackfootedferret.gif" width="150px">');
    } else {
      $('#temp-mp-button-2').html('1 &lowast; + 10+0.1% &spades; = &diams;&diams;&diams;&diams; (&#10060;)');
      $('#cutie-bar-r .cutie-card .glyph').html('');
    }
  });

  // temp button 2 text fixer (if click streaks are active)
  if($.type(cc.ls.d.tempClickStreakPassive) === 'undefined') {
    cc.ls.d.write('tempClickStreakPassive', true);
  }
  if(cc.ls.d.tempClickStreakPassive) {
    $('#temp-mp-button-2').html('1 &lowast; + 10+0.1% &spades; = &diams;&diams;&diams;&diams; (&#9745;)<br><br><img src="http://zippy.gfycat.com/AmpleDescriptiveBlackfootedferret.gif" width="150px">');
  }
}();
