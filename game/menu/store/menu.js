!function() {
  var script = 'store', dir = 'menu/' + script + '/',
  menu = cc.menu[script] = function(element) {
    cc.util.getcss(dir + 'menu.css');
    element.load(cc.util.l(dir + 'menu.html'), function() {
      $('#menu-store-buy-cutie').click(function() {
        if(cc.stats.mpcost('1000', true)) {
          var index = cc.cuties.add('77');
          cc.effect.lightBurst().done(function() {
            cc.menu('showcase', {type: 'cutie', index: index});
          });
        }
      })
    });
  };
}();
