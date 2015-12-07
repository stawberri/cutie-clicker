!function() {
  var script = 'home';
  var dir = 'menu/' + script + '/';

  cc.menu[script] = function(element, state) {
    cc.util.getcss(dir + 'menu.css');
    element.load(cc.util.l(dir + 'menu.html'));
  };
}();
