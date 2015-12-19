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

      // Check if we can afford this, while we're at it
      if(SchemeNumber.fn['<'](cc.stats.empathy(), cost)) {
        $(this).removeClass('cr-mp-cost-yes').addClass('cr-mp-cost-no');
      } else {
        $(this).removeClass('cr-mp-cost-no').addClass('cr-mp-cost-yes');
      }
    });
  });

  // Show cost for a cutie's skill
  cc.loop.draw(function() {
    $('.cv-mp-cost-skill').each(function(index, element) {
      // Grab cutie skill cost
      var index = $(element).attr('data-cutie');
      if($.type(index) === 'undefined') {
        return;
      }

      switch(index) {
        case 'left':
          index = cc.cuties.l();
        break;

        case 'right':
          index = cc.cuties.r();
        break;

        default:
          index = Number(index);
        break;
      }

      if($.type(index) != 'number') {
        if($(element).html()) {
          $(element).html('');
        }
        $(element).removeClass('cr-mp-cost-yes cr-mp-cost-no');
        return;
      }

      cc.cuties(index, function(cutie) {
        var cost = cc.stats.mpcostcalc(cutie.skillCost());
        if($(element).html() != cost) {
          $(element).html(cost);
        }

        // Check if we can afford this, while we're at it
        if(SchemeNumber.fn['<'](cc.stats.empathy(), cost)) {
          $(element).removeClass('cr-mp-cost-yes').addClass('cr-mp-cost-no');
        } else {
          $(element).removeClass('cr-mp-cost-no').addClass('cr-mp-cost-yes');
        }
      });
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

  // Clicks
  cc.loop.draw(function() {
    cc.util.cssrule('.cv-total-clicks::before')({
      content: "'" + cc.stats.clicks() + "'"
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
        $(this).removeClass('.cv-countdown');
        return;
      }

      var now = $.now();
      dataTime = Number(dataTime);
      if(isNaN(dataTime)) {
        dataTime = now;
      }

      // Check if we're locked to a direction
      var after = $(this).attr('data-after') || '';
      switch($(this).attr('data-direction')) {
        case 'up':
          if(dataTime > now) {
            $(this).html(after).removeClass('.cv-countdown');
            return;
          }
        break;

        case 'down':
          if(dataTime < now) {
            $(this).html(after).removeClass('.cv-countdown');
            return;
          }
        break;
      }

      // Calculate time
      return cc.util.timeString(Math.abs(now - dataTime));
    });
  });
}();
