// This script provides helper stuff to deal with player stats.

!function() {
  cc.stats = {};

  // Modify click counter
  cc.stats.clicks = function(value) {
    if($.type(value) !== 'undefined') {
      // Setter
      return cc.util.rhanum(cc.ls.d, 'clicks', value);
    }
    return cc.util.rhanum(cc.ls.d, 'clicks') || cc.util.rhanum(cc.ls.d, 'clicks', 0);
  }
    // Adder helper function
    cc.stats.clicks.add = function(value) {
      // Call cc.stats.clicks and add value to it!
      return cc.stats.clicks(SchemeNumber.fn['+'](cc.stats.clicks(), String(value)));
    }
}();
