!function() {
  var script = 'loveup', dir = 'menu/' + script + '/',
  menu = cc.menu[script] = function(element) {
    cc.util.getcss(dir + 'menu.css');
    element.load(cc.util.l(dir + 'menu.html'));
  };

  menu.open = function(open) {
    if(open === false) {
      setTimeout(function() {
        cc.menu('home');
      }, 300);
    }
  }
}();
