// Displays stuff related to stats

!function() {
  // Update stat display
  cc.loop.draw(function() {
    // Cutiebar display
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
      xpPercentage = SchemeNumber.fn.max('0', SchemeNumber.fn.min('100', xpPercentage));
      // Display in orb
      $('#xp-gauge .bar').css('height', xpPercentage.toFixed(3) + '%');
      // Display in burst bar
      $('#burst-xp-gauge .bar').css('width', xpPercentage.toFixed(3) + '%');
    });
  });
}();
