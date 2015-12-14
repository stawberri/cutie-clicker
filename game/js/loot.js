// This script deals with loot. It also contains the main loot tables and functions

!function() {
  cc.loot = function(lootTable) {
    var dice = Math.random();

    var validLoot = $.map(lootTable, function(value, index) {
      // Stop if it's not valid.
      if(value[0] < dice) {
        return;
      }

      // Find proper function for this line
      var func = loot[value[1]];
      if(func) {
        return func.apply(loot, value.slice(2));
      } else {
        // "noop"
        return function() {return {}};
      }
    });

    if(validLoot.length < 1) {
      return;
    } else {
      return validLoot[Math.floor(Math.random() * validLoot.length)]();
    }
  }

  cc.loot.genericMoney = [
    [1, 'empathy', 1, 100, 0],
    [.3, 'empathy', 200, 600, 1],
    [.1, 'empathy', 1000, 2000, 2]
  ];

  cc.loot.genericCutie = [
    [1, 'cutie', '77'],
    [.3, 'cutie', '25b2']
  ];

  var loot = {
    table: function(table) {
      return cc.loot(table);
    },

    empathy: function(min, max, rarity) {
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
          type: 'empathy',
          amount: money,
          rarity: rarity
        };
      }
    },

    cutie: function(type) {
      return function() {
        // Give cutie
        var index = cc.cuties.add(type);

        // Report cutie
        return {
          type: 'cutie',
          index: index
        };
      }
    }
  }
}();
