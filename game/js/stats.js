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
      value = SchemeNumber.fn.round(String(value));
      cc.stats.xp(SchemeNumber.fn['+'](cc.stats.xp(), value));

      // Ensure that this can't be less than 0
      if(SchemeNumber.fn['negative?'](cc.stats.xp())) {
        cc.stats.xp('0');
      }
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
      value = SchemeNumber.fn.round(String(value));
      cc.stats.mp(SchemeNumber.fn['+'](cc.stats.mp(), value));

      // Ensure that this can't be less than 0
      if(SchemeNumber.fn['negative?'](cc.stats.mp())) {
        cc.stats.mp('0');
      }
    }

    return cc.stats.mp();
  };

  // mp cost calculation. Doesn't actually subtract mp
  cc.stats.mpcostcalc = function(baseCost, negative) {
    // This doesn't actually calculate a percentage, but a fraction.
    // So 1 mp base cost -> 1% mp cost would actually be 0.01.
    var costAsPercentageMult = '0.0001'; // 10,000 mp base cost = 100%
    var baseCost = String(baseCost);
    var percentageCost = SchemeNumber.fn.ceiling(SchemeNumber.fn['*'](baseCost, costAsPercentageMult, cc.stats.mp()));

    var actualCost = SchemeNumber.fn.max(baseCost, percentageCost);
    if(negative) {
      actualCost = SchemeNumber.fn['*']('-1', actulCost);
    }

    return actualCost;
  }

  // Returns true if we have enough mp
  cc.stats.mpcost = function(baseCost, deduct) {
    var calculatedCost = cc.stats.mpcostcalc(baseCost);

    // Return false if there isn't enough
    if(SchemeNumber.fn['<'](cc.stats.mp(), calculatedCost)) {
      return false;
    }

    // If deduct is true, deduct mp as well
    if(deduct) {
      cc.stats.empathy(SchemeNumber.fn['*']('-1', calculatedCost));
    }

    // Return true, since we have enough
    return true;
  }

  // Converts xp to mp
  cc.stats.xpToMp = function(amount) {
    // If amount is greater than available xp, make them equal.
    var drainAmount = SchemeNumber.fn.min(String(amount), cc.stats.excitement());

    // If it's less than 1, something weird happened
    if(SchemeNumber.fn['<'](drainAmount, '1')) { return false; }

    // Remove xp, award mp.
    cc.stats.excitement(SchemeNumber.fn['*']('-1', drainAmount));
    cc.stats.empathy(drainAmount);

    return true;
  }
}();
