!function() {
  var cutie = '22c2';

  cc.cuties[cutie] = function(data) {
  };

  cc.cuties[cutie].prototype = {
    rarity: 0,
    showcaseRight: false,
    cutieQuote: '<span class="fa fa-cloud-upload"></span><span class="fa fa-cloud"></span><span class="fa fa-cloud-download"></span>',
    skillCost: function() {
      // Max level of 99
      var cost = SchemeNumber.fn.min('99', this.love());
      cost = SchemeNumber.fn['-']('100', cost);
      cost = String(cost) + '/10';
      cost = SchemeNumber.fn['*'](cost, '3');
      cost = SchemeNumber.fn.ceiling(cost);

      return cost;
    }, skillUse: function() {
      cc.stats.excitement(3);
    }
  };
}();
