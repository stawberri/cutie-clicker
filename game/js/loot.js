// This script deals with loot. It also contains the main loot tables and functions

!function() {
  cc.loot = function(lootTable) {
    var dice = Math.random();

    var validLoot = $.map(lootTable, function(value, index) {
      if(value.weight > dice) {
        return value;
      }
    });

    if(validLoot.length < 1) {
      return;
    } else {
      return validLoot[Math.floor(Math.random() * validLoot.length)]();
    }
  }

  function _(weight, func) {
    if($.type(func) !== 'function') {
      func = $.noop();
    }
    if($.type(weight) !== 'number') {
      weight = 1;
    }

    func.weight = weight;
    return func;
  }
  cc.loot.entry = _;

  cc.loot.genericMoney = [
    _(1, moneyLoot(1, 100, 0)),
    _(.3, moneyLoot(200, 600, 1)),
    _(.1, moneyLoot(1000, 2000, 2)),
  ];

  function moneyLoot(min, max, rarity) {
    return function() {
      // Generate money
      var money = SchemeNumber.fn['-'](max, min);
      money = SchemeNumber.fn['*'](money, Math.random());
      money = String(SchemeNumber.fn.round(money));
      money = SchemeNumber.fn['+'](min, money);
      money = String(money);

      // Award and report it
      cc.stats.empathy(money);
      return {
        type: 'money',
        amount: money,
        rarity: rarity
      }
    }
  }
}();
