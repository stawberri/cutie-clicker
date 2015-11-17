// Displays stuff related to stats

!function() {
  // Update stat display
  cc.render.draw(function() {
    // Cutiebar display
    cc.cuties.m(function(cutie) {
      $('#cutie-stats .love').html(cutie.love());
      $('#cutie-stats .empathy').html(cc.stats.empathy());

      var xpPercentage = 0;
      // Prevent divide by zero and other weird issues like that
      if(SchemeNumber.fn['>'](cutie.targetxp(), '0')) {
        xpPercentage = SchemeNumber.fn['*']('100', SchemeNumber.fn['/'](cc.stats.excitement(), cutie.targetxp()));
      }
      xpPercentage = SchemeNumber.fn.max('0', SchemeNumber.fn.min('100', xpPercentage));
      xpPercentage = SchemeNumber.fn['-']('100', xpPercentage);
      $('#xp-gauge .bar').css('top', xpPercentage + '%');
    });
  });
}();
