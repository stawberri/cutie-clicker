!function() {
  var cutie = '77';

  cc.cuties[cutie] = function(data) {
  };

  cc.cuties[cutie].prototype = {
    rarity: 0,
    showcaseRight: false,
    cutieQuote: '"uu"',
    skillCost: function() {
      return SchemeNumber.fn['*']('10', this.love());
    }, skillUse: function() {
      cc.stats.excitement(this.love());
    }
  };
}();
