!function() {
  var script = 'misc';
  var dir = 'menu/' + script + '/';

  cc.menu[script] = function(element) {
    cc.util.getcss(dir + 'menu.css');
    element.load(cc.util.l(dir + 'menu.html'));
  };
}();
