// This script provides helper stuff to deal with player stats.

!function() {
  cc.stats = {};

  // Modify click counter
  cc.stats.clicks = function(value) {
    if($.type(value) === 'undefined') {
      // Getter - Default to 0 clicks
      return cc.util.rhanum(cc.ls.d, 'clicks') || cc.util.rhanum(cc.ls.d, 'clicks', 0);
    } else {
      // Setter
      return cc.util.rhanum(cc.ls.d, 'clicks', value);
    }
  }
    // Adder helper function
    cc.stats.clicks.add = function(value) {
      // Call cc.stats.clicks and add value to it!
      return cc.stats.clicks(SchemeNumber.fn['+'](cc.stats.clicks(), String(value)));
    }

  // Modify xp. Don't access directly (except to read, maybe)
  cc.stats.xp = function(value) {
    if($.type(value) === 'undefined') {
      // Get - default to 0
      return cc.util.rhanum(cc.ls.d, 'xp') || cc.util.rhanum(cc.ls.d, 'xp', '0');
    } else {
      // Set
      return cc.util.rhanum(cc.ls.d, 'xp', value);
    }
  };

  // Friendly xp modification function. May have stuff attached to it in the future, so it's best to use this one
  cc.stats.excitement = function(value) {
    if(value) {
      value = String(value);
      cc.stats.xp(SchemeNumber.fn['+'](cc.stats.xp(), value));
    }

    return cc.stats.xp();
  };

  // Modify mp. Don't access directly (except to read, maybe)
  cc.stats.mp = function(value) {
    if($.type(value) === 'undefined') {
      // Get - default to 0
      return cc.util.rhanum(cc.ls.d, 'mp') || cc.util.rhanum(cc.ls.d, 'mp', '0');
    } else {
      // Set
      return cc.util.rhanum(cc.ls.d, 'mp', value);
    }
  };

  // Friendly mp modification function. May have stuff attached to it in the future, so it's best to use this one
  cc.stats.empathy = function(value) {
    if(value) {
      value = String(value);
      cc.stats.mp(SchemeNumber.fn['+'](cc.stats.mp(), value));
    }

    return cc.stats.mp();
  };
}();
