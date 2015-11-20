// Displays stuff related to stats

!function() {
  // Update stat display
  cc.loop.draw(function() {
    // Middle cutie stats
    cc.cuties.m(function(cutie) {
      // Easy to display stats
      $('#cutie-stats .love').html(cutie.love());
      $('#cutie-stats .empathy').html(cc.stats.empathy());

      // Display XP
      var xpPercentage = 0;
      // Prevent divide by zero and other weird issues like that
      if(SchemeNumber.fn['>'](cutie.targetxp(), '0')) {
        // Note: This is inexact! Don't save it!
        xpPercentage = SchemeNumber.fn['*']('100', SchemeNumber.fn['/'](cc.stats.excitement(), cutie.targetxp()));
      }
      // Cap it at 0 and 100
      xpPercentage = SchemeNumber.fn.max('0', SchemeNumber.fn.min('100', xpPercentage));
      // Display them as sizes
      $('.cv-xp-percentage-height').css('height', xpPercentage.toFixed(3) + '%');
      $('.cv-xp-percentage-width').css('width', xpPercentage.toFixed(3) + '%');

      // Notify game that bursting is ready if it is
      if(cc.burstReady) {
        $('body').addClass('ce-burst-ready');
      } else {
        $('body').removeClass('ce-burst-ready');
      }
    });
  });
}();
