// This script processes general input tasks

!function() {
  // Cutie bar main button
  $('#cutie-bar-m').on('mousedown touchstart', function(ev) {
    if(cc.burstReady && !cc.burstStart && !cc.ls.d.preBurst) {
      ev.preventDefault();

      // Burst if burst is ready
      cc.burstStart = true;
    }
  });

  // Main click handler
  var recentClickTimeout;
  var lastInterval = '1';
  var lastxp = '1';

  $('#cutie-clicker').on('mousedown touchstart', function(ev) {
    ev.preventDefault();

    clearTimeout(recentClickTimeout);

    // Request fullscreen
    (document.requestFullscreen || document.msRequestFullscreen || document.mozRequestFullScreen || document.webkitRequestFullscreen || $.noop).call();

    // Update click counter
    cc.stats.clicks.add(1);

    // Award excitement
    cc.cuties.m(function(cutie) {
      var now = $.now();
      var interval = String(now - (cc.util.rhanum(cc.ls.d, 'tempClickStreakTime') || cc.util.rhanum(cc.ls.d, 'tempClickStreakTime', now - 1)));
      var xp = '1';

      if(cc.ls.d.tempClickStreakPassive) {
        if(cc.stats.mpcost('3', true)) {
          xp = String(SchemeNumber.fn['+'](Math.floor(1 + Math.random() * 4), SchemeNumber.fn.floor(SchemeNumber.fn['*'](cutie.love(), .01 + Math.random() * 0.08))));

          $('#temp-mp-button-2').html('3+0.03% &spades;/&lowast; = &#9652; &diams;/&lowast; (&#9745;)<br>&diams; ' + xp);
          $('#cutie-bar-r .cutie-card .glyph').css('fontSize', '5rem').html('&diams; ' + xp);
        } else {
          $('#temp-mp-button-2').html('3+0.03% &spades;/&lowast; = &#9652; &diams;/&lowast; (&#9745;)<br>&#9888; 0 &clubs;');
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
      $('#temp-mp-button-2').html('3+0.03% &spades;/&lowast; = &#9652; &diams;/&lowast; (&#9745;)');
    } else {
      $('#temp-mp-button-2').html('3+0.03% &spades;/&lowast; = &#9652; &diams;/&lowast; (&#10060;)');
      $('#cutie-bar-r .cutie-card .glyph').html('');
    }
  });

  // temp button 2 text fixer (if click streaks are active)
  if($.type(cc.ls.d.tempClickStreakPassive) === 'undefined') {
    cc.ls.d.write('tempClickStreakPassive', true);
  }
  if(cc.ls.d.tempClickStreakPassive) {
    $('#temp-mp-button-2').html('3+0.03% &spades;/&lowast; = &#9652; &diams;/&lowast; (&#9745;)');
  }
}();
