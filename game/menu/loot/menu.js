!function() {
  var script = 'loot', dir = 'menu/' + script + '/',
  menu = cc.menu[script] = function(element) {
    cc.util.getcss(dir + 'menu.css');
    element.load(cc.util.l(dir + 'menu.html'), function() {
      var lootButtons = element.find('.menu-loot-button');
      lootButtons.click(function(ev) {
        lootButtons.prop('disabled', true);
        cc.effect.lightBurst({mouseEvent: ev}).done(function() {
          cc.menu('showcase', cc.loot(cc.loot.genericMoney));
        });
      });
    });
  };

  menu.open = function(open) {
    if(open === false) {
      return false;
    }
  }

  menu.exit = function(script, state) {
    if(script != 'showcase') {
      return false;
    }
  }
}();
