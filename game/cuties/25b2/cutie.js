!function() {
  var cutie = '25b2';

  cc.cuties[cutie] = function(data) {
  };

  cc.cuties[cutie].prototype = {
    rarity: 0,
    showcaseRight: false,
    cutieQuote: '&#x1f332;&#xfe0e;&#x1f381;&#xfe0e;&#x1f389;&#xfe0e;',
    skillCost: function() {
      // Max level of 100
      var cost = SchemeNumber.fn.min('100', this.love());
      cost = SchemeNumber.fn['*'](cost, '100');

      return String(cost);
    }, skillUse: function() {
      // Max level of 50
      var effectiveness = SchemeNumber.fn.min('50', this.love());
      effectiveness = String(effectiveness) + '/100';

      cc.cuties.m(function(cutie) {
        var change = SchemeNumber.fn['*'](effectiveness, cutie.targetxp());
        change = SchemeNumber.fn.ceiling(change);

        cc.stats.excitement(change);
      });
    }
  };
}();
