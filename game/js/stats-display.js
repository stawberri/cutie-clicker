// Displays stuff related to stats

!function() {
  // Update stat display
  cc.loop.draw(function() {
    // Middle cutie stats
    cc.cuties.m(function(cutie) {
      // Easy to display stats
      $('#cutie-stats .love').html(cutie.love());

      // Display XP
      var xpPercentage = 0;
      // Prevent divide by zero and other weird issues like that
      if(SchemeNumber.fn['>'](cutie.targetxp(), '0')) {
        // Note: This is inexact! Don't save it!
        xpPercentage = SchemeNumber.fn['*']('100', SchemeNumber.fn['/'](cc.stats.excitement(), cutie.targetxp()));
      } else {
        // Assume that targetxp is 0.
        xpPercentage = '100';
      }
      // Cap it at 0 and 100
      xpPercentage = SchemeNumber.fn.max('0', SchemeNumber.fn.min('100', xpPercentage));

      // Display them as sizes
      cc.util.cssrule('.cv-xp-percentage-height')({
        height: xpPercentage.toFixed(3) + '%'
      });
      cc.util.cssrule('.cv-xp-percentage-width')({
        width: xpPercentage.toFixed(3) + '%'
      });
    });
  });

  // Cost calculation class
  cc.loop.draw(function() {
    $('.cv-mp-cost').each(function(index, element) {
      // Grab data-cost
      var dataCost = $(this).attr('data-cost');
      if($.type(dataCost) === 'undefined') {
        return;
      }
      // Set converted cost
      var cost = cc.stats.mpcostcalc(dataCost);
      if($(this).html() != cost) {
        $(this).html(cost);
      }
    });
  });

  // Cutie count class
  cc.loop.draw(function() {
    cc.util.cssrule('.cv-cutie-count::before')({
      content: "'" + cc.cuties.list().length + "'"
    });
    // Amount of xp drained a second
    cc.util.cssrule('.cv-xp-drain-sec::before')({
      content: "'" + (cc.cuties.list().length / 9).toFixed(1) + "'"
    });
  });

  // Empathy class
  cc.loop.draw(function() {
    cc.util.cssrule('.cv-empathy::before')({
      content: "'" + cc.stats.empathy() + "'"
    });
  });

  // Bursting stuff
  cc.loop.draw(function() {
    // Notify game that bursting is ready if it is
    if(cc.burstReady) {
      $('html').addClass('ce-burst-ready');
    } else {
      $('html').removeClass('ce-burst-ready');
    }

    // Figure out classes for #layer-burst
    cc.cuties.m(function(cutie) {
      // Stages
      var burstClasses = '';
      var nonBurstClasses = ''
      if(cc.burstStart || cc.ls.d.preBurst) {
        burstClasses += ' burst-pre';
      } else {
        nonBurstClasses += ' burst-pre';
      }
      if(cc.ls.d.postBurst) {
        if(cc.ls.d.postBurst > 0) {
          burstClasses += ' burst-post-win';
          nonBurstClasses += ' burst-post-fail';
        } else {
          burstClasses += ' burst-post-fail';
          nonBurstClasses += ' burst-post-win';
        }
      } else {
        nonBurstClasses += ' burst-post-win burst-post-fail';
      }
      if(cc.ls.d.burst) {
        burstClasses += ' burst-active';

        // Target
        if(cutie.targetBpMet()) {
          burstClasses += ' burst-ok';
        } else {
          nonBurstClasses += ' burst-ok';
        }
      } else {
        nonBurstClasses += ' burst-active burst-ok'
      }

      $('html').addClass(burstClasses).removeClass(nonBurstClasses);
    });
  });

  // Time (countdown displays)
  cc.loop.draw(function() {
    $('.cv-countdown').html(function(index, oldHtml) {
      var dataTime = $(this).attr('data-time');
      if($.type(dataTime) === 'undefined') {
        return;
      }

      // Calculate time
      var time = Math.abs($.now() - dataTime);
      var ms = time % 1000;
      time = Math.floor(time / 1000);
      var s = time % 60;
      time = Math.floor(time / 60);
      var m = time % 60;
      time = Math.floor(time / 60);
      var h = time;

      // How much do we need to display?
      if(h > 0) {
        // Display hours, minutes (2 digits), and seconds (2 digits)
        return h + ':' + ('0' + m).slice(-2) + ':' + ('0' + s).slice(-2);
      } else if(m > 0) {
        // Display minutes and seconds (two digits)
        return m + ':' + ('0' + s).slice(-2);
      } else if(s > 0) {
        // Display seconds and ms
        return (s + (ms / 1000)).toFixed(2);
      } else {
        // Just display ms
        return ms;
      }
    });
  });
}();
