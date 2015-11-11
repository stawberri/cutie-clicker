!function() {
  cc.stats = {};

  // Modify click counter
  cc.stats.clicks = function(value) {
    if($.type(value) === 'undefined') {
      // getter
      return cc.util.rhanum(cc.ls.d, 'clicks');
    } else {
      // setter
      return cc.util.rhanum(cc.ls.d, 'clicks', value);
    }
  }
    // Adder helper function
    cc.stats.clicks.add = function(value) {
      // Call cc.stats.clicks and add value to it!
      return cc.stats.clicks(SchemeNumber.fn['+'](cc.stats.clicks(), String(value)));
    }
}();
