!function() {
  var script = 'stats';
  var dir = 'menu/' + script + '/';

  cc.menu[script] = function(element, state) {
    element.load(cc.util.l(dir + 'menu.html'));
  };

  cc.menu[script].task = function(now, element, state) {
  };

  cc.menu[script].tick = function(now, element, state) {
  };

  cc.menu[script].draw = function(now, element, state) {
  };
}();
