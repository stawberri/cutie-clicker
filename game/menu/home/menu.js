!function() {
  var script = 'home', dir = 'menu/' + script + '/',
  menu = cc.menu[script] = function(element) {
    cc.util.getcss(dir + 'menu.css');
    element.load(cc.util.l(dir + 'menu.html'), function() {
      if(location.protocol == 'https:') {
        $('#menu-home-https-message').remove();
      }
    });
  };
}();
